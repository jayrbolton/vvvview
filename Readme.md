# vvvview

A micro-module for streamlining patching of [virtual-dom](https://github.com/Matt-Esch/virtual-dom). Some suggested module pairings design patterns are below.

On npm as `vvvview`

### view(rootFunction, parentNode, initialState)

create a new render function by passing in:

* rootFunction: a function that takes some value (usually an object that represents UI state) and returns a virtual-dom tree.
* parentNode: the node on your HTML page where you want to append your virtual-dom tree (eg document.body)
* initialState: an object or other value that represents your view's initial state upon pageload.

`view` can be partially applied (eg `view(fn)`, `view(fn, node)`)

`view` returns a render function that can be used to make patches. Its one and only value is a new state value. The new function can be passed any new data, `rootFunction` will get re-evaluated using the new state, and the DOM will get updated.

```js
import h from 'virtual-dom/h'
import view from 'vvvview'

const root = state => h('p', state.msg)

// the VTree returned from `root` gets run using the default object and appended to document.body.
let render = view(root, document.body, {msg: 'hallo welt'})

// Call your render function with a new state value and the DOM will get patched
render({msg: 'bonjour le monde'})
```

That's all there is to it! 
