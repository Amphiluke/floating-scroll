# Contributing to floating-scroll

## Reporting an issue

If you have found a bug please feel free to report an issue after ensuring that there is no such bug yet (check [existing issues](https://github.com/Amphiluke/floating-scroll/issues) first). Be sure to write a clear description of the problem. It will be great if you also provide a minimum example revealing the bug. You may use such services as [JSFiddle](https://jsfiddle.net/) and [RawGit](https://rawgit.com/) to assemble a live demo for the issue you found.

## Making changes in code and opening a pull request

If you know the way to fix some bug or just to make the plugin better then you are welcome to open a pull request. Please provide a clear and detailed description of what do your changes fix or improve, or refer an existing issue containing such an explanation.

Before submitting a new pull request be sure to do the following things.

* Ensure that your changes do not break existing features.
* Test your changes in different browsers: Chrome, Firefox, Safari, Opera, Internet Explorer, and Edge.
* Note that the plugin is currently compatible with ancient versions of jQuery (1.4.3+). If your changes break this compatibility please think if you can rewrite your code to keep compatibility unaffected. However if your changes are so important and cool that they outweigh all benefits of supporting ancient versions of jQuery then it is possible to soften this requirement within reasonable limits.
* Before committing your changes please make sure that the plugin sources pass ESLint checks. Just use the command `npm run lint` in the project directory (of course, you need to install the project first by executing `npm install`). Fix any problems reported by ESLint before submitting a pull request.
* Do not forget to update the minified version of the plugin sources. Use the command `npm run build` for that.

Thanks for contribution! :tea:

Amphiluke
