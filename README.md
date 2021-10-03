# floating-scroll

## The Crux of the Matter

The general purpose of the plugin is to provide some lengthy containers on the page with a separate horizontal (or vertical) scrollbar, which does not vanish from sight when the entire page is scrolled. So, the user will always be able to scroll the container even if its own scrollbar is outside the viewport.

:bulb: **Tips:**

* floating-scroll is a jQuery plugin. If you are rather looking for a standalone dependency-free module with the similar functionality, please check out the sibling project [handy-scroll](https://github.com/Amphiluke/handy-scroll) instead.
* Developing a Vue-based app? Consider using the [vue-handy-scroll](https://github.com/Amphiluke/vue-handy-scroll) component.


## Details & API

There is the only public method used to instantiate and control a floating scrollbar — `.floatingScroll()`. Unless otherwise indicated, the plugin method `.floatingScroll()` should be called in context of a scrollable container. It takes an optional argument `method`. The currently supported methods are

* [`init`](#initialisation) (default value) — used to initialize a floating scrollbar widget;
* [`update`](#updating-scrollbar) — used t force update of the floating scrollbar parameters (size and position);
* [`destroy`](#destroying-floating-scrollbar) — removes a scrollbar and all related event handlers;
* [`destroyDetached`](#destroying-detached-widgets) — destroys floating scrollbar instances whose containers were removed from the document (requires a different context, see below).

You may also [trigger](https://api.jquery.com/trigger/) events `update.fscroll` and `destroy.fscroll` on containers with attached floating scrollbar: this does the same as invoking the corresponding methods.

## Usage

### Inclusion of plugin files

The plugin requires the CSS file [jquery.floatingscroll.css](dist/jquery.floatingscroll.css) to be included on the page (you may also import it in your CSS/LESS files). The plugin’s script file [jquery.floatingscroll.min.js](dist/jquery.floatingscroll.min.js) may be added on the web page either via a separate `<script>` element, or it may be loaded by any AMD/CommonJS compatible module loader. This is a jQuery plugin so be sure that this library is added and accessible.

:bulb: **Tip:** If you don’t care about supporting old browsers, feel free to use the file [jquery.floatingscroll.es6.min.js](dist/jquery.floatingscroll.es6.min.js), which is de facto the same as jquery.floatingscroll.min.js but is written in ES6, and is a bit smaller.

### Initialisation

The only thing required to apply floatingScroll to a static container (whose sizes will never change during the session) is a single call of the `.floatingScroll()` method on the DOM ready event:

```javascript
$(() => {
    $(".spacious-container").floatingScroll();
});
```

Starting with v3.1.0, the method `init` supports passing options. Currently, the only supported parameter is `orientation`. Default scrollbar orientation is `"horizontal"` but you can also make a vertical floating scrollbar using options:

```javascript
$(() => {
    $(".spacious-container").floatingScroll("init", {
        orientation: "vertical"
    });
});
```

### Auto-initialisation

There is another way of initialising the floatingScroll widget without writing a single line of JavaScript code. Just add an attribute `data-fl-scrolls` to the desired container. As the DOM is ready the plugin will detect all such elements and will do initialisation automatically.

```html
<div class="spacious-container" data-fl-scrolls>
    <!-- Horizontally wide contents -->
</div>

<div class="spacious-container" data-fl-scrolls='{"orientation": "vertical"}'>
    <!-- Horizontally wide contents -->
</div>
```

### Updating scrollbar

If you attach a floating scrollbar to a container whose size and/or content may dynamically change, then you need a way to update the scrollbar each time the container’s sizes change. This can be done by invoking the method `update` as in the example below.

```javascript
$(".spacious-container").floatingScroll("init");
$("#refresh-button").click(() => {
    // ... some actions which change the total scroll width of the container ...
    $(".spacious-container").floatingScroll("update");
});
```

### Destroying floating scrollbar

To detach a scrollbar and remove all related event handlers, use the method `destroy` as follows:

```javascript
$(".spacious-container").floatingScroll("destroy");
```

### Destroying detached widgets

If your app completely re-renders a large portion of DOM where floating scrollbar widgets were mounted, actual container references are lost, and therefore you cannot destroy the widgets and perform related cleanup using the `destroy` method. In this case, you may just call the `destroyDetached` method, and the pluign will find all “zombie” instances and will destroy them for you. Unlike the other methods, this one needs to be called in context of `$(window)`:

```javascript
$(".main-view .spacious-container").floatingScroll("init");
// ... the app re-renders the main view ...
$(".main-view").html("...");
// destroy floating scrollbar widgets whose containers are not in the document anymore
$(window).floatingScroll("destroyDetached");
```

### Special cases

If you want to attach a floating scrollbar to a container living in a positioned box (e.g. a modal popup with `position: fixed`) then you need to apply two special indicating class names in the markup. The plugin detects these indicating class names (they are prefixed with `fl-scrolls-`) and switches to a special functioning mode.

```html
<div class="fl-scrolls-viewport"><!-- (1) -->
    <div class="fl-scrolls-body"><!-- (2) -->
        <div class="spacious-container">
            <!-- Horizontally wide contents -->
        </div>
    </div>
</div>
```

The `.fl-scrolls-viewport` element (1) is a positioned block (with any type of positioning except `static`) which serves for correct positioning of the floating scrollbar. Note that this element itself should _not_ be scrollable. The `.fl-scrolls-body` element (2) is a vertically scrollable block (with `overflow: auto`) which encloses the target block the plugin is applied to. After applying these special class names, you may initialise the plugin as usual:

```javascript
$(".spacious-container").floatingScroll();
```

The plugin’s CSS file provides some basic styles for elements with classes `.fl-scrolls-viewport` and `.fl-scrolls-body`. Feel free to adjust their styles in your stylesheets as needed.

### “Unobtrusive” mode

You can make a floating scrollbar more “unobtrusive” so that it will appear only when the mouse pointer hovers over the scrollable container. To do so just apply the class `fl-scrolls-hoverable` to the desired scrollable container owning the floating scrollbar.

## Live demos

Check out some usage demos [here](https://amphiluke.github.io/floating-scroll/).
