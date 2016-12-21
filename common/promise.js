(function() {
	var API={};
	API.Promise=function(callback){
		return new promise(callback);
	} // Promise挂载到API对象下

    // 声明一个Promise对象
    function promise(callback) {
        Deffer.pending = false; // 修改等待状态为false
        if (typeof callback == 'function') {
            this.once = callback; // 如果参数callback是函数，就把callback赋值给Promise的once变量
        }
        return this // 返回Promise对象
    }
    var Deffer = {
        resolve: null,
        reject: null,
        pending: false
    } // 定义Deffer对象，保存Promise的状态

    // Promise原型链上添加then方法
    promise.prototype.then = function(callback) {
        if (!Deffer.pending) {
            var xhr = this.once.call(this);
            var data = '';
            var err = '';
            xhr.done(function(data) {
                if (typeof callback == 'function') {
                    Deffer.resolve = data;
                    Deffer.pending = true;
                    callback.call(this, data, err);
                }
            }).fail(function(err) {
                if (typeof callback == 'function') {
                    Deffer.reject = err;
                    Deffer.pending = true;
                    callback.call(this, data, err);
                }
            });
        } else {
            callback.call(this, Deffer.resolve, Deffer.reject);
        }
        return this
    }
    window.api=API; // 暴露API对象为全局对象
}())
