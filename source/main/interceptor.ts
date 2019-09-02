
let voidFunc = function (data: any) {
    return data;
}

class Interceptor {
    private success: Function;
    private fail: Function;
    constructor() {
        this.success = voidFunc
        this.fail = voidFunc
    }
    use(...func: Array<Function>) {
        func.forEach((item, index) => {
            if (index == 0) {
                this.success = item;
            }
            if (index == 1) {
                this.fail = item;
            }
        })
    }
    emit(type: string, params: any) {
        // @ts-ignore
        if (this[type]) {
            let data: any;
            try {
                // @ts-ignore
                data = this[type](params);
            } catch (error) {
                console.error(error);
                data = {};
                return Promise.reject({ data: data, error: error });
            }
            // 判断是否是Promise对象
            if (Object.prototype.toString.call(data) != '[object Promise]') {
                return Promise.resolve(data);
            } else {
                return data;
            }
        } else {
            console.error(this);
            console.error(type);
            throw "emit触发失败";
        }
    }
}


export default Interceptor;