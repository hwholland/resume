sap.ui.define([
	"sap/ui/vbdemos/component/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.cluster.Main", {

		onInit: function() {
			//create an instance of ClusterTree which will be used as our clustering mode
			this.oCurrentClustering = new sap.ui.vbm.ClusterTree({
				rule: "status=good",
				click: this.onClickCluster.bind(this),
				vizTemplate: new sap.ui.vbm.Cluster({
					type: sap.ui.vbm.SemanticType.Success,
					icon: "sap-icon://shipping-status",
					text: {
						path : "/",
						formatter : function (data) {
//							return this.mClusterId;
							var oClusterInstance = this;
							var sRenderedClusterId = oClusterInstance.getId();
							var oVizObjMap = oClusterInstance.getParent().mVizObjMap;
							for (var sClusterKey in oVizObjMap) {
								if (oVizObjMap[sClusterKey].getId() == sRenderedClusterId) {
									var oVBI = oClusterInstance.getParent().getParent();
									var spotIds = oVBI.getInfoForCluster(sClusterKey, sap.ui.vbm.ClusterInfoType.ContainedVOs);
									var aSpots = [];
									spotIds.map(function (spotId) {
										aSpots.push(oVBI.getVoByInternalId(spotId));
									});
									return "Count_"+aSpots.length;
								}
							}
						}
					}
				})
			});

			//create an instance of the popover which will be shown
			//when clicking a cluster. The popover will include a list
			//of the spots the cluster represents.
			this.oPopover = new sap.m.Popover({
				title: "Cluster Details",
				placement: sap.m.PlacementType.Right,
				contentMinWidth: "11rem",
				content: new sap.m.List({
					items: {
						path: "/spots",
						template: new sap.m.StandardListItem({
							title: '{name}',
							icon: 'sap-icon://shipping-status'
						})
					}
				})
			});

			//save a reference to the instance of GeoMap
			this.oVBI = this.getView().byId("vbi");

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setSizeLimit(99999);
			

			$.getJSON("media/clusterUnclustered.json", function(data) {
				oModel.setData(data);
				oController.oData = data;
			});
			
			this.getView().setModel(oModel);
			
			this.oVBI = this.getView().byId("vbi");
 
		},

		onToggleCluster: function(e) {
			var bCluster = e.getParameter("pressed");

			if (bCluster) {
				if (!this.oCurrentClustering) {
					this.oCurrentClustering = new sap.ui.vbm.ClusterTree({
						rule: "status=good",
						click: this.onClickCluster.bind(this),
						vizTemplate: new sap.ui.vbm.Cluster({
							type: "Success",
							icon: 'sap-icon://shipping-status'
						})
					});
				}
				this.oVBI.addCluster(this.oCurrentClustering);
				e.getSource().setText("Cluster off");
			} else {
				this.oVBI.removeCluster(this.oCurrentClustering);
				e.getSource().setText("Cluster on");
			}

		},
		
		onClickCluster: function( evt ){
			var oTarget = evt.getParameter("instance").getItem(); 
			
			var ident = evt.getParameter("instance").getKey();
			var type = sap.ui.vbm.ClusterInfoType.ContainedVOs;
			var info = this.oVBI.getInfoForCluster(ident, type);			
			var cluster = [];
			for (var j = 0; j < info.length; j++) {
				var spot = this.oVBI.getVoByInternalId(info[j]);
				if (spot) {
					cluster.push({name: spot.getTooltip()});
				}
			}
			
			var oClusterModel = new sap.ui.model.json.JSONModel();
			oClusterModel.setSizeLimit(99999);
			oClusterModel.setData({"cluster":cluster});
			
			
			var oPopover = new sap.m.Popover({
				title: "Cluster Details", 
				placement:"Right",
				content: new sap.m.List({
					items:{
						path: "/cluster",
						template: new sap.m.StandardListItem({
							title: '{name}',
							icon: 'sap-icon://shipping-status'
						})
					}
				})});
			oPopover.setModel(oClusterModel);
			oPopover.setContentMinWidth("11rem");
			jQuery.sap.delayedCall(0, this, function() {
				oPopover.openBy(oTarget);
			});
		}

	});
});
