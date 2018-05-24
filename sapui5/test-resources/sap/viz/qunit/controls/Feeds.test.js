/*
 Test owner: Li, Amanda
 Reviewer: Yang, tammy
 Date: 2014/01/08
 Description: Test AnalysisObject.set/getUid, set/getName(), set/getType().
 steps: 1. Create a sap.viz.ui5.controls.common.feeds.AnalysisObject
 2. verify its uid, name and type via get method.
 3. Change its uid, name and type via set method.
 */
test("Feeds.AnalysisObject",function(){
	expect(6);
	var oAnalysisObject = new sap.viz.ui5.controls.common.feeds.AnalysisObject({
		'uid' : 'id',
		'name' : 'name',
		'type' : 'type'
	});
	equal(oAnalysisObject.getUid(),'id', "getUid() is correct. ");
	equal(oAnalysisObject.getName(),'name', "getName() is correct. ");
	equal(oAnalysisObject.getType(),'type', "getType() is correct. ");
	oAnalysisObject.setUid('id1');
	oAnalysisObject.setType('type1');
	oAnalysisObject.setName('name1');
	equal(oAnalysisObject.getUid(), 'id1',"setUid() is correct. ");
	equal(oAnalysisObject.getName(),'name1', "setName() is correct. ");
	equal(oAnalysisObject.getType(), 'type1',"setType() is correct. ");
});

/*
Test owner: Li, Amanda
Reviewer: Yang, tammy
Date: 2014/01/08
Description: Test FeedItem.set/getUid, set/getType(), get/add/destoryValues().
steps: 1. Create sap.viz.ui5.controls.common.feeds.FeedItem.
2. verify its uid, name and type via get method.
3. Change its uid, name and type via set method, then verify them.
*/
test("Feeds.FeedItem", function() {
	expect(8);
    var genAnalysisObject = function(index) {
           if(index === 0) {
                  return new sap.viz.ui5.controls.common.feeds.AnalysisObject({
                        'uid' : 'ENTITY_ID_SALEQUANTITY',
                        'name' : 'Sales Quantity',
                        'type' : 'measure'
                  });
           } else if (index === 1) {
                  return new sap.viz.ui5.controls.common.feeds.AnalysisObject({
                        'uid' : 'ENTITY_ID_Sales_Cost',
                        'name' : 'Cost',
                        'type' : 'measure'
                  });
           }
    };

    var feeds = [ new sap.viz.ui5.controls.common.feeds.FeedItem({
           'uid' : 'primaryValues',
           'type' : 'Measure',
           'values' : [ genAnalysisObject(0), genAnalysisObject(1) ]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
           'uid' : 'axisLabels',
           'type' : 'Dimension',
           'values' : [ genAnalysisObject(0) ]
    }) ];
    equal('primaryValues', feeds[0].getUid(), "getUid() is correct. ");
    equal('Measure', feeds[0].getType(), "getName() is correct. ");

    equal(2, feeds[0].getValues().length, 'length is correct');
    equal(genAnalysisObject(0).getUid(), sap.viz.ui5.controls.common.feeds.FeedItem.toLightWeightFmt(feeds)[0].values[0].id, 'value0 is correct');
    equal(genAnalysisObject(1).getUid(), sap.viz.ui5.controls.common.feeds.FeedItem.toLightWeightFmt(feeds)[0].values[1].id, 'value1 is correct');
    feeds[1].setUid('regionColor');
    feeds[1].setType('Dimension');
    feeds[1].setValues([genAnalysisObject(1)]);
    equal('regionColor', feeds[1].getUid(), "setUid() is correct. ");
    equal('Dimension', feeds[1].getType(), "setName() is correct. ");
    equal( genAnalysisObject(1).getUid(), sap.viz.ui5.controls.common.feeds.FeedItem.toLightWeightFmt(feeds)[1].values[0].id, "setValues() is correct. ");
});

