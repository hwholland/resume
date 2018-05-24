describe('sap.gantt.GanttChartContainer_Complex', function() {

	it('Should load Gantt Chart Container Complex test page',function(){
		expect(takeScreenshot()).toLookAs('GanttComplex');
	}, 30000);
	it('Should display Legend dialog', function () {
		// click on Settings button if available
		element(by.id('__button15')).click();
		browser.sleep(1000);
		expect(takeScreenshot()).toLookAs('GanttComplexLegend');
		element(by.id('__item5')).click();
		expect(takeScreenshot()).toLookAs('GanttComplexLegendDocument');
	}, 30000);
	it('Should display Settings dialog', function () {
		// click on Settings button if available
		element(by.id('__button14')).click();
		browser.sleep(1000);
		expect(takeScreenshot()).toLookAs('GanttComplexSettings');
		element(by.css("#__dialog1-dialog #__dialog1-acceptbutton")).click();
	}, 30000);

	it('Should display single resouces view', function () {
		// click on the view layout dropdown list
		browser.sleep(1000);
		element(by.css("#__toolbar6 #__select0-arrow")).click();
		browser.sleep(1000);
		element(by.id('__item9')).click();
		browser.sleep(10000);
		expect(takeScreenshot()).toLookAs('GanttComplexSingleView');
	}, 30000);
});