var filterTemplates   = require('broccoli-template');
var uglifyJavaScript  = require('broccoli-uglify-js')
//var compileES6        = require('broccoli-es6-concatenator')
var compileSass       = require('broccoli-sass')
var pickFiles         = require('broccoli-funnel')
var mergeTrees        = require('broccoli-merge-trees')
var findBowerTrees    = require('broccoli-bower')
var env               = require('broccoli-env').getEnv()

function preprocess (tree) {
  // filter .hbs and .handlebars files, use the Ember handlebar compiler
  tree = filterTemplates(tree, {
    extensions: ['hbs', 'handlebars'],
    //compileFunction: 'Ember.Handlebars.compile'
  })

  return tree
}

// create tree for files in the app folder
var app = 'app'
app = pickFiles(app, {
  srcDir: '/',
  destDir: 'appkit' // move under appkit namespace
})
app = preprocess(app)

// create tree for files in the styles folder
var styles = 'styles'
styles = pickFiles(styles, {
  srcDir: '/',
  destDir: 'appkit' // move under appkit namespace
})
styles = preprocess(styles)


// create tree for vendor folder (no filters needed here)
var vendor = 'vendor'

// include app, styles and vendor trees
//var sourceTrees = [app, styles, vendor]
var sourceTrees = [app, vendor]

// Add bower dependencies
// findBowerTrees uses heuristics to pick the lib directory 
// and/or main files, and returns an array of trees for each 
// bower package found.

// sourceTrees = sourceTrees.concat(findBowerTrees())

// merge array into tree
var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true })

// // Transpile ES6 modules and concatenate them,
// // recursively including modules referenced by import statements.
// var appJs = compileES6(appAndDependencies, {
//   // Prepend contents of vendor/loader.js
//   loaderFile: 'loader.js',
//   ignoredModules: [
//     //'ember/resolver'
//   ],
//   inputFiles: [
//     'appkit/**/*.js'
//   ],
//   legacyFilesToAppend: [
//     'jquery.js',
//     'handlebars.js',
//     //'ember.js',
//     //'ember-data.js',
//     //'ember-resolver.js'
//   ],
//   wrapInEval: env !== 'production',
//   outputFile: '/assets/app.js'
// })

// compile sass
var appCss = compileSass(sourceTrees, 'appkit/app.scss', 'app.css')

// if (env === 'production') {
//   // minify js
//   appJs = uglifyJavaScript(appJs, {
//     // mangle: false,
//     // compress: false
//   })
// }

// create tree for public folder (no filters needed here)
var publicFiles = 'public'

// merge js, css and public file trees, and export them
//module.exports = mergeTrees([appJs, appCss, publicFiles])
module.exports = mergeTrees([appAndDependencies, appCss, publicFiles])

