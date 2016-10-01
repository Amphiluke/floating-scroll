/*!
 * jQuery floatingScroll Plugin v2.2.5
 * supported by jQuery v1.4.3+
 *
 * https://github.com/Amphiluke/floating-scroll
 * http://amphiluke.github.io/floating-scroll/
 *
 * Copyright (c) 2011-2016 Amphiluke
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
    
    var wnd = window,
        getMaxVisibleY = /*@cc_on (@_jscript_version<9)?function(){var e=document.documentElement;return e.scrollTop+e.clientHeight;}:@*/function () {return wnd.pageYOffset + wnd.innerHeight;};
    
    function FScroll(cont) {
        var inst = this;
        inst.cont = {block: cont[0], left: 0, top: 0, bottom: 0, height: 0, width: 0};
        inst.sbar = inst.initScroll();
        inst.visible = true;
        inst.updateAPI(); // recalculate floating scrolls and hide those of them whose containers are out of sight
        inst.syncSbar(cont[0]);
        inst.addEventHandlers();
    }
    
    $.extend(FScroll.prototype, {
    
        initScroll: function () {
            var flscroll = $("<div class='fl-scrolls'></div>");
            $("<div></div>").appendTo(flscroll).css({width: this.cont.block.scrollWidth + "px"});
            return flscroll.appendTo(this.cont.block);
        },
    
        addEventHandlers: function () {
            var inst = this,
                handlers,
                i, len;
            handlers = inst.eventHandlers = [
                {
                    $el: $(wnd),
                    handlers: {
                        // Don't use `$.proxy()` since it makes impossible event unbinding individually per instance
                        // (see the warning at http://api.jquery.com/unbind/)
                        scroll: function () {inst.checkVisibility();},
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
                    $el: $(inst.cont.block),
                    handlers: {
                        scroll: function () {inst.syncSbar(this, true);},
                        focusin: function () {
                            setTimeout(function () {
                                inst.syncSbar(inst.cont.block);
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
                cont = inst.cont,
                mustHide = (inst.sbar[0].scrollWidth <= inst.sbar[0].offsetWidth),
                maxVisibleY;
            if (!mustHide) {
                maxVisibleY = getMaxVisibleY();
                mustHide = ((cont.bottom <= maxVisibleY) || (cont.top > maxVisibleY));
            }
            if (inst.visible === mustHide) {
                inst.visible = !inst.visible;
                // we cannot simply hide a floating scroll bar since its scrollLeft property will not update in that case
                inst.sbar.toggleClass("fl-scrolls-hidden");
            }
        },
    
        syncCont: function (sender, preventSyncSbar) {
            // Prevents next syncSbar function from changing scroll position
            if (this.preventSyncCont === true) {
                this.preventSyncCont = false;
                return;
            }
            this.preventSyncSbar = !!preventSyncSbar;
            this.cont.block.scrollLeft = sender.scrollLeft;
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
                block = $(cont.block),
                pos = block.offset();
            cont.height = block.outerHeight();
            cont.width = block.outerWidth();
            cont.left = pos.left;
            cont.top = pos.top;
            cont.bottom = pos.top + cont.height;
            inst.sbar.width(cont.width).css("left", pos.left + "px");
            $("div", inst.sbar).width(block[0].scrollWidth);
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