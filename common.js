/**
 * Created by troyxu on 16/12/8.
 * only used in HTML5
 */
;(function () {

    window.requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;

    window.troy = {};

    /**
     * 判断设备种类
     */
    troy.deviceType = function () {
        var ua = navigator.userAgent;
        var agent = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        for(var i=0; i<len,len = agent.length; i++){
            if(ua.indexOf(agent[i])>0){
                break;
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
     * @param el {string} 需要缩放的节点(opacity:0)
     * @param width {number} 设计稿宽
     * @param height {number} 设计稿高
     */
    troy.autoScale = function (el, width, height) {
        var ratio = width / height,
            winW = document.getElement.clientWidth,
            winH = document.getElement.clientHeight,
            winRatio = winW/winH,
            scale, $dom = $(el);

        if (ratio === winRatio) {
            $dom.css({'opacity': 1});
            return;
        }

        if (ratio < winRatio) {
            scale = (winH/height).toString().substring(0, 6);
        } else {
            scale = (winW/width).toString().substring(0, 6);
        }
        var cssText = '-webkit-transform: scale('+scale+');-webkit-transform-origin: top; opacity:1;';
        $dom.attr('style', cssText);
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
                index = Math.round(Math.random()*10);
                string = string + arr1[index];
            }
        } else {
            for (var i = 0; i < length; i ++) {
                index = Math.round(Math.random()*62);
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
        var arrHex=["0","2","3","4","5","6","7","8","9","a","b","c","d"],
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





})();