<script setup>
import HomeCategory from "./components/HomeCategory.vue";
import HomeBanner from "./components/HomeBanner.vue";
import HomeNew from "./components/HomeNew.vue";
import HomeHot from "./components/HomeHot.vue";
import HomeProduct from "./components/HomeProduct.vue";
import HomePanel from "./components/HomePanel.vue";
</script>

<template>
  <div class="container">
    <HomeCategory />
    <HomeBanner />
    <HomeNew />
    <HomeHot />
    <HomeProduct />
    <!-- 测试面板组件 -->
    <HomePanel title="新鲜好物">
      <div>我是插槽</div>
    </HomePanel>
  </div>
</template>