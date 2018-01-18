
// container
// src
// mode|string|widthFix|heightFix
// next prev
// zoomBig zoomSmall
// stateChanged|func
// pageChanged|func

function PdfReader (opts) {
  this.init = false; // 是否未初始化

  this.state = 0; // 0-loading pdf  1-loaded pdf  2-loading page  3-loaded page

  this.src = opts.src; // pdf 路径
  this.currentPage = 0; // 当前页
  this.totalPage = 0; // 总页数

  this.container = document.querySelector(this.container); // pdf 容器

  // pdf 展现模式：宽度固定与高度固定
  // 宽度固定时需要有初始宽度，pdf 的高度将会自适应
  // 高度固定时需要有初始高度，pdf 的宽度将会自适应
  var mode = ['widthFix', 'heightFix'];
  this.mode = mode.indexOf(opts.mode) === -1 ? 'widthFix' : opts.mode;
  this.containerSizeLimit = this.mode === 'widthFix' ? this.container.clientWidth : this.container.clienHeight;

  this.pdf; // pdf 文档信息
  this.zoom = false; // 当前是否为缩放状态
  this.scale = 1; // pdf 显示时的缩放值

  this.init();

  this.stateChanged = typeof opts.stateChanged === 'function' ? opts.stateChanged : void 0
  this.pageChanged = typeof opts.pageChanged === 'function' ? opts.pageChanged : void 0



}

PdfReader.prototype = {
  constructor: PdfReader,

  init: function () {

  },

  readPdf: function () {
    var self = this;
    
    // TODO create a canvas element and put into container


    PDFJS.getDocument(self.src).then(function(data) {
      self.pdf = data;
      self.currentPage = 1;
      self.totalPage = pdf.numPages;
      self.changeState(1); // pdf 读取完成
      self.renderPage();
      self.pageChange();
      self.pageChange();
    });
  },

  // 渲染单页 pdf
  renderPage: function () {
    var self = this;
    self.changeState(2); // 开始读取 pdf 单页
    self.pdf.getPage(self.currentPage).then(function (page) {
      var viewport = page.getViewport(!this.init ? 1 : this.zoom ? this.scale : 1)

      if (!this.zoom) {
        this.setScale(viewport)
        viewport = page.getViewport(scale)
      }

      canvas.width = viewport.width
      canvas.height = viewport.height
      if (!this.init) {
        this.init = true
        this.container.style.height = viewport.height + 'px';
      }

      page.render({
        canvasContext: ctx,
        viewport: viewport
      })
      self.changeState(3); // pdf 单页读取完成
    })
  }

  setScale: function (view) {

  },

  // 翻页
  pageChange: function () {

  },

  // 缩放
  pageZoom: function () {

  },

  // 改变状态
  changeState: function (state) {
    this.state = state;
    this.stateChanged && this.stateChanged(state)
  }


}