import $ from "jquery";

const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";

let getOrientationProps = orientation => {
    let horizontal = orientation === HORIZONTAL;
    // Properties with “X” are for cross orientation (relative to the scrollbar orientation)
    return {
        ORIENTATION: orientation,
        SIZE: horizontal ? "width" : "height",
        X_SIZE: horizontal ? "height" : "width",
        OFFSET_SIZE: horizontal ? "offsetWidth" : "offsetHeight",
        OFFSET_X_SIZE: horizontal ? "offsetHeight" : "offsetWidth",
        CLIENT_SIZE: horizontal ? "clientWidth" : "clientHeight",
        CLIENT_X_SIZE: horizontal ? "clientHeight" : "clientWidth",
        INNER_X_SIZE: horizontal ? "innerHeight" : "innerWidth",
        SCROLL_SIZE: horizontal ? "scrollWidth" : "scrollHeight",
        SCROLL_POS: horizontal ? "scrollLeft" : "scrollTop",
        START: horizontal ? "left" : "top",
        X_START: horizontal ? "top" : "left",
        X_END: horizontal ? "bottom" : "right"
    };
};

let floatingScrollProto = {
    init(container, orientation) {
        let instance = this;
        instance.orientationProps = getOrientationProps(orientation);
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
        const {ORIENTATION, SIZE, SCROLL_SIZE} = instance.orientationProps;
        let widget = instance.widget = $(`<div class="fl-scrolls" data-orientation="${ORIENTATION}"></div>`);
        $("<div></div>").appendTo(widget)[SIZE](instance.container[SCROLL_SIZE]);
        widget.appendTo(instance.container);
    },

    addEventHandlers() {
        let instance = this;
        let eventHandlers = instance.eventHandlers = [
            {
                $el: instance.scrollBody || $(window),
                handlers: {
                    // Don’t use `$.proxy()` since it makes impossible event unbinding individually per instance
                    // (see the warning at http://api.jquery.com/unbind/)
                    scroll() {
                        instance.updateAPI();
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
        const {SCROLL_SIZE, OFFSET_SIZE, X_START, X_END, INNER_X_SIZE, CLIENT_X_SIZE} = instance.orientationProps;
        let mustHide = (widget[0][SCROLL_SIZE] <= widget[0][OFFSET_SIZE]);
        if (!mustHide) {
            let containerRect = container.getBoundingClientRect();
            let maxVisibleCrossEnd = scrollBody ?
                scrollBody[0].getBoundingClientRect()[X_END] :
                window[INNER_X_SIZE] || document.documentElement[CLIENT_X_SIZE];
            mustHide = ((containerRect[X_END] <= maxVisibleCrossEnd) || (containerRect[X_START] > maxVisibleCrossEnd));
        }
        if (instance.visible === mustHide) {
            instance.visible = !mustHide;
            // We cannot simply hide the scrollbar since its scroll position won’t update in that case
            widget.toggleClass("fl-scrolls-hidden");
        }
    },

    syncContainer() {
        let instance = this;
        const {SCROLL_POS} = instance.orientationProps;
        let scrollPos = instance.widget[0][SCROLL_POS];
        if (instance.container[SCROLL_POS] !== scrollPos) {
            // Prevents container’s “scroll” event handler from syncing back again widget scroll position
            instance.skipSyncWidget = true;
            // Note that this makes container’s “scroll” event handlers execute
            instance.container[SCROLL_POS] = scrollPos;
        }
    },

    syncWidget() {
        let instance = this;
        const {SCROLL_POS} = instance.orientationProps;
        let scrollPos = instance.container[SCROLL_POS];
        if (instance.widget[0][SCROLL_POS] !== scrollPos) {
            // Prevents widget’s “scroll” event handler from syncing back again container scroll position
            instance.skipSyncContainer = true;
            // Note that this makes widget’s “scroll” event handlers execute
            instance.widget[0][SCROLL_POS] = scrollPos;
        }
    },

    // Recalculate scroll width/height and container boundaries
    updateAPI() {
        let instance = this;
        const {SIZE, X_SIZE, OFFSET_X_SIZE, CLIENT_SIZE, CLIENT_X_SIZE, SCROLL_SIZE, START} = instance.orientationProps;
        let {widget, container, scrollBody} = instance;
        let clientSize = container[CLIENT_SIZE];
        let scrollSize = container[SCROLL_SIZE];
        widget[SIZE](clientSize);
        if (!scrollBody) {
            widget.css(START, `${container.getBoundingClientRect()[START]}px`);
        }
        $("div", widget)[SIZE](scrollSize);
        // Fit widget size to the native scrollbar size if needed
        if (scrollSize > clientSize) {
            widget[X_SIZE](widget[0][OFFSET_X_SIZE] - widget[0][CLIENT_X_SIZE] + 1); // +1px JIC
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

$.fn.floatingScroll = function (method = "init", options = {}) {
    if (method === "init") {
        let {orientation = HORIZONTAL} = options;
        if (orientation !== HORIZONTAL && orientation !== VERTICAL) {
            throw new Error(`Scrollbar orientation should be either “${HORIZONTAL}” or “${VERTICAL}”`);
        }
        this.each((index, el) => Object.create(floatingScrollProto).init($(el), orientation));
    } else if (Object.prototype.hasOwnProperty.call(floatingScrollProto, `${method}API`)) {
        this.trigger(`${method}.fscroll`);
    }
    return this;
};

$(document).ready(() => {
    $("body [data-fl-scrolls]").each((index, el) => {
        let $el = $(el);
        $el.floatingScroll($el.data("flScrolls") || {});
    });
});
