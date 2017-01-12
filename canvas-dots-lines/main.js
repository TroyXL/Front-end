/**
 * Created by troyxu on 16/12/6.
 */
var Main = function () {

    var dotsArr = [],
        dotsNum = 0,
        maxDotsNum = 0,
        overNum = 0, // 超出最大数量的点的数量
        dotsDistance = 250, // 点之间产生连线的最大距离

        bg = document.getElementById('bg'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),

        width = parseInt(document.documentElement.clientWidth),
        height = parseInt(document.documentElement.clientHeight),
        area = width * height, // canvas区域面积
        cssText = 'width: '+width+'px; height: '+height+'px;';

    // 设置背景和canvas的宽高
    bg.setAttribute('style', cssText);
    canvas.setAttribute('style', cssText);
    canvas.width = (width * 2).toString();
    canvas.height = (height * 2).toString();

    // 更具canvas面积动态确定初始化点的数量和最大数量
    dotsNum = parseInt(area / 6000);
    maxDotsNum = dotsNum * 2;

    //生成点
    for (var i = 0; i < dotsNum; i ++) {
        var dot = new Dots();
        dotsArr.push(dot);
        dot.init(canvas);
    }

    //鼠标事件
    document.addEventListener('click', createDot);
    function createDot(e) {
        var tx = e.pageX,
            ty = e.pageY;
        if ((tx > 0 && tx < width) && (ty > 0 && ty < height)) {

            for (var i = 0; i < 5; i ++) {
                var dot = new Dots();
                dotsArr.push(dot);
                dotsNum += 1;
                dot.init(canvas, tx, ty);
            }
        }
    };
    document.addEventListener('mousemove', moveDot);
    function moveDot(e) {

        var tx = e.pageX,
            ty = e.pageY;
        if ((tx > 0 && tx < width) && (ty > 0 && ty < height)) {
            dot.mouseDot(tx, ty);
        }
    };

    //动画与连线
    var requestAnimFrame = requestAnimationFrame || webkitRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame;
    requestAnimFrame(animateUpdate); // 兼容不同浏览器的requestAnimationFrame

    function animateUpdate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空canvas中原有的内容

        // 更新点的位置 数量超出最大值时舍弃旧的点
        if (dotsNum > maxDotsNum) {
            overNum = dotsNum - maxDotsNum;
        }

        for (var i = overNum; i < dotsNum; i ++) {
            dotsArr[i].update();
        }

        // 绘制连线
        for (var i = overNum; i < dotsNum; i ++) {
            for (var j = i + 1; j < dotsNum; j ++) {
                var tx = dotsArr[i].x - dotsArr[j].x,
                    ty = dotsArr[i].y - dotsArr[j].y,
                    s = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
                if (s < dotsDistance) {
                    ctx.beginPath();
                    ctx.moveTo(dotsArr[i].x, dotsArr[i].y);
                    ctx.lineTo(dotsArr[j].x, dotsArr[j].y);
                    ctx.strokeStyle = 'rgba(255,255,255,'+(dotsDistance-s)/dotsDistance+')';
                    ctx.strokeWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }

        requestAnimFrame(animateUpdate);
    }
}();