/*
 * @功能说明：图片上传
 * @兼容性：IE10 以下不支持客户端压缩、预览，上传成功过后可以预览
 * @author：徐亮 l.xu2@htd.cn
 * @time: 2017-12-26
 */

/*
 ************
 * Params ***
 ************
 *
 * @param url {String} required 上传的地址
 * @param imagePicker {String} required 页面上用来放置 input 元素的节点选择器字符串
 * @param thumbnailsBox {String} required 页面上用来放置缩略图的节点选择器字符串
 * @param multiple {Boolean} optional 是否支持多选，，默认不支持，ie10下不支持多选
 * @param accept {String} optional 接受的图片的格式类型字符串，默认所有种类图片
 * @param imageMaxSize {Number} optional 上传图片的最大 size，默认 5Mb
 * @param maxWidth {Int} optional 图片压缩的最大宽度，默认 600px
 * @param maxHeight {Int} optional 图片压缩的最大高度，默认 600px
 * @param imageQuality {Float} optional 图片的压缩质量，范围 (0, 1]，默认 0.1
 * @param params {Array<Object>} optional 上传图片需要携带的参数数组，格式为 [{name, value}]，name为参数名，value为参数值，无默认
 * @param repickEl {String} optional 针对某张图片重新选择的按钮节点选择器字符串，无默认
 * @param deleteEl {String} optional 删除某张图片的按钮节点选择器字符串，无默认
 * @param isAliCloud {Boolean} optional 是否上传到阿里云服务器，如果是，在不支持的浏览器上，上传成功后将会通过阿里云参数压缩获取压缩后的图片进行展示，默认 true
 * @param aliResizeSize {Int} optional 阿里云图片url压缩尺寸，默认 180
 *
 */

/*
 ****************
 * Properties ***
 ****************
 *
 * @property o {Object} 当前上传对象配置
 * @property imageIndex {Int} 最后一张图片的索引
 * @property imagesLength {Int} 当前图片数量
 * @property repickIndex {Int} 重传图片索引
 * @property thumbTagClass {String} 当前上传对象的缩略图类名选择器字符串
 * @property $input {Object} 当前上传按钮的 jQuery 对象
 * @property $inputBox {Object} 当前上传按钮父级（配置中的 imagePicker）的 jQuery 对象
 * @property $thumbnailsBox {Object} 放置缩略图的容器（配置中的 thumbnailsBox）的 jQuery 对象
 * @property aliCloudResizeString {String} 阿里云图片url压缩参数字符串
 *   
 */

/*
 **********************
 * Instance methods ***
 **********************
 *
 * @method setThumbnail 设置缩略图样式。只能重写该方法，需要返回一个 jQuery 对象作为缩略图节点
 * @method setCurrentImages 设置已经存在的图片。不支持重写，图片数量不受限制，参数为 图片地址数组{Array <String>}
 * @method uploadProgress 设置上传进度条显示。只能重写该方法，接受两个参数：当前缩略图节点{Object<jQuery>} 与 进度{Int}
 * @method uploadSuccess 设置上传成功样式。只能重写该方法，接受两个参数：当前缩略图节点{Object<jQuery>} 与 上传成功返回的数据{Object}
 * @method uploadFail 设置上传失败样式。只能重写该方法，接受两个参数：当前缩略图节点{Object<jQuery>} 与 上传失败返回的数据/失败原因{Object}
 * @method uploadComplete 上传结束回调。只能重写该方法，不论成功失败都会调用，接受一个参数：当前缩略图节点{Object<jQuery>}
 * @method showSuccessImageOnUnsupportBrower 在不支持的浏览器上显示上传成功后的图片。只能重写该方法，如果重写 uploadSuccess 需要在重写方法中调用该方法，参数随意能显示就行
 * @method extend 扩展 Uploader 实例方法。不支持重写，接受三个参数：方法名{String} 方法执行函数{Function} 与 是否立即执行{Boolean}
 * @method upload 配置完 upload 对象后必须调用该方法激活上传
 * @method getImagesUrl 获取当前 uploader 对象的所有上传成功的图片地址数组。不支持重写，返回数组包括使用 setCurrentImages 显示的图片地址
 *
 */

