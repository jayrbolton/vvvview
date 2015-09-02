var patch = require('virtual-dom/patch')
var diff = require('virtual-dom/diff')

// Given an existing view object, render it into the dom

module.exports = function render(view) {
  var newTree = view.rootComponent(view.state)
  var patches = diff(view.tree, newTree)
  view.rootNode = patch(view.rootNode, patches)
  view.tree = newTree
  if(view.cacheState) saveToLS(view.cacheState, view.state)
  return view
}

