// 封装购物车模块
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useCartStore = defineStore('cart', () => {
    const cartList = ref([])
    const addCart = (goods) => {
        // 添加购物车操作
        // 已添加过 - count + 1
        // 没有添加过 - 直接push
        // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
        const item = cartList.value.find((item) => goods.skuId === item.skuId)
        if (item) {
            item.count++
        } else {
            cartList.value.push(goods)
        }

    }
    // 删除逻辑
    const delCart = (skuId) => {
        const idx = cartList.value.findIndex((item) => skuId === item.skuId)
        cartList.value.splice(idx, 1)
    }
    // 计算属性
    // 1. 总的数量 所有项的count之和
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    // 2. 总价 所有项的count*price之和
    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
    // 是否全选
    const isAll = computed(() => cartList.value.every((item) => item.selected))
    // 已选择数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
    // 已选择商品价格合计
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))
    // 单选逻辑
    const singleCheck = (skuId, selected) => {
        // 通过skuid找到要修改的那一项,然后把它的selected修改为传过来的selected
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.selected = selected
    }
    // 全选功能
    const allCheck = (selected) => {
        cartList.value.forEach(item => item.selected = selected)
    }


    return {
        cartList,
        allCount,
        allPrice,
        isAll,
        selectedCount,
        selectedPrice,
        addCart,
        delCart,
        singleCheck,
        allCheck

    }
}, {
    persist: true
})