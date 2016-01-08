# floating-scroll

### The Crux of the Matter

The general purpose of the plugin is to provide some lengthy containers on the page with a separate horizontal scroll bar, which does not vanish from sight when the entire page is scrolled. So, the user will always be able to scroll the container even if its own scroll bar is hidden from view.

Moreover, the plugin displays such an additional floating scroll bar only in case of actual need, i.e. the floatingScroll does not result in unnecessary scroll bar duplication. So, one uses the floating scroll bar only if the “native” one is out of sight.

### Details & API

There is the only public method used to instantiate and control a floating scroll — `.floatingScroll()` (note that the old method alias `attachScroll` is kept for backward compatibility, but it will be removed in future versions). The plugin method `.floatingScroll()` should be called in context of a scrollable container. It takes an optional argument `method`. The currently supported methods are

* `init` (default value) — used to initialize a floating scroll widget;
* `update` — used to force update of the floating scroll bar parameters (size and position);
* `destroy` — removes a scroll bar and all related event handlers.

You may also trigger events `update.fscroll` and `destroy.fscroll` for containers with attached floating scroll bar: this does the same as invoking the corresponding methods.

### Examples

The only thing required to apply the floatingScroll to a static container (whose sizes will never change during the session) is a single call of the `.floatingScroll()` method on the DOM ready event:

```javascript
$(document).ready(function () {
    $(".spacious-container").floatingScroll();
});
```

If you attach a floating scroll bar to a container whose size and/or content may dynamically change, then you need a way to update the scroll bar each time the container changes. This can be done by invoking the method `update` as in example below.

```javascript
$(".spacious-container").floatingScroll("init");
$("#refresh-button").click(function () {
    // ... some actions which change the total scroll width of the container ...
    $(".spacious-container").floatingScroll("update");
});
```

To detach a scroll bar and remove all related event handlers, use the method `destroy` as follows:

```javascript
$(".spacious-container").floatingScroll("destroy");
```

### Live demos

You may find some demos of use the floatingScroll plugin [here](http://amphiluke.github.io/jquery-plugins/floatingscroll/).

### Previous versions

Prior to v2.2.0, the plugin was the part of the [jquery-plugins](https://github.com/Amphiluke/jquery-plugins) repo. If for some purpose you want to get commit history for older plugin versions, you can [extract](https://github.com/Amphiluke/jquery-plugins/commits/master?path=src/floatingscroll/jquery.floatingscroll.js) it from that “old” repo.