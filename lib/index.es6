import createElement from 'virtual-dom/create-element'
import h from 'virtual-dom/h'
import patch from 'virtual-dom/patch'
import diff from 'virtual-dom/diff'
import flyd from 'flyd'
import {curryN} from 'fj-curry'

var api = { h: h, flyd: flyd}

module.exports = api

// Create an object literal that contains all the data for view re-rendering and a state stream
api.createView = curryN(3, (parentNode, rootComponent, initialState) => {
  var view = { rootComponent: rootComponent, streams: {}, state: initialState}
  view.tree = rootComponent(view.state)
  view.rootNode = createElement(view.tree)
  parentNode.appendChild(view.rootNode)
  return view
})

// Given some streams, combine it into a view's state stream using a combinator.
// This allows you to compose any number of arbitrary streams into the view's
// main state stream so that the dom gets rerendered automatically.
api.combineState = curryN(3, (combinator, view, stream) => {
  return flyd.stream([stream], (n, changes) => {
    view.state = combinator.apply(null, [view.state, stream()])
    render(view, view.state)
    return view.state
  })
})

// Render a virtual dom tree given a view and a state, returns the state
const render = curryN(2, (view, state) => {
  if(view.sync) view.sync(state)
  var newTree = view.rootComponent(state)
  var patches = diff(view.tree, newTree)
  view.rootNode = patch(view.rootNode, patches)
  view.tree = newTree
  return state
})

