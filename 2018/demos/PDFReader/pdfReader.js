
// container
// src
// mode|string|widthFix|heightFix
// resize|boolean
// zoomStep|float(0,1)
// nextBtn prevBtn
// zoomBigBtn zoomSmallBtn
// stateChanged|func
// pageChanged|func

/*
 * 基于pdf.js的h5端pdf简易阅读工具
 *
 * @param opts {Object} pdfReader配置参数，包括以下属性
 *
 * @param container {String<Selector>} 用于显示pdf的容器选择器字符串
 * @param src {String} pdf文件路径
 * @param mode {String} 显示的模式，取值有['widthFix', 'heightFix']，默认'widthFix'，固定宽（高）后，高（宽）将会根据pdf的内容自动改变，保证在容器中完整显示一页内容
 * @param resize {Boolean} 当pdf文件内每页的尺寸可能不同时，是否针对每一页调整容器尺寸以保证完整显示，默认false（即只根据pdf的第一页内容设置容器尺寸，之后不再改变）
 * @param zoomStep {Float} 当需要对pdf进行缩放时，每次缩放的步进值，取值范围为(0, 1)，默认0.2
 * @param nextBtn {String<Selector>} 下一页按钮的选择器字符串
 * @param prevBtn {String<Selector>} 上一页按钮的选择器字符串
 * @param zoomBigBtn {String<Selector>} 放大按钮的选择器字符串
 * @param zoomSmallBtn {String<Selector>} 缩小按钮的选择器字符串
 * @param stateChanged {Function} 当阅读器状态改变时触发的回调函数，接收一个参数state，阅读器的状态种类可以参考代码32~36行，可以用来设置加载状态等
 * @param pageChanged {Function} 当阅读器翻页后触发的回调函数，接收三个参数currentPage|prevPage|totalPage，分别是当前页码|之前页码|总页码
 * @param zoomChanged {Function} 当页面缩放后的回调函数，接收两个参数inZoom|zoom，分别是当前缩放状态|缩放比例
 *
 */

/*
 * 可使用的属性说明，未列出的属性不建议使用
 *
 * @property state {Int} 阅读器当前状态
 * @property canvas {NodeElement} 当前显示的页面的canvas节点，可以通过这个节点将当前页面导出为图片
 * @property ctx {Object} canvas的2d绘制上下文对象
 * @property currentPage {Int} 当前页码
 * @property totalPage {Int} 总页码
 * @property container {NodeElement} 显示pdf的页面节点
 * @property inZoom {Boolean} 当前页面是否处于缩放状态
 * @property zoom {Float} 当前页面的缩放比例，最小为1
 */

function PdfReader (opts) {
  // 是否已经初始化完成
  this.initialized = false;
  // 当前的状态
  // 0-loading pdf pdf文件正在加载中
  // 1-loaded pdf pdf文件加载完成
  // 2-loading page 加载pdf单页视图
  // 3-loaded page pdf单页视图加载完成
  this.state = 0;
  // 用于显示 pdf 当前页面的canvas
  this.canvas;
  this.ctx;
  // pdf 路径
  this.src = opts.src;
  // 当前页码
  this.currentPage = 0;
  // 总页数
  this.totalPage = 0;
  // 阅读器容器
  this.container = document.querySelector(opts.container);
  // pdf 展现模式：宽度固定与高度固定
  // 宽度固定时容器需要有初始宽度，pdf 的高度将会自适应
  // 高度固定时容器需要有初始高度，pdf 的宽度将会自适应
  this.mode = ['widthFix', 'heightFix'].indexOf(opts.mode) === -1 ? 'widthFix' : opts.mode;
  // 容器尺寸的限制
  this.containerSizeLimit = this.mode === 'widthFix' ? this.container.clientWidth : this.container.clienHeight;
  // 切换页面后是否调整容器的尺寸以保证完全显示单页内容
  // 如果为 false 则以第一个页面完全显示的尺寸为准
  this.resize = !!opts.resize;
  // pdf 文档信息
  this.pdf;
  // 当前是否为缩放状态
  this.inZoom = false;
  // 当前的缩放比例
  this.zoom = 1;
  // 缩放时的步进值
  this.zoomStep = opts.zoomStep < 1 && opts.zoomStep > 0 ? opts.zoomStep : 0.2;
  // scale - pdf 显示时的缩放值(相对于 pdf 本身的尺寸)
  // originalScale - pdf 未进行缩放时为了完整显示进行缩放的原始缩放值
  this.scale = this.originalScale = 1;
  // 操作按钮
  this.prevBtn = document.querySelector(opts.prevBtn);
  this.nextBtn = document.querySelector(opts.nextBtn);
  this.zoomBigBtn = document.querySelector(opts.zoomBigBtn);
  this.zoomSmallBtn = document.querySelector(opts.zoomSmallBtn);
  // 状态改变时的回调方法，参数为当前的状态
  this.stateChanged = typeof opts.stateChanged === 'function' ? opts.stateChanged : void 0
  // 页面改变时的回调方法，参数依次为当前页码，之前的页码和总页数
  this.pageChanged = typeof opts.pageChanged === 'function' ? opts.pageChanged : void 0
  // 缩放状态改变时的回调方法，参数依次为当前的缩放状态和缩放的比值
  this.zoomChanged = typeof opts.zoomChanged === 'function' ? opts.zoomChanged : void 0
  // 初始化 PDFReader
  this.init();
}

