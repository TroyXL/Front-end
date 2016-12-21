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
     */
    troy.eventEmitter = function () {
        return new EventEmitter();
    };

    /**
     * 事件监听器
     */
    function EventEmitter() {
        this.handlers = {};
    };
    EventEmitter.prototype = {
        constructor: EventEmitter,
        on: function(name, handler) {
            if (!this.handlers[name]) {
                this.handlers[name] = handler;
            }
            return this;
        },
        emit: function(name) {
            if (this.handlers[name]) {
                this.handlers[name]();
            }
            return this;
        },
        removeEmitter: function(name) {
            if (this.handlers[name]) {
                delete this.handlers[name];
            }
            return this;
        },
        printEmitters: function() {
            console.log(this.handlers);
            return this;
        }
    };



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