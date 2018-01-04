/**
 * @功能说明：阿里云视频上传
 * @author：徐亮 l.xu2@htd.cn
 * @time: 2016-12-05
 */

var Video = function () {

    return {
        //视频上传基本配置 默认可选择所有格式视频文件
        setOptions: {
            url: 'http://upload.qiniu.com/',
            videoPicker: '#fileupload',
            accept: ['video/*']
        },

        setCurrentVideo: function(videoArr) {
            console.log(videoArr.length)
            for (var i = 0; i < videoArr.length; i ++) {
                if(null == videoArr[i] || 'object' != typeof videoArr[i]) continue;
                var $box = $('<div class="single-video upload-success" data-src="'+videoArr[i].src+'">'
                    + '<div class="video-info">'
                    + '<span class="video-name"><em></em>'+videoArr[i].name+'</span>'
                    + '<a href="javascript:;" class="delete js-delete">删除</a>'
                    + '</div>'
                    + '<div class="video-progress-wrapper">'
                    + '<span class="video-progress success"></span>'
                    + '<span class="video-tip">已上传</span>'
                    + '</div>'
                    + '</div>');
                $('.video-wrapper').append($box);
            }
        },

        //删除视频缩略图及进度条样式
        deleteUploadProgress: function () {
            $('body').on('click', '.js-delete', function () {
                $(this).parents('.single-video').remove();
            });
        },

        //设置视频缩略图及进度条样式
        setUploadProgress: function (file) {
            var $box = $('<div class="single-video uploading" id="'+file.fileID+'" data-src>'
                + '<div class="video-info">'
                + '<span class="video-name"><em></em>'+file.name+'</span>'
                + '<a href="javascript:;" class="delete js-delete">删除</a>'
                + '</div>'
                + '<div class="video-progress-wrapper">'
                + '<span class="video-progress"></span>'
                + '<span class="video-tip">0%</span>'
                + '</div>'
                + '</div>');
            $('.video-wrapper').append($box);
        },

        //设置进度条进度
        uploadProgress: function (file, progress) {
            var $box = $('#'+file.fileID);
            $box.find('.video-progress').width(progress + '%');
            $box.find('.video-tip').text(progress + '%');
        },

        //上传成功
        uploadSuccess: function (file, result) {
            console.log(result);
            var $box = $('#'+file.fileID);
            $box.addClass('upload-success').attr('data-src', result);
            $box.find('.video-progress').addClass('success').width('100%');
            $box.find('.video-tip').text('上传成功');
        },

        //上传失败
        uploadFail: function (file, reason) {
            console.error('upload fail: '+reason);
            var $box = $('#'+file.fileID);
            $box.addClass('upload-fail');
            $box.find('.video-name').addClass('error');
            $box.find('.video-progress').addClass('fail').width('100%');
            $box.find('.video-tip').text('上传失败');
        },

        //上传完成
        uploadComplete: function (file) {
            $('#'+file.fileID).removeClass('uploading');
        },

        upload: function () {
            var options = Video.setOptions;
            Video.deleteUploadProgress();

            var acceptArr = [];
            for ( i in options.accept) {
                acceptArr.push(options.accept[i].toLowerCase());
            }

            $(options.videoPicker).fileupload({
                url : options.url,
                sequentialUploads : true,
                autoUpload : true,
                formData : function () {
                    return [{
                        name: 'dir',
                        value: 'media'
                    }]
                },
                add: function (e, data) {
                    var file = data.files[0];
                    file.fileID = new Date().getTime();

                    data.submit()
                        .success(function (result, textStatus, jqXHR) {
                            var type = typeof result;

                            if (type === 'undefined') {
                                Video.uploadFail(file, result);
                            }

                            if (type === 'string') {
                                var data = JSON.parse(result);
                                if (data.status == 1) {
                                    Video.uploadSuccess(file, data);
                                } else {
                                    Video.uploadFail(file, data.msg);
                                }
                            }

                            if (type === 'object') {
                                if (result.status == 1) {
                                    Video.uploadSuccess(file, result);
                                } else {
                                    Video.uploadFail(file, result);
                                }
                            }
                        })
                        .error(function (jqXHR, textStatus, errorThrown) {
                            Video.uploadFail(file, errorThrown);
                        })
                        .complete(function (result, textStatus, jqXHR) {
                            Video.uploadComplete(file);
                        });
                },
                submit: function (e, data) {
                    console.log(e,data)
                    var file = data.files[0];
                    if (acceptArr.length > 0 && acceptArr.indexOf('video/*') == -1) {
                        if (acceptArr.indexOf(file.type.toLowerCase()) == -1) {
                            alert('视频文件格式错误');
                            data.abort();
                            return;
                        }
                    }
                    Video.setUploadProgress(file);
                },
                progress : function (e, data) {
                    var file = data.files[0],
                        progress = parseInt((data.loaded / data.total) * 100);
                    Video.uploadProgress(file, progress);
                }
            });
        }
    }
}();