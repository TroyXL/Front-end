/**
 * Created by Troy on 16/12/19.
 */

/**
 * picsman图片装框预览图---实际效果
 * @param {object} opts 包含以下配置的参数
 * @param {string} el 预览图节点
 * @param {string} size 预览图节点短边长度
 * @param {string} frameWidth 装框宽度
 * @param {string} cardWidth 卡纸宽度
 * @param {string} imageSize 图片实际打印尺寸
 * @param {string} imageURL 图片src
 * @param {string} cornerTopLeft 左上角图片src
 * @param {string} cornerTopRight 右上角图片src
 * @param {string} cornerBottomLeft 左下角图片src
 * @param {string} cornerBottomRight 右下角图片src
 * @param {string} border 边框图片src
 * @param {string} card 卡纸图片src
 */

var PicsActure = function (opts) {
    var imageSize = opts.imageSize,
        size = opts.size,
        unit = 0,
        $wrapper = $(opts.el),

        wrapperW, wrapperH, // wrapper尺寸
        frameW, cardW, // 装框宽度 卡纸宽度
        imageW, imageH; // 预览图尺寸

    var ratio = imageSize.width / imageSize.height,
        frameCardTotalWidth = (opts.frameWidth + opts.cardWidth) * 2;

    if (ratio < 1) {
        unit = size / (frameCardTotalWidth + imageSize.height)
    } else {
        unit = size / (frameCardTotalWidth + imageSize.width)
    }

    frameW = opts.frameWidth * unit;
    cardW = opts.cardWidth * unit;
    imageW = imageSize.width * unit;
    imageH = imageSize.height * unit;
    wrapperW = imageW + (frameW + cardW) * 2;
    wrapperH = imageH + (frameW + cardW) * 2;

    console.log('wrapperW '+ wrapperW, 'wrapperH '+wrapperH);
    console.log('frameW '+ frameW, 'cardW '+cardW);
    console.log('imageW '+ imageW, 'imageH '+imageH);

    $wrapper.html('<div class="picsman-viewer-wrapper" style="width: '+wrapperW+'px; height: '+wrapperH+'px;">' +
        '<div class="picsman-viewer" style="background: url('+opts.card+')">' +

        '<div class="frame-corner frame-corner-top-left" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerTopLeft+') no-repeat; background-size: cover;"></div>' +
        '<div class="frame-corner frame-corner-top-right" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerTopRight+') no-repeat; background-size: cover;"></div>' +
        '<div class="frame-corner frame-corner-bottom-left" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerBottomLeft+') no-repeat; background-size: cover;"></div>' +
        '<div class="frame-corner frame-corner-bottom-right" style="width: '+frameW+'px; height: '+frameW+'px; background: url('+opts.cornerBottomRight+') no-repeat; background-size: cover;"></div>' +

        '<div class="frame-border frame-border-top" style="width:calc( 100% - '+frameW*2+'px ); height: '+frameW+'px; left: '+frameW+'px; background: url('+opts.border+') repeat-x; background-size: auto 100%;"></div>' +
        '<div class="frame-border frame-border-bottom" style="width:calc( 100% - '+frameW*2+'px ); height: '+frameW+'px; left: '+frameW+'px; background: url('+opts.border+') repeat-x; background-size: auto 100%;"></div>' +
        '<div class="frame-border frame-border-left" style="height:calc( 100% - '+frameW*2+'px ); width: '+frameW+'px; top: '+frameW+'px; background: url('+opts.border+') repeat-y; background-size: 100% auto;"></div>' +
        '<div class="frame-border frame-border-right" style="height:calc( 100% - '+frameW*2+'px ); width: '+frameW+'px; top: '+frameW+'px; background: url('+opts.border+') repeat-y; background-size: 100% auto;"></div>' +

        '<img src="'+opts.imageURL+'" alt="" class="picsman" style="width: '+imageW+'px; height: '+imageH+'px;">' +
        '</div>' +
        '</div>');
};