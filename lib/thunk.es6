import deepEqual from 'deep-equal'
import clone from 'clone'

module.exports = (fn, ...args) => createThunk(fn, args)

const createThunk = (fn, args) => {
  let frozen = fn.__prevFrozen || clone(args)
  let t = {fn: fn, args: args, frozen: frozen, type: 'Thunk'}
  t.render = render(t)
  return t
}

const shouldUpdate = (current, previous) => {
  if (!current || !previous || current.fn !== previous.fn) return true
  let bool = deepEqual(current.args, previous.frozen)
  current.fn.__prevFrozen = bool ? current.frozen : undefined
  return !bool
}

const render = thunk => previous => 
  shouldUpdate(thunk, previous) ? thunk.fn.apply(null, thunk.args) : previous.vnode

