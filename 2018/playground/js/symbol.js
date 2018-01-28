class Fruit {
  constructor () {
    const number = Symbol('number')
    class F {
      constructor () {
        this[number] = 1
      }

      getNumber () {
        return this[number]
      }

      setNumber (num) {
        this[number] = num
      }
    }
    return new F()
  }
}

const apple = new Fruit()

apple.getNumber() // 1

apple.setNumber(5)

apple.getNumber() // 5

apple[number] // Uncaught ReferenceError: number is not defined
