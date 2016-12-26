/**
 * Created by troyxu on 16/12/8.
 * only used in HTML5
 */
;(function () {

    window.requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;

    window.troy = {};

    /**
     * 获取URL参数
     */
    troy.getURLParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return decodeURIComponent(r[2]);
        return null;
    };

    /**
     * 获取方法的参数名
     * @param {function} fn 需要获取参数名的方法
     * @return {array} 参数名数组
     */
    troy.getParameterNames = function (fn) {
        if(typeof fn !== 'function') return [];
        var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var code = fn.toString().replace(COMMENTS, '');
        var result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
            .match(/([^\s,]+)/g);
        return result === null
            ? []
            : result;
    };

    /**
     * 拷贝方法 回调使用promise
     * @param {string[element]} inputEleId input元素id 必须是input
     * @return {object} promise
     */
    troy.copy = function (inputEleId){
        if (inputEleId.slice(0,1) !== '#') {
            console.error(inputEleId + ' is not an id');
            return null;
        }
        var promise = troy.promise(function () {
            var self = this,
                copyDOM = document.querySelector(inputEleId);
            copyDOM.select();
            if (document.execCommand('copy')) {
                self.resolve();
            } else {
                self.reject();
            }
        });
        return promise;
    };

    /**
     * 判断是否移动设备并返回设备种类
     */
    troy.deviceType = function () {
        var ua = navigator.userAgent;
        var agent = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        for (var i = 0; len = agent.length, i < len; i ++) {
            if (ua.indexOf(agent[i]) > 0) {
                return agent[i];
            } else {
                console.log('not mobile device');
                return false;
            }
        }
    };

    /**
     * 判断是否微信
     */
    troy.isWeixin = function () {
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=='micromessenger'){
            return true;
        }else{
            return false;
        }
    };

    /**
     * 缩放屏幕适配   如果屏幕宽高获取不准确 使用setTimeout延时300 确保获取准确
     * @param el {string} 需要缩放的节点选择器(opacity:0)
     * @param width {number} 设计稿宽
     * @param height {number} 设计稿高
     */
    troy.autoScale = function (el, width, height) {
        var ratio = width / height,
            winW = document.getElement.clientWidth,
            winH = document.getElement.clientHeight,
            winRatio = winW/winH,
            scale, $dom = document.querySelectorAll(el);

        if (ratio === winRatio) {
            for (var i = 0; i < $dom.length; i ++) {
                $dom[i].style.opacity = 1;
            }
            return;
        }

        if (ratio < winRatio) {
            scale = (winH/height).toString().substring(0, 6);
        } else {
            scale = (winW/width).toString().substring(0, 6);
        }
        var cssText = '-webkit-transform: scale('+scale+');-webkit-transform-origin: top; opacity:1;';
        for (var i = 0; i < $dom.length; i ++) {
            $dom[i].setAttribute('style', cssText);
        }
    };

    /**
     * 屏幕旋转
     * @param protalCb {function} 竖屏回调
     * @param landscapeCb {function} 横屏回调
     */
    troy.detectOrientatioin = function (protalCb, landscapeCb) {

        window.addEventListener('onorientationchange' in window?'orientationchange':'resize', function () {

            if(window.orientation==180 || window.orientation==0){
                //竖屏
                if (protalCb) protalCb();
            }
            if(window.orientation==90 || window.orientation==-90){
                //横屏
                if (landscapeCb) landscapeCb();
            }

        }, false);

    };

    /**
     * 随机字符串生成器
     * @param length {int} 字符串长度
     * @param isPureNumber {boolean} 字符串是否为纯数字
     * @param prefix {string} 字符串前缀(前缀长度不在字符串长度内)
     */
    troy.randomString = function (length, isPureNumber, prefix) {
        var arr1 = ['0','1','2','3','4','5','6','7','8','9'],
            arr2 = ['0','1','2','3','4','5','6','7','8','9',
                'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            string = '', index;

        if (isPureNumber) {
            for (var i = 0; i < length; i ++) {
                index = Math.round(Math.random()*9);
                string = string + arr1[index];
            }
        } else {
            for (var i = 0; i < length; i ++) {
                index = Math.round(Math.random()*61);
                string = string + arr2[index];
            }
        }

        if (undefined != prefix) {
            string = prefix + string;
        }

        return string;
    };

    /**
     * 随机十六进制色值生成器
     */
    troy.randomColor = function () {
        var arrHex=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"],
            strHex="#",
            index;
        for(var i=0;i < 6; i++){
            index=Math.round(Math.random()*15);
            strHex+=arrHex[index];
        }
        return strHex;
    };

    /**
     * 二分法
     */
    troy.binary = function (items,value) {
        var startIndex=0,
            stopIndex=items.length-1,
            middleIndex=(startIndex+stopIndex)>>>1;
        while(items[middleIndex]!=value && startIndex<stopIndex){
            if(items[middleIndex]>value){
                stopIndex=middleIndex-1;
            }else{
                startIndex=middleIndex+1;
            }
            middleIndex=(startIndex+stopIndex)>>>1;
        }
        return items[middleIndex]!=value ? false:true;
    };

    /**
     * 精确除法
     */
    troy.addDiv = function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    };

    /**
     * 精确乘法
     */
    troy.accMul = function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    };

    /**
     * 精确加法
     */
    troy.accAdd = function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m
    };

    /**
     * 精确减法
     */
    troy.accSubtr = function (arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    };

    /**
     * 加 0 方法 小于10的数字前添加 0
     * @param {UInt, String} 正整数或可解析为正整数的字符串 小数将舍去小数点后数字
     * @return {String} 参数小于10返回加 0 后的值 参数不小于10或为其他值则返回原值
     */
    troy.addZero = function (num) {
        var number = parseInt(num);

        if (number < 0 || isNaN(number)) {
            console.warn(num + ' is not an UInt, please retry');
            return num.toString();
        }

        if (number < 10) {
            return '0'+ number.toString();
        } else {
            return number.toString();
        }
    };

    /**
     * 挂载在 window.troy 下的事件监听器
     * 也可单独使用
     */
    troy.eventEmitter = function () {
        return new EventEmitter();
    };

    /**
     * 挂载在 window.troy 下的Promise
     * 也可单独使用
     */
    troy.promise = function (fn) {
        return new Promise(fn);
    }



    /**
     * Array prototype methods extend
     */

    /**
     * 数组去重
     */
    Array.prototype.unique = function () {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = this[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    };



    /**
     * Date prototype methods extend
     */

    /**
     * 格式化日期
     * @param {String} joinStr 连接日期符号 '-' '.' '/' 不传该参数或者传入'' 将返回yyyymmddHHMMSS 例如 20161219152324
     * @param {boolean} onlyDay 是否只需要日期部分 true 返回 yyyy-mm-dd false 返回 yyyy-mm-dd HH:MM:SS
     */
    Date.prototype.formate = function (joinStr, onlyDay) {
        var joinString = '';
        if (undefined == joinStr || joinStr.length == 0) {
            joinString = '';
        } else {
            joinString = joinStr;
        }

        var dateArr1 = [], dateArr2 = [], dateStr = '';

        dateArr1.push(this.getFullYear().toString()); //year
        dateArr1.push(troy.addZero((this.getMonth() + 1))); //month
        dateArr1.push(troy.addZero((this.getDate()))); //day

        dateStr = dateArr1.join(joinString);

        if (onlyDay) {
            return dateStr;
        }

        dateStr = joinString.length != 0 ? (dateStr + ' ') : dateStr;

        dateArr2.push(troy.addZero((this.getHours()))); //hour
        dateArr2.push(troy.addZero((this.getMinutes()))); //min
        dateArr2.push(troy.addZero((this.getSeconds()))); //sec

        return joinString.length != 0 ? (dateStr + dateArr2.join(':')) : (dateStr + dateArr2.join(joinString));
    };







})();

