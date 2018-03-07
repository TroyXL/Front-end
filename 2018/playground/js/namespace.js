(function () {
  // const ns = new Namespace()

  // ns.add('com', {}) // ns.com = {}
  // ns.add('cn') = {} // ns.cn = {}
  // ns.add('net.test', true) // ns.net.test = true
  // ns.add('net.develop') = function () {} // ns.net.develop = function () {}
  // ns.add('cn', 'who', 'test') // ns.cn.who.test

  // ns.all() // find all
  // ns.find('cn') // find all in cn
  // ns.find('*.test')
  // ns.find('*', 'test') // find all first levels whose derict children has test
  // ns.find('**.test')
  // ns.find('**', 'test') // find all levels whose children has test
  // ns.find('cn.*.test')
  // ns.find('cn.**.test')

  class Namespace {
    constructor (root) {
      this.ns = {}
    }

    // all () {
    //   return this.ns
    // }

    add (domainName, value) {
      const domainNames = domainName.split(',')

    }

    find (domainName) {

    }

    _walk (domainName, currentDomain) {
      
    }

  }
}())