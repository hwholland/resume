/////////////////////////////////////////
//   Testing Part: GrowingTileContainer   //
/////////////////////////////////////////

module("GrowingTileContainer");

test("Object creation", function () {

  var oTileContainer = sap.ui.getCore().byId('idGrowing');

  strictEqual(oTileContainer.getId(), "idGrowing", "GrowingTileContainer has ID 'idGrowing'");
  var $grid = jQuery.sap.byId(oTileContainer.getId() + "-grid");
  var count = $grid.find(".sapMTile").length;
  strictEqual(count, oTileContainer.getGrowingThreshold(), "GrowingTileContainer contains " + oTileContainer.getGrowingThreshold() + " tiles");
});

asyncTest("TileContainer after growing", function() {
  var oTileContainer = sap.ui.getCore().byId('idGrowing');
  var $grid = jQuery.sap.byId(oTileContainer.getId() + "-grid");
  var count = $grid.find(".sapMTile").length;
  oTileContainer._triggerLoadingByScroll();
  setTimeout(function(){
    var newCount = $grid.find(".sapMTile").length;
    equal(newCount, count + oTileContainer.getGrowingThreshold(), "Tiles added after scroll: " + oTileContainer.getGrowingThreshold());
    start();
  }, 1000);
});
