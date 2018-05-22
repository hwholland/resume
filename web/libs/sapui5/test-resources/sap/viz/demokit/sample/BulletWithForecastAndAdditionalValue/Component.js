jQuery.sap.declare("sap.viz.sample.BulletWithForecastAndAdditionalValue.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.BulletWithForecastAndAdditionalValue.Component", {

	metadata : {
		rootView : "sap.viz.sample.BulletWithForecastAndAdditionalValue.Bullet",
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