import fetch from './fetch';
import { request, response } from './example';
const arr: Array<string> = ['get', 'post', 'put', 'delete', 'head', 'trace', 'connect'];

class Ajax {
    default = fetch.default
    interceptors: any
    constructor() {
        this.interceptors = {
            request, response
        }
    }
    request = fetch.ajax
    // 新增wpm 方法，用于注册再wpm 中
    install(Wpm: any) {
        Wpm.prototype.$fetch = ajax;
    }
}
arr.forEach(item => {
    // @ts-ignore
    Ajax.prototype[item] = function (url, data = {}, config = {}) {
        let obj = fetch.handleAjax(url, item, data, config);
        return fetch.ajax(obj);
    }
})
let ajax = new Ajax();
export default ajax;