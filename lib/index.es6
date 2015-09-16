"use strict"
import createElement from 'virtual-dom/create-element'
import patch from 'virtual-dom/patch'
import diff from 'virtual-dom/diff'
import {curryN} from 'fj-curry'

const view = curryN(3, (rootFn, parentNode, state) => {
 let view = {root: rootFn, tree: rootFn(state)}
 view.rootNode = createElement(view.tree)
 parentNode.appendChild(view.rootNode)
 return rerender(view)
})

const rerender = curryN(2, (view, newState) => {
 let newTree = view.root(newState)
 let patches = diff(view.tree, newTree)
 view.rootNode = patch(view.rootNode, patches)
 view.tree = newTree
 return newState
})

module.exports = view

