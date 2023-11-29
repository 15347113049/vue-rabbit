// 封装banner轮播图相关业务员代码
import { ref, onMounted } from 'vue'
import { getBannerAPI } from '../../../api/home';
export function useBanner() {
    const bannerList = ref([]);

    const getBanner = async () => {
        const res = await getBannerAPI({ distributionSite: "2" });
        bannerList.value = res.result;
    };

    onMounted(() => getBanner());
    return {
        bannerList
    }
}