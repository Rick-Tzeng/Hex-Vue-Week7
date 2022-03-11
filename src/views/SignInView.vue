<template>
  <div class="container-fluid login-bg">
    <h1 class="fw-bold text-success text-center pt-5">後台登入頁面</h1>
    <div class="row justify-content-center">
      <div class="col-10 col-md-6 mt-3 rounded-4">
        <form>
          <div class="form-floating my-5">
            <input
              class="form-control"
              type="email"
              id="email"
              style="user-select:none"
              placeholder="name@example.com"
              required
              v-model="user.username"
            />
            <label class="fw-bold text-muted" for="email">Email Address</label>
          </div>
          <div class="form-floating my-5">
            <input
              class="form-control"
              type="password"
              id="password"
              style="user-select:none"
              placeholder="password"
              required
              v-model="user.password"
            />
            <label class="fw-bold text-muted" for="password">Password</label>
          </div>
          <button
            class="btn btn-lg btn-success w-100 mb-5"
            type="button"
            @click="signIn"
          >登入</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      loader: {},
    };
  },
  inject: ['emitter'],
  methods: {
    signIn() {
      this.loader = this.$loading.show();
      const apiUrl = `${process.env.VUE_APP_API}/admin/signin`;
      this.$http.post(apiUrl, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          this.loader.hide();
          this.$router.push('/admin/products');
        })
        .catch(() => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '登入頁面',
            content: '【登入失敗】請確認帳號密碼是否正確',
          });
          this.loader.hide();
        });
    },
  },
};
</script>

<style>
.login-bg {
  height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1544991185-13fe5d113fe3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80');
  background-size: cover;
}
</style>
