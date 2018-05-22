///////////////
//Testing Module for ApplySearchPattern
////////////////


module("ApplySearchPattern");

test("Empty List", function() {
	if (oScfldMasterController) {
		//overwrite getList method
		var oList = new sap.m.List("list");
		oScfldMasterController.getList = function(){
			return oList;
		};

		//overwrite applySearchPatternToListItem, check only title text
		oScfldMasterController.applySearchPatternToListItem = function(oItem, sFilterPattern) {
			if (typeof oItem.getProperty("title") == "string") {
				if (oItem.getProperty("title").toLowerCase().indexOf(sFilterPattern) != -1) {
					return true;
				}
			}
			return false;
		};

		var oList = oScfldMasterController.getList();
		ok(oList, "getList()");

		var iCount = oScfldMasterController.applySearchPattern("");
		ok(iCount == 0, "search term = '', iCount = " + iCount);
	}
});

var readListGroupHeaders = function(oScfldMasterController, bVisible0, bVisible11, bVisible16) {
	var oItems = oScfldMasterController.getList().getItems();
	readListGroupHeaderItemHelper(oItems, 0, bVisible0);
	readListGroupHeaderItemHelper(oItems, 11, bVisible11);
	readListGroupHeaderItemHelper(oItems, 16, bVisible16);
};

var readListGroupHeaderItemHelper = function(oItems, iHeaderPosition, bVisible) {
	ok(oItems[iHeaderPosition] instanceof sap.m.GroupHeaderListItem, "Get " + iHeaderPosition + ". Group Header");
	ok(oItems[iHeaderPosition].getVisible() === bVisible, (bVisible===true)?"visible":"in-visible");
};

test("List mit items", function() {
	if (oScfldMasterController) {
		//set the list
		var oHeaderListItem = new sap.m.GroupHeaderListItem({title : "No Priority", count: 10});
		oScfldMasterController.getList().addItem(oHeaderListItem);
		var oObjectListItem = new sap.m.ObjectListItem({title:"jjkk", number:"0,00", numberUnit:"AUD", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"check", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"tech7", number:"19K", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"djdb", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"this", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"Vhv", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"jy3_1", number:"0,00", numberUnit:"AUD", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"tech5", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"tech1", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"chekc1344", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);

		oHeaderListItem = new sap.m.GroupHeaderListItem({title : "Very High", count: 4});
		oScfldMasterController.getList().addItem(oHeaderListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"fio_1", number:"0,00", numberUnit:"AUD", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"tech6", number:"0,00", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"Hchage", number:"676K", numberUnit:"BRL", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"check123577586", number:"10M", numberUnit:"USD", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);

		oHeaderListItem = new sap.m.GroupHeaderListItem({title : "High", count: 3});
		oScfldMasterController.getList().addItem(oHeaderListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"tech2", number:"166K", numberUnit:"INR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"tech4", number:"55K", numberUnit:"EUR", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);
		oObjectListItem = new sap.m.ObjectListItem({title:"nameji", number:"0,00", numberUnit:"AUD", type:"Active"});
		oScfldMasterController.getList().addItem(oObjectListItem);

		var iCount = oScfldMasterController.applySearchPattern("");
		ok(iCount > 0, "search term = '', iCount = " + iCount);
		readListGroupHeaders(oScfldMasterController, true, true, true);

		iCount = oScfldMasterController.applySearchPattern("techxxxx");
		ok(iCount === 0, "search term = 'techxxxx', iCount = " + iCount);
		readListGroupHeaders(oScfldMasterController, false, false, false);

		iCount = oScfldMasterController.applySearchPattern("tech");
		ok(iCount === 6, "search term = 'tech', iCount = " + iCount);
		readListGroupHeaders(oScfldMasterController, true, true, true);

		iCount = oScfldMasterController.applySearchPattern("tech1");
		ok(iCount === 1, "search term = 'tech1', iCount = " + iCount);
		readListGroupHeaders(oScfldMasterController, true, false, false);

		iCount = oScfldMasterController.applySearchPattern("tech2");
		ok(iCount === 1, "search term = 'tech2', iCount = " + iCount);
		readListGroupHeaders(oScfldMasterController, false, false, true);

		iCount = oScfldMasterController.applySearchPattern("tech");
		ok(iCount === 6, "search term = 'tech', iCount = " + iCount);
		readListGroupHeaders(oScfldMasterController, true, true, true);

		iCount = oScfldMasterController.applySearchPattern("");
		ok(iCount === 17, "search term = '', iCount = " + iCount);
		readListGroupHeaders(oScfldMasterController, true, true, true);
	}
});
