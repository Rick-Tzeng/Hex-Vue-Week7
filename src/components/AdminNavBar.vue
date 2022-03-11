<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid">
      <router-link
        class="navbar-brand text-white fs-1 fw-bold" to="/admin">
        後台首頁
      </router-link>
      <button type="button" class="d-lg-none hamburger"
        data-bs-toggle="collapse" data-bs-target="#navigation"
        ref="hamburger" @click="addIsActiveClass">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="collapse navbar-collapse" id="navigation">
        <ul class="navbar-nav text-center">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/admin/products">
              產品列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/admin/orders">
              訂單列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/admin/coupons">
              優惠券列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/admin/articles">
              貼文列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-white"
              to=""
              @click.prevent="logout"
            >
              登出
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';

export default {
  data() {
    return {
      hamburger: {},
    };
  },
  inject: ['emitter'],
  methods: {
    addIsActiveClass() {
      this.hamburger.classList.toggle('is-active');
    },
    logout() {
      const apiUrl = `${process.env.VUE_APP_API}/logout`;
      this.$http.post(apiUrl)
        .then((res) => {
          this.emitter.emit('push-message', {
            style: 'success',
            title: '登出',
            content: `${res.data.message}成功`,
          });
          this.$router.push('/');
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '登出',
            content: err.response.data.message,
          });
        });
    },
  },
  mounted() {
    this.hamburger = this.$refs.hamburger;
  },
};
</script>

<style src='../assets/stylesheets/frontnavbar.css' scoped></style>
