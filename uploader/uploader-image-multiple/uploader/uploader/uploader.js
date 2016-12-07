/**
 * @功能说明：阿里云图片上传 依赖webuploader.min.js 支持flash
 * @author：徐亮 l.xu2@htd.cn
 * @time: 2016-10-28
 */

var Uploader = function () {
  var options = null;
	return {

    	/**
       * @return {object} 包含以下参数的对象
       * @param {string} URL 上传路径
       * @param {string} imagePicker 图片选择器 class/id
       * @param {string} thumbWrapper 缩略图节点  class/id
       * @param {number} countLimit 图片张数 默认1
       * @param {string} deleteBtn 删除图片按钮 默认无删除 需要包含在缩略图节点中 class/id
       * @param {number} maxWidth 图片最大宽度 默认640
       * @param {number} imageSize 图片大小限制 默认1MB
       * @param {string} swfPath swf文件路径 默认当前文件夹
       * @param {function} afterSuccess 使用默认样式下的上传成功回调 包含两个参数 file, result
       */
    	setOptions: function() {
    		return {
          URL: null,
          imagePicker: null,
          thumbWrapper: null,
          countLimit: null,
          deleteBtn: null,
          // maxWidth: null,
          imageSize: null,
          swfPath: null,
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
         * @param file 文件
         * @return {object} 包含一个img的当前缩略图完整节点
         */
    	setImageAndProcess: function(file) {
        var $box = $(
            '<div class="img-box uploading" id="'+file.id+'" data-src>' +
            '<img src="">' +
            '<span class="process"></span>' +
            '<a class="delete js-delete"></a>' +
            '</div>'
            );
        $('.filePicker').before( $box );
        return $box;
      },

        /**
         * 展示进度条动画
         * @param file 文件
         * @param process 进度条数值
         */
        uploadProcess: function(file, process) {
          $( '#'+file.id ).find('.process').css( 'width', process * 100 + '%' );
        },

        /**
         * 上传成功执行
         * @param file 文件
         * @param {string} result 上传成功返回图片地址
         */
        uploadSuccess: function(file, result) {
          $( '#'+file.id )
          .addClass('upload-success')
          .attr('data-src', result)
          .find('.process')
          .addClass('success')
          .text('上传成功');

          if (options.afterDefaultSuccess) options.afterDefaultSuccess(file, result);
        },

        /**
         * 上传失败执行
         * @param file 文件
         * @param {string} result 上传失败返回信息
         */
        uploadError: function(file, result) {
          $( '#'+file.id )
          .addClass('upload-fail')
          .find('.process')
          .addClass('error')
          .text('上传失败');
        },

        /**
         * 上传完成执行,成功失败都会调用
         * @param file 文件
         */
        uploadComplete: function(file) {
          $('#' + file.id).removeClass('uploading');
        },

        /**
         * 上传
         */
        upload: function() {
            var lastFileId = [];

            if (!options) options = Uploader._setOpts();

            Uploader._deleteImage();

            var uploader = WebUploader.create({
                //自动上传
                auto: true,
                // swf文件路径
                swf: options.swfPath,
                // 文件接收服务端。
                server: options.URL,
                // 选择文件的按钮。可选。
                // 内部根据当前运行时创建，可能是input元素，也可能是flash.
                pick: options.imagePicker,
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                //resize: true,
                //压缩图片
                // compress:{
                    // width: options.maxWidth,

                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    // quality: 80,

                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    // allowMagnify: false,

                    // 是否允许裁剪。
                    // crop: false,

                    // 是否保留头部meta信息。
                    // preserveHeaders: true,

                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    // noCompressIfLarger: false,

                    // 单位字节，如果图片大小小于此值，不会采用压缩。
                //     compressSize: 0
                // },
                // 只允许选择文件，可选。
                accept: {
                    title: 'Images',
                    extensions: 'jpg,jpeg,png',
                    mimeTypes: 'image/jpg,image/jpeg,image/png'
                },
                // fileNumLimit: options.countLimit,
                //参数
                // formData: {
                //     dir: 'image'
                // },
                //单文件大小限制 5M
                fileSingleSizeLimit: options.imageSize
            });

            uploader.on('beforeFileQueued', function (file) {
              console.log($(options.thumbWrapper).length)
              if (file.size > options.imageSize) {
                uploader.cancelFile(file);
              }
              if ($(options.thumbWrapper).length >= options.countLimit) {
                return false;
              }
                
            });

            //图片加入队列
            uploader.on('fileQueued', function (file) {
                if (file) {
                    lastFileId.push(file.id);

                    var $box = Uploader.setImageAndProcess(file),
                        $img = $box.find('img');

                    // 创建缩略图
                    uploader.makeThumb(file, function (error, src) {
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }
                        $img.attr('src', src);
                    });

                    // 隐藏添加图片按钮
                    if (options.thumbWrapper) {
                        var length = $(options.thumbWrapper).length;
                        if (length >= options.countLimit) {
                            $(options.imagePicker).hide();
                        }
                    }
                }
            });

            //进度条
            uploader.on('uploadProgress', function (file, percentage) {
                Uploader.uploadProcess(file, percentage);
            });

            //上传成功
            uploader.on('uploadSuccess', function (file, response) {
              if (response.status == 1) {
                Uploader.uploadSuccess(file, response.url);
              } else {
                Uploader.uploadError(file, response.message);
              }
            });

            //上传失败
            uploader.on('uploadError', function (file, reason) {
                Uploader.uploadError(file, reason);
            });

            //上传完成，不管成功失败
            uploader.on('uploadComplete', function (file) {
                Uploader.uploadComplete(file);
            });

            //校验不通过时提示
            uploader.on('error', function (type) {
              console.error(type)
              if (type == 'Q_TYPE_DENIED') {
                var msg = '只能上传jpg,jpeg,png格式图片！'
                  alert(msg);
              }
              if (type == 'F_EXCEED_SIZE') {
                var msg = '超出图片大小限制！';
                  alert(msg);
              }
            });
        },

        /**
         * @pravite
         * 配置全局变量
         */
        _setOpts: function() {
            var opts = Uploader.setOptions();

            return {
                URL: opts.URL,
                imagePicker: opts.imagePicker,
                thumbWrapper: opts.thumbWrapper,
                countLimit: opts.countLimit || 1,
                deleteBtn: opts.deleteBtn,
                // maxWidth: opts.maxWidth || 640,
                imageSize: opts.imageSize || 1024 * 1024,
                swfPath: opts.swfPath || 'Uploader.swf',
                afterDefaultSuccess: opts.afterDefaultSuccess
            };
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