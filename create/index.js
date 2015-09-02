var ls = require('../lib/ls')

module.exports = create

// Given a parentNode (eg document.body), a rootComponent function, and an options object:
// Construct a view object that has:
// {
//   parentNode: Node,
//   rootComponent: function,
//   cacheState: String,
//   state: Object
// }

function view(parentNode, rootComponent, options) {
  var v = {parentNode: parentNode, rootComponent: rootComponent}
  v.state = options.defaultState ? options.defaultState : {}

  if(options.cacheState) {
    v.cacheState = options.cacheState
    v.state = ls.load(options.cacheState) || v.state
    ls.save(v.cacheState, v.state)
  }

  v.tree = rootComponent(v.state)
  v.rootNode = createElement(v.tree)
  parentNode.appendChild(v.rootNode)
  return v
}
