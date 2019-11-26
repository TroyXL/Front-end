class Pue {
  constructor ({ data } = {}) {
    this.$data = data
    dataWalker(data, this, '$proxy')
  }
}

function dataWalker (data, root, proxyName) {
  const $proxy = setProxy(data)
  for (let key in data) {
    if (data[key] instanceof Object) {
      temp = dataWalker(data[key], $proxy, key)
    }
  }
  root[proxyName] = setProxy(data)
}

function setProxy (data) {
  const proxy = (function () {
    return new Proxy(data, {
      get: (target, prop) => {
        return target[prop]
      },
      set: (target, prop, value) => {
        target[prop] = value
      }
    })
  })()

  return proxy
}

// var proxy = new Proxy({}, {
//   get: (target, prop) => {
//     console.log('individual proxy', target, prop)
//     return target[prop]
//   },
//   set: (target, prop, value) => {
//     console.log('set proxy value')
//     target[prop] = value
//   }
// })

// let obj = setProxy()
// obj.time = 12
// console.log(obj)
// console.log(obj.time)
// obj.time = 14
// console.log(obj.time)

