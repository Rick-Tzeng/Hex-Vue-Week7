<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="my-3">訂單列表</h1>
    <div>
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="this.$refs.deleteModal.openModal('全部訂單')"
        :disabled="orders.length === 0"
      >
        刪除全部訂單
      </button>
    </div>
  </div>
  <table class="table table-striped table-hover align-middle">
    <thead class="bg-dark text-white text-center">
      <tr>
        <th>編號</th>
        <th>購買時間</th>
        <th>客戶 Email</th>
        <th>購買項目</th>
        <th>購買數量／單位</th>
        <th>應付總金額</th>
        <th>是否已付款</th>
        <th>詳細內容</th>
      </tr>
    </thead>
    <!-- tbody Start -->
    <tbody>
      <tr v-for="(order, index) in orders" :key="order.id">
        <!-- 編號 -->
        <td class="fw-bold text-center">{{ index + 1 }}</td>
        <!-- 購買時間 (轉換時間格式) -->
        <td class="text-center">
          {{ new Date(order.create_at * 1000).toLocaleDateString() }}
        </td>
        <!-- 客戶 Email -->
        <td class="text-center">{{ order.user.email }}</td>
        <!-- 購買項目 -->
        <td class="text-center">
          <ul class="list-group list-group-flush">
            <li class="list-group-item bg-transparent border-0"
              v-for="(item, key) in order.products" :key="key">
              {{ item.product.title }}
            </li>
          </ul>
        </td>
        <!-- 購買數量／單位 -->
        <td class="text-end">
          <ul class="list-group list-group-flush">
            <li class="list-group-item bg-transparent border-0 pe-5"
              v-for="(item, key) in order.products" :key="key">
              {{ item.qty }} ／ {{ item.product.unit }}
            </li>
          </ul>
        </td>
        <!-- 應付總金額 -->
        <td class="text-end fw-bold pe-4">
          NT$ {{ order.total }}
        </td>
        <!-- 是否已付款 -->
        <td>
          <div class="form-check form-switch">
            <input
              class="form-check-input ms-4 me-2"
              type="checkbox"
              :id="order.id"
              v-model="order.is_paid"
              @change="putOrder(order.id, order)"
            >
            <label v-if="order.is_paid"
              class="form-check-label text-success"
              :for="order.id"
            >
              已付款
            </label>
            <label v-else
              class="form-check-label text-danger"
              :for="order.id"
            >
              未付款
            </label>
          </div>
        </td>
        <!-- 詳細內容 -->
        <td class="text-center">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="this.$refs.modal.openModal(order)"
              :disabled="selectedItemId === order.id"
            >
              檢視
            </button>
            <button
              class="btn btn-outline-danger"
              type="button"
              @click="this.$refs.deleteModal.openModal(order)"
              :disabled="selectedItemId === order.id"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
    <!-- tbody End -->
  </table>

  <!-- Pagination Component -->
  <div class="py-5">
    <PaginationComp
      :pagination="pagination"
      @get-request="getOrders"
    ></PaginationComp>
  </div>

  <!-- Order Modal -->
  <OrderModal
    ref="modal"
    @put-order="putOrder"
  ></OrderModal>

  <!-- DeleteModal Component -->
  <DeleteModal
    ref="deleteModal"
    @del-item="deleteOrder"
  ></DeleteModal>
</template>

<script>
import OrderModal from '@/components/OrderModal.vue';
import PaginationComp from '@/components/PaginationComp.vue';
import DeleteModal from '@/components/DeleteModal.vue';

export default {
  data() {
    return {
      orders: [],
      pagination: {},
      selectedItemId: '', // disabled 按鈕用
      loader: {},
    };
  },
  components: {
    OrderModal,
    PaginationComp,
    DeleteModal,
  },
  inject: ['emitter'],
  methods: {
    // 取得訂單列表
    getOrders(page = 1) {
      this.loader = this.$loading.show();
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders/?page=${page}
      `;
      this.$http.get(apiUrl)
        .then((res) => {
          const { orders, pagination } = res.data;
          this.orders = orders;
          this.pagination = pagination;
          this.loader.hide();
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '取得訂單',
            content: err.response.data.message,
          });
          this.loader.hide();
        });
    },
    // 更新單筆訂單
    putOrder(oid, order) {
      this.selectedItemId = oid;
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${oid}
      `;
      this.$http.put(apiUrl, { data: order })
        .then((res) => {
          this.$refs.modal.closeModal();
          this.getOrders(this.pagination.current_page);
          this.emitter.emit('push-message', {
            style: 'primary',
            title: '更新訂單',
            content: res.data.message,
          });
          this.selectedItemId = '';
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新訂單',
            content: err.response.data.message,
          });
          this.selectedItemId = '';
        });
    },
    // 刪除單筆訂單
    deleteOrder(oid) {
      if (oid === 'all') {
        this.deleteAllOrders();
      } else {
        this.selectedItemId = oid;
        const apiUrl = `
          ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${oid}
        `;
        this.$http.delete(apiUrl)
          .then(() => {
            this.getOrders();
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '刪除訂單',
              content: '訂單刪除成功!',
            });
            this.selectedItemId = '';
            this.$refs.deleteModal.closeModal();
          })
          .catch((err) => {
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '刪除訂單',
              content: err.response.data.message,
            });
            this.selectedItemId = '';
            this.$refs.deleteModal.closeModal();
          });
      }
    },
    // 刪除全部訂單
    deleteAllOrders() {
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders/all
      `;
      this.$http.delete(apiUrl)
        .then(() => {
          this.getOrders();
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除全部訂單',
            content: '全部訂單刪除成功!',
          });
          this.$refs.deleteModal.closeModal();
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除全部訂單',
            content: err.response.data.message,
          });
          this.$refs.deleteModal.closeModal();
        });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
