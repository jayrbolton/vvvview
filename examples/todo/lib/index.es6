"use strict"
import view from '../../../'
import flyd from 'flyd'
import lift from 'flyd-lift'
import {fromJS, Map, List} from 'immutable'
import scanMerge from 'flyd-scanmerge'
import {root, $streams} from './components.es6'

let cache = localStorage.getItem('todos')
let cachedState = cache && JSON.parse(cache)
let defaults = [{name: 'Do the dishes!'}]
let state = fromJS(cachedState || defaults)

let todoView = view(root, document.body, state)

let $toggledItems = flyd.map(pair => {
 let [item, index] = pair
 return [item.set('finished', !item.get('finished')), index]
}, $streams.checkboxChanges)

let $newItems = flyd.map(function(ev) {
 ev.preventDefault()
 let item = Map({name: ev.target.querySelector('input').value})
 ev.target.reset()
 return item
}, $streams.formSubmits)


let $state = flyd.immediate(scanMerge([
 [$toggledItems, (state, pair) => {
  let [item, index] = pair
  let items = state.get('items')
  return state.set('items', items.set(index, item))
 }],
 [$newItems, (state, item) => {
  let items = state.get('items')
  return state.set('items', items.unshift(item))
 }]
], state))

flyd.map(state => {
 localStorage.setItem('todos', JSON.stringify(state))
 return todoView(state)
}, $state)

