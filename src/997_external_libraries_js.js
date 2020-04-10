// Credit Brian @github
// https://www.labnol.org/code/20380-load-external-javascript-with-eval

var LIBRARIES = {
    prettyDate: "http://ejohn.org/files/pretty.js",
    underScore: "http://underscorejs.org/underscore-min.js",
}

Object.keys(LIBRARIES).forEach(function (library) {
    newFunc = loadJSFromUrl(LIBRARIES[library])
    eval("var " + library + " = " + newFunc)
})

function loadJSFromUrl(url) {
    return eval(UrlFetchApp.fetch(url).getContentText())
}