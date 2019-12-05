# floating-scroll

## The Crux of the Matter

The general purpose of the plugin is to provide some lengthy containers on the page with a separate horizontal scroll bar, which does not vanish from sight when the entire page is scrolled. So, the user will always be able to scroll the container even if its own scroll bar is outside the viewport.

:bulb: **Tips:**

* floating-scroll is a jQuery plugin. If you are rather looking for a standalone dependency-free module with the same functionality, please check out the sibling project [handy-scroll](https://github.com/Amphiluke/handy-scroll) instead.
* Developing a Vue-based app? Consider using the [vue-handy-scroll](https://github.com/Amphiluke/vue-handy-scroll) component.


## Details & API

There is the only public method used to instantiate and control a floating scroll bar — `.floatingScroll()`. The plugin method `.floatingScroll()` should be called in context of a scrollable container. It takes an optional argument `method`. The currently supported methods are

* [`init`](#initialisation) (default value) — used to initialize a floating scroll bar widget;
* [`update`](#updating-scroll-bar) — used to force update of the floating scroll bar parameters (size and position);
* [`destroy`](#destroying-floating-scroll-bar) — removes a scroll bar and all related event handlers.

You may also [trigger](https://api.jquery.com/trigger/) events `update.fscroll` and `destroy.fscroll` on containers with attached floating scroll bar: this does the same as invoking the corresponding methods.

## Usage

### Inclusion of plugin files

The plugin requires the CSS file [jquery.floatingscroll.css](dist/jquery.floatingscroll.css) to be included on the page (you may also import it in your CSS/LESS files). The plugin’s script file [jquery.floatingscroll.min.js](dist/jquery.floatingscroll.min.js) may be added on the web page either via a separate `<script>` element, or it may be loaded by any AMD/CommonJS compatible module loader. This is a jQuery plugin so be sure that this library is added and accessible.

:bulb: **Tip:** If you don’t care about supporting old browsers, feel free to use the file [jquery.floatingscroll.es6.min.js](dist/jquery.floatingscroll.es6.min.js), which is de facto the same as jquery.floatingscroll.min.js but is written in ES6, and is a bit smaller.

### Initialisation

The only thing required to apply floatingScroll to a static container (whose sizes will never change during the session) is a single call of the `.floatingScroll()` method on the DOM ready event:

```javascript
$(document).ready(function () {
    $(".spacious-container").floatingScroll();
});
```

### Auto-initialisation

There is another way of initialising the floatingScroll widget without writing a single line of JavaScript code. Just add an attribute `data-fl-scrolls` to the desired container. As the DOM is ready the plugin will detect all such elements and will do initialisation automatically.

```html
<div class="spacious-container" data-fl-scrolls>
    <!-- Horizontally wide contents -->
</div>
```

_The auto-initialisation feature is available starting with v3.0.0._

### Updating scroll bar

If you attach a floating scroll bar to a container whose size and/or content may dynamically change, then you need a way to update the scroll bar each time the container’s sizes change. This can be done by invoking the method `update` as in the example below.

```javascript
$(".spacious-container").floatingScroll("init");
$("#refresh-button").click(function () {
    // ... some actions which change the total scroll width of the container ...
    $(".spacious-container").floatingScroll("update");
});
```

### Destroying floating scroll bar

To detach a scroll bar and remove all related event handlers, use the method `destroy` as follows:

```javascript
$(".spacious-container").floatingScroll("destroy");
```

### Special cases

If you want to attach a floating scroll bar to a container living in a positioned box (e.g. a modal popup with `position: fixed`) then you need to apply two special indicating class names in the markup. The plugin detects these indicating class names (they are prefixed with `fl-scrolls-`) and switches to a special functioning mode.

```html
<div class="fl-scrolls-viewport"><!-- (1) -->
    <div class="fl-scrolls-body"><!-- (2) -->
        <div class="spacious-container">
            <!-- Horizontally wide contents -->
        </div>
    </div>
</div>
```

The `.fl-scrolls-viewport` element (1) is a positioned block (with any type of positioning except `static`) which serves for correct positioning of the floating scroll bar. Note that this element itself should _not_ be scrollable. The `.fl-scrolls-body` element (2) is a vertically scrollable block (with `overflow: auto`) which encloses the target block the plugin is applied to. After applying these special class names, you may initialise the plugin as usual:

```javascript
$(".spacious-container").floatingScroll();
```

The plugin’s CSS file provides some basic styles for elements with classes `.fl-scrolls-viewport` and `.fl-scrolls-body`. Feel free to adjust their styles in your stylesheets as needed.

### “Unobtrusive” mode

You can make a floating scroll bar more “unobtrusive” so that it will appear only when the mouse pointer hovers over the scrollable container. To do so just apply the class `fl-scrolls-hoverable` to the desired scrollable container owning the floating scroll bar.

## Live demos

Check out some usage demos [here](https://amphiluke.github.io/floating-scroll/).
