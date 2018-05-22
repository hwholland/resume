sap.ui.controller("sap.ui.vbm.sample.GeoMapPies.C", {
	
	onInit : function () 
	{
	    var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/ui/vbm/demokit/sample/GeoMapPies/Data.json");
	    this.getView().setModel(oModel);
	 },
	 
	onClickItem: function (evt)
	{
//		alert( "onClick");
	   evt.getSource().openDetailWindow("My Detail Window", "0", "0" );  	   
	},

	onContextMenuItem: function ( evt )
	{
		alert( "onContextMenu");
	},
   
	onContextMenuPie: function ( evt )
   {
//      alert( "onContextMenuPie");
      if ( evt.mParameters && evt.mParameters.menu )
      { 
         //Function to handle the select event of the items
         var handleSelect = function(oEvent){
            alert("clicked on " + oEvent.oSource.mProperties.text);
            
         };

         // Create the menu
         var oMenu11 = evt.mParameters.menu;
         //Create the items and add them to the menu
         var oMenuItem11 = new sap.ui.unified.MenuItem({text: "First Item"}); 
         oMenuItem11.attachSelect(handleSelect);
         oMenu11.addItem(oMenuItem11);
         var oMenuItem12 = new sap.ui.unified.MenuItem({text: "Second Item"});
         oMenuItem12.attachSelect(handleSelect);
         oMenu11.addItem(oMenuItem12);
         var oMenuItem13 = new sap.ui.unified.MenuItem({text: "Disabled Item", enabled: false});
         oMenu11.addItem(oMenuItem13);

         //Create a sub menu for second item
         var oMenu21 = new sap.ui.unified.Menu({ariaDescription: "a sub menu"});
         oMenuItem12.setSubmenu(oMenu21);
         //Create the items and add them to the sub menu
         var oMenuItem14 = new sap.ui.unified.MenuItem({text: "New TXT file", tooltip: "Creates a new TXT file."});
         oMenuItem14.attachSelect(handleSelect);
         oMenu21.addItem(oMenuItem14);
         var oMenuItem15 = new sap.ui.unified.MenuItem({text: "New RAR file", tooltip: "Creates a new RAR file."});
         oMenuItem15.attachSelect(handleSelect);
         oMenu21.addItem(oMenuItem15);

         evt.getSource().openContextMenu( oMenu11 );  

      }
	   
   },
   
   //var oPanel = null;
   onCloseDetail: function (evt) 
   {
      //alert("onCloseDetail" + this);
   },

   onOpenDetail: function (evt) 
   {
      var cont = document.getElementById(evt.getParameter("contentarea").id);
      var id = evt.getParameter("contentarea").id;
      cont.innerHTML = "Detail Window Content for Pies";
      cont.style.color = "Blue";     

   }
   
   
   
});
