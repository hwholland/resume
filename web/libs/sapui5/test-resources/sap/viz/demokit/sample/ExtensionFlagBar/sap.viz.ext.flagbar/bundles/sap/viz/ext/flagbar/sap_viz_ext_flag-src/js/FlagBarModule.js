define("sap_viz_ext_flag-src/js/FlagBarModule",["sap_viz_ext_flag-src/js/FlagBarRender","sap_viz_ext_flag-src/js/FlagBarDataMapping"], function(render,processData) {
    // Drawing Function used by new created module
    var moduleFunc = {
            _colorPalette : d3.scale.category20().range()
                                .concat(d3.scale.category20b().range())
                                .concat(d3.scale.category20c().range()), // color palette used by chart 
            _dispatch : d3.dispatch("initialized", "startToInit") //event dispatcher
    };

    moduleFunc.dispatch = function(_){
        if(!arguments.length){
            return this._dispatch;}
        this._dispatch = _;
        return this;
    };
    /**
     * function of drawing chart
     */
    moduleFunc.render = function(selection) {
        //add xml ns for root svg element, so the image element can be exported to canvas
        $(selection.node().parentNode.parentNode).attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
        
        //save instance variables to local variables because *this* is not referenced to instance in selection.each
        var _data = this._data,
            _width = this._width,
            _height = this._height,
            _colorPalette = this._colorPalette,
            _properties = this._properties,
            _dispatch = this._dispatch;
            _feeds = this._manifest.feeds;
            _dispatch.startToInit();

        selection.each(function() {

            //prepare canvas with width and height of div container
            d3.select(this).selectAll('g.vis').remove();
            var vis = d3.select(this)
                        .append('g')
                        .attr('class', 'vis')
                        .attr('width', _width)
                        .attr('height', _height);
            var that = this;
            processData(_data, _feeds, function(err, pData) {
                if(err) {
                    vis.append("text").text(err);
                    return;
                }
            render.call(that, pData, vis, _width, _height, _colorPalette, _properties, _dispatch);
           });
        });
        _dispatch.initialized({
            name : "initialized"
        });
    };
    return moduleFunc;
});