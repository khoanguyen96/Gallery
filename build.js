'use strict'

const path = require('path')
const fs = require('fs-extra')
const rm = require('rimraf')
const ora = require('ora')

const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')

const CleanCSS = require('clean-css')

const pkg = require('./package.json')

const spinner = ora('Building blueimp-gallery...')
let promise = Promise.resolve()

// Clean up the output directory
promise = promise.then(() => {
  spinner.start()

  // eslint-disable-next-line
  new Promise((resolve, reject) => {
    const dist = path.resolve('./dist')
    rm(dist, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
})

// Copy package.json and LICENSE.txt
promise = promise.then(() => {
  delete pkg.private
  delete pkg.devDependencies
  delete pkg.scripts
  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, ' '), 'utf-8')
  fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('LICENSE.txt', 'utf-8'), 'utf-8')
})

// Copy Images
promise = promise.then(() => fs.copySync('img', 'dist/img'))

// Compile / Minify CSS
promise = promise.then(() => new CleanCSS({
  returnPromise: true,
  compatibility: 'ie7',
  sourceMap: true,
  rebase: false
}).minify([
  'css/blueimp-gallery.css',
  'css/blueimp-gallery-indicator.css',
  'css/blueimp-gallery-video.css'
]).then(output => {
  fs.mkdirSync('dist/css')
  fs.writeFileSync('dist/css/blueimp-gallery.min.css', output.styles, 'utf-8')
  fs.writeFileSync('dist/css/blueimp-gallery.min.css.map', JSON.stringify(output.sourceMap), 'utf-8')
  fs.appendFileSync('dist/css/blueimp-gallery.min.css', '\n/*# sourceMappingURL=blueimp-gallery.min.css.map */')
}))

/* Compile source code into a distributable format with Buble */
// without jquery
const formats = {
  cjs: pkg.main,
  es: pkg.module,
  umd: pkg.browser
}

Object.keys(formats).forEach((format) => {
  const plugins = [resolve(), commonjs(), buble()]
  if (format === 'umd') plugins.push(uglify())

  promise = promise.then(() => rollup.rollup({
    input: 'js/src/main.js',
    plugins
  }).then(bundle => bundle.write({
    file: formats[format],
    format,
    sourcemap: true,
    name: format === 'umd' ? pkg.name : undefined
  })))
})

// with jquery
const jqueryFormats = {
  cjs: 'dist/js/jquery.blueimp-gallery.cjs.js',
  es: 'dist/js/jquery.blueimp-gallery.esm.js',
  umd: 'dist/js/jquery.blueimp-gallery.umd.js'
}

Object.keys(jqueryFormats).forEach((format) => {
  const plugins = [resolve(), commonjs(), buble()]
  if (format === 'umd') plugins.push(uglify())

  promise = promise.then(() => rollup.rollup({
    input: 'js/src/main-jquery.js',
    plugins,
    external: ['jquery']
  }).then(bundle => bundle.write({
    file: jqueryFormats[format],
    format,
    sourcemap: true,
    name: format === 'umd' ? pkg.name : undefined,
    globals: {
      jquery: '$'
    }
  })))
})

// Finish!
promise = promise.then(() => {
  spinner.stop()
  console.log('  Build complete.')
})

promise.catch(err => console.error(err.stack))