PdfReader.prototype = {
  constructor: PdfReader,

  init: function () {
    this.readPdf();
  },

  readPdf: function () {
    var self = this;
    PDFJS.getDocument(self.src).then(function (data) {
      self.pdf = data;
      self.currentPage = 1;
      self.totalPage = data.numPages;
      self.changeState(1); // pdf 读取完成
      self.renderPage();
      self.initOperation();
    });
  },

  // 渲染单页 pdf
  renderPage: function () {
    var self = this;
    self.changeState(2); // 开始读取 pdf 单页
    self.pdf.getPage(self.currentPage).then(function (page) {
      // 由于异步渲染，防止连续点击导致渲染出错，所以每次渲染时重新初始化 canvas
      var lastCanvas = self.initOrResetCanvas();
      // 展示单页内容
      self.showPage(page, lastCanvas);
      self.changeState(3); // pdf 单页读取完成
    })
  },

  // 初始化 canvas
  initOrResetCanvas: function () {
    if (this.canvas) {
      this.container.removeChild(this.canvas);
    }
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    if (this.mode === 'widthFix') {
      this.canvas.width = this.containerSizeLimit;
    } else {
      this.canvas.height = this.containerSizeLimit;
    }
    this.container.appendChild(this.canvas); // 将 canvas 添加到页面上
  },

  // 初始化操作按钮
  initOperation: function () {
    this.pageChange();
    this.pageZoom();
  },

  showPage: function (page, lastCanvas) {
    // 获取当前单页试图缩放后的尺寸
    // 初始化及缩放后切换页面时获取单页原始尺寸
    var viewport = page.getViewport(!this.initialized ? 1 : this.inZoom ? this.scale : 1);
    // 如果没有缩放，重新调整缩放比例保证完全显示
    if (!this.inZoom) {
      this.setScale(viewport);
      viewport = page.getViewport(this.scale);
      this.resizeContainerWithoutZoom(viewport);
    }
    this.resizeCanvas(viewport);

    page.render({
      canvasContext: this.ctx,
      viewport: viewport
    });
  },

  // 在未缩放时，根据 page 试图的尺寸调整 container 的尺寸
  resizeContainerWithoutZoom: function (view) {
    // 当 resize = true 时
    // 当 resize = false 但是是初始化时
    if (this.resize || (!this.resize && !this.initialized)) {
      this.initialized = true;
      var attr = this.mode === 'widthFix' ? 'height' : 'width';
      this.container.style[attr] = view[attr] + 'px';
    }
  },

  // 根据 page 试图的切换与缩放调整 canvas 的显示尺寸
  resizeCanvas: function (view) {
    this.canvas.width = view.width
    this.canvas.height = view.height
  },

  // 设置 pdf 当前页的缩放比例
  setScale: function (view) {
    if (this.mode === 'widthFix') {
      this.scale = this.originalScale = this.containerSizeLimit / view.width
    } else {
      this.scale = this.originalScale = this.containerSizeLimit / view.height
    }
  },

  // 翻页
  pageChange: function () {
    var self = this;
    if (self.prevBtn) {
      self.prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (self.state !== 3) return;
        if (self.currentPage > 1) {
          self.currentPage--;
          self.inZoom = false;
          self.renderPage();
          self.pageChanged && self.pageChanged(self.currentPage, self.currentPage + 1, self.totalPage);
        }
      });
    }
    if (self.nextBtn) {
      self.nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (self.state !== 3) return;
        if (self.currentPage < self.totalPage) {
          self.currentPage++;
          self.inZoom = false;
          self.renderPage();
          self.pageChanged && self.pageChanged(self.currentPage, self.currentPage - 1, self.totalPage);
        }
      });
    }
  },

  // 缩放
  pageZoom: function () {
    var self = this;
    if (self.zoomSmallBtn) {
      self.zoomSmallBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (self.state === 2) return;
        if (self.canvas.width > self.containerSizeLimit) {
          self.scale -= self.zoomStep;
          self.zoom = self.scale / self.originalScale;
          if (self.zoom <= 1) {
            self.inZoom = false;
            self.zoom = 1;
            self.scale = self.originalScale;
          } else {
            self.inZoom = true;
          }
          self.renderPage();
          self.zoomChanged(self.inZoom, self.zoom);
        }
      });
    }
    if (self.zoomBigBtn) {
      self.zoomBigBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (self.state === 2) return;
        self.scale += self.zoomStep;
        self.zoom = self.scale / self.originalScale;
        self.inZoom = true;
        self.renderPage();
        self.zoomChanged(self.inZoom, self.zoom);
      });
    }
  },

  // 改变状态
  changeState: function (state) {
    this.state = state;
    this.stateChanged && this.stateChanged(state)
  }
}