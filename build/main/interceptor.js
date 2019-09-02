"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let voidFunc = function (data) {
    return data;
};
class Interceptor {
    constructor() {
        this.success = voidFunc;
        this.fail = voidFunc;
    }
    use(...func) {
        func.forEach((item, index) => {
            if (index == 0) {
                this.success = item;
            }
            if (index == 1) {
                this.fail = item;
            }
        });
    }
    emit(type, params) {
        // @ts-ignore
        if (this[type]) {
            let data;
            try {
                // @ts-ignore
                data = this[type](params);
            }
            catch (error) {
                console.error(error);
                data = {};
                return Promise.reject({ data: data, error: error });
            }
            // 判断是否是Promise对象
            if (Object.prototype.toString.call(data) != '[object Promise]') {
                return Promise.resolve(data);
            }
            else {
                return data;
            }
        }
        else {
            console.error(this);
            console.error(type);
            throw "emit触发失败";
        }
    }
}
exports.default = Interceptor;
