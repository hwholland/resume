module("VizFrame");
jQuery.sap.require("sap.viz.ui5.controls.VizFrame");

var getTransformToElement = function(element, target){
    var result;
    if(element.getTransformToElement){
        result = element.getTransformToElement(target);
    }else{
        var mTargetInverse;
        try {
            mTargetInverse = target.getScreenCTM().inverse();
        } catch (e) {
            throw "'target' CTM is not invertible.";
        }
        result = mTargetInverse.multiply(element.getScreenCTM());
    }
    return result;
};
/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/1/27
 Description: Test VizFrame.setWidth() and vizFrame.getWidth
 Check points: set/get width of vizFrame works fine
 steps: 1.Create a VizFrame and set the width.
 */
test("VizFrame.setWidth/getWidth ", function() {
    expect(1);
    var oVizFrame = createVizFrame();
    oVizFrame.setWidth('200px');
    equal(oVizFrame.getWidth(), '200px', "setWidth/getWidth pass");
    oVizFrame.destroy();
});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/1/27
 Description: Test VizFrame.setHeight() and vizFrame.getHeight
 Check points: set/get height of vizFrame works fine
 steps: 1.Create a VizFrame and set the height.
 */
test("VizFrame.setHeight/getHeight ", function() {
    expect(1);
    var oVizFrame = createVizFrame();
    oVizFrame.setHeight('100px');
    equal(oVizFrame.getHeight(), '100px', "setHeight/getHeight pass");
    oVizFrame.destroy();
});

/*
 * test owner:Janet Wang
 * Reviewer: Amanda Li
 * Date: 2014/1/8
 * Description: Test for vizSelection api
 * Check points: vizSelection works well
 * steps: 1. Create a VizFrame with specified id and uiconfig
 * 2. Set vizData
 *	3. Select some data points, verify
 */

test("VizFrame.vizSelectionTest", function() {
    expect(4);
    var oModel = new sap.ui.model.json.JSONModel({
        businessData : ModelInfo.businessData
    });
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions : [{
            axis : 1,
            name : 'Country',
            value : "{Country}"
        }],
        measures : [{
            name : 'Profit', // 'name' is used as label in the Legend
            value : '{profit}' // 'value' defines the binding for the displayed value
        }],
        data : {
            path : "/businessData"
        }
    });
    //Selection data
    var dataPoints = [{
        "data" : {
            Country : "Canada",
            Profit : -141.25
        }
    }, {
        "data" : {
            Country : "China",
            Profit : 133.82
        }
    }];
    //create a vizFrame
    var vizFrame = createVizFrame();

    vizFrame.setModel(oModel);
    vizFrame.setDataset(oDataset);

    // set feeds
    var aobjCountry = new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        uid : "Country",
        name : "Country",
        type : 'Dimension'
    }), aobjProfit = new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        uid : "Profit",
        name : "Profit",
        type : 'Measure'
    });
    var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "primaryValues",
        type : 'Measure',
        values : [aobjProfit]
    }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "axisLabels",
        type : 'Dimension',
        values : [aobjCountry]
    });
    vizFrame.addFeed(feedPrimaryValues);
    vizFrame.addFeed(feedAxisLabels);
    //select dataPoints
    vizFrame.vizSelection([dataPoints[0]], {
        clearSelection : true
    });
    deepEqual(vizFrame.vizSelection(), null, "The data point can not be selected since vizContainer is not ready");
    vizFrame.placeAt("content");
    stop();
    vizFrame.attachEventOnce('renderComplete', function() {
        vizFrame.vizSelection(dataPoints, {
            clearSelection : false
        });

        var dataset = vizFrame.getDataset(), selections = vizFrame.vizSelection();
        var context = dataset.findContext(selections[1].data);
        equal(context.getPath(), '/businessData/1', 'findContext work properly')

        selections.forEach(function(dp) {
            delete dp.data._context_row_number;
        });
        equal(arrayEquaIgnoreSequencel(selections, dataPoints), true, "The selected data point is correct");

        //deselect data points
        vizFrame.vizSelection([], {
            clearSelection : true
        });
        deepEqual(vizFrame.vizSelection(), [], "The data point is deselected");
        //destroy control
        destroyVizFrame(vizFrame);
        start();
    });
});

