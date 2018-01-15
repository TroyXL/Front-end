(function () {
  let data = {
    a: 1,
    b: 2,
    c: 3
  }
  for (let k in data) {
    let val = data[k]
    Object.defineProperty(data, k, {
      enumerable: true,
      configurable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        if (val !== newVal) val = newVal
      }
    })
  }

  let deepData = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: 4,
      f: {
        g: 5,
        h: 6,
        i: {
          j: 7,
          k: 8,
          l: 9
        }
      }
    }
  }

  function walk (obj) {
    for (let key in obj) {
      let val = obj[key]
      if (val instanceof Object) {
        walk(val)
      }
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          console.log('get ' + key)
          return val
        },
        set: function (newVal) {
          console.log('set ' + key + ' to ' + newVal)
          if (val !== newVal) val = newVal
        }
      })
    }
  }

  walk(deepData)

  deepData.c.f.h = 's'
  console.log(deepData)
}())