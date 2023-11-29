// 封装category轮播图相关业务员代码
import { ref, onMounted } from 'vue'
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { getTopCategoryAPI } from "@/api/category";
export function useCategory() {
    const categoryData = ref({});
    const route = useRoute();
    const getCategory = async (id = route.params.id) => {
        const res = await getTopCategoryAPI(id);
        categoryData.value = res.result;
    };
    onMounted(() => getCategory());
    // 目标：路由参数变化时，可以把分类数据接口重新发送
    onBeforeRouteUpdate((to) => {
        getCategory(to.params.id);
    });
    return {
        categoryData
    }
}