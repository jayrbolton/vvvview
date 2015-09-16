// The same as flyd/module/scanmerge, except that it is immediate
import flyd form 'flyd'

const scanMerge = flyd.curryN(2, (pairs, acc) => {
 let streams = pairs.map(p => p[0])
 let fns = pairs.map(p => p[1])
 return flyd.immediate(flyd.stream(streams, (self, changed) => {
  console.log('changed', changed)
  if (changed.length > 0) {
   let idx = streams.indexOf(changed[0])
   acc = fns[idx](acc, changed[0]())
  }
  return acc
 }, true))
})
