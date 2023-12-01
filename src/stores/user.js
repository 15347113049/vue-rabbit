// 管理用户数据相关
import { defineStore } from 'pinia'
import { LoginAPI } from '../api/user'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
    //定义state
    const userInfo = ref([])
    //定义action
    const getUserInfo = async ({ account, password }) => {
        const res = await LoginAPI({ account, password })
        userInfo.value = res
    }
    //以对象格式把state、action return
    return {
        userInfo,
        getUserInfo
    }
}, {
    persist: {
        enabled: true
    }
})