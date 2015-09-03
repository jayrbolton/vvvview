var createView = require('../../')
var h = require('../../node_modules/virtual-dom/virtual-hyperscript')
var flyd = require('../../node_modules/flyd')


//// vdom components go

function app(state, stream) {
  var finishedLen = state.items.filter(function(item) { return item.finished }).length // could cache this better
  return h('div', [
    itemForm(stream),
    h('p', [finishedLen, ' out of ', state.items.length, ' finished']),
    itemList(state.items, stream)
  ])
}

function itemList(items, stream) {
  if(items.length) {
    return h('ul', items.map(function(item, index) { return itemRow(stream, items, index) }))
  } else {
    return h('p', 'Your slate is clean!')
  }
}

function itemForm(stream) {
  return h('form', {onsubmit: stream('addItem')}, [
    h('input', {required: true, type: 'text', placeholder: 'What needs to be done?'}),
    h('button', 'Add item')
  ])
}

function itemRow(stream, items, index) {
  var item = items[index]
  return h('li', [
      h('input', {type: 'checkbox', checked: item.finished, onchange: stream('toggleItem'), data: {items: items, index: index}}),
    h('span', {className: item.finished && 'is-finished'}, item.name)
  ])
}


//// view creation and event/state streams

// use localStorage, why not?
var cache = localStorage.getItem('view.state')
var defaultState = cache ? JSON.parse(cache) : {items: [{name: 'Do the dishes!'}]}

// init the view
var view = window.view = createView(document.body, app, defaultState)

// sync state to localStorage. could probably use frp for this instead
view.sync = function(state) {
  localStorage.setItem('view.state', JSON.stringify(state))
}

// add a new item
var newItem = flyd.map(function(ev) {
  ev.preventDefault()
  var item = { name: ev.target.querySelector('input').value }
  ev.target.reset()
  return item
}, view.stream('addItem'))

view.combine(newItem, function(state, item) {
  state.items.unshift(item)
  return state
})

// toggle state of existing item
var toggle = flyd.map(function(ev) {
  var items = ev.target.data.items
  var index = ev.target.data.index
  var item = items[index]
  item.finished = !item.finished
  return items
}, view.stream('toggleItem'))

view.combine(toggle, function(state, items) {
  state.items = items
  return state
})