/**
 * 事件监听器
 */
function EventEmitter() {
    this.handlers = {};
};
EventEmitter.prototype = {
    constructor: EventEmitter,

    /**
     * 添加事件监听
     * @param key {String} 事件名 必须
     * @param handler {Function} 处理方法 必须
     * @return {EventEmitter}
     */
    on: function(key, handler) {
        // handler不是function时 抛出异常 停止运行
        if (typeof handler !== 'function') {
            throw handler + 'is not an function'
        }
        // 如果该事件为undefined 则初始化该事件组为对象
        if (undefined === this.handlers[key]) {
            this.handlers[key] = {}
        }
        // 获取handler的方法名 匿名函数方法名为''
        var fnName = handler.name
        if (fnName === '') {
            fnName = troy.randomString(32, false, 'FN-')
        }
        // 为该事件添加需要执行的方法
        this.handlers[key][fnName] = handler

        return this
    },

    /**
     * 触发事件监听
     * @param key {String} 事件名 必须
     * @param args {arguments} 参数 可选
     * @return {EventEmitter}
     */
    emit: function(key, args) {console.log(typeof arguments, arguments)
        // 确保对应的事件方法存在
        if (undefined !== this.handlers[key]) {
            var self = this,
                argsArr = []

            for (index in arguments) {
                argsArr.push(arguments[index])
            }
            argsArr.splice(0, 1)

            // 遍历所有属性并执行对应的方法
            for (fnName in this.handlers[key]) {
                var thisFn = function () {
                    self.handlers[key][fnName].apply(this, argsArr)
                }()
            }
        }

        return this;
    },

    /**
     * 移除事件监听
     * @param key {String} 事件名 必须
     * @param fnName {String} 事件中需要被移除的方法名 可选 不传则删除该事件中的所有方法
     * @return {EventEmitter}
     */
    removeEmitter: function(key, fnName) {
        if (undefined === fnName) {
            delete this.handlers[key];
        } else {
            delete this.handlers[key][fnName];
        }

        return this;
    },

    /**
     * 移除所有事件监听
     * @param key {String} 事件名 可选 不传则删除该监听器中的所有事件及方法
     * @return {EventEmitter}
     */
    removeAllEmitter: function (key) {
        if (undefined === key) {
            this.handlers = {};
        } else {
            delete this.handlers[key];
        }

        return this;
    },

    /**
     * 打印事件监听器中的方法
     * @param key {String} 事件名 可选 不传则打印该监听器中的所有事件及方法
     * @return {EventEmitter}
     */
    printEmitters: function(key) {
        if (undefined === key) {
            console.log(this.handlers);
        } else {
            console.log(this.handlers[key]);
        }

        return this;
    }
};

