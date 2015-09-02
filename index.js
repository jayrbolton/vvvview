var createElement = require('virtual-dom/create-element')
var patch = require('virtual-dom/patch')
var diff = require('virtual-dom/diff')

module.exports = view

function view(parentNode, rootComponent, options) {
  if(!(this instanceof view)) {
    return new view(parentNode, rootComponent, options)
  }
  this.state = {}
  if(options.defaultState) {
    this.state = options.defaultState
  }
  if(options.cacheState) {
    this.cacheState = options.cacheState
    this.state = loadFromLS(options.cacheState) || this.state
    saveToLS(this.cacheState, this.state)
  }

  this.parentNode = parentNode
  this.rootComponent = rootComponent
  this.tree = rootComponent(this.state)
  this.rootNode = createElement(this.tree)
  parentNode.appendChild(this.rootNode)
  return this
}


view.prototype.render = function() {
  var newTree = this.rootComponent(this.state)
  var patches = diff(this.tree, newTree)
  this.rootNode = patch(this.rootNode, patches)
  this.tree = newTree
  if(this.cacheState) saveToLS(this.cacheState, this.state)
  return this
}


// utils for saving and loading from local storage
function saveToLS(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj))
}
function loadFromLS(key) {
  var saved = localStorage.getItem(key)
  if(saved) return JSON.parse(saved)
}

