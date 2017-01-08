/*!
 * jQuery floatingScroll Plugin v2.3.1
 * supported by jQuery v1.4.3+
 *
 * https://github.com/Amphiluke/floating-scroll
 * http://amphiluke.github.io/floating-scroll/
 *
 * Copyright (c) 2011-2017 Amphiluke
 */
(function (global, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        factory(require("jquery"));
    } else {
        factory(global.jQuery);
    }
}(this, function ($) {
    "use strict";

    function FScroll(cont) {
        var inst = this,
            scrollBody = cont.closest(".fl-scrolls-body"),
            scrollContainer = cont.closest(".fl-scrolls-container");
        inst.cont = cont[0];
        if (scrollBody.length) {
            inst.scrollBody = scrollBody;
        }
        if (scrollContainer.length) {
            inst.scrollContainer = scrollContainer;
        }
        inst.sbar = inst.initScroll();
        inst.visible = true;
        inst.updateAPI(); // recalculate floating scrolls and hide those of them whose containers are out of sight
        inst.syncSbar(inst.cont);
        inst.addEventHandlers();
    }

    $.extend(FScroll.prototype, {
        initScroll: function () {
            var flscroll = $("<div class='fl-scrolls'></div>");
            $("<div></div>").appendTo(flscroll).css({width: this.cont.scrollWidth + "px"});
            return flscroll.appendTo(this.scrollContainer || this.cont);
        },

        addEventHandlers: function () {
            var inst = this,
                handlers,
                i, len;
            handlers = inst.eventHandlers = [
                {
                    $el: inst.scrollBody || $(window),
                    handlers: {
                        // Don't use `$.proxy()` since it makes impossible event unbinding individually per instance
                        // (see the warning at http://api.jquery.com/unbind/)
                        scroll: function () {inst.checkVisibility();}
                    }
                },
                {
                    $el: $(window),
                    handlers: {
                        resize: function () {inst.updateAPI();}
                    }
                },
                {
                    $el: inst.sbar,
                    handlers: {
                        scroll: function () {inst.visible && inst.syncCont(this, true);}
                    }
                },
                {
                    $el: $(inst.cont),
                    handlers: {
                        scroll: function () {inst.syncSbar(this, true);},
                        focusin: function () {
                            setTimeout(function () {
                                inst.syncSbar(inst.cont);
                            }, 0);
                        },
                        // The `adjustScroll` event type is kept for backward compatibility only.
                        "update.fscroll adjustScroll": function (e) {
                            // Check event namespace to ensure that this is not an extraneous event in a bubbling phase
                            if (e.namespace === "fscroll" || e.type === "adjustScroll") {
                                inst.updateAPI();
                            }
                        },
                        "destroy.fscroll": function (e) {
                            if (e.namespace === "fscroll") {
                                inst.destroyAPI();
                            }
                        }
                    }
                }
            ];
            for (i = 0, len = handlers.length; i < len; i++) {
                handlers[i].$el.bind(handlers[i].handlers);
            }
        },

        checkVisibility: function () {
            var inst = this,
                mustHide = (inst.sbar[0].scrollWidth <= inst.sbar[0].offsetWidth),
                contRect,
                maxVisibleY;
            if (!mustHide) {
                contRect = inst.cont.getBoundingClientRect();
                maxVisibleY = inst.scrollBody
                    ? inst.scrollBody[0].getBoundingClientRect().bottom
                    : window.innerHeight || document.documentElement.clientHeight;
                mustHide = ((contRect.bottom <= maxVisibleY) || (contRect.top > maxVisibleY));
            }
            if (inst.visible === mustHide) {
                inst.visible = !mustHide;
                // we cannot simply hide a floating scroll bar since its scrollLeft property will not update in that case
                inst.sbar.toggleClass("fl-scrolls-hidden");
            }
            // Adjust the floating scroll position
            if (inst.scrollBody) {
                inst.sbar.css({ "top": inst.visible ? (maxVisibleY - inst.sbar.height()) + "px" : '' });
            }
        },

        syncCont: function (sender, preventSyncSbar) {
            // Prevents next syncSbar function from changing scroll position
            if (this.preventSyncCont === true) {
                this.preventSyncCont = false;
                return;
            }
            this.preventSyncSbar = !!preventSyncSbar;
            this.cont.scrollLeft = sender.scrollLeft;
        },

        syncSbar: function (sender, preventSyncCont) {
            // Prevents next syncCont function from changing scroll position
            if (this.preventSyncSbar === true) {
                this.preventSyncSbar = false;
                return;
            }
            this.preventSyncCont = !!preventSyncCont;
            this.sbar[0].scrollLeft = sender.scrollLeft;
        },

        // Recalculate scroll width and container boundaries
        updateAPI: function () {
            var inst = this,
                cont = inst.cont,
                pos = cont.getBoundingClientRect();
            inst.sbar.width($(cont).outerWidth());
            inst.sbar.css("left", Math.round(pos.left) + "px");
            
            $("div", inst.sbar).width(cont.scrollWidth);
            inst.checkVisibility(); // fixes issue #2
        },

        // Remove a scrollbar and all related event handlers
        destroyAPI: function () {
            var handlers = this.eventHandlers,
                i, len;
            for (i = 0, len = handlers.length; i < len; i++) {
                handlers[i].$el.unbind(handlers[i].handlers);
            }
            this.sbar.remove();
        }
    });

    // `attachScroll` is the old alias used in v1.X. Temporally kept for backward compatibility.
    $.fn.attachScroll = $.fn.floatingScroll = function (method) {
        if (!arguments.length || method === "init") {
            this.each(function () {
                new FScroll($(this));
            });
        } else if (FScroll.prototype.hasOwnProperty(method + "API")) {
            this.trigger(method + ".fscroll");
        }
        return this;
    };
}));