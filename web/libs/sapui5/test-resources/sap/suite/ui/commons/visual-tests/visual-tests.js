	var _iDelay = 5;
	var _aCases = Object.keys(oConfData).sort();
    var _oConfModel = new sap.ui.model.json.JSONModel();
    _oConfModel.setData(oConfData);
    sap.ui.getCore().setModel(_oConfModel);
    var _oHcbBtn, _oRtlBtn, _oHomeBtn, _oPlayBtn, _oPrevBtn, _oCurrBtn, _oNextBtn, _oDelayInp, _bRtl, _bHcb;
    
    var _buildImg = function(sCaseName, iImgNumber) {
    	return new sap.m.Image({ src: oConfData[sCaseName].images[iImgNumber] });
    };
    
    var _buildBtn = function(sName, bEnabled) {
    	return new sap.m.Button({text: sName, press: function() {_buildCase(sName);}, enabled: bEnabled });
    };

    var _buildHomeBtn = function(bEnabled) {
    	return new sap.m.Button({icon: "sap-icon://home", press: function() { _nextCase(_aCases[0], 0); }, enabled: bEnabled });
    };

    var _getPlayStop = function() {
    	return _bAuto ? "sap-icon://stop" : "sap-icon://play"; 
    };
    
    var _buildPlayBtn = function(sName) {
    	return new sap.m.Button({ 
    		icon: _getPlayStop(),	
    		press: function() {	
    			_nextCase(sName, _bAuto ? 0 : 1); 
    			this.icon = _getPlayStop();
    				_oHomeBtn.setEnabled(!_bAuto);
    				_oPrevBtn.setEnabled(!_bAuto); 
    				_oCurrBtn.setEnabled(!_bAuto); 
    				_oNextBtn.setEnabled(!_bAuto);
    	}});
    };
    
    var _buildRtlBtn = function(sCaseName) {
    	jQuery("html").attr("dir", (_bRtl = new RegExp('^RTL$', 'i').test(oConfData[sCaseName].dir)) ? "rtl" : "ltr");
    	return new sap.m.Button({ text: _bRtl ? "LTR" : "RTL", press: function(oE) { jQuery("html").attr("dir", (_bRtl = !_bRtl) ? "rtl" : "ltr"); this.setText(_bRtl ? "LTR" : "RTL");  } });
    };
    
    var _setTheme = function(_bHcb) {
    	sap.ui.getCore().applyTheme(_bHcb ? "sap_hcb" : "sap_bluecrystal");
    };

    var _buildHcbBtn = function(sCaseName) {
    	_bHcb = new RegExp('^SAP_HCB$', 'i').test(oConfData[sCaseName].theme);
    	if (sap.ui.getCore().getConfiguration().getTheme() != (_bHcb ? "sap_hcb" : "sap_bluecrystal")) {
    		_setTheme(_bHcb);
    	}
    	return new sap.m.Button({ text: _bHcb ? "BC" : "HCB", press: function(oE) { _setTheme(_bHcb = !_bHcb); this.setText(_bHcb ? "BC" : "HCB"); } });
    }; 

    var _buildText = function(sText) {
    	return new sap.ui.core.HTML({ content: "<div>"+sText+"</div>" });
    };
    
    var _bAuto = false;
    var _sDelayedCall = null;
    var _nextCase = function(sCaseName, iDirection) {
    	var iIndex = _aCases.indexOf(sCaseName);
    	_bAuto = (iDirection != 0);
    	if (iDirection < 0) {
    		sCaseName = (iIndex - 1 >= 0)? _aCases[iIndex - 1] : _aCases[_aCases.length - 1];
    	} else if (iDirection > 0){
    		sCaseName = (iIndex + 1 < _aCases.length) ? _aCases[iIndex + 1] : _aCases[0];
    	}
    	_buildCase(sCaseName);
    	if (_sDelayedCall) {
    		jQuery.sap.clearDelayedCall(_sDelayedCall);
    	}
    	if (_bAuto) {
    		_sDelayedCall = jQuery.sap.delayedCall(1000*_iDelay, this, _nextCase, [sCaseName, iDirection]);
	   	}
    };
    
    var _buildCase = function(sCaseName) {
    	var iIndex = _aCases.indexOf(sCaseName);
    	var oNavHBox = new sap.m.HBox({ 
    		items: [
    		    _oRtlBtn = _buildRtlBtn(sCaseName),
    		    _oHcbBtn = _buildHcbBtn(sCaseName),
    		    _oHomeBtn = _buildHomeBtn(!_bAuto && iIndex != 0),
    		    _oPlayBtn = _buildPlayBtn(sCaseName),
    		    _oPrevBtn = _buildBtn(_aCases[iIndex - 1], !_bAuto && iIndex - 1 >= 0),
    		    _oCurrBtn = new sap.m.Button({text: '['+sCaseName+']', press: function() { _nextCase(sName, iDirection);}, enabled: !_bAuto }),
    		    _oNextBtn = _buildBtn(_aCases[iIndex + 1], !_bAuto && iIndex + 1 < _aCases.length),
    		    _oDelayInp = new sap.m.Input({ placeholder: "Delay "+_iDelay+"(s)", maxLength: 3, change: function(oEvnt) { _iDelay = parseFloat(oEvnt.getParameter("newValue")); }})
    		]
    	});
    	var oText = _buildText(oConfData[sCaseName].text);
    	if (oConfData[sCaseName].onLoad) {
        	jQuery.sap.delayedCall(500, this, oConfData[sCaseName].onLoad);
    	}
    	var aItems = [oNavHBox];
    	aItems.push(oText);
    	aItems.push(new sap.ui.core.HTML({ content: "<hr><div>Screenshots:</div>" }));
    	if (oConfData[sCaseName].images) {
        	for (var iImgNum=0; iImgNum < oConfData[sCaseName].images.length; iImgNum++) {
        		aItems.push(_buildImg(sCaseName, iImgNum));
        	}
    	}
    	aItems.push(new sap.ui.core.HTML({ content: "<hr><div>Controls:</div>" }));
    	var aControls = [];
    	for (var iCtrlNum=0; iCtrlNum < oConfData[sCaseName].controls.length; iCtrlNum++) {
			aControls.push(buildControl(sCaseName, iCtrlNum));
    	}
    	var oControlsVBox = new sap.m.VBox({ items: [ aControls ] });
    	oControlsVBox.addStyleClass("vtControlContainer");
    	aItems.push(oControlsVBox);
    	var oVBox = new sap.m.VBox({ items: aItems });
    	oVBox.placeAt("content","only");
    	$(document).off("keyup").keyup(function (oEvt) {
    		if (oEvt.keyCode == 37 && iIndex - 1 >= 0) {
    			_buildCase(_aCases[iIndex - 1]);
    		} else if (oEvt.keyCode == 39 && iIndex + 1 < _aCases.length) {
    			_buildCase(_aCases[iIndex + 1]);
    		}  
   		}); 
    };
    
    _buildCase(_aCases[0]);
