import $ from "jquery";

let floatingScrollProto = {
    init(container) {
        let instance = this;
        let scrollBody = container.closest(".fl-scrolls-body");
        if (scrollBody.length) {
            instance.scrollBody = scrollBody;
        }
        instance.container = container[0];
        instance.visible = true;
        instance.initWidget();
        instance.updateAPI(); // recalculate scrollbar parameters and set its visibility
        instance.addEventHandlers();
        // Set skipSync flags to their initial values (because update() above calls syncWidget())
        instance.skipSyncContainer = instance.skipSyncWidget = false;
    },

    initWidget() {
        let instance = this;
        let widget = instance.widget = $("<div class='fl-scrolls'></div>");
        $("<div></div>").appendTo(widget).css({width: `${instance.container.scrollWidth}px`});
        widget.appendTo(instance.container);
    },

    addEventHandlers() {
        let instance = this;
        let eventHandlers = instance.eventHandlers = [
            {
                $el: instance.scrollBody || $(window),
                handlers: {
                    // Don't use `$.proxy()` since it makes impossible event unbinding individually per instance
                    // (see the warning at http://api.jquery.com/unbind/)
                    scroll() {
                        instance.checkVisibility();
                    },
                    resize() {
                        instance.updateAPI();
                    }
                }
            },
            {
                $el: instance.widget,
                handlers: {
                    scroll() {
                        if (instance.visible && !instance.skipSyncContainer) {
                            instance.syncContainer();
                        }
                        // Resume widget->container syncing after the widget scrolling has finished
                        // (it might be temporally disabled by the container while syncing the widget)
                        instance.skipSyncContainer = false;
                    }
                }
            },
            {
                $el: $(instance.container),
                handlers: {
                    scroll() {
                        if (!instance.skipSyncWidget) {
                            instance.syncWidget();
                        }
                        // Resume container->widget syncing after the container scrolling has finished
                        // (it might be temporally disabled by the widget while syncing the container)
                        instance.skipSyncWidget = false;
                    },
                    focusin() {
                        setTimeout(() => instance.syncWidget(), 0);
                    },
                    "update.fscroll"({namespace}) {
                        // Check event namespace to ensure that this is not an extraneous event in a bubbling phase
                        if (namespace === "fscroll") {
                            instance.updateAPI();
                        }
                    },
                    "destroy.fscroll"({namespace}) {
                        if (namespace === "fscroll") {
                            instance.destroyAPI();
                        }
                    }
                }
            }
        ];
        eventHandlers.forEach(({$el, handlers}) => $el.bind(handlers));
    },

    checkVisibility() {
        let instance = this;
        let {widget, container, scrollBody} = instance;
        let mustHide = (widget[0].scrollWidth <= widget[0].offsetWidth);
        if (!mustHide) {
            let containerRect = container.getBoundingClientRect();
            let maxVisibleY = scrollBody ?
                scrollBody[0].getBoundingClientRect().bottom :
                window.innerHeight || document.documentElement.clientHeight;
            mustHide = ((containerRect.bottom <= maxVisibleY) || (containerRect.top > maxVisibleY));
        }
        if (instance.visible === mustHide) {
            instance.visible = !mustHide;
            // We cannot simply hide the scrollbar since its scrollLeft property will not update in that case
            widget.toggleClass("fl-scrolls-hidden");
        }
    },

    syncContainer() {
        let instance = this;
        let {scrollLeft} = instance.widget[0];
        if (instance.container.scrollLeft !== scrollLeft) {
            // Prevents container’s “scroll” event handler from syncing back again widget scroll position
            instance.skipSyncWidget = true;
            // Note that this makes container’s “scroll” event handlers execute
            instance.container.scrollLeft = scrollLeft;
        }
    },

    syncWidget() {
        let instance = this;
        let {scrollLeft} = instance.container;
        if (instance.widget[0].scrollLeft !== scrollLeft) {
            // Prevents widget’s “scroll” event handler from syncing back again container scroll position
            instance.skipSyncContainer = true;
            // Note that this makes widget’s “scroll” event handlers execute
            instance.widget[0].scrollLeft = scrollLeft;
        }
    },

    // Recalculate scroll width and container boundaries
    updateAPI() {
        let instance = this;
        let {widget, container, scrollBody} = instance;
        let {clientWidth, scrollWidth} = container;
        widget.width(clientWidth);
        if (!scrollBody) {
            widget.css("left", `${container.getBoundingClientRect().left}px`);
        }
        $("div", widget).width(scrollWidth);
        // Fit widget height to the native scroll bar height if needed
        if (scrollWidth > clientWidth) {
            widget.height(widget[0].offsetHeight - widget[0].clientHeight + 1); // +1px JIC
        }
        instance.syncWidget();
        instance.checkVisibility(); // fixes issue #2
    },

    // Remove a scrollbar and all related event handlers
    destroyAPI() {
        let instance = this;
        instance.eventHandlers.forEach(({$el, handlers}) => $el.unbind(handlers));
        instance.widget.remove();
        instance.eventHandlers = instance.widget = instance.container = instance.scrollBody = null;
    }
};

$.fn.floatingScroll = function (method = "init") {
    if (method === "init") {
        this.each((index, el) => Object.create(floatingScrollProto).init($(el)));
    } else if (Object.prototype.hasOwnProperty.call(floatingScrollProto, `${method}API`)) {
        this.trigger(`${method}.fscroll`);
    }
    return this;
};

$(document).ready(() => {
    $("body [data-fl-scrolls]").floatingScroll();
});