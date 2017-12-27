/**
 * @功能说明：图片上传
 * @author：徐亮 l.xu2@htd.cn
 * @time: 2017-12-26
 */
(function () {
  var needSupport = !checkBrowerDelowIE9();
  var thumbIdPrefix = 'IMG-UPLOAD-';

  var Uploader = function (opts) {
    // configs
    this.o = $.extend({
      url: '', // 上传地址 required
      imagePicker: 'input[type=file]', // 图片选择器 required
      thumbnailsBox: '', // 存放缩略图的容器 required
      multiple: false, // 是否多选
      accept: '*', // 图片格式
      countLimit: 9, // 最大张数
      imageMaxSize: 5, // 图片最大 5M
      maxWidth: 600,
      maxHeight: 600,
      imageQuality: 0.1, // (0, 1]
      params: [],

      repickEl: '', // 针对某张图片重新选择图片的按钮元素 如果本身支持多选 重选图片将只会对第一张进行处理
      deleteEl: '' // 删除按钮
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
    

    // 设置缩略图样式
    // 改方法需要返回一个 $ 对象作为缩略图
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
      this.showSuccessImageOnIE8();
    }

    this.uploadFail = function ($el, data) {
      $el.attr('upload-fail', '')
        .find('.process')
        .addClass('fail')
        .text('上传失败');
    }

    this.uploadComplete = function ($el) {
      console.log('上传完成');
    }

    this.showSuccessImageOnIE8 = function ($el, imageUrl) {
      if (!needSupport) {
        $el.find('img').attr('src', imageUrl);
      }
    }

    this.extend = function (fnName, func) {
      this[fnName] = func;
      func.call(this)
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
      var $thumbs = $('[upload-success]');
      for (var i = 0; i < $thumbs.length; i++) {
        urls.push($($thumbs[i]).attr('data-src'));
      }
      return urls;
    },

    _activeExtends: function () {
      for (var k in Uploader.prototype._extend) {
        Uploader.prototype._extend[k].call(this);
      }
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
      $(document).on('change', '#' + self.$inputBox.data('input'), function (e) {
        // 重选时 只获取第一个文件
        var fileList = self.repickIndex == -1 ? e.target.files : [e.target.files[0]]
        for (var i = 0; i < fileList.length; i ++) {
          var file = fileList[i];
          if (file.size > self.o.imageMaxSize * 1024 * 1024) {
            alert('图片最大尺寸为 ' + self.o.imageMaxSize + 'Mb')
            continue;
          }
          
          if (needSupport) { // 非 ie8
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

          } else { // ie8 直接上传图片 不做预览和压缩处理
            self._showPreviewImage('', '', self.imageIndex)
            self._sendImage(file, self.imageIndex)
          }

          self.imageIndex++;
          self.imagesLength++;
          if (self.imagesLength >= self.o.countLimit) break;
        }
        // 替换 input 清空 fileList
        self.$inputBox.empty();
        self.$input = createFilePicker(self.$inputBox, self.o.multiple, self.o.accept);
      });
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

    _extend: {}
  }

  // 检测浏览器版本
  function checkBrowerDelowIE9 () {
    if (navigator.appName != "Microsoft Internet Explorer") return false;

    var version = Number(navigator.appVersion.split(";")[1].replace(/[ ]/g,"").substring(4));
    if (version > 8) return false
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
    return new Blob([ab], {type : 'image/jpeg'}, Math.random().toString(32).substring(2) + 'jpeg');
  }

  // 将 Uploader 挂载到全局
  window.Uploader = Uploader;

  // Uploader 全局扩展方法
  window.Uploader.rigister = function (fnName, func) {
      Uploader.prototype._extend[fnName] = func
    }
}());
