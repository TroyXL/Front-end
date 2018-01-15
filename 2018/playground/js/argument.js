(function() {
  let a = 1

  function addOne(number) {
    number = number + 1
  }

  console.log(a)
  addOne(a)
  console.log(a)

  console.log('')

  let b = {
    c: 1
  }

  console.log(b.c)
  addOne(b.c)
  console.log(b.c)

  console.log('')

  function objectAddOne(obj) {
    for (let k in obj) {
      obj[k] += 1
    }
  }

  console.log(b)
  objectAddOne(b)
  console.log(b)

  console.log('')
}())