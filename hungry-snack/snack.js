/**
 * Created by troyxu on 16/12/13.
 */
var Snack = function () {
    this.canvas;
    this.ctx;
    this.x;
    this.y;
    this.length;

    this.forward; // 方向 upon down left right
    this.step; // 步伐
    this.speed; // 初始速度 1s
    this.timer; // 定时器
    this.counter; // 计数器
    this.corners; // 拐角数
    this.isStarted; // 游戏是否开始
};

Snack.prototype = {
    init: function (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = 10;
        this.y = 10;
        this.step = 10;
        this.speed = 500;
        this.length = 1;
        this.counter = 0;
        this.corners = 0;
        this.isStarted = false;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + this.step * this.counter);
        this.ctx.lineTo(this.x, this.y + this.step * this.counter + this.step * this.length);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();

        this.addKeyListener();

        return this;
    },

    addKeyListener: function () {
        var self = this;
        window.onkeyup = function (e) {
            switch (e.keyCode) {
                case 32: //空格
                    if (this.isStarted) return;
                    if ('down' === this.forward) return;
                    this.isStarted = true;
                    this.forward = 'down';
                    self.startGame();
                    break;
                case 38: //上
                    if ('upon' === this.forward) return;
                    self.forward = 'upon';
                    break;
                case 40: //下
                    if ('down' === this.forward) return;
                    self.forward = 'down';
                    break;

                case 37: //左
                    if ('left' === this.forward) return;
                    self.forward = 'left';
                    break;

                case 39: //右
                    if ('right' === this.forward) return;
                    self.forward = 'right';
                    break;
            }
        }
    },

    update: function () {
        this.counter = this.counter + 1;
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        switch (this.forward) {
            case 'upon':
                this.upon();
                break;
            case 'down':
                this.down();
                break;
            case 'left':
                this.left();
                break;
            case 'right':
                this.right();
                break;
        }
    },

    startGame: function () {
        var self = this;
        this.timer = setInterval(
            function () {
                self.update();
            },
            self.speed
        );
    },

    upon: function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + this.step * this.counter);
        this.ctx.lineTo(this.x, this.y + this.step * this.counter + this.step * this.length);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();
    },

    down: function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + this.step * this.counter);
        this.ctx.lineTo(this.x, this.y + this.step * this.counter + this.step * this.length);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();
    },

    left: function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + this.step * this.counter);
        this.ctx.lineTo(this.x, this.y + this.step * this.counter + this.step * this.length);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();

    },

    right: function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + this.step * this.counter);
        // for (var i = 0; i < )
        this.ctx.lineTo(this.x, this.y + this.step * this.counter + this.step * this.length);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();

    },

};