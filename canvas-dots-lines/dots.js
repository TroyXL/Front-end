/**
 * Created by troyxu on 16/12/6.
 */
var Dots = function () {
    this.canvas;
    this.ctx;
    this.x;
    this.y;
    this.r;
    this.sx;
    this.sy;
};

Dots.prototype = {
    init: function (canvas, x, y) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.x = x*2 || Math.random() * this.canvas.width;
        this.y = y*2 || Math.random() * this.canvas.height; // *2 canvas画布尺寸是物理尺寸的2倍（window scale）
        this.r = Math.random() * 4;
        this.sx = Math.random() * 4 - 2;
        this.sy = Math.random() * 4 - 2;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r + 0.5, 0, 2*Math.PI);
        this.ctx.fillStyle = "rgba(255,255,255,.8)";
        this.ctx.fill();
        this.ctx.closePath();
    },

    update: function () {
        this.x = this.x + this.sx;
        this.y = this.y + this.sy;

        if (this.x < 0 || this.x > this.canvas.width) {
            this.init(this.canvas);
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.init(this.canvas);
        }

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r + 0.5, 0, 2*Math.PI);
        this.ctx.fillStyle = "rgba(255,255,255,.8)";
        this.ctx.fill();
        this.ctx.closePath();
    },

    mouseDot: function (x, y) {
        this.x = x*2;
        this.y = y*2;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r + 0.5, 0, 2*Math.PI);
        this.ctx.fillStyle = "rgba(255,0,0,.8)";
        this.ctx.fill();
        this.ctx.closePath();
    }


};