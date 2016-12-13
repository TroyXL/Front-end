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



}();