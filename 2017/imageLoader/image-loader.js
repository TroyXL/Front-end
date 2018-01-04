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
  }

  // 开始监听
  listen () {
    let images = document.querySelectorAll(this.className)
    let tempImages = []
    Array.from(images).forEach(item => {
      this.imagesArray.push({
        src: item.src,
        state: -1 // -1-loading 0-fail 1-success
      })
      tempImages.push(item)
    })
    for (let i = 0; i < tempImages.length; i++) {
      this._watchState(tempImages[i])
    }
    tempImages = null
    images = null
  }


  // 监听图片加载状态
  _watchState (image) {
    image.onload = () => {
      this._setState(image, 1)
    }
    image.onerror = () => {
      this._setState(image, 0)
    }
    image.onabort = () => {
      this._setState(image, 0)
    }
  }

  // 设置图片加载状态
  _setState (image, isSuccess) {
    for (let i = 0; i < this.imagesArray.length; i++) {
      // 当有多张同样的图片时，保证每次改变状态只改变一个
      if (this.imagesArray[i].src === image.src && this.imagesArray[i].state === -1) {
        this.imagesArray[i].state = isSuccess
        isSuccess ? this.success(this.imagesArray[i].src) : this.fail(this.imagesArray[i].src)
        return
      }
    }
  }
}