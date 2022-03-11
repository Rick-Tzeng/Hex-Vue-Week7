<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="my-3">產品列表</h1>
    <button
      class="btn btn-success"
      type="button"
      @click="this.$refs.modal.openModal(true, {})"
    >
      新增產品
    </button>
  </div>

  <!-- Pagination Component -->
  <div class="py-5">
    <PaginationComp
      :pagination="pagination"
      @get-request="getProducts"
    ></PaginationComp>
  </div>

  <!-- Render Products Start -->
  <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-5">
    <div class="col" v-for="product in products" :key="product.id">
      <div class="card h-100">
        <div :style="`
          height: 240px;
          background-image: url(${product.imageUrl});
          background-size: cover;
          background-position: center 40%;
          `">
        </div>
        <div class="card-body">
          <div class="card-title fw-bold">
            {{ product.title }}
          </div>
          <div class="card-text">
            {{ product.description }}
          </div>
        </div>
        <div class="form-check form-switch d-flex justify-content-end pe-3">
          <input
            class="form-check-input me-1"
            type="checkbox"
            :id="product.id"
            v-model="product.is_enabled"
            :true-value="1"
            :false-value="0"
            @change="putProduct(product.id, product)"
            :disabled="selectedItemId === product.id"
          />
          <label v-if="product.is_enabled"
            class="form-check-label text-success fw-bold"
            :for="product.id"
          >
            已啟用
          </label>
          <label v-else
            class="form-check-label text-muted"
            :for="product.id"
          >
            未啟用
          </label>
        </div>
        <div class="p-3">
          <div v-if="!product.price" class="h4">
            {{ product.origin_price }} 元 / {{ product.unit }}
          </div>
          <div v-else class="text-end">
            <del class="text-muted">
              原價 {{ product.origin_price }}
              元 / {{ product.unit }}
            </del>
            <div>
              現在只要<span class="h4 text-danger px-1">{{ product.price }}</span>
              元 / {{ product.unit }}
            </div>
          </div>
        </div>
        <div class="card-footer d-flex">
          <button
            class="btn btn-primary"
            type="button"
            @click="this.$refs.modal.openModal(false, product)"
            :disabled="selectedItemId === product.id"
          >
            編輯
          </button>
          <button
            class="btn btn-danger ms-auto"
            type="button"
            @click="this.$refs.deleteModal.openModal(product)"
            :disabled="selectedItemId === product.id"
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Render Products End -->

  <!-- Pagination Component -->
  <div class="py-5">
    <PaginationComp
      :pagination="pagination"
      @get-request="getProducts"
    ></PaginationComp>
  </div>

  <!-- ProductModal Component -->
  <ProductModal
    ref="modal"
    @post-product="postProduct"
    @put-product="putProduct"
  ></ProductModal>

  <!-- DeleteModal Component -->
  <DeleteModal
    ref="deleteModal"
    @del-item="deleteProduct"
  ></DeleteModal>
</template>

<script>
import PaginationComp from '@/components/PaginationComp.vue';
import ProductModal from '@/components/ProductModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      selectedItemId: '', // disabled 按鈕用
      loader: {},
    };
  },
  components: {
    PaginationComp,
    ProductModal,
    DeleteModal,
  },
  inject: ['emitter'],
  methods: {
    // 取得產品列表
    getProducts(page = 1) {
      this.loader = this.$loading.show();
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products/?page=${page}
      `;
      this.$http.get(apiUrl)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
          this.loader.hide();
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '取得產品',
            content: err.response.data.message,
          });
          this.loader.hide();
        });
    },
    // 新增單一產品
    postProduct(product) {
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product
      `;
      this.$http.post(apiUrl, { data: product })
        .then((res) => {
          this.$refs.modal.closeModal();
          this.getProducts();
          this.emitter.emit('push-message', {
            style: 'success',
            title: '新增產品',
            content: `${res.data.message}：${product.title}`,
          });
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '新增產品',
            content: err.response.data.message,
          });
        });
    },
    // 更新單一產品
    putProduct(pid, product) {
      this.selectedItemId = pid;
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${pid}
      `;
      this.$http.put(apiUrl, { data: product })
        .then((res) => {
          this.$refs.modal.closeModal();
          this.getProducts(this.pagination.current_page);
          this.emitter.emit('push-message', {
            style: 'primary',
            title: '更新產品',
            content: `${res.data.message}：${product.title}`,
          });
          this.selectedItemId = '';
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新產品',
            content: err.response.data.message,
          });
          this.selectedItemId = '';
        });
    },
    // 刪除單一產品
    deleteProduct(pid) {
      this.selectedItemId = pid;
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${pid}
      `;
      this.$http.delete(apiUrl)
        .then((res) => {
          this.getProducts();
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除產品',
            content: res.data.message,
          });
          this.selectedItemId = '';
          this.$refs.deleteModal.closeModal();
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除產品',
            content: err.response.data.message,
          });
          this.selectedItemId = '';
          this.$refs.deleteModal.closeModal();
        });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
