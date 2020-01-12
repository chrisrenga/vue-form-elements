let mix = require('laravel-mix');

require("laravel-mix-tailwind");
require("laravel-mix-purgecss");

mix.setPublicPath('dist')
    .sass("src/index.scss", "dist")
    .js("src/index.js", "dist")
    .copy("src/index.scss", "dist")
    .tailwind('tailwind.config.js')

if (mix.inProduction()) {
    mix.purgeCss({
        folders: ['src', 'dist']
    })
}