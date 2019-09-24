(function ($) {
    var instances = {},
        globalID = 0,
        userAgent = navigator.userAgent.toLowerCase();

    var defaults = {
        keepSourceStyles: false,
        loadingText: "Loading map...",
        activeLayerId: 0,
        opacityGradation: [0.4, 0.6, 0.8, 1],
        tooltip: {
            rowCount: 5,
            showAllRows: false
        }
    };

    var svgIMap = function (elem, options) {
        var _data;

        this.methods = {

            destroy: function () {
                delete instances[_data.$map.attr("id")];
                _data.$map.empty();
                return _this
            },

            getData: function () {
                return _data
            },

            recalcData: function () {
                for (var rind in _data.mapdata["regions"]) {
                    // var result = _data.mapdata["regions"][rind]["data"];
                    _this.sortJSON(_data.mapdata["regions"][rind]["data"], 'value', -1);
                }

                for (var lind in _data.mapdata["layers"]) {
                    _data.mapdata["layers"][lind]["maxValue"] = Number.MIN_VALUE;
                    _data.mapdata["layers"][lind]["minValue"] = Number.MAX_VALUE;

                    for (var ind in _data.mapdata["regions"]) {
                        var regionData = _data.mapdata["regions"][ind];

                        for (var dind in regionData["data"]) {
                            if (regionData["data"][dind]["layerid"] === _data.mapdata["layers"][lind]["id"]) {
                                if (regionData["data"][dind]["value"] > _data.mapdata["layers"][lind]["maxValue"]) {
                                    _data.mapdata["layers"][lind]["maxValue"] = regionData["data"][dind]["value"];
                                }
                                if (regionData["data"][dind]["value"] < _data.mapdata["layers"][lind]["minValue"]) {
                                    _data.mapdata["layers"][lind]["minValue"] = regionData["data"][dind]["value"];
                                }
                                break;
                            }
                        }
                    }

                    _data.mapdata["layers"][lind]["gradstep"] = (_data.mapdata["layers"][lind]["maxValue"] - _data.mapdata["layers"][lind]["minValue"]) / (_data.options.opacityGradation.length);
                    _data.mapdata["layers"][lind]["gradstep"] = parseFloat(_data.mapdata["layers"][lind]["gradstep"].toFixed(3));
                }

                for (var ind in _data.mapdata["regions"]) {
                    _data.mapdata["regions"][ind]["maxValue"] = _data.mapdata["regions"][ind]["data"][0]["value"];

                    var regionData = _data.mapdata["regions"][ind];
                    for (var dind in regionData["data"]) {
                        var layerRegionData = regionData["data"][dind];

                        for (var lind in _data.mapdata["layers"]) {
                            if (layerRegionData["layerid"] === _data.mapdata["layers"][lind]["id"]) {
                                var layerData = _data.mapdata["layers"][lind];
                                layerRegionData["color"] = layerData["basecolor"];

                                var oCount = _data.options.opacityGradation.length;
                                var currStep = 0;
                                var valData = layerRegionData["value"];

                                for (; currStep < oCount; currStep++) {
                                    if (valData >= (layerData["minValue"] + layerData["gradstep"] * currStep) && valData <= (layerData["minValue"] + layerData["gradstep"] * (currStep + 1))) {
                                        break;
                                    }
                                }
                                if (currStep >= oCount) {
                                    currStep = oCount - 1;
                                }
                                layerRegionData["opacity"] = _data.options.opacityGradation[currStep];
                                break;
                            }
                        }

                    }
                }
            },

            decorateRegions: function (e) {
                _data.map = _data.mapObject.contentDocument;
                if (_data.map === undefined || _data.map === null) {
                    return
                }

                _data.$map = $(_data.mapObject.contentDocument.getElementsByClassName("maparea"));

                if (_data.$map !== undefined && _data.mapdata !== undefined) {
                    for (var ind in _data.mapdata["regions"]) {
                        var regionData = _data.mapdata["regions"][ind];

                        var color = '#d9dada';
                        var opacity = 0.5;
                        var region = _data.$map.filter("#" + regionData["id"]);

                        if (region !== undefined) {
                            if (_data.options.activeLayerId === 0) {
                                var maxValueLayer = parseInt(regionData["data"][0]["layerid"]);
                                var maxMaxValue = Number.MIN_VALUE;
                                var minMaxValue = Number.MAX_VALUE;

                                for (var ind in _data.mapdata["regions"]) {
                                    var varRegionData = _data.mapdata["regions"][ind];

                                    if (varRegionData["data"][0]["value"] > maxMaxValue) {
                                        maxMaxValue = varRegionData["data"][0]["value"];
                                    }
                                    if (varRegionData["data"][0]["value"] < minMaxValue) {
                                        minMaxValue = varRegionData["data"][0]["value"];
                                    }
                                }
                                var gradstep = (maxMaxValue - minMaxValue) / (_data.options.opacityGradation.length);
                                gradstep = parseFloat(gradstep.toFixed(3));

                                for (var lind in _data.mapdata["layers"]) {
                                    var layerData = _data.mapdata["layers"][lind];
                                    if (parseInt(layerData["id"]) === maxValueLayer) {
                                        if (layerData["basecolor"] !== undefined) {
                                            color = layerData["basecolor"];

                                            var oCount = _data.options.opacityGradation.length;
                                            var currStep = 0;
                                            var valData = regionData["data"][0]["value"];

                                            for (; currStep < oCount; currStep++) {
                                                if (valData >= (minMaxValue + gradstep * currStep) && valData <= (minMaxValue + gradstep * (currStep + 1))) {
                                                    break;
                                                }
                                            }
                                            if (currStep >= oCount) {
                                                currStep = oCount - 1;
                                            }
                                            opacity = _data.options.opacityGradation[currStep];
                                        }
                                        break;
                                    }
                                }
                            } else {
                                for (var dind in regionData["data"]) {
                                    if (parseInt(regionData["data"][dind]["layerid"]) === _data.options.activeLayerId) {
                                        color = regionData["data"][dind]["color"];
                                        opacity = regionData["data"][dind]["opacity"];
                                        break;
                                    }
                                }
                            }
                            region.attr("fill", color);
                            region.attr("fill-opacity", opacity);
                            region.tooltip({
                                    top: _data.mapObject.offsetTop+5,
                                    left: _data.mapObject.offsetLeft+20,
                                    positionLeft: false,
                                    delay: 30,
                                    track: false,
                                    bodyHandler: _this.setTooltip
                                });
                        }

                    }
                }
            },

            setRegionsData: function (e) {
                if (e !== undefined) {
                    _data.options.dataSource = e;
                }

                $.getJSON(_data.options.dataSource)
                    .done(function (json) {

                        _data.mapdata = json;
                        //                        for (var rind in _data.mapdata["regions"]) {
                        //                            var result = _data.mapdata["regions"][rind]["data"];
                        //                            _this.sortJSON(result, 'value', -1);
                        //                        }
                        _this.recalcData(null);
                        _this.decorateRegions(null);
                    })
                    .fail(function (jqxhr, textStatus, error) {
                        var err = textStatus + ", " + error;
                        console.log("Request Failed: " + err);
                    });
            },

            onSetLayer: function (p) {
                _data.options.activeLayerId = parseInt(p, 10);
                _this.decorateRegions(null);
                return true
            },

            setTooltip: function () {
                var regionId = $(this).attr("id");
                for (var regind in _data.mapdata["regions"]) {
                    if (regionId === _data.mapdata["regions"][regind]["id"]) {
                        var regionData = _data.mapdata["regions"][regind];
                    }
                }
                var htmlData = '<div class="map_legend3">' + regionData["name"] + '<span class="fl_right"> (опр '+regionData["percent"]+'%)</span></div><div class="map_legend2">';
                var countRegionData = 1;
                for (var i in regionData["data"]) {
                    if (_data.options.tooltip.rowCount !== undefined && countRegionData > _data.options.tooltip.rowCount) {
                        break;
                    }

                    if (!_data.options.tooltip.showAllRows && _data.options.activeLayerId !== 0 && parseInt(regionData["data"][i]["layerid"], 10) !== _data.options.activeLayerId) {
                        continue;
                    }

                    var classAttr = "row";

                    if (parseInt(regionData["data"][i]["layerid"], 10) === _data.options.activeLayerId) {
                        classAttr = "row active_tooltip";
                    }

                    htmlData = htmlData + '<div class="' + classAttr + '">';
                    //http://www.cvk.gov.ua/pls/vp2014/WP004?pt021f01=134

                    if (regionData["data"][i]["title"] !== undefined) {
                        htmlData = htmlData + regionData["data"][i]["title"];
                    } else {
                        for (var lind in _data.mapdata["layers"]) {
                            if (parseInt(_data.mapdata["layers"][lind]["id"]) === parseInt(regionData["data"][i]["layerid"])) {
                                htmlData = htmlData + _data.mapdata["layers"][lind]["name"];
                            }
                        }
                    }
                    htmlData = htmlData + ':&nbsp;&nbsp;<b>' + regionData["data"][i]["value"];
                    if (_data.options.tooltip.measure !== undefined) {
                        htmlData = htmlData + _data.options.tooltip.measure;
                    }
                    htmlData = htmlData + '</b>';

                    var comment = regionData["data"][i]["comment"];
                    if (comment !== undefined && comment.length > 0) {
                        htmlData = htmlData + '<div class="map_comment">' + comment + '</div>';
                    }

                    htmlData = htmlData + '</div>';
                    countRegionData++;
                }

                if (htmlData != undefined) {
                    htmlData = htmlData + '</div>';
                    var result = $("<div>").html(htmlData);
                }
                else {
                    var result = '<div style="display:none;"></div>';
                }
                return result;
            },

            setGradation: function (g) {
                _data.options.opacityGradation = g;
            },

            init: function (e, t) {
                if (!e.dataSource) {
                    alert("svgIMap Error: Please provide a map Data");
                    return false
                }
                _data = {};
                _data.options = $.extend(true, {}, defaults, e);
                _this.setRegionsData(_data.options.dataSource);

                var svgId = $(t).attr("id");
                _data.mapObject = document.getElementById(svgId);
                _data.mapObject.onload = _this.decorateRegions;
                return _this
            },

            sortJSON: function (objArray, prop, direction) {
                if (arguments.length < 2) throw new Error("sortJsonArrayByProp requires 2 arguments");
                var direct = arguments.length > 2 ? arguments[2] : 1; //Default to ascending

                if (objArray && objArray.constructor === Array) {
                    var propPath = (prop.constructor === Array) ? prop : prop.split(".");
                    objArray.sort(function (a, b) {
                        for (var p in propPath) {
                            if (a[propPath[p]] && b[propPath[p]]) {
                                a = a[propPath[p]];
                                b = b[propPath[p]];
                            }
                        }
                        // convert numeric strings to integers
                        //a = a.match(/^\d+$/) ? +a : a;
                        //b = b.match(/^\d+$/) ? +b : b;
                        return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
                    });
                }
            }
        };

        var _this = this.methods
    };

    $.fn.svgIMap = function (methodOrOptions) {
        var t = $(this).attr("id");

        if (instances[t] !== undefined && instances[t].methods[methodOrOptions]) {
            return instances[t].methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof methodOrOptions == "object" && instances[t] === undefined) {
            instances[t] = new svgIMap(this, methodOrOptions);
            return instances[t].methods.init(methodOrOptions, this)
        } else if (instances[t]) {
            return instances[t].methods
        } else {
            return $(this)
        }
    }
})(jQuery)
