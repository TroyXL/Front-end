/*
 * 图片横向瀑布流布局 最大限度保证每张图片完整显示 可以获取最后计算出来的图片布局宽高信息 最后的瀑布流效果需要配合 css 实现（作者通过浮动布局实现）当然你也可以对代码进行修改 让其能够直接返回一段已经布局完成的 html 结构
 * 需要先提供每张图片的宽高 如果没有图片的宽高数据 则可以在代码中添加处理方法从而获取到图片宽高数据后再布局 但是并不推荐这样做
 * 尽量保证图片总数能被单行显示的数量整除 避免最后一行单张显示 否则会影响美观
 * 每张图由于宽高取整返回的宽高存在0-2px的误差 可以通过 css 保证视觉效果
 */

/*
 * @param images {Object} 图片对象列表，每一个对象有 src width height 三个属性
 * @param containerWidth {Integer} 容器宽度
 * @param numberInLine {Integer} 单行显示图片数量
 * @param limit {Integer} 限制需要进行布局的图片的数量 如果传入的图片列表有100张 但只需要对前20张进行布局 后面的图片忽略 则可以使用此参数限制 如果不传则默认0（不限制）
 * @param stdRatio {Float} 图片标准宽高比
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
    // 图片撑满整行时的标准高度
    this.stdHeight = this.containerWidth / this.stdRatio

    this.chunkAndLayout()
  }

  // 将图片列表根据单行数量分块并开始计算布局
  chunkAndLayout () {
    // 当图片只有一张时，完整显示这张图片
    if (this.images.length === 1) {
      this.layoutFullImage(this.images[0])
      return
    }
    let temp = []
    for (let i = 0; i < this.images.length; i++) {
      if (this.limit && i >= this.limit) return
      temp.push(this.images[i])

      // 当单行图片数量达到限制数量时
      // 当已经是最后一张图片时
      // 当已经达到需要布局的最大数量时
      if (i % this.numberInLine === this.numberInLine - 1 || i === this.images.length - 1 || i === this.limit - 1) {
        this.computedImagesLayout(temp)
        temp = []
      }
    }
  }

  // 完整显示图片
  layoutFullImage (image) {
    let ratio = image.width / image.height
    image.width = this.containerWidth
    image.height = parseInt(this.containerWidth / ratio)
    this.completedImages.push(image)
  }

  // 根据分块计算图片布局信息
  computedImagesLayout(images) {
    if (images.length === 1) {
      // 当前分组只有一张图片时
      this.layoutWithSingleImage(images[0])
    } else {
      // 当前分组有多张图片时
      this.layoutWithMultipleImages(images)
    }
  }

  
  // 分组中只有一张图片 该张图片会单独占满整行的布局 如果图片高度过大则以标准宽高比为标准 其余部分剪裁 否则完整显示
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

  // 分组中有多张图片时的布局
  layoutWithMultipleImages(images) {

    // 以相对图宽为标准，根据每张图的相对宽度计算占据容器的宽度

    let widths = [] // 保存每张图的相对宽度
    let ratios = [] // 保存每张图的宽高比
    images.forEach(item => {
      // 计算每张图的宽高比
      let ratio = item.width / item.height
      // 根据标准高度计算相对图宽
      let relateWidth = this.stdHeight * ratio
      widths.push(relateWidth)
      ratios.push(ratio)
    })

    // 计算每张图片相对宽度的总和
    let totalWidth = widths.reduce((sum, item) => sum + item, 0)

    let lineHeight = 0 // 行高
    let leftWidth = this.containerWidth // 容器剩余宽度 还未开始布局时的剩余宽度等于容器宽度

    images.forEach((item, i) => {
      if (i === 0) {
        // 第一张图片
        // 通过图片相对宽度与相对总宽度的比值计算出在容器中占据的宽度与高度
        item.width = parseInt(this.containerWidth * (widths[i] / totalWidth))
        item.height = lineHeight = parseInt(item.width / ratios[i])
        // 第一张图片布局后的剩余容器宽度
        leftWidth = leftWidth - item.width
      } else if (i === images.length - 1) {
        // 最后一张图片
        // 宽度为剩余容器宽度
        item.width = leftWidth
        item.height = lineHeight
      } else {
        // 中间图片
        // 以行高为标准 计算出图片在容器中的宽度
        item.height = lineHeight
        item.width = parseInt(item.height * ratios[i])
        // 图片布局后剩余的容器宽度
        leftWidth = leftWidth - item.width
      }
      this.completedImages.push(item)
    })
  }
}