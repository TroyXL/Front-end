/**
 * Created by troyxu on 16/12/8.
 */
;(function () {

    window.requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;

    window.troy = {};

    /*
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

    /*
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


    /*
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

    troy.detectOrientatioin = function (protalCb, landscapeCb) {
        window.addEventListener('onorientationchange' in window?'orientationchange':'resize', troy.autoScale, false){
            if(window.orientation==180 || window.orientation==0){
                //竖屏
            }
            if(window.orientation==90 || window.orientation==-90){
                //横屏
            }
        }
    }

    window.addEventListener('onorientationchange' in window?'orientationchange':'resize', function () {
        
    }, false)

    function detectOrientatioin(){
        if(window.orientation==180 || window.orientation==0){
            //竖屏
        }
        if(window.orientation==90 || window.orientation==-90){
            //横屏
        }
    }


})();