"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = __importDefault(require("./fetch"));
const example_1 = require("./example");
const arr = ['get', 'post', 'put', 'delete', 'head', 'trace', 'connect'];
class Ajax {
    constructor() {
        this.default = fetch_1.default.default;
        this.request = fetch_1.default.ajax;
        this.interceptors = {
            request: example_1.request, response: example_1.response
        };
    }
    // 新增wpm 方法，用于注册再wpm 中
    install(Wpm) {
        Wpm.prototype.$fetch = ajax;
    }
}
arr.forEach(item => {
    // @ts-ignore
    Ajax.prototype[item] = function (url, data = {}, config = {}) {
        let obj = fetch_1.default.handleAjax(url, item, data, config);
        return fetch_1.default.ajax(obj);
    };
});
let ajax = new Ajax();
exports.default = ajax;
