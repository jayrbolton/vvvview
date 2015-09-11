import {mori, h, flyd} from '../../../lib/index.es6'
window.flyd = flyd

let toggleItem = flyd.stream()
let toggleItemScoped = (items, index) => ev => toggleItem([ev, items, index])
let submitForm = flyd.stream()

const root = state => {
  let finishedLen = state.items.filter(item => item.finished).length // could cache this better
  return h('div', [
    itemForm(),
    h('p', [finishedLen, ' out of ', state.items.length, ' finished']),
    itemList(state.items)
  ])
}

const itemList = items =>
	items.length ?
		  h('ul', items.map((item, index) => itemRow(items, index)))
		: h('p', 'Your slate is clean!')

const itemForm = () =>
  h('form', {onsubmit: submitForm}, [
    h('input', {required: true, type: 'text', placeholder: 'What needs to be done?'}),
    h('button', {type: 'submit'}, 'Add item')
  ])

const itemRow = (items, index) => {
  let item = items[index]
  return h('li', [
    h('input', {type: 'checkbox', checked: item.finished, onchange: toggleItemScoped(items, index)}),
    h('span', {className: item.finished && 'is-finished'}, item.name)
  ])
}

module.exports = {
  vtree: root,
  submitForm: submitForm,
  toggleItem: toggleItem,
}

