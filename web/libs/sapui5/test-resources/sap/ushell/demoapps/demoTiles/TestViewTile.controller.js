// @copyright@

(function () {
    "use strict";
    /*global jQuery, sap, console, window, hasher */
    /*jslint plusplus: true, nomen: true*/

    sap.ui.controller("sap.ushell.demo.demoTiles.TestViewTile", {
        _handleTilePress: function (oTileControl) {
            if (typeof oTileControl.attachPress === 'function') {
                oTileControl.attachPress(function () {
                    if (typeof oTileControl.getTargetURL === 'function') {
                        var sTargetURL = oTileControl.getTargetURL();
                        if (sTargetURL) {
                            if (sTargetURL[0] === '#') {
                                hasher.setHash(sTargetURL);
                            } else {
                                window.open(sTargetURL, '_blank');
                            }
                        }
                    }
                });
            }
        }
    });
}());
