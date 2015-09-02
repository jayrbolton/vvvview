var ls = require('../lib/ls')
var createElement = require('virtual-dom/create-element')

// Given a parentNode (eg document.body), a rootComponent function, and an options object:
// Construct a view object that has:
// {
//   parentNode: Node,
//   rootComponent: function,
//   cacheState: String,
//   state: Object
// }

module.exports = function create(parentNode, rootComponent, initialState) {
  var v = {parentNode: parentNode, rootComponent: rootComponent}
  v.state = initialState || {}
  v.tree = rootComponent(v.state)
  v.rootNode = createElement(v.tree)
  parentNode.appendChild(v.rootNode)
  return v
}
