"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const qs_1 = __importDefault(require("qs"));
const example_1 = require("./example");
let instance;
class Fetch {
    constructor() {
        this.default = {
            method: 'get',
            baseURL: '',
            async: true,
            headers: {},
            params: {},
            data: {},
            timeout: 60000,
            source: 'SINGLE',
            responseType: 'json',
            withCredentials: false,
            validateStatus(status) {
                return status == 200;
            },
            transformRequest(...data) {
                example_1.request.use(...data);
            },
            transformResponse(...data) {
                example_1.response.use(...data);
            },
        };
        if (instance) {
            return instance; //防止被篡改
        }
        else {
            instance = this;
        }
        // // @ts-ignore
        // this.default.transformRequest();
        // // @ts-ignore
        // this.default.transformResponse();
    }
    handleAjax(url, method, data, config) {
        let obj = Object.assign({}, this.default, config, { url,
            method,
            data });
        return index_1.deepCopy(obj);
    }
    ajax(data) {
        return this._ajax(index_1.deepCopy(data));
    }
    /**
     *
     * @param params
     * @description  内容实现描述：
     *                  1. _handleData 整合 data 和 params 数据 ，url 格式化
     *                  2. 触发 transformRequest 钩子，修改data 值或者格式  去除
     *                  3. 触发 beforeSend 提交前 config.data 数据钩子  整合数据之后
     *                  4. 避免 beforeSend 钩子中 修改了 data params url 所以重新调用一次_handleData，重新整合数据
     */
    _ajax(params) {
        try {
            params = this._handleData(index_1.deepCopy(params));
        }
        catch (error) {
            console.error(`_handleData:before:Error`);
            console.error(error);
        }
        return example_1.request.emit(index_1.emits.success, params)
            .then((result) => {
            params = result;
            try {
                params = this._handleData(index_1.deepCopy(params));
            }
            catch (error) {
                console.error(`_handleData:after:Error`);
                console.error(error);
            }
            try {
                params = this._handleUrl(index_1.deepCopy(params));
            }
            catch (error) {
                console.error(`_handleUrl:Error`);
                console.error(error);
            }
            return this._requestData(params);
        });
        // .catch((err: any) => {
        //     console.error(`request:Error`);
        //     console.log(err);
        //     console.error(err);
        //     request.emit(emits.fail, err);
        // });
    }
    /**
     *
     * @param data
     * @description method 转为大写，如果为空则设置 默认
     *              url 清除 url链接上的参数整合进params
     *              params 特殊情况，如果method等于GET的情况，params置空，params的数据，整合进data对象中
     */
    _handleData(data) {
        if (typeof data != 'object') {
            throw new Error('请求参数有误,参数不是一个对象');
        }
        // method
        (!data.method) && (data.method = this.default.method);
        data.method = data.method.toUpperCase();
        // url
        let [url, params] = data.url.split('?');
        data.url = url;
        data.params = Object.assign({}, qs_1.default.parse(params), data.params);
        if (data.method == 'GET') {
            try {
                data.params = Object.assign({}, data.params, data.data);
                data.data = index_1.deepCopy(data.params);
                data.params = {};
            }
            catch (error) {
                console.error('data-params整合:Error');
                console.error(error);
            }
        }
        // typeof data.data == 'object' && (data.body = JSON.stringify(data.data));
        return data;
    }
    /**
     *
     * @param data
     * @description url 格式化
     */
    _handleUrl(data) {
        if (!(data.url.includes('http://') || data.url.includes('https://'))) {
            data.url = this.default.baseURL + data.url;
        }
        let [url, params] = data.url.split('?');
        if (JSON.stringify(data.params) != '{}')
            data.url = `${url}?${qs_1.default.stringify(data.params)}`;
        return data;
    }
    /**
     *
     * @param params
     */
    _requestData(params) {
        return new Promise((resolve, reject) => {
            this._requestStatus(params)
                .then((result) => {
                example_1.response.emit(index_1.emits.success, Object.assign({}, result, { ajax: params }))
                    .then((data) => {
                    resolve(data);
                }).catch((error) => {
                    reject(error);
                });
            })
                .catch((err) => {
                example_1.response.emit(index_1.emits.fail, Object.assign({}, err, { ajax: params }))
                    .then((data) => {
                    reject(data);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
    /**
     *
     * @param params
     * 请求层 中间状态处理
     */
    _requestStatus(params) {
        return new Promise((resolve, reject) => {
            this._request(params)
                .then((result) => {
                if (this.default.validateStatus(result.statusCode)) {
                    resolve(result);
                }
                else {
                    reject(result);
                }
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    _request(params) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: params.url,
                data: params.data,
                method: params.method,
                header: params.headers,
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    }
}
exports.default = new Fetch();
