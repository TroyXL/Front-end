function Promise( fn ) {
    if (null != fn && typeof fn !== 'function') {
        console.error(fn + ' is not a function');
        return;
    }

    this.status = 'pending'; // 当前状态 pending resolve reject complete
    this.data = []; // 回调参数数组
    this.once = fn; // 存储fn
    this.handles = {
        resolve: null,
        reject: null
    }; // 存储对应状态的回调方法
    this.next = null;
};

Promise.prototype = {
    /**
     * 状态标记为已完成 执行成功回调 传入参数将作为参数列表存入回调的data参数中
     */
    resolve: function () {
        if (this.status === 'reject') return; // 状态改变后无法再次更改
        this.status = 'resolve';
        this.data = arguments;
        if (null != this.next) {
            try {
                this.handles.resolve.call(this.next, undefined, this.data);
            } catch (e) {
                this.handles.resolve.call(this.next, e, this.data);
            }
        }
    },

    /**
     * 状态标记为已失败 执行失败回调 传入参数将作为参数列表存入回调的data参数中
     */
    reject: function () {
        if (this.status === 'resolve') return; // 状态改变后无法再次更改
        this.status = 'reject';
        this.data = arguments;
        if (null != this.next) {
            try {
                this.handles.reject.call(this.next, undefined, this.data);
            } catch (e) {
                this.handles.reject.call(this.next, e, this.data);
            }
        }
    },

    /**
     * 回调方法
     * @param resolveCb {function} 已完成回调 参数[err, data] data中包含resolve()中的参数列表
     * @param rejectCb {function} 已失败回调 参数[err, data] data中包含reject()中的参数列表
     * @return Promise {object}
     */
    then: function (resolveCb, rejectCb) {
        this.next = new Promise();

        if (null != resolveCb && typeof resolveCb === 'function') {
            this.handles.resolve = resolveCb;
        } else {
            console.error('arguments[0]: ' + resolveCb + 'must be an function')
            return;
        }

        if (null != rejectCb && typeof rejectCb !== 'function') {
            console.error('arguments[1]: ' + rejectCb + 'must be an function')
            return;
        }
        if (null != rejectCb && typeof rejectCb === 'function') {
            this.handles.reject = rejectCb;
        }

        if (undefined != this.once) {
            this.once.call(this); // 将promise交给fn执行, 以便在fn内部改变promise状态
        }

        return this.next;
    }
};

