function Promise( fn ) {

    if (null != fn && typeof fn !== 'function') {
        console.error(fn + ' is not a function');
        return;
    }

    this.status = 'pending'; // 当前状态 pending resolve reject complete
    this.value = null; // 结果值
    this.once = fn; // 存储fn
    this.handles = []; // 存储对应状态的回调方法
    this.next = null;

}

Promise.prototype = {

    // 状态标记为已完成, 执行成功回调
    resolve: function () {
        if (this.status === 'reject') return; // 状态改变后无法再次更改
        this.status = 'resolve';
        console.log(this.next)
        if (null != this.next) {
            this.handles[0].call(this.next);
        }

    },

    // 状态标记为已失败, 执行失败回调
    reject: function () {
        if (this.status === 'resolve') return; // 状态改变后无法再次更改
        this.status = 'reject';
        console.log(this.next)
        if (null != this.next) {
            this.handles[1]().call(this.next);
        }

    },
    
    // 回调方法 then
    then: function (resolveCb, rejectCb) {
        this.next = new Promise();

        if (null == resolveCb || typeof resolveCb !== 'function') {
            console.error('argv[0]: ' + resolveCb + 'must be an function')
            return;
        } else {

            this.handles.push(resolveCb);
        }

        if (null != rejectCb && typeof rejectCb !== 'function') {
            console.error('argv[1]: ' + rejectCb + 'must be an function')
            return;
        } else {
            this.handles.push(rejectCb);
        }

        if (undefined != this.once) {
            this.once.call(this); // 将promise交给fn执行, 以便在fn内部改变promise状态
        }

        return this.next;

    }
}

