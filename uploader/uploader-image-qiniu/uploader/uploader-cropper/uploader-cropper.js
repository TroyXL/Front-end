/**
 * @功能说明：七牛图片上传 带剪裁功能 依赖jquery.fileupload.js cropper.min.js
 * @author：徐亮 l.xu2@htd.cn
 * @time: 2016-9-26
 */

var Uploader = function () {
  var options = null;
	return {

		/**
     * 全局配置
     * @return {object} 返回包含以下参数的对象
     * @param {string} token 上传凭证
     * @param {string} domain 空间域名
     * @param {string} URL 上传路径
     * @param {string} imagePicker 图片选择器 必须包含input[tupe=file]的标签 class/id
     * @param {string} thumbWrapper 缩略图节点  class/id
     * @param {number} countLimit 图片张数 默认1
     * @param {string} deleteBtn 删除图片按钮 默认无删除 需要包含在缩略图节点中 class/id
     * @param {number} maxWidth 图片最大宽度 默认640
     * @param {number} aspectRatio 图片剪裁宽高比 默认自由比例
     * @param {function} afterSuccess 使用默认样式下的上传成功回调 包含三个参数 fileID, fileName, result
     */
		setOptions: function() {
			return {
				token: null,
				domain: null,
        URL: null,
        imagePicker: null,
        thumbWrapper: null,
        countLimit: null,
        deleteBtn: null,
        maxWidth: null,
        aspectRatio: null,
        afterDefaultSuccess: null
			}
		},

    /**
     * 展示现成图片 需要先调用setOptions方法 重写改方法时需要自己绑定删除图片按钮事件 判断添加图片按钮是否隐藏
     * @param {array} imgArr 现有图片url数组
     */
    setCurrentImage: function(imgArr) {
        if (!options) options = Uploader._setOpts();

        for (var i = 0; i < imgArr.length; i ++) {
          if(null == imgArr[i] || "" == imgArr[i]) continue;
          var $box = $(
            '<div class="img-box upload-success" data-src="'+imgArr[i]+'">' +
            '<img src="'+imgArr[i]+'">' +
            '<a class="delete js-delete"></a>' +
            '</div>'
            );
          $('.filePicker').before( $box );

          // 隐藏添加图片按钮
          if (options.thumbWrapper && $(options.thumbWrapper).length >= options.countLimit) {
            $(options.imagePicker).hide();
            break;
          }
        }
        Uploader._deleteImage();
      },

    /**
     * 设置缩略图、进度条样式并绘制
     * @param fileID 文件id
     * @param fileName 文件名
     * @param imgSrc 缩略图src
     */
		setImageAndProcess: function(fileID, fileName, imgSrc) {
      var $box = $(
            '<div class="img-box uploading" id="img'+fileID+'" data-src>' +
            '<img src="'+imgSrc+'">' +
            '<span class="process"></span>' +
            '<a class="delete js-delete"></a>' +
            '</div>'
            );
      $('.filePicker').before( $box );
    },

    /**
     * 展示进度条动画
     * @param fileID 文件id
     * @param fileName 文件名
     * @param process 进度条数值
     */
    uploadProcess: function(fileID, fileName, process) {
      $('#img'+fileID).find('.process').css('width', process + '%');
    },

    /**
     * 上传成功执行
     * @param fileID 文件id
     * @param fileName 文件名
     * @param {string} result 上传成功返回图片地址
     */
    uploadSuccess: function(fileID, fileName, result) {
      $('#img' + fileID)
        .addClass('upload-success')
        .attr('data-src', result)
        .find('.process')
        .addClass('success')
        .text('上传成功');

        if (options.afterDefaultSuccess) options.afterDefaultSuccess(fileID, fileName, result);
    },

    /**
     * 上传失败执行
     * @param fileID 文件id
     * @param fileName 文件名
     * @param {string} result 上传失败返回信息
     */
    uploadError: function(fileID, fileName, result) {
      $('#img' + fileID)
        .addClass('upload-fail')
        .find('.process')
        .addClass('error')
        .text('上传失败');
    },

    /**
     * 上传完成执行,成功失败都会调用
     * @param fileID 文件id
     * @param fileName 文件名
     */
    uploadComplete: function(fileID, fileName) {
      $('#img' + fileID).removeClass('uploading');
    },

    /**
     * 上传
     * @param {object} opts 包含以下参数的对象
     */
    upload: function() {
      if (!options) options = Uploader._setOpts();

      // 裁剪层
      var $cropperLayer = '<div class="fixed-cropper-wrap" style="position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: #000;z-index: 998;display: none;">' + 
                          '<div class="cropper-wraper" style="width: 100%;height: 100%;">' +
                          '<div class="img-container" style="width: 100%;height: 100%;">' +
                          '<img class="origin-img" src="" alt="" />' +
                          '</div>' +
                          '</div>' +
                          '<div class="img-preview" style="position: fixed;left: 0;bottom: 44px;height: 80px;width: 80px;z-index: 999;overflow: hidden;"></div>' +
                          '<div class="cropper-control" style="position: fixed;left: 0;right: 0;bottom: 0;height: 44px;background: #000;z-index: 999;">' +
                          '<a href="javascript:;" class="js-cancel-crop" style="height:44px;line-height:44px;padding:0 15px;color:#fff;text-decoration: none;float:left;">取消</a>' +
                          '<a href="javascript:;" class="js-start-crop" style="height:44px;line-height:44px;padding:0 15px;color:#fff;text-decoration: none;float:right;">裁剪并上传</a>' +
                          '</div>' +
                          '</div>';
      $('body').append($cropperLayer);

      Uploader._deleteImage();

      // 获取文件
      var $input = $(options.imagePicker).find('input');
      $input.on('change', function() {
        var file = this.files[0];
        options.fileID = new Date().getTime();
        options.fileName = file.name;

        // 读取文件
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          $('.fixed-cropper-wrap').show().find('.origin-img').attr('src', reader.result);
            $('.origin-img').cropper({
                aspectRatio: options.aspectRatio,
                preview: ".img-preview"
            });
          
        };
      });

      // 确定剪裁
      $(document).on('click', '.js-start-crop', function() {
        var result = $('.origin-img').cropper('getCroppedCanvas'),
            imgURL = result.toDataURL("image/jpeg",0.9),
            image = new Image();
        image.src = imgURL;
        image.onload = function() {
          options.image = image;
          Uploader._showAndCompressImage(options);
        }
      });

      // 取消剪裁
      $(document).on('click', '.js-cancel-crop', function(){
        $('.fixed-cropper-wrap').hide().find('.origin-img').attr('src', '');
        $('.origin-img').cropper('destroy');
      });
    },

    /**
     * @pravite
     * 配置全局变量
     */
    _setOpts: function() {
      var opts = Uploader.setOptions();

      return {
        token: opts.token,
        domain: opts.domain,

        URL: opts.URL,
        imagePicker: opts.imagePicker,
        thumbWrapper: opts.thumbWrapper,
        countLimit: opts.countLimit || 1,
        deleteBtn: opts.deleteBtn,
        maxWidth: opts.maxWidth || 640,
        aspectRatio: opts.aspectRatio,
        afterDefaultSuccess: opts.afterDefaultSuccess,

        fileID: null,
        fileName: null,
        image: null
      }
    },
 
    /**
     * @pravite
     * 压缩和展示图片
     */
    _showAndCompressImage: function() {
      var image = options.image,
          canvas = document.createElement('canvas'),
          imgSrc,
          blob,
          files = [];

      // 图片宽度超过640则压缩到640
      if (image.width > options.maxWidth) {
        image.height = canvas.height = (image.height / image.width) * options.maxWidth;
        image.width = canvas.width = options.maxWidth;
        canvas.getContext('2d').drawImage(image, 0, 0, options.maxWidth, image.height);
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
      }
      imgSrc = canvas.toDataURL("image/jpeg",0.9);

      // 展示缩略图
      Uploader.setImageAndProcess(options.fileID, options.fileName, imgSrc);

      // 隐藏添加图片按钮
      if (options.thumbWrapper) {
        var length = $(options.thumbWrapper).length;
        if (length >= options.countLimit) {
          $(options.imagePicker).hide();
        }
      }

      // 关闭裁剪
      $('.fixed-cropper-wrap').hide().find('.origin-img').attr('src', '');
      $('.origin-img').cropper('destroy');

      // 创建blob对象
      blob = Uploader._convertBase64UrlToBlob(imgSrc);
      blob.name = options.fileName.split('.')[0] + '.jpeg';
      files.push(blob);
      Uploader._imageUpload(files, options);
    },

    /**
     * @pravite
     * base64转为blob对象
     */
    _convertBase64UrlToBlob: function(urlData) {
        var bytes = window.atob(urlData.split(',')[1]),
            ab = new ArrayBuffer(bytes.length),
            ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob( [ab] , {type : 'image/jpeg'});
    },

    /**
     * @pravite
     * 开始上传
     */
    _imageUpload: function(files) {
      var $input = $(options.imagePicker).find('input');
      // fileupload配置
      $input.fileupload({
        url : options.URL,
        sequentialUploads : true,
        autoUpload : false,
        formData : function () {
          return [{
            name: 'token',
            value: options.token
          }]
        },
        progressall : function (e, data) {
          var process = parseInt((data.loaded / data.total) * 100);
          Uploader.uploadProcess(options.fileID, options.fileName, process);
        }
      });

      // 上传
      $input.fileupload('send', {
        files: files
      }).success(function (result, textStatus, jqXHR) {
        Uploader.uploadSuccess(options.fileID, options.fileName, options.domain + '/' + result.key);
      }).error(function (jqXHR, textStatus, errorThrown) {
        Uploader.uploadError(options.fileID, options.fileName, jqXHR);
      }).complete(function (result, textStatus, jqXHR) {
        Uploader.uploadComplete(options.fileID, options.fileName);
      });
    },

    /**
     * @pravite
     * 绑定删除图片事件
     */
    _deleteImage: function() {
      if (options.thumbWrapper && options.deleteBtn) {
        $(options.deleteBtn).off();
        $(document).on('click', options.deleteBtn, function(e) {
          var $delete = $(e.target);
          $delete.parents(options.thumbWrapper).remove();
          $(options.imagePicker).show();
        });
      }
    }

	}

}();