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

    add (domainName, value) {
      if (!domainName.length) return {}
      const domainNames = domainName.split(',')
      const aimDomain = this._walk(this.ns, domainNames, 0)

      if (arguments.length > 1) aimDomain = value
      return aimDomain
    }

    find (domainName) {
      const domainNames = domainName.split(',')
      this._walk(this.ns, domainNames, 0)
    }

    _walk (currentDomain, domainNames, index) {
      if (index === domainNames.length - 1) return currentDomain

      const domain = domainNames[index]
      if (currentDomain[domain] === undefined) currentDomain[domain] = {}
      this._walk(currentDomain[domain], domainNames, index + 1)
    }

  }
}())