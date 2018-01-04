/**
 * @功能说明：图片尺寸压缩
 * @author：徐亮 l.xu2@htd.cn
 * @time: 2016-11-10
 */

(function () {
	var $input = $('input[type=file]'),
			$start = $('button'),
			$tip = $('#compress-tip'),
			maxWidth,
			currentFiles = [],
			readyFiles = [];

	// 获取当前input选择文件
	$input.on('change', function() {
		currentFiles = this.files;
	});

	$start.click(function() {

		if (currentFiles.length == 0) return;
		if ($(this).hasClass('compressing')) return;

		$(this).addClass('compressing');
		$tip.text('压缩中……');
		maxWidth = parseInt($('input[name=maxWidth]').val()) || 640;
		

		for (var i = 0; i < currentFiles.length; i ++) {

			var readFile = function(file) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function() {
					var image = new Image();
					image.src = reader.result;
					image.name = file.name;
					image.onload = function() {
						compressImage(image);
					}
				}
			}(currentFiles[i])	
		}
	});

	function compressImage(image) {
		var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				compressedImage = {};

		if (image.width > maxWidth) {
        image.height = canvas.height = (image.height / image.width) * maxWidth;
        image.width = canvas.width = maxWidth;
        ctx.drawImage(image, 0, 0, maxWidth, image.height);
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
      }
      compressedImage.src = canvas.toDataURL("image/png");
      compressedImage.name = image.name;
      downloadFiles(compressedImage);

      
	};

	function downloadFiles(image) {
		var blob = base64ToBlob(image.src);
    blob.name = image.name;
		if (currentFiles.length == 1) { // 只有一张图片，直接下载
			
      singleFileDownload(blob);
		} else { // 超过一张图片，打包下载
			
			readyFiles.push(blob);

			if (readyFiles.length == currentFiles.length) {
				zip.createWriter( new zip.BlobWriter("application/zip"), function(writer) {
			    addFileToZip(writer, readyFiles, 0);
				});
				
			}
		}
	}

	function base64ToBlob(urlData) {
		var bytes = window.atob(urlData.split(',')[1]),
        ab = new ArrayBuffer(bytes.length),
        ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : 'image/png'});
	};

	function singleFileDownload(content){
		$tip.text('');
  	$start.removeClass('compressing');
    var aLink = document.createElement('a'),
        evt = document.createEvent("HTMLEvents");
    
    evt.initEvent("click", false, false);
    aLink.download = content.name;
    aLink.href = window.URL.createObjectURL(content);
    aLink.click();
  }

  function addFileToZip(zipWriter, blobArr, index) {
  	if (index < blobArr.length) {
  		var blob = blobArr[index];
  		zipWriter.add(blob.name, new zip.BlobReader(blob), function() {
  			addFileToZip(zipWriter, blobArr, index + 1);
  		});
  		
  	} else {
  		$tip.text('');
  		$start.removeClass('compressing');
			zipWriter.close(function(zippedBlob) {
				var downloadLink = document.createElement("a"),
            URL = window.URL || window.webkitURL;

        downloadLink.href = URL.createObjectURL( zippedBlob );
        downloadLink.download = "compress.zip";
        downloadLink.click();

        window.location.reload();
      });
  	}
  }


})();