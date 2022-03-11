<template>
  <div class="toast-container position-fixed p-5 bottom-0 end-0"
    style="z-index: 2048">
    <div
      class="toast show"
      v-for="(msg, index) in messages"
      :key="'msg' + index"
      role="alert"
    >
      <div class="toast-header" :class="`bg-${msg.style}`">
        <strong class="me-auto text-white">
          {{ msg.title }}
        </strong>
        <button
          type="button"
          class="btn-close bg-white"
          @click="closeToast(index)"
          aria-label="Close">
        </button>
      </div>
      <div class="toast-body fw-bold" v-if="msg.content">
        {{ msg.content }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
    };
  },
  inject: ['emitter'],
  methods: {
    showToast() {
      // 6 秒後自動從 messages 陣列移除
      setTimeout(() => {
        this.messages.shift();
      }, 6000);
    },
    // 把選擇要關閉的 Toast 從 messages 陣列移除
    closeToast(index) {
      this.messages.splice(index, 1);
    },
  },
  mounted() {
    this.emitter.on('push-message', (message) => {
      const { style = 'success', title, content } = message;
      this.messages.push({ style, title, content });
      this.showToast();
    });
  },
};
</script>
