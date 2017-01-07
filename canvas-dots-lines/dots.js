/**
 * Created by troyxu on 16/12/6.
 */
var Dots = function () {
    // 画布相关
    this.canvas;
    this.ctx;

    // 绘制点相关
    this.x;
    this.y;
    this.r;

    // 移动相关
    this.sx;
    this.sy;
};

Dots.prototype = {
    // 初始化点的方法 x/y为可选参数 为生成点的位置 不传则随机生成
    init: function (canvas, x, y) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.x = x*2 || Math.random() * this.canvas.width;
        this.y = y*2 || Math.random() * this.canvas.height;
        this.r = Math.random() * 4; // 随机生成 <4 的半径值

        // 随机确定点的移动速度与方向 速度值在 [-2, 2) 之间 提高数值可加快速度
        this.sx = Math.random() * 4 - 2;
        this.sy = Math.random() * 4 - 2;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        this.ctx.fillStyle = "rgba(255,255,255,.8)";
        this.ctx.fill();
        this.ctx.closePath();
    },

    // 更新点位置
    update: function () {
        this.x = this.x + this.sx;
        this.y = this.y + this.sy;

        // 点超出canvas范围时另其"重生"
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

    // 跟踪鼠标的点的位置更新 x/y为鼠标位置
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