<template>
  <nav aria-label="page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !pagination.has_pre }">
        <router-link
          class="page-link"
          to=""
          @click.prevent="$emit('get-request', pagination.current_page - 1)"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </router-link>
      </li>
      <li
        class="page-item"
        :class="{ active: page === pagination.current_page }"
        v-for="page in pagination.total_pages"
        :key="'p' + page"
      >
        <router-link
          class="page-link"
          to=""
          @click.prevent="$emit('get-request', page)"
        >
          {{ page }}
        </router-link>
      </li>
      <li class="page-item" :class="{ disabled: !pagination.has_next }">
        <router-link
          class="page-link"
          to=""
          @click.prevent="$emit('get-request', pagination.current_page + 1)"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  // 取得分頁資訊
  props: ['pagination'],
};
</script>
