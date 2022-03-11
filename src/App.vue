<template>
  <router-view />
  <!-- 在 main.js 全域註冊的元件 -->
  <ToastMessage></ToastMessage>
</template>

<script>
import emitter from '@/methods/eventBus';

export default {
  // 提供給需要 .emit 資料給 ToastMessage 的元件
  provide() {
    return {
      emitter,
    };
  },
};
</script>

<style lang="scss">
@import './assets/stylesheets/all';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>
