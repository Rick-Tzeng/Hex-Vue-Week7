<template>
  <AdminNavBar></AdminNavBar>
  <div class="container admin">
    <h1 class="my-3 text-center fw-bold">管理者頁面</h1>
    <router-view v-if="isShow"/>
  </div>
</template>

<script>
import AdminNavBar from '@/components/AdminNavBar.vue';

export default {
  data() {
    return {
      isShow: false,
    };
  },
  components: {
    AdminNavBar,
  },
  inject: ['emitter'],
  methods: {
    isLegalUser() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      if (token) {
        this.$http.defaults.headers.common.Authorization = token;
        const apiUrl = `${process.env.VUE_APP_API}/api/user/check`;
        this.$http.post(apiUrl)
          .then(() => {
            this.emitter.emit('push-message', {
              style: 'success',
              title: '登入',
              content: '驗證成功!',
            });
            this.isShow = true;
          })
          .catch((err) => {
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '登入',
              content: err.response.data.message,
            });
            this.$router.push('/');
          });
      } else {
        this.emitter.emit('push-message', {
          style: 'danger',
          title: '登入',
          content: '請重新登入',
        });
        this.$router.push('/');
      }
    },
  },
  mounted() {
    this.isLegalUser();
  },
};
</script>

<style scoped>
.admin {
  margin-top: 15vh;
}
</style>
