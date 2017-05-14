/**
 * Created by Troy on 17/5/14.
 */

function Lue(opts) {
    this.$data = {}
    this.$methods = {}
    this.$directives=[]

    this.$el =  document.querySelector(opts.el)
    if (this.$el) this._compileNode(this.$el)

    if (typeof opts.data === 'object') {
        // 需要将 opts.data 的数据绑定到 $data 上，所以目标对象为 $data，源对象为 opts.data
        this._each(this.$data, opts.data)
    }

    if (typeof opts.methods === 'object') {
        this._bindMethods(opts.methods)
    }

    // 兼容当 methods 属性为方法，并且返回一个对象时的情况
    if (typeof opts.methods === 'function' && typeof opts.methods() === 'object') {
        this._bindMethods(opts.methods())
    }

    if (typeof opts.ready === 'function') {
        this.$directives.forEach(function (dir) {
            dir.update()
        })
        opts.ready.call(this)
    }
}

Lue.prototype = {
    constructor: Lue,

    /**
     * 遍历深层数据对象
     * @param aimObj 需要被绑定到的目标对象
     * @param sourceObj 源对象
     * @private
     */
    _each: function (aimObj, sourceObj) {
        var value
        for (var key in sourceObj) {
            value = sourceObj[key]
            // 当遍历到的属性值是个对象时，对该对象再次进行遍历，此时目标对象和源对象相同，不需要改变 value 上属性所绑定的对象
            if (typeof value === 'object') {
                this._each(value, value)
            }
            // 当该属性值不为对象时，进行数据绑定
            this._bindData(aimObj, key, value)
        }
    },

    _bindData: function (obj, key, val) {
        var self = this, directive
        // 遍历 $directives 中的所有指令，找出与当前数据的 key 相同的指令
        self.$directives.forEach(function (dir) {
            if (dir.expression === key) {
                directive = dir
            }
        })

        Object.defineProperty(obj, key, {
            enumerable: true, // 是否可枚举
            configurable: true, // 是否可删除
            get: function () {
                console.log('get', key, val)
                return val
            },
            set: function (newVal) {
                if (val !== newVal) {
                    val = newVal
                    // 当新旧值不同且不为对象时 执行指令的页面更新
                    if (typeof newVal !== 'object') directive.update()
                }
                // 需要绑定的目标对象为设置的新值 newVal，而需要被绑定的源对象也为 newVal
                if (typeof newVal === 'object') self._each(newVal, newVal)
            }
        })
    },

    _bindMethods: function (obj) {
        var self = this
        for (var key in obj) {
            var val = obj[key]
            if (typeof val === 'function') {
                // 放该属性为方法时，在 $methods 上创建一个同名方法
                // 这个方法的作用是改变传入的参数 $methods 属性上的对应方法的执行环境并执行
                // 两个连续的三目运算的作用是：当该方法无参数时，直接通过 call 改变执行环境并执行；当存在 1 个参数时，通过 call 方法并传入这个参数 arg；当参数多于 1 个时，通过 apply 方法并传入整个参数列表
                this.$methods[key] = function (arg) {
                    var length = arguments.length
                    length ? length > 1 ? val.apply(self, arguments) : val.call(self, arg)
                        : val.call(self)
                }
            }
        }
    },

    // 判断当前节点类型
    // 如果为 1（节点）则调用 _compileElement 方法
    // 如果为 3（文本）则调用 _compileText 方法
    _compileNode: function (node) {
        switch (node.nodeType) {
            case 1:// node
                this._compileElement(node)
                break
            case 3 :// text
                this._compileText(node)
                break
            default:
                return
        }
    },

    // 判断当前节点有没有子节点
    // 如果存在子节点，则将该节点传入 _compileNode() 进而再次判断子节点是不是文本节点
    _compileElement: function (node) {
        if (node.hasChildNodes()) {
            // 通过 Array.from() 可以将一个类数组转为数组
            // forEach 为数组的遍历方法。它的第一个参数是函数，函数的参数为当前数组中被遍历的元素；第二个参数可选，作用是指明当前回调函数作用时 this 的值（这里即为 Vue 的实例）
            Array.from(node.childNodes).forEach(this._compileNode, this)
        }
    },

    // 对文本节点中形如 {{data}} 的表达式进行数据的替换
    _compileText: function (node) {
        var patt = /{{\w+}}/g
        var nodeValue = node.nodeValue
        var expressions = nodeValue.match(patt)
        if (!expressions) return

        var self = this
        expressions.forEach(function (expression) {
            // 这里删除了上一节中的创建节点后替换的代码 可以直接通过 nodeValue 来更新节点的值
            var property = expression.replace(/[{}]/g, '')
            // 向 $directives 添加一条指令
            self.$directives.push(new Directive('text', node, self, property))
        })
    }
}




/** 声明一个 Directive 类
 * @param {String} name 指令的种类 当存在多种指令时用来区分是哪种指令
 * @param {Object} el 与这条指令相关联的节点 node类型
 * @param {Object} vm 指令存在的 Lue 实例 可以方便地获取到该实例上的属性
 * @param {String} expression 表达式
 */
 function Directive(name, el, vm, expression) {
    this.name = name
    this.el = el
    this.vm = vm
    this.expression = expression
    this.attr = 'nodeValue'

    this.update()
}

 // 为 Directive 添加一个更新视图的方法 当指令类型增多时可以添加更多的方法
 Directive.prototype.update = function() {
     console.log(this.vm.$data.name)
    this.el[this.attr] = this.vm.$data[this.expression]
}
