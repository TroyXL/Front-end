/**
 * Created by troyxu on 16/12/13.
 */
var Main = function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        snack, currentDot;

    canvas.width = 800; canvas.height = 600;
    canvas.style.width = '400px'; canvas.style.height = '300px';

    snack = new Snack().init(canvas);

    currentDot = new Dot().init(ctx);

    /* 存在问题
     *
     *  1.无法判断是否触碰到自己,数组的indexof方法不可用,不能通过字面量判断(对象是引用类型),按点的位置也不可行 ===> 导致可能无法判断是否触碰到了点
     *
     *  2.思考可行解决办法: 将snack对象改成一个dots对象集,判断触碰到的点是否已经在snack内部,已经存在则游戏结束,不存在则添加到snack
     *
     */



}();