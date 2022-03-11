<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="my-3">優惠券列表</h1>
    <div>
      <button
        class="btn btn-success"
        type="button"
        @click="this.$refs.modal.openModal(true, {})"
      >
        新增優惠券
      </button>
    </div>
  </div>
  <table class="table table-striped table-hover align-middle text-center">
    <thead class="bg-dark text-white">
      <tr>
        <th>編號</th>
        <th>優惠券名稱</th>
        <th>優惠折扣(%)</th>
        <th>使用期限</th>
        <th>是否啟用</th>
        <th>編輯內容</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(coupon, index) in coupons" :key="'c' + index">
        <td class="fw-bold">{{ index + 1 }}</td>
        <td>{{ coupon.title }}</td>
        <td>{{ coupon.percent }} %</td>
        <td>{{ new Date(coupon.due_date * 1000).toLocaleDateString() }}</td>
        <td>
          <span class="fw-bold">啟用狀態：</span>
          <span v-if="coupon.is_enabled" class="text-success fw-bold">
            已啟用
          </span>
          <span v-else class="text-muted">
            未啟用
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="this.$refs.modal.openModal(false, coupon)"
              :disabled="selectedItemId === coupon.id"
            >
              修改
            </button>
            <button
              class="btn btn-outline-danger"
              type="button"
              @click="this.$refs.deleteModal.openModal(coupon)"
              :disabled="selectedItemId === coupon.id"
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
      @get-request="getCoupons"
    ></PaginationComp>
  </div>

  <!-- CouponModal Component -->
  <CouponModal
    ref="modal"
    @post-coupon="postCoupon"
    @put-coupon="putCoupon"
  ></CouponModal>

  <!-- DeleteModal Component -->
  <DeleteModal
    ref="deleteModal"
    @del-item="deleteCoupon"
  ></DeleteModal>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';
import PaginationComp from '@/components/PaginationComp.vue';
import DeleteModal from '@/components/DeleteModal.vue';

export default {
  data() {
    return {
      coupons: [],
      pagination: {},
      selectedItemId: '', // disabled 按鈕用
      loader: {},
    };
  },
  components: {
    CouponModal,
    PaginationComp,
    DeleteModal,
  },
  inject: ['emitter'],
  methods: {
    // 取得優惠券列表
    getCoupons(page = 1) {
      this.loader = this.$loading.show();
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons/?page=${page}
      `;
      this.$http.get(apiUrl)
        .then((res) => {
          const { coupons, pagination } = res.data;
          this.coupons = coupons;
          this.pagination = pagination;
          this.loader.hide();
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '取得優惠券',
            content: err.response.data.message,
          });
          this.loader.hide();
        });
    },
    // 新增優惠券
    postCoupon(coupon) {
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon
      `;
      this.$http.post(apiUrl, { data: coupon })
        .then((res) => {
          this.$refs.modal.closeModal();
          this.getCoupons();
          this.emitter.emit('push-message', {
            style: 'success',
            title: '新增優惠券',
            content: `${res.data.message}：${coupon.title}`,
          });
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '新增優惠券',
            content: err.response.data.message,
          });
        });
    },
    // 更新優惠券
    putCoupon(cid, coupon) {
      this.selectedItemId = cid;
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${cid}
      `;
      this.$http.put(apiUrl, { data: coupon })
        .then((res) => {
          this.$refs.modal.closeModal();
          this.getCoupons();
          this.emitter.emit('push-message', {
            style: 'primary',
            title: '更新優惠券',
            content: `${res.data.message}：${coupon.title}`,
          });
          this.selectedItemId = '';
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新優惠券',
            content: err.response.data.message,
          });
          this.selectedItemId = '';
        });
    },
    // 刪除優惠券
    deleteCoupon(cid) {
      this.selectedItemId = cid;
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${cid}
      `;
      this.$http.delete(apiUrl)
        .then((res) => {
          this.getCoupons();
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除優惠券',
            content: res.data.message,
          });
          this.selectedItemId = '';
          this.$refs.deleteModal.closeModal();
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除優惠券',
            content: err.response.data.message,
          });
          this.selectedItemId = '';
          this.$refs.deleteModal.closeModal();
        });
    },
  },
  mounted() {
    this.getCoupons();
  },
};
</script>
