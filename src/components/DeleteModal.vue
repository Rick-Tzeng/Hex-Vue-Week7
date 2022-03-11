<template>
  <div class="modal fade" ref="deleteModal" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="delProductModalLabel">刪除產品</h5>
          <button class="btn-close bg-white" type="button"
            data-bs-dismiss="modal" aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{ item.title }}</strong>
          （刪除後將無法恢復）。
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-danger"
            type="button"
            @click="$emit('del-item', item.id)"
          >
            確認刪除
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
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';

export default {
  data() {
    return {
      modal: {},
      item: {},
    };
  },
  methods: {
    openModal(item) {
      if (item === '全部訂單') {
        this.item.title = item;
        this.item.id = 'all';
      } else {
        this.item = JSON.parse(JSON.stringify(item));
      }
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.deleteModal, {
      backdrop: 'static',
      keyboard: false,
    });
  },
};
</script>
