var createElement = require('virtual-dom/create-element')
var h = require('virtual-dom/h')
var flyd = require('flyd')
var patch = require('virtual-dom/patch')
var diff = require('virtual-dom/diff')

var api = {}
module.exports = api

api.h = h
api.flyd = flyd


// Create an object literal that contains all the data for view re-rendering and a state stream
api.create = function(parentNode, rootComponent, initialState) {
  var view = { rootComponent: rootComponent, streams: {}, state: initialState }

  // Setup vdom rendering
  view.tree = rootComponent(initialState, api.evStream(view))
  view.rootNode = createElement(view.tree)
  parentNode.appendChild(view.rootNode)

  // Init the state stream
  // view.state = flyd.map(render(view), flyd.stream(initialState))

  return view
}


// Given any stream, combine it into the view's state stream using a combinator.
// This allows you to compose any number of arbitrary streams into the view's
// main state stream so that the dom gets rerendered automatically.
api.combine = function(view, stream, combinator) {
 return flyd.stream([stream], function() {
  view.state = combinator(view.state, stream())
  render(view)(view.state)
  return view.state
 })
}

// return a stream that can be used inside a VNode for things like
// 'onclick' and 'onsubmit'. Given a view and an arbitrary name, either return
// an already-initialized event stream or create a new one and cache it into
// the view.
api.evStream = function(view, name) {
  if(arguments.length < 2) { return function(name) { return api.evStream(view, name) }} // partial application
  if(view.streams[name] === undefined) {
   view.streams[name] = flyd.stream()
  }
  return view.streams[name]
}


// Render a virtual dom tree given a view and a state, returns the state
function render(view) { return function(state) {
  if(view.sync) view.sync(state)
  var newTree = view.rootComponent(state, api.evStream(view))
  var patches = diff(view.tree, newTree)
  view.rootNode = patch(view.rootNode, patches)
  view.tree = newTree
  return state
}}

