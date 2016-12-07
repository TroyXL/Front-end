/**
 * Created by troyxu on 16/12/6.
 */
var Dots = function () {
    this.ctx;
    this.x;
    this.y;
    this.r;
    this.sx;
    this.sy;
    this.ismouse = false;
};

Dots.prototype = {
    init: function (ctx, x, y) {
        this.ctx = ctx;
        this.x = x*2 || Math.random() * 1920;
        this.y = y*2 || Math.random() * 1080;
        this.r = Math.random() * 4;
        this.sx = Math.random() * 6 - 3;
        this.sy = Math.random() * 6 - 3;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r + 0.5, 0, 2*Math.PI);
        this.ctx.fillStyle = "rgba(255,255,255,.8)";
        this.ctx.fill();
        this.ctx.closePath();
    },

    update: function () {
        this.x = this.x + this.sx;
        this.y = this.y + this.sy;

        if (this.x < 0 || this.x > 1920) {
            this.init(this.ctx);
        }
        if (this.y < 0 || this.y > 1080) {
            this.init(this.ctx);
        }

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r + 0.5, 0, 2*Math.PI);
        this.ctx.fillStyle = "rgba(255,255,255,.8)";
        this.ctx.fill();
        this.ctx.closePath();
    }
};