test("VizFrame.vizSelectionTest with context", function() {
    expect(1);
    var oModel = new sap.ui.model.json.JSONModel({
        businessData : ModelInfo.businessContextData
    });
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions : [{
            axis : 1,
            name : 'Country',
            value : "{Country}"
        },{
            axis : 1,
            name : 'Year',
            value : "{Year}"
        },{
            axis : 1,
            name : 'City',
            value : "{City}"
        }],
        measures : [{
            name : 'Profit', // 'name' is used as label in the Legend
            value : '{profit}' // 'value' defines the binding for the displayed value
        }],
        data : {
            path : "/businessData"
        }
    });
    //Selection data
    var dataPoints = [{
        "data" : {
            Country : "Canada"
        
        }
    }, {
        "data" : {
            Country : "China"
          
            
        }
    }];
      var dataPointsResult = [{
        "data" : {
            Country : "Canada",
            Profit : -141.25,
            Year: "2001",
            City:"a"
        }
    }, {
        "data" : {
            Country : "China",
            Profit : 133.82, 
            Year: "2002",
            City:"b"
            
        }
    }];
    //create a vizFrame
    var vizFrame = createVizFrame();
    oDataset.setContext([{id: "Year"}, "City"]);
    vizFrame.setModel(oModel);
    vizFrame.setDataset(oDataset);

    // set feeds
    var aobjCountry = new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        uid : "Country",
        name : "Country",
        type : 'Dimension'
    }), aobjProfit = new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        uid : "Profit",
        name : "Profit",
        type : 'Measure'
    });
    var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "primaryValues",
        type : 'Measure',
        values : [aobjProfit]
    }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "axisLabels",
        type : 'Dimension',
        values : [aobjCountry]
    });
    vizFrame.addFeed(feedPrimaryValues);
    vizFrame.addFeed(feedAxisLabels);
    //select dataPoints

    vizFrame.placeAt("content");
    stop();
    vizFrame.attachEventOnce('renderComplete', function() {
        vizFrame.vizSelection(dataPoints, {
            clearSelection : false
        });

        var  selections = vizFrame.vizSelection();


        selections.forEach(function(dp) {
            delete dp.data._context_row_number;
        });
        equal(arrayEquaIgnoreSequencel(selections, dataPointsResult), true, "The selected data point is correct");

        //destroy control
        destroyVizFrame(vizFrame);
        start();
    });
});

test("VizFrame.vizSelectionTest with bubble context", function() {
    expect(1);
    var oModel = new sap.ui.model.json.JSONModel({
        businessData : ModelInfo.businessContextData
    });
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions : [{
            axis : 1,
            name : 'Country',
            value : "{Country}"
        },{
            axis : 1,
            name : 'Year',
            value : "{Year}"
        },{
            axis : 1,
            name : 'City',
            value : "{City}"
        }],
        measures : [{
            name : 'Profit', // 'name' is used as label in the Legend
            value : '{profit}' // 'value' defines the binding for the displayed value
        },{
            name : 'Revenue', // 'name' is used as label in the Legend
            value : '{revenue}' // 'value' defines the binding for the displayed value
        },{
            name : 'Population', // 'name' is used as label in the Legend
            value : '{population}' // 'value' defines the binding for the displayed value
        }],
        data : {
            path : "/businessData"
        }
    });
    //Selection data
    var dataPoints = [{
        "data" : {
            Country : "Canada"
        
        }
    }, {
        "data" : {
            Country : "China"
          
            
        }
    }];
      var dataPointsResult = [{
        "data" : {
            Country : "Canada",
            Profit : -141.25,
            Year: "2001",
            City:"a",
            Revenue:410.87,
            Population:34789000
        }
    }, {
        "data" : {
            Country : "China",
            Profit : 133.82, 
            Year: "2002",
            City:"b",
            Revenue:338.29,
            Population:1339724852
            
        }
    }];
    //create a vizFrame
    var vizType = 'info/bubble';
    var option = {
        viztype: vizType,
      
    };
    var vizFrame = createVizFrame(option);
    oDataset.setContext([{id: "Year"}, "City"]);
    vizFrame.setModel(oModel);
    vizFrame.setDataset(oDataset);


    var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "primaryValues",
        type : 'Measure',
        values : ["Profit"]
    }),
    feed2Values = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "valueAxis2",
        type : 'Measure',
        values : ["Revenue"]
    }),
      feedWidth = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "bubbleWidth",
        type : 'Measure',
        values : ["Population"]
    }),
     feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid : "color",
        type : 'Dimension',
        values : ["Country"]
    });
    vizFrame.addFeed(feedPrimaryValues);
    vizFrame.addFeed(feedAxisLabels);
    vizFrame.addFeed(feed2Values);
     vizFrame.addFeed(feedWidth);
    //select dataPoints

    vizFrame.placeAt("content");
    stop();
    vizFrame.attachEventOnce('renderComplete', function() {
        vizFrame.vizSelection(dataPoints, {
            clearSelection : false
        });

        var  selections = vizFrame.vizSelection();


        selections.forEach(function(dp) {
            delete dp.data._context_row_number;
        });
        equal(arrayEquaIgnoreSequencel(selections, dataPointsResult), true, "The selected data point is correct");

        //destroy control
        destroyVizFrame(vizFrame);
        start();
    });
});
/*
Test owner: Li, Amanda
Reviewer: Yang, tammy
Date: 2014/01/08
Description: Create a vizFrame, and it is not added into dom. the vizFrame is null, so vizContainer.save() is {}
steps: 1. Create vizFrame.
2. Save the viz instance
3. Verify the save json object. it should be {}.
*/
//test("VizFrame.save",function(){
//	expect(1);
//	var vizFrame = createVizFrame();
//	vizFrame.placeAt("content");
//	 var saveJson = vizFrame.save();
//	 var expectResult = {};
//	 deepEqual(saveJson, expectResult,"VizFrame is not created,the result of save() is empty. ");
//	 destroyVizFrame(vizFrame);
//});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: setVizType() and getVizType()
 Check points: 1. Set viz type before vizFrame exists, then get viz type, check the viz type could be gotten.
 2. Set viz type after vizFrame exists, then get viz type, check the viz type could be gotten.
 steps: 	1. Create a VizFrame.
 2. Set viz type.
 3. Get viz type and verify.
 4. After the vizFrame is created.
 5. Set viz type.
 6. Get viz type and verify.
 7. Destroy vizFrame.
 */
