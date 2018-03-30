sap.ui.define(["resume/web/model/js/Base", "sap/viz/ui5/controls/VizFrame", "sap/viz/ui5/data/DimensionDefinition", "sap/viz/ui5/data/MeasureDefinition", "sap/viz/ui5/controls/common/feeds/FeedItem", "sap/viz/ui5/data/FlattenedDataset"],
    function(Base, VizFrame, DimensionDefinition, MeasureDefinition, FeedItem, FlattenedDataset) {
        "use strict";
        return Base.extend("resume.web.model.js.VizFrame", {

            constructor: function(oConfig) {
                this.config = oConfig;
                this.dimensions = [];
                this.measures = [];
                this.feeds = [];
                this.dataset = new FlattenedDataset({
                    data: "{/data}",
                });
                this.instantiateControl();
                this.configureDimensions();
                this.configureMeasures();
                this.configureFeeds();
                this.configureProperties();
            },

            instantiateControl: function() {
                this.vizFrame = new VizFrame({
                    vizType: this.config.vizType,
                    height: "300px",
                    width: "100%",
                    uiConfig: {
                        applicationSet: 'fiori'
                    }
                });
            }, 

            configureDimensions: function() {
                for(var i = 0; i < this.config.dimensions.length; i++) {
                    var oDimension = new DimensionDefinition(this.config.dimensions[i]);
                    this.dataset.addDimension(oDimension);
                }
            },

            configureMeasures: function() {
                for(var i = 0; i < this.config.measures.length; i++) {
                    var oMeasure = new MeasureDefinition(this.config.measures[i]);
                    this.dataset.addMeasure(oMeasure);
                }
            },

            configureFeeds: function() {
                for(var i = 0; i < this.config.feeds.length; i++) {
                    var oFeed = new FeedItem(this.config.feeds[i]);
                    console.log(oFeed);
                    this.vizFrame.addFeed(oFeed);
                }
            },

            configureProperties: function() {
                this.vizFrame.setVizProperties(this.config.properties);
            },

            getVizFrame: function() {
                this.vizFrame.setDataset(this.dataset);
                return this.vizFrame;
            }

        });
    });