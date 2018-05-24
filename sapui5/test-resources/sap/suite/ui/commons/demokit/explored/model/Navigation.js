jQuery.sap.declare("model.Navigation");

model.Navigation = {

	items: [

		{parent: null, type: "DIR", id: "root", name: "Categories" },

		{parent: "root", type: "DIR", id: "containers", name: "Container" },
		{parent: "containers", type: "JS",  id: "uti", name: "Unified Thing Inspector"},
	]
};

// calculate the sample counts
(function () {

	// map items 2 indizes
	var itemIndizes = {};
	jQuery.each(model.Navigation.items, function (i, item) {
		itemIndizes[item.id] = i;
	});
	
	// define recursive count function
	var fnCalcCounts = function (id, level) {
		var itemCount = 0;
		jQuery.each(model.Navigation.items, function (i, item) {
			if (id === item.parent) {
				if ("DIR" === item.type) {
					itemCount += fnCalcCounts(item.id, level + 1);
				} else {
					itemCount++;
					item.level = level + 1;
				}
			}
		});
		var i = itemIndizes[id];
		model.Navigation.items[i].count = itemCount;
		model.Navigation.items[i].level = level;
		return itemCount;
	};
	
	// start recursion with root
	fnCalcCounts("root", 0);
}
)();
