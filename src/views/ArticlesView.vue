<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="my-3">貼文列表</h1>
    <div>
      <button
        class="btn btn-success"
        type="button"
        @click="this.$refs.modal.openModal(true, {})"
      >
        新增貼文
      </button>
    </div>
  </div>
  <table class="table table-striped table-hover align-middle text-center">
    <thead class="bg-dark text-white">
      <tr>
        <th>編號</th>
        <th>標題</th>
        <th>作者</th>
        <th>貼文描述</th>
        <th>建立日期</th>
        <th>是否公開</th>
        <th>編輯內容</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(article, index) in articles" :key="'a' + index">
        <td class="fw-bold">{{ index + 1 }}</td>
        <td>{{ article.title }}</td>
        <td>{{ article.author }}</td>
        <td>{{ article.description }}</td>
        <td>{{ new Date(article.create_at * 1000).toLocaleDateString() }}</td>
        <td>
          <span class="fw-bold">公開狀態：</span>
          <span v-if="article.isPublic" class="text-success fw-bold">
            已公開
          </span>
          <span v-else class="text-muted">
            未公開
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="getArticle(article.id)"
              :disabled="selectedItemId === article.id"
            >
              修改
            </button>
            <button
              class="btn btn-outline-danger"
              type="button"
              @click="this.$refs.deleteModal.openModal(article)"
              :disabled="selectedItemId === article.id"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Pagination Component -->
  <div class="py-5">
    <PaginationComp
      :pagination="pagination"
      @get-request="getArticles"
    ></PaginationComp>
  </div>

  <!-- ArticleModal Component -->
  <ArticleModal
    ref="modal"
    @post-article="postArticle"
    @put-article="putArticle"
  ></ArticleModal>

  <!-- DeleteModal Component -->
  <DeleteModal
    ref="deleteModal"
    @del-item="deleteArticle"
  ></DeleteModal>
</template>

<script>
import ArticleModal from '@/components/ArticleModal.vue';
import PaginationComp from '@/components/PaginationComp.vue';
import DeleteModal from '@/components/DeleteModal.vue';

export default {
  data() {
    return {
      articles: [],
      pagination: {},
      selectedItemId: '', // disabled 按鈕用
      loader: {},
    };
  },
  components: {
    ArticleModal,
    PaginationComp,
    DeleteModal,
  },
  inject: ['emitter'],
  methods: {
    // 取得貼文列表
    getArticles(page = 1) {
      this.loader = this.$loading.show();
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/articles/?page=${page}
      `;
      this.$http.get(apiUrl)
        .then((res) => {
          const { articles, pagination } = res.data;
          this.articles = articles;
          this.pagination = pagination;
          this.loader.hide();
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '取得貼文',
            content: err.response.data.message,
          });
          this.loader.hide();
        });
    },
    // 取得單篇貼文 (貼文 content 打這支 api 才找得到)
    getArticle(aid) {
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${aid}
      `;
      this.$http.get(apiUrl)
        .then((res) => {
          const { article } = res.data;
          this.$refs.modal.openModal(false, article);
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '取得單篇貼文',
            content: err.response.data.message,
          });
        });
    },
    // 新增貼文
    postArticle(article) {
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article
      `;
      this.$http.post(apiUrl, { data: article })
        .then((res) => {
          this.$refs.modal.closeModal();
          this.getArticles();
          this.emitter.emit('push-message', {
            style: 'success',
            title: '新增貼文',
            content: res.data.message,
          });
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '新增貼文',
            content: err.response.data.message,
          });
        });
    },
    // 更新貼文
    putArticle(aid, article) {
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${aid}
      `;
      this.$http.put(apiUrl, { data: article })
        .then((res) => {
          this.$refs.modal.closeModal();
          this.getArticles();
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新貼文',
            content: res.data.message,
          });
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新貼文',
            content: err.response.data.message,
          });
        });
    },
    // 刪除貼文
    deleteArticle(aid) {
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${aid}
      `;
      this.$http.delete(apiUrl)
        .then((res) => {
          console.log(res);
          this.$refs.deleteModal.closeModal();
          this.getArticles();
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除貼文',
            content: res.data.message,
          });
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除貼文',
            content: err.response.data.message,
          });
          this.$refs.deleteModal.closeModal();
        });
    },
  },
  mounted() {
    this.getArticles();
  },
};
</script>
