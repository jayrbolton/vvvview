'use strict'
import {flyd, combineState, createView} from '../../../lib/index.es6'
import {vtree, toggleItem, submitForm, sUndos} from './vtree.es6'

// See ./vtree.js for the virtual-dom components

//// view creation and event/state streams

// use localStorage, why not?
let cache = localStorage.getItem('todos')
let initialState = cache ? JSON.parse(cache) : {items: [{name: 'Do the dishes!'}]}

// init the view
let todos = createView(document.body, vtree, initialState)
window.todos = todos

// sync state to localStorage. could probably use frp for this instead
todos.sync = function(state) {
  localStorage.setItem('todos', JSON.stringify(state))
}


// add a new item
let newItem = flyd.map(ev => {
  ev.preventDefault()
  let item = { name: ev.target.querySelector('input').value }
  ev.target.reset()
  return item
}, submitForm)


combineState((state, item) => {
  state.items.push(item)
  return state
}, todos, newItem)


// toggle state of existing item
let toggle = flyd.map(params => {
 let [ev, items, index] = params
 items[index].finished = !items[index].finished
 return items
}, toggleItem)


combineState((state, items) => {
  state.items = items
  return state
}, todos, toggle)