/*
 test('VizFrame.set/get VizType', function() {
 expect(5);
 var vizType = 'bar';
 var option = {viztype:vizType};
 var vizFrame = createVizFrame(option);

 equal(vizFrame.getVizType(),vizType,'The viz type is set to VizFrame and get synchronously.');
 //Show VizContainer to create vizFrame, then set and get viz type asynchronously
 vizFrame.placeAt('content');
 var callback = function(){
 vizFrame.detachEvent("initialized");
 vizType = 'line';
 vizFrame.setVizType(vizType);
 equal(vizFrame.getVizType(),vizType,'The viz type is set to VizFrame and get asynchronously.');
 vizFrame.setVizType('column');
 equal(vizFrame.getVizType(),'column','The viz type is set to VizFrame and get asynchronously.');
 destroyVizFrame(vizFrame);
 start();
 };
 vizFrame.attachEvent("initialized", callback);
 stop();
 });
 */

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: setVizProperties() and getVizProperties()
 Check points: 1. Set viz properties before vizFrame exists, then get viz properties, check the viz properties could be
gotten.
 2. Set viz properties after vizFrame exists, then get viz css, check the viz properties could be gotten and the new
properties is merged.
 steps: 	1. Create a vizFrame.
 2. Set viz properties.
 3. Get viz properties and verify.
 4. After the vizFrame is existed
 5. Set viz properties.
 6. Get viz properties and verify properties could be gotten and new properties is merged.
 7. Destroy vizFrame.
 */
asyncTest('VizFrame.set/get VizProperties', function() {
    expect(6);
    var vizFrame = createVizFrame();
    //Set and get viz properties synchronously
    var properties1 = VizProperty[0];
    var properties2 = VizProperty[1];
    var expectProperties = VizProperty[2];
    vizFrame.setVizProperties(properties1);
    var t1 = vizFrame.getVizProperties().title, t2 = properties1.title;
    equal(t1.alignment, t2.alignment, "The alignment is set to vizFrame and get asynchronously");
    equal(t1.text, t2.text, "The text is set to vizFrame and get asynchronously");
    equal(t1.visible, t2.visible, "The visible is set to vizFrame and get asynchronously");

    //Show vizFrame to create vizFrame, then set and get viz css asynchronously
    vizFrame.placeAt('content');

    vizFrame.detachEvent("renderComplete", arguments.callee);
    vizFrame.setVizProperties(properties2);
    t1 = vizFrame.getVizProperties().title, t2 = expectProperties.title;
    equal(t1.alignment, t2.alignment, "The alignment is set to vizFrame and get asynchronously");
    equal(t1.text, t2.text, "The text is set to vizFrame and get asynchronously");
    equal(t1.visible, t2.visible, "The visible is set to vizFrame and get asynchronously");
    vizFrame.setVizProperties(properties1);
    destroyVizFrame(vizFrame);
    start();
});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: addFeed(), destroyFeeds(), getFeeds()
 Check points: 1. Set feeds before vizFrame exists, then get feeds, check the feeds could be gotten.
 2. Set feeds after vizFrame exists, then get feeds, check the feeds could be gotten.
 steps: 	1. Create a VizFrame.
 2. Set feeds via addFeed() and destroyFeeds().
 3. Get feeds and verify.
 4. After the VizFrame is existed
 5. Set feeds.
 6. Get feeds and verify.
 7. Destroy VizFrame.
 */
