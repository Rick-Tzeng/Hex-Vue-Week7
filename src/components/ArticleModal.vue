<template>
  <div class="modal fade" ref="articleModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content border-0">
        <!-- isNewArticle Start -->
        <div v-if="isNewArticle">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">
              新增貼文
            </h5>
            <button type="button" class="btn-close bg-white"
              data-bs-dismiss="modal" aria-label="Close"
            ></button>
          </div>
        </div>
        <div v-else>
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white">
              編輯貼文
            </h5>
            <button type="button" class="btn-close bg-white"
              data-bs-dismiss="modal" aria-label="Close"
            ></button>
          </div>
        </div>
        <!-- isNewArticle End -->
        <!-- Article Content Start -->
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label" for="article-title">貼文標題</label>
            <input
              class="form-control"
              type="text"
              id="article-title"
              v-model="article.title"
              placeholder="請輸入貼文標題"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="article-image">貼文圖片</label>
            <input
              class="form-control"
              type="text"
              id="article-image"
              v-model="article.imageUrl"
              placeholder="請輸入圖片網址"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="article-author">作者</label>
            <input
              class="form-control"
              type="text"
              id="article-author"
              v-model="article.author"
              placeholder="請輸入作者名稱"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="article-post_date">貼文建立日期</label>
            <input
              class="form-control"
              type="date"
              id="article-post_date"
              v-model="post_date"
              required
            />
          </div>
          <!-- Tag Start -->
          <div class="mb-3">
            <div v-if="Array.isArray(article.tag)">
              <div
                class="mb-1"
                v-for="(tag, key) in article.tag"
                :key="'tag' + key"
              >
                <div class="mb-3">
                  <label class="form-label" for="article-tag">新增標籤</label>
                  <input
                    class="form-control"
                    type="text"
                    id="article-tag"
                    v-model="article.tag[key]"
                    placeholder="請輸入標籤"
                  />
                </div>
              </div>
              <div v-if="
                !article.tag.length || article.tag[article.tag.length - 1]
              ">
                <button class="btn btn-outline-primary"
                  @click="article.tag.push('')">
                  新增標籤
                </button>
              </div>
              <div v-else>
                <button class="btn btn-outline-danger"
                  @click="article.tag.pop('')">
                  刪除標籤
                </button>
              </div>
            </div>
            <div v-else>
              <button class="btn btn-outline-primary"
                @click="createTags">
                新增標籤
              </button>
            </div>
          </div>
          <!-- Tag End -->
          <div class="mb-3">
            <label class="form-label" for="article-description">貼文描述</label>
            <textarea
              class="form-control"
              type="text"
              id="article-description"
              v-model="article.description"
              placeholder="請輸入貼文描述"
            ></textarea>
          </div>
          <div class="mb-3">
            <!--
              <p>貼文內容</p>
              <ckeditor
                :editor="editor"
                :config="editorConfig"
                v-model="article.content"
              ></ckeditor>
            -->
            <label class="form-label" for="article-content">貼文內容</label>
            <textarea
              class="form-control"
              type="text"
              id="article-content"
              v-model="article.content"
              placeholder="請輸入貼文描述"
            ></textarea>
          </div>
          <div class="mb-3">
            <div class="form-check form-switch">
              <span class="fw-bold">公開狀態：</span>
              <input
                class="form-check-input"
                type="checkbox"
                id="is-public"
                v-model="article.isPublic"
                required
              />
              <label v-if="article.isPublic"
                class="form-check-label text-success fw-bold"
                for="is-public"
              >
                已公開
              </label>
              <label v-else
                class="form-check-label text-muted"
                for="is-public"
              >
                未公開
              </label>
            </div>
          </div>
        </div>
        <!-- Article Content End -->
        <!-- Post or Put Start -->
        <div class="modal-footer">
          <div v-if="isNewArticle">
            <button
              class="btn btn-success"
              type="button"
              @click="$emit('post-article', article)"
            >
              確認新增
            </button>
          </div>
          <div v-else>
            <button
              class="btn btn-primary"
              type="button"
              @click="$emit('put-article', article.id, article)"
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
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  data() {
    return {
      modal: {},
      article: {
        tag: [],
      },
      post_date: '',
      isNewArticle: false,
      // editor: ClassicEditor,
      // editorConfig: {
      //   toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|',
      //     'numberedList', 'bulletedList', 'link'],
      // },
    };
  },
  methods: {
    openModal(isNewArticle, article) {
      this.isNewArticle = isNewArticle;
      if (isNewArticle) {
        this.article = {};
        this.post_date = '';
      } else {
        this.article = JSON.parse(JSON.stringify(article));
        // 因 input type="date" 只吃 YYYY-MM-DD 格式，所以改成用此方式抓時間
        const dateAndTime = new Date(this.article.create_at * 1000).toISOString().split('T');
        [this.post_date] = dateAndTime;
      }
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    createTags() {
      this.article.tag = [];
      this.article.tag.push('');
    },
  },
  watch: {
    // 若 post_date 有變更將更新 this.article.create_at
    post_date() {
      this.article.create_at = Math.floor(new Date(this.post_date) / 1000);
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.articleModal, {
      backdrop: 'static',
      keyboard: false,
    });
  },
};
</script>
