export function deepCopy(obj: any) {
    if (obj == null) { return null }
    let result: any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]); // 如果是对象，再次调用该方法自身 
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

export enum emits {
    success = 'success',
    fail = 'fail'
}