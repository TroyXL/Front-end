/**
 * Created by troyxu on 16/12/13.
 */
var Snack = function () {
    this.canvas;
    this.ctx;

    // snack properties
    this.x;
    this.y;
    this.length;
    this.dotsArr;

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

        this.step = 10;
        this.x = this.step;
        this.y = this.step;
        this.length = 2;
        this.dotsArr = [{x: this.x, y: this.y + this.step}, {x: this.x, y: this.y}];
        this.dotsArr.length = this.length;

        this.speed = 250;

        this.counter = 0;
        this.corners = 0;
        this.isStarted = false;

        this.drawSnack();

        this.addKeyListener();

        return this;
    },

    drawSnack: function () {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        this.ctx.beginPath();
        // this.ctx.moveTo(this.dotsArr[0].x, this.dotsArr[0].y);

        for (var i = 0; i < this.length; i ++) {

            var dot = this.dotsArr[i];

            if (!this.isAlive(dot) && this.isStarted) {
                console.log('you die');
                clearInterval(this.timer);
                return;
            }

            if (i == 0) {
                this.ctx.moveTo(dot.x, dot.y);
            } else {
                this.ctx.lineTo(dot.x, dot.y);
            }

        }

        this.ctx.lineWidth = this.step;
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();
    },

    addKeyListener: function () {
        var self = this;
        window.onkeyup = function (e) {
            switch (e.keyCode) {
                case 32: //空格 开始游戏
                    if (this.isStarted) return;
                    if ('down' === this.forward) return;
                    this.isStarted = true;
                    this.forward = 'down';
                    self.update();
                    break;
                case 38: //上
                    if ('upon' === this.forward) return;
                    self.forward = 'upon';
                    self.update();
                    break;
                case 40: //下
                    if ('down' === this.forward) return;
                    self.forward = 'down';
                    self.update();
                    break;

                case 37: //左
                    if ('left' === this.forward) return;
                    self.forward = 'left';
                    self.update();
                    break;

                case 39: //右
                    if ('right' === this.forward) return;
                    self.forward = 'right';
                    self.update();
                    break;
            }
        }
    },

    isAlive: function (dot) {
        if (dot.x == this.x && dot.y == this.y) {
            return false;
        }
        return true;
    },

    update: function () {
        var self = this;

        clearInterval(this.timer);
        this.timer = setInterval(
            function () {
                self.length = self.length + 1;

                switch (self.forward) {
                    case 'down':
                        self.down();
                        break;
                    case 'upon':
                        self.upon();
                        break;
                    case 'left':
                        self.left();
                        break;
                    case 'right':
                        self.right();
                        break;
                }

                self.dotsArr = [{x: self.x, y: self.y}].concat(self.dotsArr);
                self.dotsArr.length = self.length;

                self.drawSnack();
            },
            self.speed
        );
    },

    upon: function () {
        this.y = this.y - this.step;
    },

    down: function () {
        this.y = this.y + this.step;
    },

    left: function () {
        this.x = this.x - this.step;
    },

    right: function () {
        this.x = this.x + this.step;
    },

};