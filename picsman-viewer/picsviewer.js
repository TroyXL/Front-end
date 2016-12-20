/**
 * Created by Troy on 16/12/19.
 */

/**
 * picsman图片装框预览图
 * @param {object} opts 包含以下配置的参数
 * @param {string} el 预览图节点
 * @param {string} size 预览图节点尺寸
 * @param {string} unit 单位尺寸
 * @param {string} scale 装框/卡纸 比值
 * @param {string} imageURL 图片src
 * @param {string} cornerTopLeft 左上角图片src
 * @param {string} cornerTopRight 右上角图片src
 * @param {string} cornerBottomLeft 左下角图片src
 * @param {string} cornerBottomRight 右下角图片src
 * @param {string} border 边框图片src
 * @param {string} card 卡纸图片src
 */

var Pics = function (opts) {
    var image = new Image(),
        size = opts.size,
        unit = opts.unit,
        scale = opts.scale,
        $wrapper = $(opts.el),

        wrapperW, wrapperH, // wrapper尺寸
        frameW, cardW, // 装框宽度 卡纸宽度
        imageW, imageH; // 预览图尺寸

    image.onload = function () {
        var ratio = image.width / image.height;


        if (ratio < 1) {
            wrapperH = size;
            wrapperW = size * ratio;
        } else {
            wrapperW = size;
            wrapperH = size / ratio;
        }

        if (scale < 1) { // frameW < cardW
            frameW = unit;
            cardW = unit / scale;
        } else { // frameW > cardW
            cardW = unit;
            frameW = unit * scale;
        }

        imageW = wrapperW - (frameW + cardW) * 2;
        imageH = wrapperH - (frameW + cardW) * 2;

        console.log('wrapperW '+ wrapperW, 'wrapperH '+wrapperH);
        console.log('frameW '+ frameW, 'cardW '+cardW);
        console.log('imageW '+ imageW, 'imageH '+imageH);
        console.log('scale '+ scale);

        $wrapper.html('<div class="picsman-viewer-wrapper" style="width: '+wrapperW+'px; height: '+wrapperH+'px;">' +
        '<div class="picsman-viewer" style="background: url('+opts.card+')">' +

        '<div class="frame-corner frame-corner-top-left" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerTopLeft+') no-repeat; background-size: cover;"></div>' +
        '<div class="frame-corner frame-corner-top-right" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerTopRight+') no-repeat; background-size: cover;"></div>' +
        '<div class="frame-corner frame-corner-bottom-left" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerBottomLeft+') no-repeat; background-size: cover;"></div>' +
        '<div class="frame-corner frame-corner-bottom-right" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerBottomRight+') no-repeat; background-size: cover;"></div>' +

        '<div class="frame-border frame-border-top" style="width:calc( 100% - '+frameW+'px ); height: '+frameW+'px; left: '+frameW+'px; background: url('+opts.border+') repeat-x; background-size: auto 100%;"></div>' +
        '<div class="frame-border frame-border-bottom" style="width:calc( 100% - '+frameW+'px ); height: '+frameW+'px; left: '+frameW+'px; background: url('+opts.border+') repeat-x; background-size: auto 100%;"></div>' +
        '<div class="frame-border frame-border-left" style="height:calc( 100% - '+frameW+'px ); width: '+frameW+'px; top: '+frameW+'px; background: url('+opts.border+') repeat-y; background-size: 100% auto;"></div>' +
        '<div class="frame-border frame-border-right" style="height:calc( 100% - '+frameW+'px ); width: '+frameW+'px; top: '+frameW+'px; background: url('+opts.border+') repeat-y; background-size: 100% auto;"></div>' +


        '<img src="'+opts.imageURL+'" alt="" class="picsman" style="width: '+imageW+'px; height: '+imageH+'px;">' +
        '</div>' +
        '</div>');


    };

    image.src = opts.imageURL;
};