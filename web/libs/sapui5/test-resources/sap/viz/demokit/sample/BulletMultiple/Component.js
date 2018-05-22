jQuery.sap.declare("sap.viz.sample.BulletMultiple.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.BulletMultiple.Component", {

	metadata : {
		rootView : "sap.viz.sample.BulletMultiple.Bullet",
		dependencies : {
			libs : [
				"sap.viz",
				"sap.m"
			]
		},
		config : {
			sample : {
				stretch : true,
				files : [
					"Bullet.view.xml",
					"Bullet.controller.js"
				]
			}
		}
	}
});