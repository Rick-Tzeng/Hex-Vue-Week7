<template>
  <div class="modal fade" ref="couponModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content border-0">
        <!-- isNewCoupon Start -->
        <div v-if="isNewCoupon">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">
              新增優惠券
            </h5>
            <button type="button" class="btn-close bg-white"
              data-bs-dismiss="modal" aria-label="Close"
            ></button>
          </div>
        </div>
        <div v-else>
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white">
              編輯優惠券
            </h5>
            <button type="button" class="btn-close bg-white"
              data-bs-dismiss="modal" aria-label="Close"
            ></button>
          </div>
        </div>
        <!-- isNewCoupon End -->
        <!-- Coupon Content Start -->
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label" for="coupon-title">優惠券名稱</label>
            <input
              class="form-control"
              type="text"
              id="coupon-title"
              v-model="coupon.title"
              placeholder="請輸入優惠券名稱"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="coupon-code">優惠碼</label>
            <input
              class="form-control"
              type="text"
              id="coupon-code"
              v-model="coupon.code"
              placeholder="請輸入優惠碼"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="coupon-due_date">使用期限</label>
            <input
              class="form-control"
              type="date"
              id="coupon-due_date"
              v-model="due_date"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="coupon-percent">優惠折扣（0%～100%）</label>
            <input
              class="form-control"
              type="number"
              id="coupon-percent"
              v-model.number="coupon.percent"
              placeholder="請輸入優惠折扣"
              min="0"
              max="100"
              oninput="this.value = !!this.value
                && Math.abs(this.value) >= 0
                && Math.abs(this.value) <= 100
                ? Math.abs(this.value) : null"
              required
            />
          </div>
          <div class="mb-3">
            <div class="form-check form-switch">
              <span class="fw-bold">啟用狀態：</span>
              <input
                class="form-check-input"
                type="checkbox"
                id="is_enabled"
                v-model="coupon.is_enabled"
                :true-value="1"
                :false-value="0"
                required
              />
              <label v-if="coupon.is_enabled"
                class="form-check-label text-success fw-bold"
                for="is_enabled"
              >
                已啟用
              </label>
              <label v-else
                class="form-check-label text-muted"
                for="is_enabled"
              >
                未啟用
              </label>
            </div>
          </div>
        </div>
        <!-- Coupon Content End -->
        <!-- Post or Put Start -->
        <div class="modal-footer">
          <div v-if="isNewCoupon">
            <button
              class="btn btn-success"
              type="button"
              @click="$emit('post-coupon', coupon)"
            >
              確認新增
            </button>
          </div>
          <div v-else>
            <button
              class="btn btn-primary"
              type="button"
              @click="$emit('put-coupon', coupon.id, coupon)"
            >
              確認編輯
            </button>
          </div>
          <button
            class="btn btn-secondary"
            type="button"
            data-bs-dismiss="modal"
          >
            取消
          </button>
        </div>
        <!-- Post or Put End -->
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';

export default {
  data() {
    return {
      modal: {},
      coupon: {},
      due_date: '',
      isNewCoupon: false,
    };
  },
  methods: {
    openModal(isNewCoupon, coupon) {
      this.isNewCoupon = isNewCoupon;
      // 判斷是否為「新增」或「編輯」優惠券
      if (isNewCoupon) {
        this.coupon = {};
        this.due_date = '';
      } else {
        this.coupon = JSON.parse(JSON.stringify(coupon));
        // 因 input type="date" 只吃 YYYY-MM-DD 格式，所以改成用此方式抓時間
        const dateAndTime = new Date(this.coupon.due_date * 1000).toISOString().split('T');
        [this.due_date] = dateAndTime;
      }
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
  },
  watch: {
    // 若 due_date 有變更將更新 this.coupon.due_date
    due_date() {
      this.coupon.due_date = Math.floor(new Date(this.due_date) / 1000);
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.couponModal, {
      backdrop: 'static',
      keyboard: false,
    });
  },
};
</script>
