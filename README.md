# WPM-fetch
wpm-fetch 主要是适用于微信小程序的npm包 对原生微信小程序wx.request 进行promise封装。 </br>
借鉴于axios ，实现axios 的大部分配置，例：method，baseURL，headers，params，data，validateStatus，transformRequest，transformResponse等配置，后续将持续更新实现更多配置。

## 安装
```
npm install wpm-fetch --save
cnpm install wpm-fetch --save
```

## 引用
```
import fetch from 'wpm-fetch';
const fetch = require("wpm-fetch").default;
```

## 示例
```
fetch.get(url[,data,config])
fetch.post(url[,data,config])
fetch.put(delete[,data,config])
fetch.head(url[,data,config])
fetch.trace(url[,data,config]) 
fetch.connect(url[,data,config])
```
以上方法名对应着相对的请求方式 
```
fetch.request({url[,method,data,params,headers]})
```

------------------------------------------
```
<!-- get 请求： /get/user/info?urlparams=1&id=1&params=2  -->
fetch.get('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
  .then( response=> {
    console.log(response); 
  })
  .catch( error=> {
    console.log(error); 
  });
<!-- post 请求：  -->
fetch.post('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
  .then( response=> {
    console.log(response); 
  })
  .catch( error=> {
    console.log(error); 
  });
<!-- put 请求：  -->
fetch.put('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
  .then( response=> {
    console.log(response); 
  })
  .catch( error=> {
    console.log(error); 
  });
  <!-- head 请求：  -->
fetch.head('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
  .then( response=> {
    console.log(response); 
  })
  .catch( error=> {
    console.log(error); 
  });
  <!-- trace 请求：  -->
fetch.trace('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
  .then( response=> {
    console.log(response); 
  })
  .catch( error=> {
    console.log(error); 
  });
  <!-- connect 请求：  -->
fetch.connect('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
  .then( response=> {
    console.log(response); 
  })
  .catch( error=> {
    console.log(error); 
  });
```

## 简介
wpm-fetch  可单独引入  直接fetch 调用所有内置方法
也可以挂载再[wpm-wx](https://www.npmjs.com/package/wpm-wx)依赖中,
内置支持wpm 引入方式
```
import fetch from 'wpm-fetch';
import wpm from 'wpm-wx';

wpm.use(fetch);

new  wpm();
```
这样引入后即可在微信小程序page实例中this.$fetch.get() 中使用 </br>
ps: 如果不用用$fetch 作为 请求名 可以 ```wpm.prototype.xxxx = fetch;```

## api  
```
{
  method:"", // 默认请求方式 默认是get
  baseURL:"", // 默认 请求域名
  headers:{}, // 发送的自定义请求头
  params:{}, // 是与请求一起发送的 URL 参数 params 现只支持对象形式
  data: {},  // 是与请求一起发送的 body 里面的内容
  /**
    * 注册请求前预处理
    * 还可以通过  fetch.interceptors.request.use(config=>{}) 实现注册
    */
  transformRequest(config=>{
     // 实现内容
  }) , 
  /**
    * 注册请求拦截器
    * 还可以通过  fetch.interceptors.response.use(config=>{},error=>{}) 实现注册
    */
  transformResponse(data=>{
     // 实现内容
  },error=>{
    // 请求错误/失败 实现内容
  }) , 
   
}
```


## 版本
* alpha v0.0.1</br>
  >使用ts 重构，重新规划拦截器和项目结构
  >缩减原项目实现过多的冗余的功能,尽量精简
  >实现 基本请求封装，公共配置实现