asyncTest('VizFrame.set/get Feeds', function() {
    expect(2);
    var analysisObjects = createAnalysisObj([0, 1, 2, 3, 4, 5, 6]);

    var feeds1 = [new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[0]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'regionColor',
        'type' : 'Dimension',
        'values' : [analysisObjects[1]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[2], analysisObjects[3]]
    })];
    var feeds2 = [new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[4]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'regionColor',
        'type' : 'Dimension',
        'values' : [analysisObjects[5]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[6]]
    })];
    var option = {
        viztype : 'line'
    };
    var vizFrame = createVizFrame(option);
    //Set feeds before viz frame exists
    setVizControlFeeds(vizFrame, feeds1);
    ok(compareFeedsUid(vizFrame.getFeeds(), feeds1), 'Before viz frame exist, the viz feeds is set to ViizFrame and get correctly.');

    vizFrame.placeAt('content');

    //Set feeds after viz frame exists
    setVizControlFeeds(vizFrame, feeds2);
    ok(compareFeedsUid(vizFrame.getFeeds(), feeds2), 'After viz frame exist, the viz feeds is set to VizFrame and get correctly.');
    destroyVizFrame(vizFrame);
    start();
});

/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: vizUpdate()
 Check points: 1. Create a VizFrame and set data and feeds, then update css, properties, feeds and data, verify all of
them could be updated
 steps: 	1. Create a VizFrame.
 2. Set feeds and data.
 3. After the vizFrame is existed
 4. Update css and verify css is updated.
 4. Update properties and verify properties is updated.
 5. Update feeds and verify feeds is updated..
 6. Update data and verify data is updated.
 7. Destroy VizFrame.
 */
test('VizFrame.vizUpdate', function() {
    expect(5);
    var vizType = 'line';
    var option = {
        viztype : vizType
    };
    var vizFrame = createVizFrame(option);

    var oModel1 = new sap.ui.model.json.JSONModel({
        businessData1 : ModelInfo.businessData
    });

    var oDataset1 = new sap.viz.ui5.data.FlattenedDataset('FrameDS1', {
        dimensions : [{
            name : 'Country',
            value : "{Country}"
        }],
        measures : [{
            name : 'Profit',
            value : '{profit}'
        }, {
            name : 'Revenue',
            value : '{revenue}'
        }],
        data : {
            path : "/businessData1"
        }
    });
    var oModel2 = new sap.ui.model.json.JSONModel({
        businessData2 : ModelInfo.businessData2
    });

    var oDataset2 = new sap.viz.ui5.data.FlattenedDataset('FrameDS2', {
        dimensions : [{
            name : 'Product',
            value : "{Product}"
        }, {
            name : 'City',
            value : "{City}"
        }],
        measures : [{
            name : 'Number',
            value : '{number}'
        }],
        data : {
            path : "/businessData2"
        }
    });
    var analysisObjects = [new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid' : 'Product',
        'name' : 'Product',
        'type' : 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid' : 'Country',
        'name' : 'Country',
        'type' : 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid' : 'Profit',
        'name' : 'Profit',
        'type' : 'Measure'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid' : 'Revenue',
        'name' : 'Revenue',
        'type' : 'Measure'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid' : 'Country',
        'name' : 'Country',
        'type' : 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid' : 'City',
        'name' : 'City',
        'type' : 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid' : 'Number',
        'name' : 'Number',
        'type' : 'Measure'
    })];
    var feeds1 = [new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[1]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[2], analysisObjects[3]]
    })];
    var feeds2 = [new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'axisLabels',
        'type' : 'Dimension',
        'values' : [analysisObjects[0]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'regionColor',
        'type' : 'Dimension',
        'values' : [analysisObjects[5]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : 'primaryValues',
        'type' : 'Measure',
        'values' : [analysisObjects[6]]
    })];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt("content");

    var updateOptions1 = {
        css : '.v-background{fill:#FADCF7;} .v-body-title{fill:#6B4D2C;} .v-body-label{fill:#11D3F5;}'
    };

    var updateOptions2 = {
        properties : {
            title : {
                visible : true,
                text : 'title1',
                alignment : "left"
            }
        },
        feeds : feeds2
    };

    var updateOptions3 = {
        data : oDataset2
    };

    stop();
    vizFrame.attachEventOnce('renderComplete', function() {
    	setTimeout(function(){
            var t1 = vizFrame.getVizProperties().title;
            var t2 = updateOptions2.properties.title;
            equal(t1.alignment, t2.alignment, "The alignment is set to vizFrame and get asynchronously");
            equal(t1.text, t2.text, "The text is set to vizFrame and get asynchronously");
            equal(t1.visible, t2.visible, "The visible is set to vizFrame and get asynchronously");
            ok(compareFeedsUid(vizFrame.getFeeds(), updateOptions2.feeds), 'The feeds is updated.');
            equal(vizFrame.getDataset().sId, 'FrameDS2', 'The data is updated.');
            destroyVizFrame(vizFrame);
            start();
    	}, 1000);
        //Update css only
        vizFrame.vizUpdate(updateOptions1);
        //Update properties and feeds
        vizFrame.vizUpdate(updateOptions2);
        //Update data
        vizFrame.vizUpdate(updateOptions3);
        vizFrame.setModel(oModel2);
    });
});


