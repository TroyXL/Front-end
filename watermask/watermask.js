/**
 *  图片添加水印方法
 *
 *	使用方法
 *	1. 创建 Watermask 实例
 *	2. 通过 setStatusListener() 方法监听实例的当前状态：当状态为 1 时，可以添加需要绘制水印的素材图片路径；当状态为 3 时，可以获取已经绘制完成的图片 src (base64 格式)，同时实例状态变为 1
 *	3. 通过 setSourceImage() 方法添加素材图片，方法接受一个图片路径数组
 *	4. 通过 getWatermaskImage() 方法可以获取绘制完水印的图片对象数组，在绘制过程中如果发生错误，则该项为错误原因，而不是图片对象（程序不会抛出错误）
 *
 *	参数说明
 *	@param opts {Object} required 配置项参数对象，具体配置见下方配置项参数说明
 *
 *	配置项参数说明
 *	@param maskImage {String} required 水印图片 src
 *	@param position {Object} optional 水印添加位置 {horizontal: left | center<default> | right, vertical: top | middle<default> | bottom}, 默认水平垂直居中
 *	@param margin {Int} optional 在非水平垂直居中的情况下，水印与图片边缘的距离，默认 10px
 *	@param scale {Float} optional 水印与图片的宽的比值，范围(0, 1]，默认 0.1
 */

class Watermask {
 	constructor (opts) {
 		// 目标图片缓存池 [{sourceImage, outputImage, status}]
 		this.pool = []

 		// 当前工作状态
 		// 0-prepare 准备中，水印图片未加载完成
 		// 1-prepareFinish 准备完成，水印图片加载完成，但是还没有需要添加水印的图片
 		// 2-pending 正在为图片添加水印
 		// 3-complete 当前所有图片添加水印完成
 		this.status = {
 			code: 0,
 			completeCounter: 0,
 			listener: (status) => console.log(status)
 		}
 		this._watchStatusChange()

 		// 水印边距
 		this.margin = opts.margin || opts.margin == 0 ? opts.margin : 10

 		// 水印位置
 		this.position = opts.position ? opts.position : {}
 		// 校验 postion 的值，如果不正确，则使用默认值
 		this.position.horizontal = this.position.horizontal ? (
 			['left', 'center', 'right'].indexOf(this.position.horizontal) > -1 ? 
 				this.position.horizontal : 'center'
 			) : 'center'
 		this.position.vertical = this.position.vertical ? (
 			['top', 'middle', 'bottom'].indexOf(this.position.vertical) > -1 ? 
 				this.position.vertical : 'middle'
 			) : 'middle'

 		// 水印与图片的比例
 		// 校验比值是否在范围内，不在范围内或未设置则使用默认值
 		this.scale = opts.scale && opts.scale > 0 && opts.scale <= 1 ? opts.scale : 0.1

 		// 水印图片
 		if (typeof opts.maskImage != 'string') {
 			throw new Error ('property maskImage must be a src string')
 		} else {
 			// maskImage 为字符串时，加载该图片
 			let tempImage = new Image()
 			tempImage.onload = () => {
 				this.maskImage = tempImage
 				// 水印图片加载完成，准备完毕
 				this.status.code = 1
 				tempImage = null
 			}
 			tempImage.onerror = () => {
 				tempImage = null
 				throw new Error ('mask image load error')
 			}
 			tempImage.src = opts.maskImage
 		}
 	}

 	/** 
 	 *  设置需要添加水印的图片，重复调用此方法，新的图片将会在原有图片完成之后开始
 	 *	由于添加水印的过程为异步，请在 status = 1 时调用
 	 *  @param sourceImageArray {Array<String>} required 需要添加水印的图片 src 列表
 	 */
 	setSourceImage (sourceImageArray) {
 	 	if (this.status.code != 1) {
 	 		console.warn('now is waiting for complete, cannot add more images')
 	 		return
 	 	}
 	 	if (! (sourceImageArray instanceof Array)) throw new Error ('sourceImageArray must be an Array')
 		// 将目标图片存入缓存池
 		// 如果不是字符串将会在输出图片时输出错误
 		let errorCounter = 0 // 记录出错的项目数量
 		sourceImageArray.forEach( (item) => {
 			let errorMsg = ''
 			if (typeof item != 'string') {
 				errorMsg = 'source image must be a string: '+item
 				errorCounter += 1
 			}
 			this.pool.push({
 				sourceImage: item,
 				outputImage: null,
 				error: errorMsg
 			})
 		} )
 		// 遍历结束后，给完成计数赋值
 		this._increaseCompleteCounter(errorCounter)
 		// 水印图片未准备好，则等准备好后再执行
 		this._loopImagePool()
 	}

