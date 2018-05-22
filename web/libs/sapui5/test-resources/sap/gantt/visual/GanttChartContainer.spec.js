describe('sap.gantt.GanttChartContainer', function() {

	it('Should load test page',function(){
		expect(takeScreenshot()).toLookAs('GanttChartContainerInitial');
	});

	it('Should display Cozy mode', function () {
		//Click Cozy button on toolbar
		element(by.id('__button17')).click();
		browser.sleep(3000);
		expect(takeScreenshot()).toLookAs('GanttChartContainerCozy');
	});

	it('Should display Condense mode', function () {
		//Click Condense button on toolbar
		element(by.id('__button18')).click();
		browser.sleep(3000);
		expect(takeScreenshot()).toLookAs('GanttChartContainerCondese');
	});

});
