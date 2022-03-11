<template>
  <div class="modal fade" ref="orderModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <!-- Order Start -->
      <div class="modal-content border-0">
        <div class="modal-header bg-primary">
          <h5 class="modal-title text-white">
            訂單內容
          </h5>
          <button type="button" class="btn-close bg-white"
            data-bs-dismiss="modal" aria-label="Close"
          ></button>
        </div>
        <!-- Order Content Start -->
        <div class="modal-body">
          <div class="row">
            <div class="mt-4">
              <h3>客戶資料</h3>
            </div>
            <table class="table table-striped table-hover align-middle">
              <tbody>
                <tr>
                  <td>姓名</td>
                  <td>{{ order.user.name }}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{{ order.user.email }}</td>
                </tr>
                <tr>
                  <td>電話</td>
                  <td>{{ order.user.tel }}</td>
                </tr>
                <tr>
                  <td>地址</td>
                  <td>{{ order.user.address }}</td>
                </tr>
              </tbody>
            </table>
            <div class="mt-4">
              <h3>訂單詳細內容</h3>
            </div>
            <table class="table table-striped table-hover align-middle">
              <tbody>
                <tr>
                  <td>訂單編號</td>
                  <td>{{ order.id }}</td>
                </tr>
                <tr>
                  <td>購買時間</td>
                  <td>
                  {{ new Date(order.create_at * 1000).toLocaleDateString() }}
                  </td>
                </tr>
                <tr>
                  <td>付款狀態</td>
                  <td>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input me-2"
                        type="checkbox"
                        :id="order.id"
                        v-model="order.is_paid"
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
                </tr>
                <tr>
                  <td>應付總金額</td>
                  <td>NT$ {{ order.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row mt-5">
            <h3>選購商品</h3>
            <table class="table table-striped table-hover align-middle text-end">
              <thead class="bg-dark text-white">
                <tr>
                  <th class="pe-5">商品名稱</th>
                  <th class="pe-5">購買數量／單位</th>
                  <th class="pe-5">金額</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.products" :key="item.id">
                  <td class="pe-5">{{ item.product.title }}</td>
                  <td class="pe-5">
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item bg-transparent border-0">
                        {{ item.qty }} ／ {{ item.product.unit }}
                      </li>
                    </ul>
                  </td>
                  <td class="pe-5">NT$ {{ item.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Order Content End -->
        <div class="modal-footer">
          <button
            class="btn btn-primary"
            type="button"
            @click="$emit('put-order', order.id, order)"
          >
            修改付款狀態
          </button>
          <button
            class="btn btn-secondary"
            type="button"
            data-bs-dismiss="modal"
          >
            取消
          </button>
        </div>
      </div>
      <!-- Order End -->
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';

export default {
  data() {
    return {
      modal: {},
      order: {
        products: {},
        user: {},
      },
    };
  },
  methods: {
    openModal(order) {
      this.order = JSON.parse(JSON.stringify(order));
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.orderModal, {
      backdrop: 'static',
      keyboard: false,
    });
  },
};
</script>

<style scoped>
tbody > tr > td:nth-child(1) {
  font-weight: bold;
}
</style>
