"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deepCopy(obj) {
    if (obj == null) {
        return null;
    }
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]); // 如果是对象，再次调用该方法自身 
            }
            else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}
exports.deepCopy = deepCopy;
var emits;
(function (emits) {
    emits["success"] = "success";
    emits["fail"] = "fail";
})(emits = exports.emits || (exports.emits = {}));
