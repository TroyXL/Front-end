/**
 * Created by Troy on 17/2/24.
 */

var TPromise = function ( func ) {
    this.func = func;
    this.status = 2;
    this.handler = {
        resolve: null,
        reject: null
    };
}

TPromise.prototype = {
    constructor: TPromise,

    then: function ( resolveCb, rejectCb ) {
        this.func( resolve, reject );
        if ( typeof resolveCb === 'function' ) {
            this.handler.resolve = resolveCb;
        }
        if ( typeof rejectCb === 'function' ) {
            this.handler.reject = rejectCb;
        }
        return new TPromise()
    },
}

