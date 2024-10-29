// @ts-ignore
import Axios from '@/request/axios'
// @ts-ignore
import { HttpResponse } from '@/request/types'


/**
 * @interface LoginParams -登录参数
 * @property {string} username -用户名
 * @property {string} password -用户密码
 */
interface LoginParams {
    username: string
    password: string
}
//封装User类型的接口方法
export class UserService {
    /**
     * @description 查询User的信息
     * @return {HttpResponse} result
     * @param params
     */
    static async login(params: LoginParams): Promise<HttpResponse> {
        if (params.username == 'admin' && params.password == '123456'){
            return {
                code: 200,
                data: {
                    token: 'asfsavcsacdsf', // 假设返回的token
                    username: params.username,
                    // other info...
                },
                msg: 'success'
            };
        }else{
            return {
                code: 500,
                msg: '用户名或密码错误'
            };
        }


        // return Axios('/api/user', {
        //     method: 'get',
        //     responseType: 'json',
        //     data: {
        //         ...params
        //     },
        // })
    }

    static async resgister(params: LoginParams): Promise<HttpResponse> {
        return Axios('/api/user/resgister', {
            method: 'get',
            responseType: 'json',
            params: {
                ...params
            },
        })
    }
}