/**
 * Promise
 */
function Promise(fn) {
    if (null != fn && typeof fn !== 'function') {
        console.error(fn + ' is not a function');
        return;
    }

    this.status = 'pending'; // 当前状态 pending resolve reject complete
    this.data = {}; // 回调参数
    this.once = fn; // 存储fn
    this.handles = {
        resolve: null,
        reject: null
    }; // 存储对应状态的回调方法
    this.next = null;
};
Promise.prototype = {
    /**
     * 状态标记为已完成 执行成功回调 传入参数将作为参数列表存入回调的data参数中
     */
    resolve: function () {
        if (this.status === 'reject') return; // 状态改变后无法再次更改
        this.status = 'resolve';
        this.data = arguments;
        if (null != this.next) {
            try {
                this.handles.resolve.call(this.next, undefined, this.data);
            } catch (e) {
                this.handles.resolve.call(this.next, e, this.data);
            }
        }
    },

    /**
     * 状态标记为已失败 执行失败回调 传入参数将作为参数列表存入回调的data参数中
     */
    reject: function () {
        if (this.status === 'resolve') return; // 状态改变后无法再次更改
        this.status = 'reject';
        this.data = arguments;
        if (null != this.next) {
            try {
                this.handles.reject.call(this.next, undefined, this.data);
            } catch (e) {
                this.handles.reject.call(this.next, e, this.data);
            }
        }
    },

    /**
     * 回调方法
     * @param resolveCb {function} 已完成回调 参数[err, data] data中包含resolve()中的参数列表
     * @param rejectCb {function} 已失败回调 参数[err, data] data中包含reject()中的参数列表
     * @return Promise {object}
     */
    then: function (resolveCb, rejectCb) {
        this.next = new Promise();

        if (null != resolveCb && typeof resolveCb === 'function') {
            this.handles.resolve = resolveCb;
        } else {
            console.error('arguments[0]: ' + resolveCb + 'must be an function')
            return;
        }

        if (null != rejectCb && typeof rejectCb !== 'function') {
            console.error('arguments[1]: ' + rejectCb + 'must be an function')
            return;
        }
        if (null != rejectCb && typeof rejectCb === 'function') {
            this.handles.reject = rejectCb;
        }

        if (undefined != this.once) {
            this.once.call(this); // 将promise交给fn执行, 以便在fn内部改变promise状态
        }

        return this.next;
    }
};