// @ts-ignore
import axios, {AxiosRequestConfig} from 'axios'
import router from '@/router'
import {ElMessage} from "element-plus";
import store from '@/store'
// @ts-ignore
import { showMessage } from "@/request/status";   // 引入状态码文件
// @ts-ignore
import qs from "qs"


// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map()
/**
 * 添加请求
 * @param {Object} config
 */
const addPending = (config: AxiosRequestConfig) => {
    const url = [
        config.method,
        config.url,
        qs.stringify(config.params),
        qs.stringify(config.data)
    ].join('&')
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
        if (!pending.has(url)) { // 如果 pending 中不存在当前请求，则添加进去
            pending.set(url, cancel)
        }
    })
}
/**
 * 移除请求
 * @param {Object} config
 */
const removePending = (config: AxiosRequestConfig) => {
    const url = [
        config.method,
        config.url,
        qs.stringify(config.params),
        qs.stringify(config.data)
    ].join('&')
    if (pending.has(url)) { // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
        const cancel = pending.get(url)
        cancel(url)
        pending.delete(url)
    }
}

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
    for (const [url, cancel] of pending) {
        cancel(url)
    }
    pending.clear()
}

let baseURL = ''
if(import.meta.env.MODE === 'staging') { // 预备模式
    baseURL = process.env.NODE_ENV === 'development' ? import.meta.env.VITE_DEV_SERVER : import.meta.env.VITE_SERVER
} else { // development或production模式
    baseURL = ''
}

// 创建axios实例
const request = axios.create({
    baseURL:baseURL+'/api',// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout: 80000, // 请求超时时间(毫秒)
    withCredentials: true,// 异步请求携带cookie
    headers: {
        // 设置后端需要的传参类型
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
})



// request拦截器
request.interceptors.request.use(
    config => {
        console.log("请求拦截")
        removePending(config) // 在请求开始前，对之前的请求做检查取消操作
        addPending(config) // 将当前请求添加到 pending 中
        // 如果你要去localStor获取token,(如果你有)
        let token = store.state.token;
        if (token) {
            // 添加请求头
            config.headers["Authorization"] = "Bearer " + token
            config.headers["token"]=  token
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)

// response 拦截器
request.interceptors.response.use(
    response => {
        console.log("响应拦截")
        removePending(response) // 在请求结束后，移除本次请求
        // 对响应数据做点什么
        const res =  response.data
        store.commit('setToken', res.token);
        if(res.code === 1) return res
        if (res.code === -2) {
            // 清除 token
            store.commit('delToken');
            ElMessage.error('请先登陆！')
            router.push({
                path:'/index'
            })
            return res
        }
        if(res.code !== 1 && res.code !== -2) {
            // 清除 token
            store.commit('delToken');
            return ElMessage.error(res.msg)
        }
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)

export class Request {
    /**
     * get方法
     * @param {string} url 路径
     * @param {object} params 参数
     */
    static get = (url: string, params?: any) => {
        return new Promise((resolve, reject) => {
            axios.get(url, { params: params }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    static post = (url: string, params?: any) => {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params)).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
}

export default request