 	/** 
 	 *	获取添加完水印的图片
 	 *	由于添加水印的过程为异步，请在 status 变为 3 时调用
 	 *	@return outputImageArray {Array<Image>} 添加完水印的图片列表，顺序与输入的图片顺序相同
 	 */
 	getWatermaskImage () {
 	 	if (this.status.code != 3) return
 	 		const outputImageArray = this.pool.map( (item) => {
 	 			if (!item.error) return item.outputImage
 	 				else return new Error (item.error)
 	 			} )
 		this.pool = [] // 取出图片后清空缓存池
 		this.status.completeCounter = 0 // 清空已完成计数
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
 		// 如果在设置监听器之前，状态已经改变，则手动执行一次监听器方法
 		if (this.status.code==1) this.status.listener(this.status.code)
 	}

/**************************************警告***************************************/
/********************************* 以下为私有方法 **********************************/
/**********************************请勿调用及修改***********************************/

 	/**
 	 *	状态监测，状态改变时主动调用 listener
 	 */
 	_watchStatusChange () {
 	 	const self = this
 	 	Object.defineProperty(self.status, 'code', {
 	 		enumerable: true,
 	 		configurable: true,
 	 		get: function () {
 	 			return this.codeValue || 0
 	 		},
 	 		set: function (newVal) {
 	 			if (this.codeValue !== newVal) {
 	 				this.codeValue = newVal
 	 				self.status.listener(newVal)
 	 			}
 	 		}
 	 	})
 	 	Object.defineProperty(self.status, 'completeCounter', {
 	 		enumerable: true,
 	 		configurable: true,
 	 		get: function () {
 	 			return this.counterValue || 0
 	 		},
 	 		set: function (newVal) {
 	 			if (this.counterValue !== newVal) {
 	 				this.counterValue = newVal
 	 				self._checkComplete()
 	 			}
 	 		}
 	 	})
 	}

 	/**
 	 *	遍历缓存池中的项目
 	 */
 	_loopImagePool () {
 	 	this.status.code = 2
 	 	for (let i = 0; i < this.pool.length; i ++) {
 	 		const item = this.pool[i]
 	 		this._beforeAddWatermask(i, item)
 	 	}
 	 }

 	/**
 	 *	向图片上添加水印之前的操作，加载图片，如果加载出错则标记错误
 	 *	@param i {Int} 当前缓存池中的项目索引
 	 *	@param item {Object} 当前缓存池中的项目
 	 */
 	_beforeAddWatermask (i, item) {
 	 	let tempImage = new Image()
 		// 图片加载完成，开始添加水印
 		tempImage.onload = () => {
 			this._addWatermask(i, tempImage)
 			tempImage = null
 		}
 		// 图片加载出错，标记错误，并增加完成计数
 		tempImage.onerror = () => {
 			this.pool[i].error = 'load image error: '+ item.sourceImage
 			this._increaseCompleteCounter(1)
 			tempImage = null
 		}
 		tempImage.src = item.sourceImage
 	}

 	/**
 	 *	添加水印
 	 *	@param i {Int} 当前缓存池中的项目索引
 	 *	@param image {Image} 当前要添加水印的图片对象
 	 */
 	_addWatermask (i, image) {
 	 	// 创建 canvas 用来绘制图片和水印
 	 	let canvas = document.createElement('canvas')
 	 	let ctx = canvas.getContext('2d')
 	 	// 创建一个绘制完水印的图片承载容器
 	 	let completedImage = new Image()
 	 	completedImage.crossOrigin = "Anonymous" // 设置图片跨域
 	 	// 绘制完的图片加载完后，修改缓存池中的该项目输出图像属性，并增加完成计数
 	 	completedImage.onload = () => {
 	 		this.pool[i].outputImage = completedImage
 	 		this._increaseCompleteCounter(1)
 	 		completedImage = null
 	 		canvas = null
 	 		ctx = null
 	 	}
 	 	// 绘制完的图片加载失败，记录失败原因，并增加完成计数
 	 	completedImage.onerror = () => {
 	 		this.pool[i].error = 'load watermask image error: '+ this.pool[i].sourceImage
 	 		this._increaseCompleteCounter(1)
 	 		completedImage = null
 	 		canvas = null
 	 		ctx = null
 	 	}

 	 	// 在 canvas 上绘制原图
 	 	canvas.width = image.width
 	 	canvas.height = image.height
 	 	ctx.drawImage(image, 0, 0, image.width, image.height)
 	 	// 在 canvas 上绘制水印
 	 	this._drawWatermaskOncanvasContext(ctx, this.maskImage, image)
 	 	// 从canvas上将绘制完水印的图片转为 base64 并赋值给图片容器的 src
 	 	completedImage.src = canvas.toDataURL("image/png")
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

	/**
 	 * 增加完成计数
 	 * @param count {Int} 需要增加的计数
 	 */
 	_increaseCompleteCounter (count) {
 	 	this.status.completeCounter = this.status.completeCounter + count
 	}

	/**
 	 * 校验当前缓存池中的图片是否已经全部添加水印
 	 * @param count {Int} 需要增加的计数
 	 */
 	_checkComplete () {
 	 	if (this.pool.length) {
 	 		// 缓存池中存在项目，且已完成计数与缓存池项目数相同时，添加水印全部完成
 	 		if (this.status.completeCounter == this.pool.length) this.status.code = 3
 	 	} else { 
 	 		// 当缓存池被清空，完成计数变为 0 时，更改 code = 1
 	 		this.status.code = 1
 	 	}
 	}
}