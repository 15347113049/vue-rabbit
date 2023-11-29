import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryAPI } from "@/api/layout";

export const useCategoryStore = defineStore('category', () => {
    // 导航内的逻辑
    // state 导航列表数据
    const categoryList = ref([]);
    // action 获取导航数据的方法
    const getCategory = async () => {
        const res = await getCategoryAPI();
        categoryList.value = res.result;
        console.log(categoryList.value);
    };

    return {
        categoryList,
        getCategory
    }
})
