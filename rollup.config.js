import pkg from "./package.json";
import babel from "rollup-plugin-babel";

let config = {
    input: "src/jquery.floatingscroll.js",
    output: {
        format: "umd",
        globals: {
            jquery: "jQuery"
        },
        interop: false,
        banner: `/*!
${pkg.name} v${pkg.version}
${pkg.homepage}
(c) ${new Date().getUTCFullYear()} ${pkg.author}
*/`
    },
    external: ["jquery"]
};

export default [{
    input: config.input,
    output: Object.assign({file: "dist/jquery.floatingscroll.es6.min.js"}, config.output),
    external: config.external,
    plugins: [
        babel({
            exclude: "node_modules/**",
            presets: ["minify"]
        })
    ]
}, {
    input: config.input,
    output: Object.assign({file: "dist/jquery.floatingscroll.min.js"}, config.output),
    external: config.external,
    plugins: [
        babel({
            exclude: "node_modules/**",
            presets: [
                ["env", {
                    modules: false,
                    loose: true
                }],
                "minify"
            ]
        })
    ]
}];
