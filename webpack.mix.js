const mix = require('laravel-mix');
let path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.setPublicPath('dist')
    .js('src/index.js', 'dist')
    .vue()
    .postCss('src/index.css', 'dist', [
        require('postcss-nested'),
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
    ]);

mix.browserSync({
    proxy: path.basename(__dirname) + '.test',
});
