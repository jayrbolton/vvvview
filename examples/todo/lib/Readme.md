
This is a simple todolist example that combines the usage of flyd, immutable, and virtual-dom.

Main takeaways:

#### components

Components are a set of virtual-dom functions that render the DOM. They also include flyd event streams that originate from the DOM.

Initialize the streams at the top of your components file and reference them within `onclick`, `onsubmit`, etc properties.

If you want to access special data in your event stream that is available in your virtual-dom function, use partial application:

```js
const myStream = flyd.stream()
const myHandler = data => ev => myStream(data)
const myTree = state => h('p', {onclick: myHandler(state.data)}, 'hi')
```

An alternative way to pass data into an event stream is to use virtual-dom's data property within the node:

```js
const myStream = flyd.stream()
const myDataStream = flyd.map(ev => ev.target.data, myStream)
const myTree = state => h('p', {onclick: myStream, data: state.data}, 'hi')
```

I think the above two methods are equally valid, but I personally prefer the partial application method as it's more direct and flexible.

Since your state is immutable, it's easy to thunk all child dom tree functions using vdom-thunk:

#### immutable

Use immutable-js or mori as the data structure for your view's state.

#### scanmerge

Use flyd-scanmerge to combine all your streams into a single state stream:

```js
let $state = flyd.immediate(scanMerge([
 [$stream1, data => state.set('someKey', data) ],
 [$stream2, data => state.set('someKey', data) ]
], state))
```

When you have a single state stream, you can your view function over the state stream. This will rerender the DOM on every new value in the state stream.

```js
flyd.map(todoView, $state)
```

