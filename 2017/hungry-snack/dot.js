/**
 * Created by troyxu on 16/12/13.
 */
var Dot = function () {
    this.ctx;

    this.x; // 起始位置 x
    this.y; // 起始位置 y

    this.ox; //前一次的起始位置 x
    this.oy; //前一次的起始位置 y

};

Dot.prototype = {
    init: function (ctx) {
        this.ctx = ctx;
        this.x = Math.random() * 800;
        this.y = Math.random() * 600;

        if (this.x === this.ox || this.y === this.oy) {
            this.init(this.ctx);
            return;
        } // 防止两次出现的位置相同

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + 10);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#333';
        ctx.stroke();
        ctx.closePath();

        return this;
    }
}