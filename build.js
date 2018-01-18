'use strict'

const fs = require('fs')
const del = require('del')

const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')

const pkg = require('./package.json')

let promise = Promise.resolve()

// Clean up the output directory
promise = promise.then(() => del['dist/*'])

// Compile source code into a distributable format with Buble

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
  cjs: 'dist/js/jquery.blueimp.gallery.cjs.js',
  es: 'dist/js/jquery.blueimp.gallery.esm.js',
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

// Copy package.json and LICENSE.txt
promise = promise.then(() => {
  delete pkg.private
  delete pkg.devDependencies
  delete pkg.scripts
  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, ' '), 'utf-8')
  fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('LICENSE.txt', 'utf-8'), 'utf-8')
})

promise.catch(err => console.error(err.stack))
