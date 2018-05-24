sap.ui.define(["sap/ovp/ui/DashboardLayoutRearrange","sap/ovp/ui/DashboardLayoutModel"],function(R,D){"use strict";var a=function(u){this.aCards=null;this.dashboardLayoutModel=new D(u);this.layoutDomId="";this.oLayoutCtrl={};this.componentDomId="";this.oLayoutData={layoutWidthPx:1680,contentWidthPx:1600,colCount:5,colWidthPx:320,rowHeightPx:176,marginPx:this.convertRemToPx(3)-8};this.lastTriggeredColWidth=0.0;};a.prototype.setLayout=function(l){this.oLayoutCtrl=l;this.layoutDomId=l.getId();this.componentDomId=this.layoutDomId.split("--")[0];};a.prototype.getDashboardLayoutModel=function(){return this.dashboardLayoutModel;};a.prototype.updateCardVisibility=function(c){this.dashboardLayoutModel.updateCardVisibility(c);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);this._setCardsCssValues(this.aCards);this.layoutCards();};a.prototype.updateLayoutData=function(d){if(this.oLayoutData.layoutWidthPx===d){return this.oLayoutData;}var i=this.oLayoutData.marginPx,e=0,s=320,m=1024,c=8,n=d+i;this.oLayoutData.layoutWidthPx=d;if(n<=s){i=this.convertRemToPx(0.5)-c;e=sap.ui.Device.system.desktop?16:0;}else if(n<=m){i=this.convertRemToPx(1)-c;e=sap.ui.Device.system.desktop?8:0;}else{i=this.convertRemToPx(3)-c;}if(i!==this.oLayoutData.marginPx){this.oLayoutData.marginPx=i;jQuery(".sapUshellEasyScanLayout").css({"margin-left":i+"px"});}this.oLayoutData.contentWidthPx=d-i-e;this.oLayoutData.colCount=Math.floor(this.oLayoutData.contentWidthPx/320);if(this.oLayoutData.colCount===0){this.oLayoutData.colCount=1;}this.oLayoutData.colWidthPx=this.oLayoutData.contentWidthPx/this.oLayoutData.colCount;return this.oLayoutData;};a.prototype.getRearrange=function(s){var d={containerSelector:".sapUshellEasyScanLayoutInner",wrapper:".sapUshellEasyScanLayout",draggableSelector:".easyScanLayoutItemWrapper",placeHolderClass:"easyScanLayoutItemWrapper-placeHolder",cloneClass:"easyScanLayoutItemWrapperClone",moveTolerance:10,switchModeDelay:500,isTouch:!sap.ui.Device.system.desktop,debug:false,aCards:this.aCards,layoutUtil:this,rowHeight:this.oLayoutData.rowHeightPx,colWidth:this.oLayoutData.colWidthPx};s=jQuery.extend(d,s);this.rearrange=new R(s);return this.rearrange;};a.prototype.resizeLayout=function(w){var b=this.oLayoutData.colCount;var t=false;if(this.oLayoutData.layoutWidthPx!==w){this.updateLayoutData(w);t=Math.abs(this.lastTriggeredColWidth-this.oLayoutData.colWidthPx)>this.convertRemToPx(0.5);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);var i=0;for(i=0;i<this.aCards.length;i++){this.setCardCssValues(this.aCards[i]);var $=jQuery("#"+this.getCardDomId(this.aCards[i].id));$.css({top:this.aCards[i].dashboardLayout.top,left:this.aCards[i].dashboardLayout.left,width:this.aCards[i].dashboardLayout.width,height:this.aCards[i].dashboardLayout.height});if(b!==this.oLayoutData.colCount||t){this._triggerCardResize(this.aCards[i].dashboardLayout,$);}}if(t){this.lastTriggeredColWidth=this.oLayoutData.colWidthPx;}}};a.prototype.buildLayout=function(w){var l={};if(!w){return l;}this.updateLayoutData(w);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);this._setCardsCssValues(this.aCards);l=this.dashboardLayoutModel.extractCurrentLayoutVariant();return l;};a.prototype.getCards=function(c){if(this.aCards&&this.oLayoutData.colCount===c){return this.aCards;}this._setColCount(c);this.aCards=this.dashboardLayoutModel.getCards(c);this._setCardsCssValues(this.aCards);return this.aCards;};a.prototype.resetToManifest=function(){this.aCards=[];this.dashboardLayoutModel.resetToManifest();this.buildLayout(this.oLayoutData.layoutWidthPx);this.layoutCards();};a.prototype.getCardDomId=function(c){return this.layoutDomId+"--"+c;};a.prototype.getCardId=function(c){var b="";if(c){b=c.split("--")[2];}return b;};a.prototype.getCardByPositionPx=function(p){var r=Math.floor(p.top/this.oLayoutData.rowHeightPx)+1;var c=Math.floor(p.left/this.oLayoutData.colWidthPx)+1;var g={row:r,column:c};return this.dashboardLayoutModel.getCardByGridPos(g);};a.prototype.getCardsByArea=function(b,r){var g={};var c=this.getCardByPositionPx(b);var t={};if(r){t.column=Math.round(b.x/this.oLayoutData.colWidthPx);t.row=Math.round(b.y/this.oLayoutData.rowHeightPx);}else{t.column=Math.floor(b.x/this.oLayoutData.colWidthPx)+1;t.row=Math.floor(b.y/this.oLayoutData.rowHeightPx)+1;}if(t.column>1){t.column=1;}if(t.row>1){t.row=1;}if(c){g.x1=c.dashboardLayout.column;g.y1=c.dashboardLayout.row;}else{g.x1=t.column;g.y1=t.row;}g.x2=Math.ceil(b.width/this.oLayoutData.colWidthPx)+g.x1-1;g.y2=Math.ceil(b.height/this.oLayoutData.rowHeightPx)+g.y1-1;var d={cards:this.dashboardLayoutModel.getCardsByGrid(g),upperLeftEdge:this._mapGridToPositionPx({column:g.x1,row:g.y1}),upperLeftGridCell:{column:g.x1,row:g.y1},cardUpperLeft:c,touchPointCell:this._mapGridToPositionPx(t),touchPointGridCell:t};return d;};a.prototype.moveCardToGrid=function(f,g,p){var t=this.dashboardLayoutModel.moveCardToGrid(this.getCardId(f),g,p);if(t.length>0){this._positionCards(t);}this.oLayoutCtrl.fireAfterDragEnds();if(!this.dashboardLayoutModel.validateGrid()){this.dashboardLayoutModel.undoLastChange();}};a.prototype.isCardAutoSpan=function(c){return this.dashboardLayoutModel.getCardById(c).dashboardLayout.autoSpan;};a.prototype.setAutoCardSpanHeight=function(e){var l;var c=e.target.parentElement.parentElement.id.split("--")[1];var r=Math.ceil(e.size.height/this.getRowHeightPx());l=this.dashboardLayoutModel.resizeCard(c,{rowSpan:r,colSpan:1},false);this._sizeCard(l.resizeCard);this._positionCards(l.affectedCards);};a.prototype._sizeCard=function(c){if(!c){return;}var $=jQuery("#"+this.getCardDomId(c.id));$.css({width:c.dashboardLayout.colSpan*this.oLayoutData.colWidthPx+"px",height:c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx+"px"});this._triggerCardResize(c.dashboardLayout,$);};a.prototype._triggerCardResize=function(c,$){if(c.autoSpan||!c.visible){return;}var b=$.children().first().attr("id");try{var C=sap.ui.getCore().byId(b).getComponentInstance();if(C){var g=C.getAggregation("rootControl").getController();if(g){g.resizeCard(c);}else{jQuery.sap.log.error("OVP resize: no controller found for "+b);}}}catch(e){jQuery.sap.log.warning("OVP resize: "+b+" catch "+e.toString());}};a.prototype._positionCards=function(c){if(!c){return;}var i=0;var p={};for(i=0;i<c.length;i++){if(!c[i].dashboardLayout.visible){continue;}p=this._mapGridToPositionPx(c[i].dashboardLayout);var $=jQuery("#"+this.getCardDomId(c[i].id));$.css({top:p.top,left:p.left});}};a.prototype.layoutCards=function(c){var C=c||this.aCards;var i=0;var p={};for(i=0;i<C.length;i++){if(!C[i].dashboardLayout.visible){continue;}p=this._mapGridToPositionPx(C[i].dashboardLayout);var $=jQuery("#"+this.getCardDomId(C[i].id));$.css({top:p.top,left:p.left,width:C[i].dashboardLayout.colSpan*this.oLayoutData.colWidthPx+"px",height:C[i].dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx+"px"});this._triggerCardResize(C[i].dashboardLayout,$);}};a.prototype.resizeCard=function(c,s){var l=this.dashboardLayoutModel.resizeCard(this.getCardId(c),s,true);this._sizeCard(l.resizeCard);this._positionCards(l.affectedCards);this.oLayoutCtrl.fireAfterDragEnds();if(!this.dashboardLayoutModel.validateGrid()){this.dashboardLayoutModel.undoLastChange();}};a.prototype._sortCardsByCol=function(c){c.sort(function(b,d){if(b.dashboardLayout.column&&b.dashboardLayout.row&&b.dashboardLayout.column===d.dashboardLayout.column){if(b.dashboardLayout.row<d.dashboardLayout.row){return-1;}else if(b.dashboardLayout.row>d.dashboardLayout.row){return 1;}}else if(b.dashboardLayout.column){return b.dashboardLayout.column-d.dashboardLayout.column;}else{return 0;}});};a.prototype._sortCardsByRow=function(c){c.sort(function(b,d){if(b.dashboardLayout.column&&b.dashboardLayout.row&&b.dashboardLayout.row===d.dashboardLayout.row){if(b.dashboardLayout.column<d.dashboardLayout.column){return-1;}else if(b.dashboardLayout.column>d.dashboardLayout.column){return 1;}}else if(b.dashboardLayout.row){return b.dashboardLayout.row-d.dashboardLayout.row;}else{return 0;}});};a.prototype._mapGridToPositionPx=function(g){var p={top:(g.row-1)*this.getRowHeightPx()+"px",left:(g.column-1)*this.getColWidthPx()+"px"};return p;};a.prototype.mapPositionToGrid=function(p){var g={};var b={};b.y1=Math.floor((p.top+1)/this.oLayoutData.rowHeightPx)+1;b.x1=Math.floor((p.left+1)/this.oLayoutData.colWidthPx)+1;g=this._mapGridToPositionPx({column:b.x1,row:b.y1});g.gridCoordX=b.x1;g.gridCoordY=b.y1;return g;};a.prototype.getPixelPerRem=function(){var f=parseFloat(getComputedStyle(document.documentElement).fontSize);return f;};a.prototype._getCardComponentDomId=function(c){return this.componentDomId+"--"+c;};a.prototype._getCardController=function(c){var C=null;var b=sap.ui.getCore().byId(this._getCardComponentDomId(c));if(b){C=b.getComponentInstance().getAggregation("rootControl").getController();}return C;};a.prototype._setCardsCssValues=function(c){var i=0;for(i=0;i<c.length;i++){this.setCardCssValues(c[i]);}};a.prototype.setCardCssValues=function(c){c.dashboardLayout.top=((c.dashboardLayout.row-1)*this.oLayoutData.rowHeightPx)+"px";c.dashboardLayout.left=((c.dashboardLayout.column-1)*this.oLayoutData.colWidthPx)+"px";c.dashboardLayout.width=(c.dashboardLayout.colSpan*this.oLayoutData.colWidthPx)+"px";c.dashboardLayout.height=(c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx)+"px";};a.prototype.convertRemToPx=function(v){var b=v;if(typeof v==="string"||v instanceof String){b=v.length>0?parseInt(v.split("rem")[0],10):0;}return b*this.getPixelPerRem();};a.prototype.convertPxToRem=function(v){var b=v;if(typeof v==="string"||v instanceof String){b=v.length>0?parseFloat(v.split("px")[0],10):0;}return b/this.getPixelPerRem();};a.prototype.getLayoutWidthPx=function(){return this.oLayoutData.colCount*this.oLayoutData.colWidthPx;};a.prototype.getColWidthPx=function(){return this.oLayoutData.colWidthPx;};a.prototype.getRowHeightPx=function(){return this.oLayoutData.rowHeightPx;};a.prototype._setColCount=function(c){this.oLayoutData.colCount=c;};a.prototype.getDropSimData=function(f){var p=true;var g={};var c=[];var C=[];var i=0;var r=this.oLayoutData.rowHeightPx;var b=this.oLayoutData.colWidthPx;var o=this.dashboardLayoutModel.getCardById(this.getCardId(f.id));var t={column:Math.round(f.left/b),row:Math.round(f.top/r)};var T=true;t.row=(t.row<1)?0:t.row;t.column=(t.column<0)?0:t.column;var d=o?o.dashboardLayout.colSpan:0;if(t.column+d>(this.oLayoutData.colCount)){t.column=this.oLayoutData.colCount-d;}if(t.column+d<this.oLayoutData.colCount){T=false;}var e={left:(t.column)*b,top:(t.row)*r};var h=e.top;if(e.left>this.oLayoutData.colCount*b){e.left=this.oLayoutData.colCount*b;}if(o){g.y1=t.row+1;g.x1=t.column+1;g.y2=g.y1+o.dashboardLayout.rowSpan-1;g.x2=g.x1+o.dashboardLayout.colSpan-1;c=this.dashboardLayoutModel.getCardsByGrid(g,this.getCardId(f.id));for(i=0;i<c.length;i++){C.push(this.getCardDomId(c[i].id));}}for(i=0;i<c.length;i++){if((c[i].dashboardLayout.row-1)*r<h){h=(c[i].dashboardLayout.row-1)*r;}}if(f.top<h-16){p=false;}if(T){p=false;}return{cellPos:e,coveredCardIds:C,pushHorizontal:p};};return a;},true);