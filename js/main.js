(function (global) {

"use strict";

var $ = global.jQuery;

$(".fs-demo").floatingScroll();


$(".fs-whatwg-cols").on("change", "input[type='checkbox']", function (e) {
    var $checkboxes = $(e.delegateTarget).find("input[type='checkbox']"),
        index;
    if ($checkboxes.filter(":checked").length) {
        index = $checkboxes.index(e.target);
        if (index > -1) {
            $("#fs-whatwg").find("th, td")
                .filter(":nth-child(" + (index + 2) + ")")
                .toggleClass("hidden");
        }
    } else {
        $checkboxes.prop("checked", true);
        $("#fs-whatwg").find("th.hidden, td.hidden").removeClass("hidden");
    }
    $(".fs-whatwg").floatingScroll("update");
});


$("#fs-listing-toggle").on("click", function () {
    var $scrollOwner = $(".fs-listing");
    if ($scrollOwner.hasClass("fs-listing-collapsed")) {
        $scrollOwner.removeClass("fs-listing-collapsed").floatingScroll("init");
    } else {
        $scrollOwner.addClass("fs-listing-collapsed").floatingScroll("destroy");
    }
});

$("#fs-open-popup").on("click", function (e) {
    var $popup = $("#fs-popup");
    $popup.toggleClass("fs-popup-hidden");
    if ($popup.hasClass("fs-popup-hidden")) {
        return;
    }
    $("#fs-maze").floatingScroll("update");
    e.stopPropagation();
    $(document).on("click", function popupOutClick(e) {
        var $target = $(e.target);
        if ($target.is(".fs-popup-close") || !$target.closest($popup).length) {
            $popup.addClass("fs-popup-hidden");
            $("body").off("click", popupOutClick);
        }
    });
});

$(".fs-orientation input[name='orientation']").on("change", function (e) {
    var orientation = e.target.value;
    var container = $("#fs-maze");
    container
        .floatingScroll("destroy")
        .attr("data-fs-orientation", orientation)
        .floatingScroll("init", {orientation: orientation});
    // This is only needed when working in “custom viewport” mode
    if (orientation === "vertical") {
        container.children(".fl-scrolls").css("top", container.position().top + "px");
    }
});

$("#is-unobtrusive").on("change", function (e) {
    $(".fs-demo").toggleClass("fl-scrolls-hoverable", e.target.checked);
});

if (global.hljs) {
    global.hljs.initHighlightingOnLoad();
}

})(this);