// 管理用户数据相关
import { defineStore } from 'pinia'
import { LoginAPI } from '../api/user'
import { ref } from 'vue'
import { useCartStore } from './cart'
import { mergeCartAPI } from '../api/cart'
export const useUserStore = defineStore('user', () => {
    const cartStore = useCartStore()
    //定义state
    const userInfo = ref({})
    //定义action
    const getUserInfo = async ({ account, password }) => {
        const res = await LoginAPI({ account, password })
        userInfo.value = res.result
        // 合并购物车
        await mergeCartAPI(cartStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count
            }
        }))
        cartStore.getCartList()
    }
    // 退出时清除用户信息
    const clearUserInfo = () => {
        userInfo.value = {}
        cartStore.clearCart()
    }
    //以对象格式把state、action return
    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
}, {
    persist: {
        enabled: true
    }
})