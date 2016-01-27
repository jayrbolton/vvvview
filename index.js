var createElement = require('virtual-dom/create-element')
var patch = require('virtual-dom/pach')
var diff = require('virtual-dom/diff')
var curryN = require('fj-curry').curryN

var view = curryN(3, function(rootFn, parentNode, state) {
 let view = {root: rootFn, tree: rootFn(state)}
 view.rootNode = createElement(view.tree)
 parentNode.appendChild(view.rootNode)
 return rerender(view)
})

var rerender = curryN(2, function(view, newState) {
 let newTree = view.root(newState)
 let patches = diff(view.tree, newTree)
 view.rootNode = patch(view.rootNode, patches)
 view.tree = newTree
 return newTree
})

module.exports = view