/*
 *******************
 * Class methods ***
 *******************
 *
 * @method rigister 扩展 Uploader 实例方法。不支持重写，接受三个参数：方法名{String} 方法执行函数{Function} 与 Uploader实例化时是否立即执行{Boolean}
 * @method setSupportIeVersion 设置 Uploader 支持的 IE 最低版本。不支持重写，接受一个参数：版本号{Int}。默认 10（IE10）
 *
 */

(function () {
  var needSupport = checkBrowerDelowIE(10);
  var thumbIdPrefix = 'IMG-UPLOAD-';

  var Uploader = function (opts) {
    // configs
    this.o = $.extend({
      url: '/', // 上传地址 required
      imagePicker: '', // 图片选择器 required
      thumbnailsBox: '', // 存放缩略图的容器 required
      multiple: false, // 是否多选
      accept: 'image/*', // 图片格式
      countLimit: 9, // 最大张数
      imageMaxSize: 5, // 图片最大 5M
      maxWidth: 600,
      maxHeight: 600,
      imageQuality: 0.1, // (0, 1]
      params: [],

      repickEl: '', // 针对某张图片重新选择图片的按钮元素 如果本身支持多选 重选图片将只会对第一张进行处理
      deleteEl: '', // 删除按钮

      isAliCloud: true, // 是否上传到阿里云
      aliResizeSize: 180
    }, opts);
    
    this.imageIndex = 0; // 图片索引
    this.imagesLength = 0; // 当前图片数量
    this.repickIndex = -1; // 重传图片索引
    this.thumbTagClass = '.' + (this.o.thumbnailsBox + '-item').substring(1).toUpperCase(); // 缩略图类名

    // filePicker
    this.$input;
    // filePicker box
    this.$inputBox = $(this.o.imagePicker).attr('data-input', 'INPUT-' + Math.random().toString(32).substring(2).toUpperCase());
    if (this.$inputBox) this.$input = createFilePicker(this.$inputBox, this.o.multiple, this.o.accept);
    // thumbnail box
    this.$thumbnailsBox = $(this.o.thumbnailsBox);
    // 阿里云服务器获取图片压缩参数
    this.aliCloudResizeString = '?x-oss-process=image/resize,w_' + this.o.aliResizeSize + ',h_' + this.o.aliResizeSize + ',m_pad';

    // 设置缩略图样式
    // 该方法需要返回一个 $ 对象作为缩略图
    this.setThumbnail = function () {
      return $(
        '<div class="img-box">' +
          '<img>' +
          '<span class="process"></span>' +
          '<a href="javascript:;" class="delete js-delete"></a>' +
          '<a href="javascript:;" class="repick js-repick">重传</a>' +
        '</div>'
      );
    }

    // 设置现有的图片
    this.setCurrentImages = function (imagesArr) {
      var index = 0;
      for (var i = 0; i < imagesArr.length; i ++) {
        if(!imagesArr[i]) continue;
        this._showPreviewImage(imagesArr[i], imagesArr[i], this.imageIndex);
        this.imageIndex++;
        this.imagesLength++;
      }
      this._toggleInput();
    }

    this.uploadProgress = function ($el, progress) {
      $el.find('.process').css('width', progress + '%');
    }

    this.uploadSuccess = function ($el, data) {
      $el.attr('upload-success', '')
        .attr('data-src', data.url)
        .find('.process')
        .addClass('success')
        .text('上传成功');
      this.showSuccessImageOnUnsupportBrower();
    }

    this.uploadFail = function ($el, data) {
      $el.attr('upload-fail', '')
        .find('.process')
        .addClass('fail')
        .text('上传失败');
    }

    this.uploadComplete = function ($el) {}

    // 上传成功后，在不支持显示缩略图的浏览器上显示上传的图片
    this.showSuccessImageOnUnsupportBrower = function ($el, imageUrl) {
      if (!needSupport) {
        $el.find('img').attr('src', imageUrl + this.o.isAliCloud ? this.aliCloudResizeString : '');
      }
    }

    this.extend = function (fnName, func, immediately) {
      if (duplicateMethodName(fnName, this)) return;
      this[fnName] = func;
      if (immediately) func.call(this)
    }
  }

  Uploader.prototype = {
    constructor: Uploader,

    upload: function () {
      var self = this;
      self._watchInputChange(function (img, id) {
        self._showPreviewImage('', img, id)
      })

      self._deleteImage();
      self._repickImage();
      self._activeExtends();
    },

    // 获取所有上传成功的图片地址
    getImagesUrl: function () {
      var urls = [];
      var $thumbs = $(this.o.thumbnailsBox + ' [upload-success]');
      for (var i = 0; i < $thumbs.length; i++) {
        urls.push($($thumbs[i]).attr('data-src'));
      }
      return urls;
    },

    // 展示缩略图
    _showPreviewImage: function (imageUrl, imageSrc, id) {
      // 缩略图标识 class
      var $box = this.setThumbnail();
      $box
        .addClass(this.thumbTagClass.substring(1))
        .attr({
          'data-src': imageUrl,
          'id': thumbIdPrefix + id
        })
        .find('img')
        .attr('src', imageSrc);
      if (imageUrl) $box.attr('upload-success', '');
      if (this.repickIndex == -1) {
        this.$thumbnailsBox.append($box);
      } else {
        $(this.thumbTagClass).eq(this.repickIndex).after($box).remove();
        this.repickIndex = -1;
      }
    },

    // 删除图片
    _deleteImage: function () {
      if (!this.o.deleteEl) return;
      var self = this;
      $(document).on('click', self.thumbTagClass + ' ' + self.o.deleteEl, function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parents(self.thumbTagClass).remove();
        self.imagesLength--;
        self._toggleInput();
      });
    },

    // 重取图片
    _repickImage: function () {
      if (!this.o.repickEl) return;
      var self = this;
      $(document).on('click', self.thumbTagClass + ' ' + self.o.repickEl, function (e) {
        e.preventDefault();
        e.stopPropagation();
        self.imagesLength--;
        self.repickIndex = $(this).parents(self.thumbTagClass).index();
        self.$input.click();
      });
    },

    //  input 的隐藏与显示
    _toggleInput: function () {
      if (this.imagesLength >= this.o.countLimit) this.$inputBox.hide();
      else this.$inputBox.show();
    },

    // 监听 input change 事件
    _watchInputChange: function (cb) {
      var self = this;
      if (needSupport) {
        $(document).on('change', '#' + self.$inputBox.data('input'), function (e) {
          // 重选时 只获取第一个文件
          var fileList = self.repickIndex == -1 ? this.files : [this.files[0]]

          for (var i = 0; i < fileList.length; i ++) {
            var file = fileList[i];
            if (file.size > self.o.imageMaxSize * 1024 * 1024) {
              alert('图片最大尺寸为 ' + self.o.imageMaxSize + 'Mb')
              continue;
            }
            
            (function (index) {
              loadImage(
                file,
                function (img) {
                  var imgSrc = img.toDataURL('jpeg', self.o.imageQuality);
                  cb && cb(imgSrc, index);
                  self._sendImage(convertBase64UrlToBlob(imgSrc), index);
                },
                {
                  maxWidth: self.o.maxWidth,
                  maxHeight: self.o.maxHeight,
                  canvas: true
                }
              )
            }(self.imageIndex));

            
            if (self.imagesLength >= self.o.countLimit) break;
          }
          self._toggleInput();
          self._resetInput();
        });
      } else { // ie8 直接上传图片 不做预览和压缩处理
        self._ieSendImage()
      }
    },

    _resetInput () {
      this.$inputBox.empty();
      this.$input = createFilePicker(this.$inputBox, this.o.multiple, this.o.accept);
    },

    // 传输图片
    _sendImage: function (file, id) {
      var self = this;
      var $thumb = $('#' + thumbIdPrefix + id);

      self.$input.fileupload({
        url : self.o.url,
        sequentialUploads : true,
        autoUpload : false,
        formData : function () {
          return self.o.params
        },
        progressall : function (e, data) {
          var progress = parseInt((data.loaded / data.total) * 100);
          self.uploadProgress($thumb, progress);
        }
      });

      // 上传
      self.$input.fileupload('send', {
        files: [file]
      }).success(function (result, textStatus, jqXHR) {
        var data = JSON.parse(result);
        if (data.status == 1) {
          self.uploadSuccess($thumb, data);
        } else {
          self.uploadFail($thumb, data);
        }
      }).error(function (jqXHR, textStatus, errorThrown) {
        self.uploadFail($thumb, jqXHR);
      }).complete(function (result, textStatus, jqXHR) {
        self.uploadComplete($thumb);
      });
    },

    _ieSendImage: function () {
      var self = this;
      var id, $thumb;

      self.$input.fileupload({
        url : self.o.url,
        paramName: 'files',
        autoUpload : true,
        formData : function () {
          return self.o.params
        },
        add: function (e, data) {
          id = self.imageIndex++;
          self.imagesLength++;
          $thumb = $('#' + thumbIdPrefix + id);
          self._showPreviewImage('', '', id);
          self._toggleInput();
          self._resetInput();
          self._ieSendImage();
          data.submit()
            .success(function (result, textStatus, jqXHR) {
              var data = JSON.parse(result);
              if (data.status == 1) {
                self.uploadSuccess($thumb, data);
              } else {
                self.uploadFail($thumb, data);
              }
            }).error(function (jqXHR, textStatus, errorThrown) {
              self.uploadFail($thumb, jqXHR);
            }).complete(function (result, textStatus, jqXHR) {
              self.uploadComplete($thumb);
            });
        },
        progressall: function(e, data) {
          var progress = parseInt((data.loaded / data.total) * 100);
          self.uploadProgress($thumb, progress);
        }
      });
    },

    // 激活扩展的全局方法
    _activeExtends: function () {
      for (var k in Uploader.prototype._extend) {
        var f = Uploader.prototype._extend[k]
        Uploader.prototype[k] = f.func
        if (f.immediately) f.func.call(this);
      }
    },

    // 扩展的方法
    _extend: {}
  }

  // 检测浏览器版本
  function checkBrowerDelowIE (version) {
    if (navigator.appName != "Microsoft Internet Explorer") return false;

    var v = Number(navigator.appVersion.split(";")[1].replace(/[ ]/g,"").substring(4));
    if (v > version) return false
    return true
  }

  // 创建 filePicker
  function createFilePicker ($el, multiple, accept) {
    var $input = $('<input type="file" />');
    $input.attr({
      'id': $el.data('input'),
      'accept': accept ? 'image/*' : accept
    });
    if (multiple) $input.attr('multiple', 'multiple');
    $input.css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      filter: 'opacity(0)'
    })
    $el.css('position', 'relative').append($input);
    return $input;
  }

  // base64转为blob对象
  function convertBase64UrlToBlob (urlData) {
    var bytes = window.atob(urlData.split(',')[1]),
        ab = new ArrayBuffer(bytes.length),
        ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    var file = new Blob([ab], {type : 'image/jpeg'});
    file.name = Math.random().toString(32).substring(2) + '.jpeg';
    return file;
  }

  // 检查是否有重名方法
  function duplicateMethodName (name, obj) {
    for (var k in obj) {
      if (k === name) {
        throw new Error('method ' + name + ' is duplicated');
        return true;
      }
    }
    return false;
  }

  // 将 Uploader 挂载到全局
  window.Uploader = Uploader;

  // Uploader 全局扩展方法
  window.Uploader.rigister = function (fnName, func, immediately) {
    if (duplicateMethodName(fnName, Uploader.prototype)) return;
    Uploader.prototype._extend[fnName] = {
      func: func,
      immediately: !!immediately
    }
  }

  // 设置支持的 IE 最低版本
  window.Uploader.setSupportIeVersion = function (version) {
    needSupport = !checkBrowerDelowIE(version);
  };
}());