/*
 Test owner: Amanda Li
 Reviewer: Amanda Li
 Date: 2014/01/28
 Description: Test sap.viz.ui5.VizFrame: getVizUid()
 Check points: 1. Before vizFrame exists, the getVizUid() is null.
 2. After vizFrame exists, the getVizUid() is existed
 steps: 	1. Create a VizFrame.
 2. Check the UID is null.
 3. After the vizFrame is created.
 4. Check the UID .
 5. Destroy vizFrame.
 */
test('VizFrame.getVizUid', function() {
    expect(2);
    var vizFrame = createVizFrame();

    notEqual(vizFrame.getVizUid(), null, 'The vizUid is null and get synchronously.');

    //Show VizContainer to create vizFrame, then get vizUid asynchronously
    vizFrame.placeAt('content');
    notEqual(vizFrame.getVizUid(), null, 'The vizUid is not null and get asynchronously.');
    destroyVizFrame(vizFrame);
});

/*
Test owner: Amy Li
Reviewer: Amanda Li
Date: 2014/10/13
Description: Test sap.viz.ui5.VizFrame: setVizScales() and getVizScales()
Check points: 1. Set scales before vizFrame render completed, then get scales, check the scales could be gotten.
                        2. Set scales after vizFrame render completed, then get scales, check the scales could be gotten.
Steps: 1. create a vizframe
              2. Set scales via setVizScales().
              3. Get scales and verify.
              4. After the VizFrame is existed
              5. Set scales.
              6. Get scales and verify.
              7. Destroy VizFrame.
*/
asyncTest('VizFrame.set/get VizScales', function() {
     expect(2);
     var vizType = 'line';
     var option = {
         viztype : vizType
     };
     var vizFrame = createVizFrame(option);

     var oModel1 = new sap.ui.model.json.JSONModel({
         businessData1 : ModelInfo.businessData
     });

     var oDataset1 = new sap.viz.ui5.data.FlattenedDataset('FrameDSViz', {
         dimensions : [{
             name : 'Country',
             value : "{Country}"
         }],
         measures : [{
             name : 'Profit',
             value : '{profit}'
         }, {
             name : 'Revenue',
             value : '{revenue}'
         }],
         data : {
             path : "/businessData1"
         }
     });
     var analysisObjects = [new sap.viz.ui5.controls.common.feeds.AnalysisObject({
         'uid' : 'Product',
         'name' : 'Product',
         'type' : 'Dimension'
     }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
         'uid' : 'Country',
         'name' : 'Country',
         'type' : 'Dimension'
     }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
         'uid' : 'Profit',
         'name' : 'Profit',
         'type' : 'Measure'
     }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
         'uid' : 'Revenue',
         'name' : 'Revenue',
         'type' : 'Measure'
     }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
         'uid' : 'Country',
         'name' : 'Country',
         'type' : 'Dimension'
     }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
         'uid' : 'City',
         'name' : 'City',
         'type' : 'Dimension'
     }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
         'uid' : 'Number',
         'name' : 'Number',
         'type' : 'Measure'
     })];
     var feeds1 = [new sap.viz.ui5.controls.common.feeds.FeedItem({
         'uid' : 'axisLabels',
         'type' : 'Dimension',
         'values' : [analysisObjects[1]]
     }), new sap.viz.ui5.controls.common.feeds.FeedItem({
         'uid' : 'primaryValues',
         'type' : 'Measure',
         'values' : [analysisObjects[2], analysisObjects[3]]
     })];
     vizFrame.setModel(oModel1);
     vizFrame.setDataset(oDataset1);
     setVizControlFeeds(vizFrame, feeds1);
     //Set and get viz scales synchronously
     var scales = [{
        feed : 'color',
        palette : ['#ff0000']
     }];
     vizFrame.setVizScales(scales);
     deepEqual(vizFrame.getVizScales()[0], scales[0], "The scale is set to vizFrame before vizFrame render Completed");
     vizFrame.placeAt('content');
     //add vizFrame to dom, then set and get viz scales asynchronously 
     vizFrame.attachEventOnce('renderComplete', function() {
		 var scales2 = [{
             feed : 'color',
             palette : ['#00ff00']
		 }];
	     vizFrame.setVizScales(scales2);
	     deepEqual(vizFrame.getVizScales()[0], scales2[0], "The scale is set to vizFrame after vizFrame render Completed");
	     destroyVizFrame(vizFrame);	
	     start();
     });     
});

