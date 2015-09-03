var createElement = require('virtual-dom/create-element')
var flyd = require('flyd')
var patch = require('virtual-dom/patch')
var diff = require('virtual-dom/diff')

// Given a parentNode (eg document.body), a rootComponent function, and an options object:
// Construct a view object that has:
// {
//   parentNode: Node,
//   rootComponent: function,
//   initialState: Object
// }

module.exports = function create(parentNode, rootComponent, initialState) {
  var v = { rootComponent: rootComponent, streams: {} }

  // Bind some event in your vdom to a stream (see examples)
  v.emitter = function(name) {
    if(v.streams[name]) return v.streams[name]
    var s = v.streams[name] = flyd.stream()
    return s
  }

  // Retrieve a previously bound event stream (see examples)
  v.stream = function(name) {
    var s = v.streams[name]
    if(s === undefined) s = flyd.stream()
    return s
  }

  // Setup vdom rendering
  v.tree = rootComponent(initialState, v.emitter)
  v.rootNode = createElement(v.tree)
  parentNode.appendChild(v.rootNode)

  // Init the state stream
  v.state = flyd.stream(initialState)
  flyd.map(render(v), v.state)

  // Given a stream, combine it into the view's state stream using combinator
  v.combine = function(stream, combinator) {
    var combined = flyd.scan(combinator, v.state(), stream)
    v.state = combined
    flyd.map(render(v), v.state)
    return v.state
  }

  return v
}


function render(view) { return function(state) {
  var newTree = view.rootComponent(state, view.emitter)
  var patches = diff(view.tree, newTree)
  view.rootNode = patch(view.rootNode, patches)
  view.tree = newTree
  if(view.sync) view.sync(state)
  return state
}}


