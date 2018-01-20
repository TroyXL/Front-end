class ImagesLayout {
  constructor(images, limit = 0, containerWidth, numberInLine = 2, stdRatio = 1.5) {
    // 图片列表
    this.images = images
    // 布局完毕的图片列表
    this.completedImages = []
    // 容器宽度
    this.containerWidth = containerWidth
    // 单行显示的图片数量
    this.numberInLine = numberInLine
    // 限制布局的数量
    this.limit = limit
    // 图片标准宽高比
    this.stdRatio = stdRatio
    // 图片标准高度
    this.stdHeight = parseInt(this.containerWidth / this.stdRatio)

    this.chunkAndLayout()
  }

  // 将图片列表分块并开始计算布局
  chunkAndLayout () {
    if (this.images.length === 1) {
      this.layoutFullImage(this.images[0])
      return
    }
    let temp = []
    for (let i = 0; i < this.images.length; i++) {
      if (this.limit && i >= this.limit) return
      temp.push(this.images[i])
      if (i % this.numberInLine === this.numberInLine - 1 || i === this.images.length - 1 || i === this.limit - 1) {
        this.computedImagesLayout(temp)
        temp = []
      }
    }
  }

  // 根据分块计算图片布局信息
  computedImagesLayout(images) {
    if (images.length === 1) {
      this.layoutWithSingleImage(images[0])
    } else {
      this.layoutWithMultipleImages(images)
    }
  }

  // 显示完整图片的布局
  layoutFullImage (image) {
    let ratio = image.width / image.height
    image.width = this.containerWidth
    image.height = parseInt(this.containerWidth / ratio)
    this.completedImages.push(image)
  }

  layoutWithSingleImage (image) {
    let ratio = image.width / image.height
    image.width = this.containerWidth
    // 如果是长图，则布局时按照标准宽高比显示中间部分
    if (ratio < this.stdRatio) {
      image.height = this.stdHeight
    } else {
      image.height = parseInt(this.containerWidth / ratio)
    }
    this.completedImages.push(image)
  }

  layoutWithMultipleImages(images) {
    // 以相对图宽为标准，根据每张图的相对宽度计算比值
    // 保存每张图的宽度
    let widths = []
    let ratios = []
    images.forEach(item => {
      // 计算每张图的宽高比
      let ratio = item.width / item.height
      // 根据标准高度计算相对图宽
      let relateWidth = parseInt(this.stdHeight * ratio)
      widths.push(relateWidth)
      ratios.push(ratio)
    })

    let totalWidth = widths.reduce((sum, item) => sum + item, 0)
    let imageHeight = 0
    let leftWidth = 0
    images.forEach((item, i) => {
      if (i === 0) { // 第一张图片
        item.width = parseInt(this.containerWidth * (widths[i] / totalWidth))
        item.height = imageHeight = parseInt(item.width / ratios[i])
        leftWidth = this.containerWidth - item.width
      } else if (i === images.length - 1) { // 最后一张图片
        item.width = leftWidth
        item.height = imageHeight
      } else { // 中间图片
        item.height = imageHeight
        item.width = parseInt(item.height * ratios[i])
        leftWidth = leftWidth - item.width
      }
      this.completedImages.push(item)
    })
  }
}

module.exports = ImagesLayout