asyncTest('VizFrame.zoom', function() {
    expect(4);
    var vizType = 'line';
    var option = {
        viztype: vizType
    };
    var vizFrame = createVizFrame(option);
    vizFrame.setVizProperties({
        interaction: {
            zoom: {
                enablement: "enabled"
            }
        }
    });
    var oModel1 = new sap.ui.model.json.JSONModel({
        businessData1: ModelInfo.businessData
    });

    var oDataset1 = new sap.viz.ui5.data.FlattenedDataset('FrameDSZoomTest', {
        dimensions: [{
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Profit',
            value: '{profit}'
        }, {
            name: 'Revenue',
            value: '{revenue}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var analysisObjects = [new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Product',
        'name': 'Product',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Profit',
        'name': 'Profit',
        'type': 'Measure'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Revenue',
        'name': 'Revenue',
        'type': 'Measure'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'City',
        'name': 'City',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Number',
        'name': 'Number',
        'type': 'Measure'
    })];
    var feeds1 = [new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid': 'axisLabels',
        'type': 'Dimension',
        'values': [analysisObjects[1]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid': 'primaryValues',
        'type': 'Measure',
        'values': [analysisObjects[2], analysisObjects[3]]
    })];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    setVizControlFeeds(vizFrame, feeds1);

    vizFrame.placeAt('content');

    vizFrame.attachEventOnce('renderComplete', function() {
        var view, plot, viewSize, plotSize, offset;
        
        vizFrame.zoom({
            direction: "in"
        });
        view = document.querySelector("#content .v-plot-bound");
        plot = document.querySelector("#content .v-plot-main");
        viewSize = view.getBBox();
        plotSize = plot.getBBox();
        offset = getTransformToElement(plot, view);
        
        ok(plotSize.width > viewSize.width, "Plot is larger after zoom in");
        ok(offset.e < 0, "Plot's top-left corner is translated off view to keep plot centered");

        vizFrame.zoom({
            direction: "out"
        });
        view = document.querySelector("#content .v-plot-bound");
        plot = document.querySelector("#content .v-plot-main");
        viewSize = view.getBBox();
        plotSize = plot.getBBox();
        offset = getTransformToElement(plot, view);
        
        ok(Math.ceil(plotSize.width) === Math.ceil(viewSize.width) && Math.ceil(plotSize.height) === Math.ceil(viewSize.height), "Plot is smaller after zoom out");
        ok(Math.ceil(offset.f) === 0 && Math.ceil(offset.e) === 0, "Plot's top-left corner is translated back to keep plot centered");
        
        destroyVizFrame(vizFrame);
        start();
    });
});

