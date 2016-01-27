# vvvview

A micro-module for streamlining usage of [virtual-dom](https://github.com/Matt-Esch/virtual-dom). Some suggested module pairings design patterns are below.

### install & require

Add `vvvview` to your package.json and use ES6 (eg Babel) and/or browserify.

```js
import view from 'vvvview'
```

### view(rootFunction, parentNode, initialState)

create a new view by passing in:

* rootFunction: a function that takes some value (usually an object that represents UI state) and returns a virtual-dom tree.
* parentNode: the node where you want to append your virtual-dom tree (eg document.body)
* initialState: an object or other value that represents your view's initial state upon pageload.

`view` can be partially applied (eg `view(fn)`, `view(fn, node)`)

`view` returns a new function that can be used to update your view. Its one and only value is the view's new state. The new function can be passed any new data, `rootFunction` will get re-evaluated using the new state, and the DOM will get updated.

```js
import h from 'virtual-dom/h'
import view from 'vvvview'

const root = state => h('p', state.msg)

// the VTree returned from `root` gets run using the default object and appended to document.body.
let helloView = view(root, document.body, {msg: 'hallo welt'})

// Call your view function with a new state value and the DOM will get re-rendered automatically
helloView({msg: 'bonjour le monde'})
```

That's all there is to it! 

## pairings & patterns

### functional reactive programming and immutability

A counter example using [flyd](https://github.com/paldepind/flyd) and [immutable-js](https://facebook.github.io/immutable-js/)

```js
import h from 'virtual-dom/h'
import view from 'vvvview'
import {Map} from 'immutable'
import flyd from 'flyd'

let clickStream = flyd.stream()
let count = flyd.scan(n => n + 1, 0, clickStream)

const root = state => h('a', {onclick: clickStream}, state.count || 'click me!')

let counter = view(root, document.body, Map({count: 0}))

// Scan the count stream with the state to create a stream of states
let stateStream = flyd.scan((state, count) => state.set('count', count), state, count)
// Call the view function on every value in the stateStream
flyd.map(counter, stateStream)
```

With immutable, you can also make your views lightning fast by using [vdom-thunk](https://github.com/Raynos/vdom-thunk) without any configuration.

