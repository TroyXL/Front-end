/*
 * 图片横向瀑布流布局 最大限度保证每张图片完整显示
 * 需要先提供每张图片的宽高 仅返回最后计算出来的图片宽高
 * 尽量保证图片总数能被单行显示的数量整除 避免最后一行单张显示 否则会影响美观
 * 每张图由于宽高取整返回的宽高存在0-2px的误差，可以通过 css 保证视觉效果
 */

class ImagesLayout {
  constructor(images, containerWidth, numberInLine = 10, limit = 0, stdRatio = 1.5) {
    // 图片列表
    this.images = images
    // 布局完毕的图片列表
    this.completedImages = []
    // 容器宽度
    this.containerWidth = containerWidth
    // 单行显示的图片数量
    this.numberInLine = numberInLine
    // 限制布局的数量 如果传入的图片列表有100张 但只需要对前20张进行布局 后面的图片忽略 则可以使用此参数限制 如果不传则默认0（不限制）
    this.limit = limit
    // 图片标准宽高比（当最后一行只剩一张图片时 为了不让布局看上去很奇怪 所以要有一个标准宽高比 当图片实际宽高比大于标准宽高比时会发生截取 小于时按照实际高度占满整行显示）
    this.stdRatio = stdRatio
    // 图片标准高度
    this.stdHeight = this.containerWidth / this.stdRatio

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
      image.height = parseInt(this.stdHeight)
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
      let relateWidth = this.stdHeight * ratio
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