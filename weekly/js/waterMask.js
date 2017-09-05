/**
 *  图片添加水印方法
 *	@param maskImage {String} required 水印图片 src
 *	@param position {Object} optional 水印添加位置 {horizontal: left | center<default> | right, vertical: top | middle<default> | bottom}, 默认水平垂直居中
 *	@param scale {Float} optional 水印与图片的宽的比值，范围(0, 1]，默认 0.1
 *	@param margin {Int} optional 在非水平垂直居中的情况下，水印与图片边缘的距离，默认 10px
 */

 class Watermask {
 	constructor (opts) {
 		// 当前工作状态
 		// 0-prepare 准备中，水印图片未加载完成
 		// 1-prepareFinish 准备完成，水印图片加载完成，但是还没有需要添加水印的图片
 		// 2-pending 正在为图片添加水印
 		// 3-complete 当前所有图片添加水印完成
 		this.status = {
 			code: undefined,
 			listener: (status) => console.log(status)
 		}
 		this._watchStatusChange()
 		this.status.code = 0

 		// 目标图片缓存池 [{index, sourceImage, outputImage, status}]
 		this.pool = []
 		// 目标图片索引
 		this.currentIndex = 0
 		// 已完成的数量
 		this.completeCounter = 0

 		// 水印边距
 		this.margin = opts.margin || opts.margin == 0 ? opts.margin : 10

 		// 水印位置
 		this.position = opts.position ? opts.position : {}
 		// 校验 postion 的值，如果不正确，则使用默认值
 		this.position.horizontal = this.position.horizontal ? (
 				['left', 'center', 'right'].indexOf(this.position.horizontal) > -1 ? this.position.horizontal : 'center'
 			) : 'center'
 		this.position.vertical = this.position.vertical ? (
 				['top', 'middle', 'bottom'].indexOf(this.position.vertical) > -1 ? this.position.vertical : 'middle'
 			) : 'middle'

 		// 水印与图片的比例
 		// 校验比值是否在范围内，不在范围内或未设置则使用默认值
 		this.scale = opts.scale && opts.scale > 0 && opts.scale <= 1 ? opts.scale : 0.1

 		// 水印图片
 		if (typeof opts.maskImage != 'string') {
 			throw new Errow ('property maskImage must be a String or an Image object')
 		} else {
 			// maskImage 为字符串时，加载该图片
 			let tempImage = new Image()
 			tempImage.onload = () => {
 				this.maskImage = tempImage
 				// 水印图片加载完成，准备完毕
 				this.status.code = 1
 				// 如果缓存池中存在图片则开始添加水印
 				if (this.pool.length) this._loopImagePool()
 			}
 			tempImage.onerror = () => {
 				throw new Errow ('mask image load error')
 			}
 			tempImage.src = opts.maskImage
 		}
 	}

 	/** 
 	 *  设置需要添加水印的图片，重复调用此方法，新的图片将会在原有图片之后
 	 *  @param sourceImageArray {Array<String>} required 需要添加水印的图片 src 列表
 	 */
 	setSourceImage (sourceImageArray) {
 		if (typeof sourceImageArray != 'array') throw new Error ('sourceImageArray must be an Array')
 		// 将目标图片存入缓存池
 		// 如果不是字符串将会在输出图片时输出错误
 		sourceImageArray.forEach( (item) => {
 			let hasError = ''
 			if (typeof item != 'string') {
 				hasError = 'source image must be a string: '+item
 				this.completeCounter += 1
 			}
 			this.pool.push({
	 			index: this.currentIndex,
	 			sourceImage: item,
	 			outputImage: null,
	 			error: typeError
	 		})
	 		this.currentIndex += 1
 		} )
 		// 水印图片未准备好，则等准备好后再执行
 		if (!this.status.code) return
 		else this._loopImagePool()
 	}

 	/** 
 	 *	获取添加完水印的图片
 	 *	由于添加水印的过程为异步，请在 status 变为 4 时调用
 	 *	@return outputImageArray {Array<Image>} 添加完水印的图片列表，顺序与输入的图片顺序相同
 	 */
 	getWatermaskImage () {
 		if (this.status.code != 4) return
 		const outputImageArray = this.pool.map( (item) => {
 			if (!item.error) return item.outputImage
 			else return new Error (item.error)
 		} )
 		this.pool = [] // 取出图片后清空缓存池
 		this.completeCounter = 0 // 清空已完成计数
 		this.status.code = 1 // 将状态改为 1 已准备好但还没有待添加水印图片
 		return outputImageArray
 	}

 	/**
 	 *  监听当前运行状态，当发生改变时调用用户自定义方法
 	 *	@param listener {Function} 监听器方法，有参数 status 表示当前状态
 	 */
 	// 0-prepare 准备中，水印图片未加载完成
 		// 1-prepareFinish 准备完成，水印图片加载完成，但是还没有需要添加水印的图片
 		// 2-pending 正在为图片添加水印
 		// 3-complete 当前所有图片添加水印完成
 	setStatusListener (listener) {
 		this.status.listener = listener && typeof listener == 'function' ? listener : void 0
 	}



 	/*********************************************************************************/
 	/********************************* 私有方法分割线 ***********************************/
 	/*********************************************************************************/

 	/**
 	 *	状态监测，状态改变时主动调用 listener
 	 */
 	_watchStatusChange () {
 		const self = this
 		Object.defineProperty(self.status, 'code', {
		    enumerable: true,
		    configurable: true,
		    get: function () {
		        return this.value
		    },
		    set: function (newVal) {
		        if (this.value !== newVal) {
		        	this.value = newVal
		        	self.status.listener(newVal)
		        }
		    }
		})
 	}

 	/**
 	 *	遍历缓存池中的项目
 	 */
 	_loopImagePool () {
 		// 遍历之前检查已完成计数与缓存池内项目数量是否相同，相同说明所有图片已完成添加水印
 		if (this.pool.length && this.completeCounter == this.pool.length) this.status.code = 4

 		for (let i = 0; i < this.pool.length; i ++) {
 			const item = this.pool[i]
 			// 如果当前缓存池中的这个项目存在错误或者已经有输出图像，则忽略
 			if (item.error || item.outputImage) continue
 			// 当前项目无错误也没有输出图像，则开始准备添加水印
 			else this._beforeAddWatermask(i, item)
 		}
 	}

 	/**
 	 *	向图片上添加水印之前的操作，加载图片，如果加载出错则标记错误
 	 *	@param i {Int} 当前缓存池中的项目索引
 	 *	@param item {Object} 当前缓存池中的项目
 	 */
 	_beforeAddWatermask (i, item) {
 		const index = item.index
 		const tempImage = new Image()
 		tempImage.onload = () => {
 			this.status.code = 3
 			this._addWatermask(i, tempImage)
 		}
 		tempImage.onerror = () => {
 			this.completeCounter += 1
 			this.pool[i].error = 'load image error: '+ item.sourceImage
 		}
 		tempImage.src = item.sourceImage
 	}

 	/**
 	 *	添加水印
 	 *	@param i {Int} 当前缓存池中的项目索引
 	 *	@param image {Image} 当前要添加水印的图片对象
 	 */
 	 _addWatermask (i, image) {
 	 	const canvas = document.createElement('canvas')
 	 	const ctx = canvas.getContext('2d')
 	 	const completedImage = new Image()

 	 	completedImage.onload = () => {
 	 		this.completeCounter += 1
 	 		this.pool[i].outputImage = completedImage
 	 	}
 	 	completedImage.onerror = () => {
 	 		this.completeCounter += 1
 			this.pool[i].error = 'load watermask image error: '+ this.pool[i].sourceImage
 	 	}

 	 	// 在 canvas 上绘制原图
 	 	canvas.width = image.width
 	 	canvas.height = image.height
 	 	ctx.drawImage(image, 0, 0, image.width, image.height)
 	 	// 在 canvas 上绘制水印
 	 	this._drawWatermaskOncanvasContext(ctx, this.maskImage, image)

 	 	newImage.src = canvas.toDataURL("image/png")
 	 }

 	 /**
 	  * 绘制水印
 	  * @param ctx {Object} 当前需要绘制水印的 canvas 上下文
 	  * @param mask {Image} 水印图片对象
 	  * @param image {Image} 添加水印的图片对象
 	  */
 	 _drawWatermaskOncanvasContext (ctx, mask, image) {
 	 	// 计算绘制水印的尺寸
 	 	const tempWidth = mask.width
 	 	mask.width = image.width * this.scale
 	 	mask.height = mask.width / tempWidth * mask.height

 	 	// 计算绘制水印的位置
 	 	let positionX, positionY
 	 	// 水平方向
 	 	switch (this.position.horizontal) {
 	 		case 'left':
 	 			positionX = this.margin
 	 			break
 	 		case 'right':
 	 			positionX = image.width - mask.width - this.margin
 	 			break
 	 		case 'center':
 	 			positionX = (image.width - mask.width) / 2
 	 	}
 	 	// 垂直方向
 	 	switch (this.position.vertical) {
 	 		case 'top':
 	 			positionY = this.margin
 	 			break
 	 		case 'bottom':
 	 			positionY = image.height - mask.height - this.margin
 	 			break
 	 		case 'middle':
 	 			positionY = (image.height - mask.height) / 2
 	 	}
 	 	ctx.drawImage(mask, positionX, positionY, mask.width, mask.height)
 	 }
}