asyncTest("dataset.invalidate", function() {
    var vizType = 'line';
    var option = {
        viztype: vizType
    };
    var vizFrame = createVizFrame(option);
    vizFrame.setVizProperties({
        interaction: {
            zoom: {
                enablement: "enabled"
            }
        }
    });
    var oModel1 = new sap.ui.model.json.JSONModel({
        businessData1: ModelInfo.businessData
    });

    var oDataset1 = new sap.viz.ui5.data.FlattenedDataset('FrameDSUpdateTest', {
        dimensions: [{
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Profit',
            value: '{profit}'
        }, {
            name: 'Revenue',
            value: '{revenue}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var analysisObjects = [new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid': 'Product', 'name': 'Product', 'type': 'Dimension'}),
                           new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid': 'Country', 'name': 'Country', 'type': 'Dimension'}),
                           new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid': 'Profit', 'name': 'Profit', 'type': 'Measure'}),
                           new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid': 'Revenue', 'name': 'Revenue', 'type': 'Measure'}),
                           new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid': 'Country', 'name': 'Country', 'type': 'Dimension'}),
                           new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid': 'City', 'name': 'City', 'type': 'Dimension'}),
                           new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid': 'Number', 'name': 'Number', 'type': 'Measure'})];
    var feeds1 = [new sap.viz.ui5.controls.common.feeds.FeedItem({'uid': 'axisLabels', 'type': 'Dimension', 'values': [analysisObjects[1]]}),
                  new sap.viz.ui5.controls.common.feeds.FeedItem({'uid': 'primaryValues', 'type': 'Measure', 'values': [analysisObjects[2], analysisObjects[3]]})];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt('content');
    vizFrame.attachEvent("renderComplete", function() {
        oDataset1.invalidate();
        ok(vizFrame._invalidateDataset, "invalidate Dataset marks vizFrame._invalidateDataset flag");
        destroyVizFrame(vizFrame);
        start();
    });

});


function getChartTitle(){
    return document.querySelector(".viz-title-label").textContent;
}

function testSetViz() {
    expect(16);
    var vizType = 'info/line';
    var option = {
        viztype: vizType,
        uiConfig: {
            'applicationSet': arguments[0]
        }
    };
    var vizFrame = createVizFrame(option);
    var oModel1 = new sap.ui.model.json.JSONModel({
        businessData1: ModelInfo.businessData
    });
    var oDataset1 = new sap.viz.ui5.data.FlattenedDataset('FrameDSZoomTest', {
        dimensions: [{
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Profit',
            value: '{profit}'
        }, {
            name: 'Revenue',
            value: '{revenue}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var analysisObjects = [new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Product',
        'name': 'Product',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Profit',
        'name': 'Profit',
        'type': 'Measure'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Revenue',
        'name': 'Revenue',
        'type': 'Measure'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Country',
        'name': 'Country',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'City',
        'name': 'City',
        'type': 'Dimension'
    }), new sap.viz.ui5.controls.common.feeds.AnalysisObject({
        'uid': 'Number',
        'name': 'Number',
        'type': 'Measure'
    })];
    var feeds1 = [new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid': 'axisLabels',
        'type': 'Dimension',
        'values': [analysisObjects[1]]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid': 'primaryValues',
        'type': 'Measure',
        'values': [analysisObjects[2], analysisObjects[3]]
    })];
    vizFrame.setModel(oModel1);
    vizFrame.setDataset(oDataset1);
    setVizControlFeeds(vizFrame, feeds1);
    vizFrame.placeAt('content');
    var chatType, chartTitle;
    var step = 0;
    vizFrame.attachEvent('renderComplete', function() {
        if (step === 0) {
            chatType = this._vizFrame.type();
            equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            equal(chartTitle, "Title of Chart", "the default chart title");

            var userProp = {
                "title": {
                    "text": "apple",
                    "visible": true
                }
            };
            vizFrame.setVizProperties(userProp);
        } else if (step === 1) {
            chartTitle = getChartTitle();
            equal(chartTitle, "apple", "user-defined title");
            vizFrame.setVizType('info/column');
        } else if (step === 2) {
            chatType = this._vizFrame.type();
            equal(chatType, "info/column", "chart type check");

            chartTitle = getChartTitle();
            equal(chartTitle, "apple", "user-defined title");
            vizFrame.setVizType('info/line');
        } else if (step ===3){
            chatType = this._vizFrame.type();
            equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            equal(chartTitle, "apple", "user-defined title");
            vizFrame.setVizType('info/dual_stacked_bar');
        } else if (step === 4) {
            chatType = this._vizFrame.type();
            equal(chatType, "info/dual_stacked_bar", "chart type check");

            //the valueAxis color of dual_stacked_bar chart  is different than non-dual charts.
            var valueAxisColor = vizFrame.getVizProperties().valueAxis.color;
            equal(valueAxisColor, "sapUiChartPaletteSequentialHue1Dark1", "valueAxis color check");

            chartTitle = getChartTitle();
            equal(chartTitle, "apple", "user-defined title");
            sap.ui.getCore().applyTheme("sap_hcb");
        } else if (step === 5) {
            vizFrame.setVizType('info/line');
        } else if (step === 6) {
            chatType = this._vizFrame.type();
            equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            equal(chartTitle, "apple", "user-defined title");

            var valueAxisColor = vizFrame.getVizProperties().valueAxis.color;
            equal(valueAxisColor, "#ffffff" , "valueAxis color check");

            var chartTitleColor = vizFrame.getVizProperties().title.style.color;
            equal(chartTitleColor, "#ffffff", "high contrast theme applied");
            sap.ui.getCore().applyTheme("sap_bluecrystal");
        } else {
            chatType = this._vizFrame.type();
            equal(chatType, "info/line", "chart type check");

            chartTitle = getChartTitle();
            equal(chartTitle, "apple", "user-defined title");
            destroyVizFrame(vizFrame);
            start();
        }
        step++;
    });
}

asyncTest('vizFrame.setVizType', testSetViz.bind(null, "fiori"));
asyncTest('vizFrame.setVizType without applicationSet', testSetViz.bind(null, null));

//as the bullet chart is the most complex, the follwings use bullet chart to test the function
asyncTest("dataset.exportToSVGString", function() {
    var option = {
        viztype: 'bullet'
    };
    var vizFrame = createVizFrame(option);
    vizFrame.setVizProperties({
        plotArea: {
          colorPalette: ['sapUiChartPaletteSemanticNeutralDark1'],
          gap: {
            visible: true,
            type: "negative",
            negativeColor: 'sapUiChartPaletteSemanticBad'
          }
        }
    });
    var oModel = new sap.ui.model.json.JSONModel({
        milk : bulletModelInfo.milk
    });
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        // a Bar Chart requires exactly one dimension (x-axis)
        'dimensions' : [{
            'name' : 'Store Name',
            'value' : "{Store Name}"
        }],
        // it can show multiple measures, each results in a new set of bars in a new color
        'measures' : [
        {
           'name' : 'Revenue', // 'name' is used as label in the Legend
           'value' : '{Revenue}' // 'value' defines the binding for the displayed value
        },{
           'name' : 'Additional Revenue',
           'value' : '{Additional Revenue}'
        }, {
           'name' : 'Forecast',
           'value' : '{Forecast}'
        }, {
           'name': "Target",
           'value': "{Target}"
        }, {
           'name': 'Revenue2',
           'value': '{Revenue2}'
        }, {
           'name': 'Additional Revenue2',
           'value': '{Additional Revenue2}'
        }, {
           'name': "Forecast2",
           'value': "{Forecast2}"
        }, {
           'name': "Target2",
           'value': "{Target2}"
        }],
        // 'data' is used to bind the whole data collection that is to be displayed in the chart
        'data' : {
           'path' : "/milk"
        }
      });
      vizFrame.setDataset(oDataset)
      vizFrame.setModel(oModel);

      // set feeds
      var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : "actualValues",
        'type' : "Measure",
        'values' : ["Revenue"]
      }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : "categoryAxis",
        'type' : "Dimension",
        'values' : ["Store Name"]
      }),feedTargetValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
        'uid' : "targetValues",
        'type' :"Measure",
        'values' : ["Target"]
      });

      vizFrame.addFeed(feedPrimaryValues);
      vizFrame.addFeed(feedAxisLabels);
      vizFrame.addFeed(feedTargetValues);
    
      vizFrame.placeAt('content');
      var emptySVG = vizFrame.exportToSVGString();
      equal(emptySVG,"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\"/>");
      vizFrame.attachEvent("renderComplete", function() {
        //an empty <defs>, v-m-action-layer-group, v-m-decoration-layer-group, v-m-backgroup
        //v-m-title, v-m-legendgroup, v-m-mian, defs-diagonalhatch.
        var svgResult = $($.parseHTML(vizFrame.exportToSVGString()));
        var svgResultLength = svgResult.children().length;
        var mainChild = svgResult.find(".v-m-main").children().length;
        equal(svgResultLength,8);

        //hideTitleLegend = true,v-m-tile and v-m-legendgroup will be removed
        svgResultLength = $($.parseHTML(vizFrame.exportToSVGString({hideTitleLegend:true}))).children().length;
        equal(svgResultLength,6);
        
        //hideAxis = true, v-m-main.v-m-yAxis, v-m-main.v-m-yAxis2, v-m-main.v-m-xAxis, v-m-main.v-m-xAxis2, v-m-main.v-m-zAxis 
        //but in this case only move v-m-yAxis and v-m-xAxis2
        var svgResult = $($.parseHTML(vizFrame.exportToSVGString({width:400,height:400,hideTitleLegend:true,hideAxis:true})));
        var width = svgResult.attr("width");
        var height  = svgResult.attr("height");
        svgResultLength = svgResult.children().length;
        mainChild -= svgResult.find(".v-m-main").children().length;
        equal(width,400);
        equal(height,400);
        equal(svgResultLength,6);
        equal(mainChild,2);
        destroyVizFrame(vizFrame);
        start();
      });

});


