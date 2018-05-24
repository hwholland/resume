/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define("sap/suite/ui/commons/TimelineRenderManager", ["jquery.sap.global", "./library", "sap/m/Text", "sap/ui/core/Icon", "sap/m/ViewSettingsDialog", "sap/ui/core/ResizeHandler", "sap/ui/core/Item", "sap/m/ButtonType", "sap/m/ToolbarSpacer", "sap/m/SearchField", "sap/m/OverflowToolbar", "sap/m/Select", "sap/m/RangeSlider", "sap/m/Label", "sap/m/Panel", "sap/m/FlexBox", "sap/m/OverflowToolbarButton", "sap/m/MessageStrip", "sap/ui/core/CSSSize", "sap/m/ViewSettingsFilterItem", "sap/m/ViewSettingsCustomItem", "sap/m/OverflowToolbarLayoutData", "sap/m/OverflowToolbarPriority", "sap/m/MessageToast", "sap/ui/core/InvisibleText", "sap/m/SliderTooltip"], function (q, l, T, I, V, R, a, B, b, S, O, c, d, L, P, F, f, M, C, g, h, k, m, n, o, p) {
	"use strict";
	var r = l.TimelineGroupType;
	var s = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");
	var t = 680;
	var D = Object.freeze({
		UP: "UP",
		DOWN: "DOWN",
		NONE: "NONE"
	});

	function u($, e, i) {
		$.removeClass(e).addClass(i);
	}

	function _($, A) {
		return parseInt($.css(A).replace("px", ""), 10);
	}
	var v = {
		extendTimeline: function (w) {
			w.prototype._initControls = function () {
				this._setupMessageStrip();
				this._setupFilterDialog();
				this._setupHeaderToolbar();
				this._setupAccessibilityItems();
			};
			w.prototype._registerResizeListener = function () {
				var e = this.$().parent().get(0);
				if (e) {
					this.oResizeListener = R.register(e, q.proxy(this._performResizeChanges, this));
				}
			};
			w.prototype._deregisterResizeListener = function () {
				if (this.oResizeListener) {
					R.deregister(this.oResizeListener);
				}
			};
			w.prototype._performUiChanges = function (e) {
				this._deregisterResizeListener();
				if (!this.getDomRef()) {
					return;
				}
				if (this._isVertical()) {
					this._performUiChangesV(e);
				} else {
					this._performUiChangesH();
				}
				this._setupScrollers();
				this._startItemNavigation();
				this._registerResizeListener();
			};
			w.prototype._performDoubleSidedChangesLi = function ($, i) {
				var e = $.children().first(),
					j = this._isLeftAlignment() ? "sapSuiteUiCommonsTimelineItemWrapperVLeft" : "sapSuiteUiCommonsTimelineItemWrapperVRight";
				if (this._renderDblSided) {
					if ($.hasClass('sapSuiteUiCommonsTimelineItem')) {
						$.removeClass('sapSuiteUiCommonsTimelineItem').addClass(i ? "sapSuiteUiCommonsTimelineItemOdd" : "sapSuiteUiCommonsTimelineItemEven");
						if (!i) {
							u(e, "sapSuiteUiCommonsTimelineItemWrapperVLeft", "sapSuiteUiCommonsTimelineItemWrapperVRight");
						} else {
							u(e, "sapSuiteUiCommonsTimelineItemWrapperVRight", "sapSuiteUiCommonsTimelineItemWrapperVLeft");
						}
					}
				} else {
					$.removeClass("sapSuiteUiCommonsTimelineItemOdd").removeClass("sapSuiteUiCommonsTimelineItemEven").addClass("sapSuiteUiCommonsTimelineItem");
					e.removeClass("sapSuiteUiCommonsTimelineItemWrapperVLeft").removeClass("sapSuiteUiCommonsTimelineItemWrapperVRight").addClass(j);
				}
			};
			w.prototype._performDoubleSidedChanges = function () {
				var $ = this.$(),
					e = $.find('.sapSuiteUiCommonsTimelineItemUlWrapper').not(".sapSuiteUiCommonsTimelineShowMoreWrapper"),
					x = $.find(".sapSuiteUiCommonsTimelineScrollV .sapSuiteUiCommonsTimelineGroupHeader"),
					y;
				if (this._renderDblSided) {
					this._$content.addClass("sapSuiteUiCommonsTimelineDblSided");
					x.addClass("sapSuiteUiCommonsTimelineGroupHeaderDblSided");
					x.addClass("sapSuiteUiCommonsTimelineItemWrapperVLeft").removeClass("sapSuiteUiCommonsTimelineItemWrapperVRight");
				} else {
					this._$content.removeClass("sapSuiteUiCommonsTimelineDblSided");
					x.removeClass("sapSuiteUiCommonsTimelineGroupHeaderDblSided sapSuiteUiCommonsTimelineItemWrapperVLeft");
					x.addClass(this._isLeftAlignment() ? "sapSuiteUiCommonsTimelineItemWrapperVLeft" : "sapSuiteUiCommonsTimelineItemWrapperVRight");
				}
				for (var j = 0; j < e.length; j++) {
					var z = q(e[j]),
						A = z.find('> li').not(".sapSuiteUiCommonsTimelineGroupHeader");
					A.eq(1).css("margin-top", this._renderDblSided ? "40px" : "auto");
					for (var i = 0; i < A.length; i++) {
						y = q(A[i]);
						this._performDoubleSidedChangesLi(y, (i % 2) === 0);
					}
				}
				$.find(".sapSuiteUiCommonsTimelineItemBarV").css("height", "");
				$.find(".sapSuiteUiCommonsTimelineItem").css("margin-bottom", "");
			};
			w.prototype._performUiChangesH = function () {
				var $ = this.$(),
					e, i;
				var j = function (x) {
					return ($.width() - (x.position().left + x.outerWidth()));
				};
				if (this.getEnableDoubleSided() && this._isGrouped()) {
					i = $.find(".sapSuiteUiCommonsTimelineHorizontalBottomLine ul");
					$.find("[firstgroupevenitem = true]:visible").each(function (x, y) {
						var z = function (Q) {
								return Q + "-" + (this._bRtlMode ? "right" : "left");
							}.bind(this),
							A = q("#" + y.id + "-line"),
							E = this._bRtlMode ? j(A) : A.position().left,
							G = 30,
							H = q(y),
							J = _(i, z("padding")),
							K, N;
						if (x === 0) {
							K = E - G - J;
						} else {
							e = H.prevAll(".sapSuiteUiCommonsTimelineItemLiWrapperV:visible:first");
							N = this._bRtlMode ? j(e) : (e.position().left + _(e, z("margin")));
							K = (E - G) - (N + e.outerWidth());
						}
						H.css(z("margin"), K + "px");
					}.bind(this));
				}
				if (!this.getEnableScroll()) {
					$.find(".sapSuiteUiCommonsTimelineContentsH").css("overflow-x", "hidden");
				}
				this._calculateTextHeight();
			};
			w.prototype._performUiChangesV = function (e) {
				var $ = this.$(),
					i = $.outerWidth() + 50;
				if (this.getEnableDoubleSided()) {
					this._renderDblSided = i >= t;
					if (this._renderDblSided !== this._lastStateDblSided || e) {
						this._performDoubleSidedChanges();
					}
					this._lastStateDblSided = this._renderDblSided;
				}
				this._calculateTextHeight();
				this._calculateHeightV();
			};
			w.prototype._calculateHeightV = function () {
				var $ = this.$(),
					e = this.$("headerBar").outerHeight() || 0,
					j = this.$("filterMessage").outerHeight() || 0,
					x = this.$("messageStrip").outerHeight() || 0,
					y = x + j + e,
					z = function (J, H) {
						var K, N, Q, W, X, Y, Z, a1 = J.length,
							b1 = this.getShowIcons() ? ".sapSuiteUiCommonsTimelineItemBarIconWrapperV:visible" : ".sapSuiteUiCommonsTimelineItemNoIcon:visible",
							c1 = H.length > 0 ? H.find(b1 + ", .sapSuiteUiCommonsTimelineItemBarIconWrapperV:visible").eq(0) : q(),
							d1 = 8;
						for (var i = 0; i < a1; i++) {
							K = q(J[i + 1]);
							N = q(J[i]);
							Q = i < a1 - 1 ? K.find(b1) : c1;
							X = N.find(b1);
							if (Q.length > 0 && X.length > 0) {
								Y = Q.offset().top;
								Z = X.offset().top + X.height();
								W = N.find(".sapSuiteUiCommonsTimelineItemBarV");
								d1 = 8;
								W.height(Y - Z - d1);
							}
						}
					},
					A = function (J) {
						var K, N, Q, W, X, Y = 40,
							Z = 100,
							a1 = function () {
								var b1 = _(Q, "margin-top") + Q.position().top + Q.height() - K.position().top;
								N.css("margin-bottom", b1 + Y + "px");
							};
						for (var i = 2; i < J.length; i++) {
							K = q(J[i]);
							N = q(J[i - 1]);
							Q = q(J[i - 2]);
							W = this._bRtlMode ? !K.hasClass("sapSuiteUiCommonsTimelineItemOdd") : K.hasClass("sapSuiteUiCommonsTimelineItemOdd");
							X = K.position().left;
							if (!W && X < Z || W && X > Z) {
								a1();
							} else {
								var b1 = K.position().top - N.position().top,
									c1 = _(Q, "margin-bottom");
								if (b1 < Y) {
									Q.css("margin-bottom", c1 + Y - b1);
								}
							}
						}
					},
					E = function () {
						var K = 5,
							N = $.position().top,
							Q = $.parent().height(),
							W = _(this._$content, "padding-bottom"),
							X = _(this._$content, "padding-top"),
							Y = Q - N - y - X - W - K;
						this._$content.height(Y);
					}.bind(this),
					U, G, H, J;
				if (this.getEnableScroll()) {
					E();
				}
				if (this._renderDblSided) {
					U = $.find(".sapSuiteUiCommonsTimelineItemUlWrapper");
					for (var i = 0; i < U.length; i++) {
						G = q(U[i]);
						H = q(U[i + 1]);
						J = G.find(" > li:not(.sapSuiteUiCommonsTimelineGroupHeader):visible");
						J.css("margin-bottom", "");
						A.call(this, J, G);
						z.call(this, J, H);
					}
				}
			};
			w.prototype._performResizeChanges = function () {
				this._performUiChanges();
			};
			w.prototype._calculateTextHeight = function () {
				var $ = this.$(),
					e = this.getTextHeight(),
					j, x, y = function (H, G) {
						$.find(".sapSuiteUiCommonsTimelineItemTextWrapper:visible").each(function (J, W) {
							var K = q(W),
								N = K.children().first(),
								Q = N.get(0).getClientRects(),
								U = 0,
								X = 0,
								Y, Z = -100000,
								a1 = 0,
								b1 = K.attr("expanded");
							if (!b1) {
								if (Q && Q.length > 0) {
									Y = Q[0].top;
									a1 = 0;
									for (var i = 0; i < Q.length - 1; i++) {
										if (Z !== Q[i].bottom) {
											Z = Q[i].bottom;
											a1++;
										}
										if (H > 0 && (Q[i + 1].bottom - Y > H)) {
											X = a1;
											U = Q[i].bottom - Y;
											break;
										}
										if (G > 0 && a1 === G) {
											U = Q[i].bottom - Q[0].top;
											X = G;
											break;
										}
									}
								}
								if (U > 0) {
									K.height(U);
									K.css("-webkit-line-clamp", X.toString());
									K.next().show();
								} else if (!K.attr("expandable")) {
									K.next().hide();
								}
							}
						});
					},
					z = function (i) {
						y(0, parseInt(i, 10));
					},
					A = function (H) {
						y(H, 0);
					},
					E = function () {
						var i = $.find(".sapSuiteUiCommonsTimelineItemTextWrapper");
						i.css("height", "");
						i.css("-webkit-line-clamp", "");
						$.css("height", "100%");
						var G = this._$content.height(),
							H = _(this._$content, "padding-bottom"),
							J = this._$content.get(0).scrollHeight,
							K = J - G - H,
							N = {
								height: 0
							},
							Q, U = 20;
						$.find(".sapSuiteUiCommonsTimelineItemTextWrapper").each(function (W, X) {
							var Y = q(X).height();
							if (Y > N.height) {
								N.height = Y;
								N.item = q(this);
							}
						});
						if (N.item) {
							Q = N.item.parent().find(".sapSuiteUiCommonsTimelineItemShowMore:hidden").height();
							return N.height - K - Q - U;
						}
						return 1;
					};
				if (e) {
					if (this._useAutomaticHeight()) {
						A(E.call(this));
					} else if (q.isNumeric(e)) {
						z(e);
					} else {
						j = /([0-9]*\.?[0-9]+)(px)+/i;
						x = j.exec(e);
						if (x && x.length > 1) {
							A(x[1]);
						} else if (C.isValid(e)) {
							$.find(".sapSuiteUiCommonsTimelineItemTextWrapper").height(e);
						}
					}
				}
			};
			w.prototype._fixScrollerPositionH = function () {
				var $ = this.$(),
					e = $.find(".sapSuiteUiCommonsTimelineHorizontalMiddleLine"),
					i = $.find(".sapSuiteUiCommonsTimelineHorizontalScroller"),
					j, x = this._$content.position().top;
				if (e.get(0)) {
					j = e.position().top;
					$.find(".sapSuiteUiCommonsTimelineScrollerIconWrapper").css("top", j - 5);
					i.css("top", x + "px");
					i.height(this._$content.outerHeight() - 15);
				}
			};
			w.prototype._setupScrollers = function () {
				var $ = this.$(),
					e = 450,
					N = 'rgba(0, 0, 0, 0)',
					i, j, x, y, G, z, A, E, H, J, K, Q, U, W = function (X) {
						var Y = N;
						X.parents().each(function (Z, a1) {
							var j = q(a1).css("background-color"),
								b1 = q(a1).css("background-image");
							if (b1 !== "none") {
								Y = N;
								return;
							}
							if (j !== N && j !== "transparent") {
								Y = j;
							}
						});
						return Y;
					};
				if (this._scrollingFadeout()) {
					i = this._isVertical() ? $.height() : $.width();
					if (i < e) {
						$.find(".sapSuiteUiCommonsTimelineVerticalScroller", ".sapSuiteUiCommonsTimelineHorizontalScroller").hide();
						this._scrollersSet = false;
						return;
					}
					if (!this._scrollersSet) {
						j = W(this.$());
						if (j && j !== N) {
							x = j.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
							if (x && x.length >= 4) {
								y = parseInt(x[1], 10);
								G = parseInt(x[2], 10);
								z = parseInt(x[3], 10);
								A = "rgba(" + y + "," + G + "," + z + ", 0)";
								H = "rgba(" + y + "," + G + "," + z + ", 0.7)";
								E = "rgba(" + y + "," + G + "," + z + ", 1)";
								J = $.find(".sapSuiteUiCommonsTimelineHorizontalLeftScroller, .sapSuiteUiCommonsTimelineTopScroller ");
								K = $.find(".sapSuiteUiCommonsTimelineHorizontalRightScroller, .sapSuiteUiCommonsTimelineBottomScroller");
								Q = this._isVertical() ? "top" : "left";
								U = this._isVertical() ? "bottom" : "right";
								J.css("background-image", "linear-gradient(to " + Q + ", " + A + ", " + E + ")");
								K.css("background-image", "linear-gradient(to " + U + ", " + A + ", " + E + ")");
								J.css("background-image", "-webkit-linear-gradient(" + U + ", " + A + ", " + H + " 30%," + E + ")");
								K.css("background-image", "-webkit-linear-gradient(" + Q + ", " + A + ", " + H + " 30%," + E + ")");
								this._scrollersSet = true;
								if (this.getContent().length > 0) {
									if ((!this._isVertical() && this._$content.get(0).scrollWidth > this._$content.outerWidth()) || (this._isVertical() && this._$content.get(0).scrollHeight > this._$content.outerHeight())) {
										K.show();
									}
								}
							}
						} else {
							$.find(".sapSuiteUiCommonsTimelineHorizontalScroller").hide();
						}
					}
					if (!this._isVertical()) {
						this._fixScrollerPositionH();
					}
				}
			};
			w.prototype._setupScrollEvent = function () {
				var $ = this.$(),
					e = $.find(".sapSuiteUiCommonsTimelineHorizontalLeftScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper, .sapSuiteUiCommonsTimelineTopScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper"),
					i = $.find(".sapSuiteUiCommonsTimelineHorizontalRightScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper, .sapSuiteUiCommonsTimelineBottomScroller .sapSuiteUiCommonsTimelineScrollerIconWrapper"),
					j = $.find(".sapSuiteUiCommonsTimelineHorizontalLeftScroller, .sapSuiteUiCommonsTimelineTopScroller"),
					x = $.find(".sapSuiteUiCommonsTimelineHorizontalRightScroller, .sapSuiteUiCommonsTimelineBottomScroller"),
					y = this._$content,
					z = this;
				if (z._lazyLoading() || z._scrollingFadeout()) {
					y.on("scroll", function (A) {
						var E = q(A.currentTarget),
							G = E.get(0).scrollLeft,
							H = E.get(0).scrollTop,
							J = false,
							K = 200,
							N = 5,
							Q = false,
							U, W, X, Y, y;
						if (z._isVertical()) {
							U = E.outerHeight();
							W = E.get(0).scrollHeight;
							Q = H + U > W - K;
							J = H + U >= W - N;
						} else {
							X = E.width();
							Y = E.get(0).scrollWidth;
							Q = G + X > Y - K;
							J = G + X >= Y - N - 185;
						}
						if (z._lazyLoading() && z._scrollMoreEvent) {
							if (Q && !z._isMaxed()) {
								z._scrollMoreEvent = false;
								z._loadMore();
							}
						}
						if (z._scrollersSet) {
							if (G > 50 || H > 50) {
								j.show();
							} else {
								j.hide();
								z._manualScrolling = false;
							}
							if (J) {
								x.hide();
							} else {
								x.show();
							}
							var Z;
							if (z._isVertical()) {
								Z = E.get(0).scrollTop;
								y = Z > z._lastScrollPosition.y ? i : e;
								z._lastScrollPosition.y = Z;
							} else {
								Z = E.get(0).scrollLeft;
								y = Z > z._lastScrollPosition.x ? i : e;
								z._lastScrollPosition.x = Z;
							}
							y.addClass("sapSuiteUiCommonsTimelineScrolling");
							clearTimeout(q.data(this, 'scrollTimer'));
							q.data(this, 'scrollTimer', setTimeout(function () {
								e.removeClass("sapSuiteUiCommonsTimelineScrolling");
								i.removeClass("sapSuiteUiCommonsTimelineScrolling");
							}, 350));
						}
					});
					this.$().find(".sapSuiteUiCommonsTimelineScrollerIconWrapper").mousedown(function (A) {
						var E = 90,
							G = (q(this).hasClass("sapSuiteUiCommonsTimelineScrollerIconWrapperLeft") || q(this).hasClass("sapSuiteUiCommonsTimelineScrollerIconWrapperTop")) ? -E : E;
						z._manualScrolling = true;
						z._performScroll(G);
					});
					this.$().find(".sapSuiteUiCommonsTimelineScrollerIconWrapper").mouseup(function () {
						z._manualScrolling = false;
					}).mouseout(function () {
						z._manualScrolling = false;
					});
				}
				if (this.getEnableScroll()) {
					this._$content.on("wheel", function (A) {
						var E = A.originalEvent.deltaY,
							G = 30;
						if (E < G && E > G * -1) {
							E = E > 0 ? G : G * -1;
						}
						this.scrollLeft += E * 2;
					});
					$.find(".sapSuiteUiCommonsTimelineHorizontalScroller, .sapSuiteUiCommonsTimelineVerticalScroller").on("wheel", function (A) {
						var E = A.originalEvent.deltaY;
						if (z._isVertical()) {
							z._$content.get(0).scrollTop += E * 2;
						} else {
							z._$content.get(0).scrollLeft += E * 2;
						}
					});
				}
			};
			w.prototype._setupMessageStrip = function () {
				var e = this;
				this._objects.register("messageStrip", function () {
					return new M(e.getId() + "-messageStrip", {
						close: function () {
							e.setCustomMessage("");
							e.fireCustomMessageClosed();
						},
						showCloseButton: true
					});
				});
				this._objects.register("filterMessageText", function () {
					return new T(e.getId() + "-filterMessageText", {});
				});
				this._objects.register("filterMessage", function () {
					var i = e._objects.getFilterMessageText(),
						j, x;
					x = new I(e.getId() + "filterMessageIcon", {
						src: "sap-icon://decline",
						press: [e._clearFilter, e]
					});
					j = new O(e.getId() + "-filterMessage", {
						design: "Info",
						content: [i, new b(), x]
					});
					j.addStyleClass("sapSuiteUiCommonsTimelineFilterInfoBar");
					j.setHeight("auto");
					return j;
				});
			};
			w.prototype._setMessageBars = function (e) {
				var i = this._getFilterMessage();
				if (i) {
					e.addChild(this._objects.getFilterMessage());
					this._objects.getFilterMessageText().setText(i);
				}
			};
			w.prototype._setupRangeFilterPage = function () {
				var i = this;
				this._rangeFilterType = null;
				this._objects.register("timeFilterSelect", function () {
					var e = new c(i.getId() + "-timeFilterSelect", {
						change: function (j) {
							i._rangeFilterType = j.getParameter("selectedItem").getProperty("key");
							i._setRangeFilter();
						},
						items: [new a({
							text: s.getText("TIMELINE_YEAR"),
							key: r.Year
						}), new a({
							text: s.getText("TIMELINE_QUARTER"),
							key: r.Quarter
						}), new a({
							text: s.getText("TIMELINE_MONTH"),
							key: r.Month
						}), new a({
							text: s.getText("TIMELINE_DAY"),
							key: r.Day
						})]
					});
					e.addStyleClass("sapSuiteUiCommonsTimelineRangeSelect");
					return e;
				});
				this._objects.register("timeRangeSlider", function () {
					var j = new d(i.getId() + "-timeRangeSlider", {
						enableTickmarks: true,
						visible: false,
						showAdvancedTooltip: true,
						step: 1,
						change: function (e) {
							var x = j.getMin(),
								y = j.getMax(),
								z = j.getRange();
							i._filterDialogRangePage.setFilterCount(+(z[0] !== x || z[1] !== y));
						}
					});
					j._updateTooltipContent = function (x, N) {
						var y, z;
						var A = function () {
							return i._rangeFilterType === r.Year;
						};
						if (y > i._maxDate) {
							y = i._maxDate;
						}
						if (y < i._minDate) {
							y = i._minDate;
						}
						try {
							y = i._fnAddDate(N);
							z = i._formatGroupBy(y, i._rangeFilterType).title;
							x.setValue(N);
							x.onAfterRendering = function () {
								try {
									if (this instanceof p && p.prototype.onAfterRendering) {
										p.prototype.onAfterRendering.apply(this);
									}
									var $ = x.$("input");
									$.attr("type", null);
									$.val(z);
									$.parent().width(A() ? "40px" : "115px");
								} catch (e) {}
							};
							x.$("input").attr("type", null);
							x.$("input").val(z);
						} catch (e) {}
					};
					j.addStyleClass("sapSuiteUiCommonsTimelineRangeFilter");
					j.onAfterRendering = function () {
						d.prototype.onAfterRendering.apply(this);
						var e = this.$().find(".sapMSliderLabel");
						e.eq(0).html(i._formatGroupBy(i._minDate, i._rangeFilterType).title);
						e.eq(1).html(i._formatGroupBy(i._maxDate, i._rangeFilterType).title);
					};
					return j;
				});
				this._objects.register("rangeTypeLbl", function () {
					return new L(i.getId() + "-rangeTypeLbl", {
						text: s.getText("TIMELINE_GROUP_BY_PERIOD") + ":"
					});
				});
				this._objects.register("rangeTypePanel", function () {
					var e = new P(i.getId() + "-rangeTypePanel", {
						content: [i._objects.getRangeTypeLbl(), i._objects.getTimeFilterSelect()]
					});
					e.addStyleClass("sapSuiteUiCommonsTimelineRangeFilterPanel");
					return e;
				});
				this._objects.register("rangePanel", function () {
					return new F(i.getId() + "rangePanel", {
						direction: "Column",
						items: [i._objects.getRangeTypePanel(), i._objects.getTimeRangeSlider()]
					});
				});
			};
			w.prototype._setupFilterFirstPage = function (e) {
				if (e) {
					e.removeAllAggregation("filterItems");
					if (this.getShowItemFilter()) {
						e.addAggregation("filterItems", new g({
							key: "items",
							text: this._getFilterTitle()
						}));
					}
					if (this.getShowTimeFilter()) {
						this._filterDialogRangePage = new h({
							key: "range",
							text: s.getText("TIMELINE_RANGE_SELECTION"),
							customControl: [this._objects.getRangePanel()]
						});
						e.addAggregation("filterItems", this._filterDialogRangePage);
					}
				}
			};
			w.prototype._setupFilterDialog = function () {
				var e = this;
				this._setupRangeFilterPage();
				this._objects.register("filterContent", function () {
					var i, j, x = function (E) {
							if (!e._filterState.data) {
								e._setFilterList();
								E.removeAllItems();
								e._aFilterList.forEach(function (G) {
									var H = q.grep(e._currentFilterKeys, function (J) {
										return G.key === J.key;
									}).length > 0;
									E.addItem(new g({
										key: G.key,
										text: G.text,
										selected: H
									}));
								});
							}
							e._filterState.data = true;
						},
						y = function () {
							n.show(s.getText("TIMELINE_NO_LIMIT_DATA"));
						},
						z = function () {
							if (!e._filterState.range) {
								A.setBusy(true);
								e._getTimeFilterData().then(function () {
									A.setBusy(false);
									if ((!e._minDate || !e._maxDate) || (!(e._minDate instanceof Date) || !(e._maxDate instanceof Date))) {
										y();
										return;
									}
									if (!e._rangeFilterType) {
										e._rangeFilterType = e._calculateRangeTypeFilter();
									}
									if (!e._startDate && !e._endDate) {
										e._setRangeFilter();
									} else {
										i = e._fnDateDiff(e._rangeFilterType, e._minDate, e._startDate);
										j = e._fnDateDiff(e._rangeFilterType, e._minDate, e._endDate);
										e._objects.getTimeRangeSlider().setRange([i, j]);
									}
									e._objects.getTimeFilterSelect().setSelectedKey(e._rangeFilterType);
									e._objects.getTimeRangeSlider().setVisible(true);
									e._objects.getTimeRangeSlider().invalidate();
								}).catch(function () {
									A.setBusy(false);
									y();
								});
								e._filterState.range = true;
							}
						},
						A = new V(e.getId() + "-filterContent", {
							confirm: function (E) {
								var G = E.getParameter("filterItems"),
									H, J, K, N, Q;
								e._currentFilterKeys = G.map(function (U) {
									return {
										key: U.getProperty("key"),
										text: U.getProperty("text")
									};
								});
								H = e._objects.getTimeRangeSlider();
								N = H.getRange();
								J = H.getMin();
								K = H.getMax();
								e._startDate = null;
								e._endDate = null;
								if (N[0] !== J || N[1] !== K) {
									e._startDate = e._fnAddDate(Math.min.apply(null, N), D.DOWN);
									e._endDate = e._fnAddDate(Math.max.apply(null, N), D.UP);
									Q = true;
								}
								e._filterData(Q);
							},
							resetFilters: function (E) {
								var G = e._objects.getTimeRangeSlider();
								G.setValue(G.getMin());
								G.setValue2(G.getMax());
								e._filterDialogRangePage.setFilterCount(0);
							},
							filterDetailPageOpened: function (E) {
								var K = E.getParameter("parentFilterItem").getProperty("key");
								if (K === "items") {
									x(E.getParameter("parentFilterItem"));
								}
								if (K === "range") {
									z();
								}
							}
						});
					e._setupFilterFirstPage(A);
					return A;
				});
			};
			w.prototype._setupHeaderToolbar = function () {
				var e = this,
					i = function (x) {
						e._objects.register(x.name, function () {
							var y = new f(e.getId() + "-" + x.name, {
								type: B.Transparent,
								icon: x.icon,
								tooltip: x.tooltip,
								press: x.fnPress
							});
							y.setLayoutData(new k({
								priority: x.priority
							}));
							return y;
						});
					};
				i({
					name: "filterIcon",
					icon: "sap-icon://add-filter",
					tooltip: s.getText("TIMELINE_FILTER_BY"),
					fnPress: [e._openFilterDialog, e],
					priority: m.NeverOverflow,
					visible: e.getShowItemFilter() || e.getShowTimeFilter()
				});
				i({
					name: "sortIcon",
					icon: "sap-icon://arrow-bottom",
					tooltip: s.getText("TIMELINE_SORT"),
					fnPress: [e._sortClick, e],
					priority: m.High,
					visible: e.getSort() && e.getShowSort()
				});
				var j = new b();
				this._objects.register("searchFieldLabel", function () {
					return new o(e.getId() + "-searchFieldLabel", {
						text: s.getText("TIMELINE_ACCESSIBILITY_SEARCH")
					});
				});
				this._objects.register("searchField", function () {
					var x = new S(e.getId() + "-searchField", {
						width: "14rem",
						ariaLabelledBy: e._objects.getSearchFieldLabel().getId(),
						search: function (E) {
							e._search(E.getSource().getValue());
						},
						visible: e.getShowSearch()
					});
					x.setLayoutData(new k({
						priority: m.Low
					}));
					return x;
				});
				this._objects.register("headerBar", function () {
					var x = [];
					if (e._isVertical()) {
						x = [j, e._objects.getSearchFieldLabel(), e._objects.getSearchField(), e._objects.getSortIcon(), e._objects.getFilterIcon()];
					} else {
						x = [e._objects.getSortIcon(), e._objects.getFilterIcon(), e._objects.getSearchFieldLabel(), e._objects.getSearchField()];
					}
					var H = new O(e.getId() + "-headerBar", {
						content: x,
						visible: e.getShowHeaderBar()
					});
					H.addStyleClass("sapSuiteUiCommonsTimelineHeaderBar");
					H.setParent(e);
					return H;
				});
			};
			w.prototype._setupAccessibilityItems = function () {
				var e = this;
				this._objects.register("accessibilityTitle", function () {
					return new o(e.getId() + "-accessibilityTitle", {
						text: s.getText("TIMELINE_ACCESSIBILITY_TITLE")
					});
				});
			};
		}
	};
	return v;
}, true);