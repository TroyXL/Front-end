// imagesSrc extraImageSrc size direction imagesMargin extraMargin padding complete
class ImagesJointer {
  constructor (opts) {
    this.images = { length: 0 }
    this.extraImage
    this.size = opts.size || 300
    this.direction = ['vertical', 'horizontal'].indexOf(opts.direction) === -1 ? 'vertical' : opts.direction
    this.imagesMargin = opts.imagesMargin || 5
    this.extraMargin = opts.extraMargin || 100
    this.padding = opts.padding || 5
    this.paddingHead = opts.paddingHead || this.padding
    this.paddingFoot = opts.paddingFoot || this.padding
    this.backgroundColor = opts.backgroundColor || '#ffffff'
    this.complete = typeof opts.complete === 'function' ? opts.complete : void 0

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    if (opts.extraImageSrc) {
      this.parseImages(opts.imagesSrc.concat(opts.extraImageSrc), true)
    } else {
      this.parseImages(opts.imagesSrc)
    }
  }

  parseImages (images, hasExtraImage) {
    if (!(images instanceof Array)) images = [ images ]

    let promises = []

    for (let i = 0; i < images.length; i++) {
      promises.push(this.risizeImage(images[i], i, (i === images.length - 1) && hasExtraImage ? true : false))
    }

    Promise.all(promises).then(() => {
      this.renderImages()
    })
  }

  risizeImage (imageSrc, index, extra) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.onload = () => {
        if (!extra) this.images.length++
        
        if (this.direction === 'vertical') {
          image.height = parseInt(image.height / image.width * this.size)
          image.width = this.size
        } else {
          image.width = parseInt(image.width / image.height * this.size)
          image.height = this.size
        }

        extra ? this.extraImage = image : this.images[index] = image
        resolve && resolve()
      }
      image.error = () => {
        console.error(`图片 ${this.images[i]} 加载失败`)
        resolve && resolve()
      }
      image.src = imageSrc
    })
  }

  renderImages () {
    this.initCanvas()
    this.drawImages()
  }

  initCanvas () {
    if (this.direction === 'vertical') {
      this.canvas.width = this.size + this.padding * 2
      this.canvas.height = this.computeImagesTotalLength('height') + this.paddingHead + this.paddingFoot
    } else {
      this.canvas.height = this.size + this.padding * 2
      this.canvas.width = this.computeImagesTotalLength('width') + this.paddingHead + this.paddingFoot
    }

    this.ctx.beginPath()
    
    
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.closePath()
  }

  computeImagesTotalLength (side) {
    let totalLength = 0

    for (let i = 0; i < this.images.length; i++) {
      totalLength += this.images[i][side]
      totalLength += i === this.images[i][side] - 1 ? 0 : this.imagesMargin
    }
    if (this.extraImage) totalLength = totalLength + this.extraMargin + this.extraImage[side]
    return totalLength
  }

  drawImages () {
    let currentLength = 0
    if (this.direction === 'vertical') {
      for (let i = 0; i < this.images.length; i++) {
        let image = this.images[i]
        this.ctx.drawImage(image, this.padding, i * this.imagesMargin + this.paddingHead + currentLength, image.width, image.height)
        currentLength += image.height
      }
      this.ctx.drawImage(this.extraImage, this.padding, this.canvas.height - this.paddingFoot - this.extraImage.height, this.extraImage.width, this.extraImage.height)
    } else {
      for (let i = 0; i < this.images.length; i++) {
        let image = this.images[i]
        this.ctx.drawImage(image, i * this.imagesMargin + this.paddingHead + currentLength, this.padding, image.width, image.height)
        currentLength += image.width
      }
      this.ctx.drawImage(this.extraImage, this.canvas.width - this.paddingFoot - this.extraImage.width, this.padding, this.extraImage.width, this.extraImage.height)
    }
    this.complete ? this.complete(this.canvas) : this.showComplete()
  }

  showComplete () {
    document.querySelector('body').appendChild(this.canvas)
  }
}