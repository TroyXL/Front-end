/**
 * Created by troyxu on 16/12/26.
 */

/**
 * 瀑布流方法
 * @param opts {Object} 配置参数
 * @constructor
 */

var options = {
    cellWrapper: '', // 容器

    cellSpace: 10, // 间距
    numberInLine: 3, // 每行个数
    cellNearbyEdge: false, // cell是否紧贴外层节点

    dataSource: [], // 数据源




}

var Waterfall = function (opts) {

    this.cellWrapper = opts.cellWrapper // 外节点选择器
    this.cellSpace = opts.cellSpace // cell间距
    this.numberInLine = opts.numberInLine // 每行显示个数
    this.cellNearbyEdge = opts.cellNearbyEdge // cell是否紧贴外层节点
    this.dataSource = opts.dataSource // 数据源数组


    var $wrapper = document.querySelectorAll(this.wrapper)[0], // 外节点
        wrapperWidth = getComputedStyle($wrapper, null).width // 外节点宽度
    if ($wrapper.style.position !== '') { // 给外节点添加position属性
        $wrapper.style.position = 'relative'
    }
    if (wrapperWidth == 0) { // 如果外节点未设置宽度 则设置其宽度为100%
        $wrapper.style.width = '100%'
        wrapperWidth = getComputedStyle($wrapper).width
    }

    this.cellWidth = 0
    if (this.cellNearbyEdge) {
        this.cellWidth = (wrapperWidth - (this.numberInLine - 1) * this.cellSpace) / 3
    } else {
        this.cellWidth = (wrapperWidth - (this.numberInLine + 1) * this.cellSpace) / 3
    }

    this.arrangeArr = []
    this.arrangeArr.length = this.numberInLine




}

Waterfall.prototype = {
    /**
     * 设置每个cell的样式 最外层节点class需设置为 waterfall-cell
     * @param index {Number}
     * @param cellDataSource {Object} 当前index的cell数据源 dataSource[index]
     * @return cellDom {String} cell Dom结构
     */
    setSinglecell: function (index, cellDataSource) {
        var cell = '<div class="waterfall-cell"></div>'
    },

    /**
     * 数据源改变时 调用该方法 绘制界面
     * @param newDataSource {Array} 新增数据源数组
     * @param noAppend {Boolean} 新增cell是否添加在后面 true -
     */
    update: function (newDataSource, noAppend) {

    },

    _getCellHeight: function (el) {
        return getComputedStyle(el).height
    }
    
    
    
    
    
    
}