import h from 'virtual-dom/h'
import flyd from 'flyd'
import thunk from 'vdom-thunk'
"use strict"

let $streams = {
 formSubmits: flyd.stream(),
 checkboxChanges: flyd.stream()
}

let checkChangesScoped = (item, index) => ev => {
 return $streams.checkboxChanges([item, index])
}

const root = state => {
 let finishedLen = state.get('items').filter(item => item.get('finished')).count()
 return h('div', [
  thunk(itemForm),
  h('p', [finishedLen, ' out of ', state.get('items').count(), ' finished']),
  thunk(itemList, state.get('items'))
 ])
}

const itemList = items => items.count()
 ? h('ul', items.map((item, index) => thunk(itemRow, items, index)).toJS())
 : h('p', 'Your slate is clean!')

const itemForm = ()=>
 h('form', {onsubmit: $streams.formSubmits}, [
 h('input', {required: true, type: 'text', placeholder: 'What needs to be done?'}),
 h('button', {type: 'submit'}, 'Add item')
])

const itemRow = (items, index) => {
 let item = items.get(index)
 return h('li', [
  h('input', {type: 'checkbox', checked: item.get('finished'), onchange: checkChangesScoped(item, index)}),
  h('span', {className: item.get('finished') && 'is-finished'}, item.get('name'))
 ])
}

module.exports = {root: root, $streams: $streams}

