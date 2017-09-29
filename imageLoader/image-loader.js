class ImageLoader {
  // 构造器
  // className string
  // success function
  // fail function
  constructor (opts) {
    opts = opts ?  opts : {}
    this.className = opts.className || '.image-loader'
    this.success = opts.success && typeof opts.success === 'function' ? opts.success : (src) => {
      console.log('success - image: [' + src + ']')
    }
    this.fail = opts.fail && typeof opts.fail === 'function' ? opts.fail : (src) => {
      console.log('fail - image: [' + src + ']')
    }
    this.imagesArray = []
    this.walk()
  }

  // 获取当前所有添加了 className 的 image 标签
  walk () {
    const images = document.querySelectorAll(this.className)
    console.log(images)
    Array.from(images).forEach(item => {
      if (this._getState(item)) return
      this.imagesArray.push(item)
    })
  }







  _setState (image, value) {
    // 0-fail 1-success
    image.setAttribute('data-state', value)
    if (value === 1) this.success(image.src)
    if (value === 2) this.fail(image.src)
  }

  _getState (image) {
    return image.dataset.state
  }
}