import { deepCopy, emits } from '../utils/index';
import qs from 'qs';
import { request, response } from './example';

let instance: Fetch;
class Fetch {
    default: any = {
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
        validateStatus(status: any) {
            return status == 200;
        },
        transformRequest(...data: Array<Function>) {
            request.use(...data);
        },
        transformResponse(...data: Array<Function>) {
            response.use(...data);
        },
    };
    constructor() {
        if (instance) {
            return instance; //防止被篡改
        } else {
            instance = this;
        }
        // // @ts-ignore
        // this.default.transformRequest();
        // // @ts-ignore
        // this.default.transformResponse();
    }
    handleAjax(url: string, method: string, data: any, config: Object) {
        let obj = {
            ...this.default,
            ...config,
            url,
            method,
            data,
        }
        return deepCopy(obj);
    }
    ajax(data: Object) {
        return this._ajax(deepCopy(data));
    }
    /**
     * 
     * @param params 
     * @description  内容实现描述：
     *                  1. _handleData 整合 data 和 params 数据 ，url 格式化 
     *                  2. 触发 transformRequest 钩子，修改data 值或者格式  去除
     *                  3. 避免 transformRequest 钩子中 修改了 data params url 所以重新调用一次_handleData，重新整合数据
     *                  4. 格式化 url
     */
    private _ajax(params: any) {
        try {
            params = this._handleData(deepCopy(params));
        } catch (error) {
            console.error(`_handleData:before:Error`);
            console.error(error);
        }
        return request.emit(emits.success, params)
            .then((result: any) => {
                params = result;
                try {
                    params = this._handleData(deepCopy(params));
                } catch (error) {
                    console.error(`_handleData:after:Error`);
                    console.error(error);
                }
                try {
                    params = this._handleUrl(deepCopy(params));
                } catch (error) {
                    console.error(`_handleUrl:Error`);
                    console.error(error);
                }
                return this._requestData(params);
            })
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
    private _handleData(data: any): Object {
        if (typeof data != 'object') {
            throw new Error('请求参数有误,参数不是一个对象');
        }
        // method
        (!data.method) && (data.method = this.default.method);
        data.method = data.method.toUpperCase()
        // url
        let [url, params] = data.url.split('?');
        data.url = url
        data.params = {
            ...qs.parse(params),
            ...data.params,
        }
        if (data.method == 'GET') {
            try {
                data.params = {
                    ...data.params,
                    ...data.data,
                }
                data.data = deepCopy(data.params);
                data.params = {};
            } catch (error) {
                console.error('data-params整合:Error');
                console.error(error);
            }
        }
        // typeof data.data == 'object' && (data.body = JSON.stringify(data.data));
        return data
    }
    /**
     * 
     * @param data 
     * @description url 格式化
     */
    private _handleUrl(data: any): Object {
        if (!(data.url.includes('http://') || data.url.includes('https://'))) {
            data.url = this.default.baseURL + data.url;
        }
        let [url, params] = data.url.split('?');
        if (JSON.stringify(data.params) != '{}')
            data.url = `${url}?${qs.stringify(data.params)}`;
        return data;
    }
    /**
     * 
     * @param params 
     */
    private _requestData(params: any) {
        return new Promise((resolve, reject) => {
            this._requestStatus(params)
                .then((result: any) => {
                    response.emit(emits.success, { ...result, ajax: params })
                        .then((data: any) => {
                            resolve(data);
                        }).catch((error: any) => {
                            reject(error)
                        });
                })
                .catch((err) => {
                    response.emit(emits.fail, { ...err, ajax: params })
                        .then((data: any) => {
                            reject(data);
                        }).catch((error: any) => {
                            reject(error)
                        });
                });
        });
    }
    /**
     * 
     * @param params 
     * 请求层 中间状态处理
     */
    private _requestStatus(params: any) {
        return new Promise((resolve, reject) => {
            this._request(params)
                .then((result: any) => {
                    if (this.default.validateStatus(result.statusCode)) {
                        resolve(result);
                    } else {
                        reject(result)
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    private _request(params: any) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: params.url,
                data: params.data,
                method: params.method,
                header: params.headers,
                success: (result: Object) => {
                    resolve(result);
                },
                fail: (err: any) => {
                    reject(err);
                }
            })
        })
    }
}

export default new Fetch();