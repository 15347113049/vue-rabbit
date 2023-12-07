<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import powerSet from "./power-set";
// 商品数据
let pathMap = {};
const goods = ref({});
const getGoods = async () => {
  // 1135076  初始化就有无库存的规格
  // 1369155859933827074 更新之后有无库存项（蓝色-20cm-中国）
  const res = await axios.get(
    "http://pcapi-xiaotuxian-front-devtest.itheima.net/goods?id=1369155859933827074"
  );
  goods.value = res.data.result;
  pathMap = getPathMap(goods.value);
  // 初始化更新按钮状态
  initDisabledState(goods.value.specs, pathMap);
};
onMounted(() => getGoods());

// 切换选中状态
const changeSelected = (item, val) => {
  if (val.disabled) return;
  // 同排和当前点击项
  if (val.selected) {
    //激活状态就取消激活
    val.selected = false;
  } else {
    item.values.forEach((val) => (val.selected = false));
    val.selected = true;
  }
  updateDisabledState(goods.value.specs, pathMap);
  const index = getSelectedValues(goods.value.specs).findIndex(
    (item) => item === undefined
  );
  if (index > -1) {
    console.log("找到了，信息不完整");
  } else {
    const key = getSelectedValues(goods.value.specs).join("-");
    const skuIds = pathMap[key];
    // 以skuId作为匹配项去goods.value.skus数组中找
    const skuObj = goods.value.skus.find((item) => item.id === skuIds[0]);
    console.log("sku对象为", skuObj);
  }
};
// 生成有效路径字典对象
const getPathMap = (goods) => {
  const pathMap = {};
  // 1. 得到所有有效的Sku集合
  const effectivesSkus = goods.skus.filter((sku) => sku.inventory > 0);
  // 2. 根据有效的Sku集合使用powerSet算法得到所有子集 [1,2] => [[1], [2], [1,2]]
  effectivesSkus.forEach((sku) => {
    // 2.1 获取可选规格值数组
    const selectedValArr = sku.specs.map((val) => val.valueName);
    // 2.2 获取可选值数组的子集
    const valueArrPowerSet = powerSet(selectedValArr);
    // 3. 根据子集生成路径字典对象
    // 3.1 遍历子集 往pathMap中插入数据
    valueArrPowerSet.forEach((arr) => {
      // 根据Arr得到字符串的key，约定使用-分割 ['蓝色'，'美国'] => '蓝色-美国'
      const key = arr.join("-");
      // 给pathMap设置数据
      if (pathMap[key]) {
        pathMap[key].push(sku.id);
      } else {
        pathMap[key] = [sku.id];
      }
    });
  });
  return pathMap;
};

// 1. 定义初始化函数
// specs：商品源数据 pathMap：路径字典
const initDisabledState = (specs, pathMap) => {
  // 约定：每一个按钮的状态由自身的disabled进行控制
  specs.forEach((item) => {
    item.values.forEach((val) => {
      // 路径字典中查找是否有数据 有-可以点击 没有-禁用
      val.disabled = !pathMap[val.name];
    });
  });
};

// 获取选中匹配数组 ['黑色',undefined,undefined]
const getSelectedValues = (specs) => {
  const arr = [];
  specs.forEach((spec) => {
    const selectedVal = spec.values.find((value) => value.selected);
    arr.push(selectedVal ? selectedVal.name : undefined);
  });
  return arr;
};

const updateDisabledState = (specs, pathMap) => {
  // 约定：每一个按钮的状态由自身的disabled进行控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs);
    item.values.forEach((val) => {
      if (val.selected) return;
      const _seletedValues = [...selectedValues];
      _seletedValues[i] = val.name;
      const key = _seletedValues.filter((value) => value).join("-");
      // 路径字典中查找是否有数据 有-可以点击 没有-禁用
      val.disabled = !pathMap[key];
    });
  });
};
</script>

<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <!-- 图片类型规格 -->
          <img
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSelected(item, val)"
          />
          <!-- 文字类型规格 -->
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            v-else
            @click="changeSelected(item, val)"
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<style scoped lang="scss">
@mixin sku-state-mixin {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: #27ba9b;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      > img {
        width: 50px;
        height: 50px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }

      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }
    }
  }
}
</style>