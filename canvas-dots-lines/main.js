/**
 * Created by troyxu on 16/12/6.
 */
var Main = function () {
    //图片背景
    var image = new Image(),
        dotsArr = [],
        dotsNum = 100,
        maxDotsNum = 200,
        overNum = 0,
        dotsDistance = 250;
        canvas = document.getElementById('canvas'),
        ctxC = canvas.getContext('2d'),
        dotsC = document.getElementById('dots'),
        ctxD = dotsC.getContext('2d'),
        offsetTop = canvas.offsetTop,
        offsetLeft = canvas.offsetLeft,
        width = dotsC.width/2,
        height = dotsC.height/2;

    //绘制背景图
    image.onload = function () {
        image.width = canvas.width;
        image.height = canvas.height / canvas.width * image.width;
        ctxC.drawImage(image, 0, 0, image.width, image.height);
    };
    image.src = 'http://oss.bayun.org/homepage/bg.jpg';

    //生成点
    for (var i = 0; i < dotsNum; i ++) {
        var dot = new Dots();
        dotsArr.push(dot);
        dot.init(ctxD);
    }

    //鼠标事件
    document.addEventListener('click', createDot);
    function createDot(e) {
        var tx = e.pageX,
            ty = e.pageY;
        if ((tx > offsetLeft && tx < (offsetLeft + width)) && (ty > offsetTop && ty < (offsetTop + height))) {

            for (var i = 0; i < 5; i ++) {
                var dot = new Dots();
                dotsArr.push(dot);
                dotsNum += 1;
                dot.init(ctxD, tx-offsetLeft, ty-offsetTop);
            }
        }
    };
    // document.addEventListener('mousemove', hoverDot);
    // function hoverDot(e) {
    //     var tx = e.pageX,
    //         ty = e.pageY;
    //     if ((tx > offsetLeft && tx < (offsetLeft + width)) && (ty > offsetTop && ty < (offsetTop + height))) {
    //         var dot = new Dots();
    //         dotsArr.push(dot);
    //         dotsNum += 1;
    //         dot.init(ctxD, tx-offsetLeft, ty-offsetTop);
    //     }
    // };

    //动画与连线
    var requestAnimFrame = requestAnimationFrame || webkitRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame;
    requestAnimFrame(animateUpdate);

    function animateUpdate() {
        ctxD.clearRect(0, 0, canvas.width, canvas.height);

        if (dotsNum > maxDotsNum) {
            overNum = dotsNum - maxDotsNum;
        }

        for (var i = overNum; i < dotsNum; i ++) {
            dotsArr[i].update();
        }

        for (var i = overNum; i < dotsNum; i ++) {
            for (var j = i + 1; j < dotsNum; j ++) {
                var tx = dotsArr[i].x - dotsArr[j].x,
                    ty = dotsArr[i].y - dotsArr[j].y,
                    s = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
                if (s < dotsDistance) {
                    ctxD.beginPath();
                    ctxD.moveTo(dotsArr[i].x, dotsArr[i].y);
                    ctxD.lineTo(dotsArr[j].x, dotsArr[j].y);
                    ctxD.strokeStyle = 'rgba(255,255,255,'+(dotsDistance-s)/dotsDistance+')';
                    ctxD.strokeWidth = 1;
                    ctxD.stroke();
                    ctxD.closePath();
                }
            }
        }

        requestAnimFrame(animateUpdate);
    }





}();