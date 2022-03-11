<template>
  <div class="container-fluid not-found-bg">
    <div class="not-found text-center">
      <h1 class="fw-bold mb-5">{{ err }}</h1>
      <p class="h1 p-5">{{ msg }}</p>
      <router-link to="/" id="back__home" class="h1 p-5">
        👉 回到登入頁面
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      err: '⚠ Code 404 ERROR ⚠',
      msg: 'Sorry...找不到該網頁🤔',
    };
  },
};
</script>

<style scoped>
.not-found-bg {
  background-color: var(--bs-gray-300);
}

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#back__home {
  color: var(--bs-success);
  text-decoration: none;
  transition: 0.6s;
}

#back__home:hover {
  background-color: var(--bs-light);
  transform: translateY(-5px);
  box-shadow: 0 2px 4px var(--bs-gray-600);
}
</style>
