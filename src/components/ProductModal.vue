<template>
  <div class="modal fade" ref="productModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content border-0">
        <!-- isNewProduct Start -->
        <div v-if="isNewProduct">
          <div class="modal-header bg-success">
            <h5 class="modal-title text-white">
              新增產品
            </h5>
            <button type="button" class="btn-close bg-white"
              data-bs-dismiss="modal" aria-label="Close"
            ></button>
          </div>
        </div>
        <div v-else>
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white">
              編輯產品
            </h5>
            <button type="button" class="btn-close bg-white"
              data-bs-dismiss="modal" aria-label="Close"
            ></button>
          </div>
        </div>
        <!-- isNewProduct End -->
        <div class="modal-body">
          <div class="row">
            <!-- imageUrl & imagesUrl Start -->
            <div class="col-sm-4">
              <div class="mb-3">
                <label class="form-label" for="imageUrl">主要圖片</label>
                <input
                  class="form-control"
                  type="text"
                  id="imageUrl"
                  v-model="product.imageUrl"
                  placeholder="請輸入圖片連結"
                  required
                />
                <img
                  class="img-fluid"
                  :src="product.imageUrl"
                  :alt="product.title"
                />
              </div>
              <div class="mb-3">
                <label
                  class="form-label"
                  for="upload-ImageUrl"
                  :disabled="uploadStatus"
                >
                  或 上傳圖片
                </label>
                <input
                  ref="uploadInput"
                  class="form-control"
                  type="file"
                  id="upload-ImageUrl"
                  @change="uploadImage"
                  :disabled="uploadStatus"
                />
              </div>
              <!-- imagesUrl Start -->
              <h3 class="mb-3">新增更多圖片</h3>
              <div v-if="Array.isArray(product.imagesUrl)">
                <div
                  class="mb-1"
                  v-for="(image, key) in product.imagesUrl"
                  :key="'img' + key"
                >
                  <div class="mb-3">
                    <label class="form-label" for="imagesUrl">圖片網址</label>
                    <input
                      class="form-control"
                      type="text"
                      id="imagesUrl"
                      v-model="product.imagesUrl[key]"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <div v-if="product.imagesUrl[key]">
                    <img class="img-fluid" :src="image" :alt="product.title" />
                  </div>
                </div>
                <div v-if="
                  !product.imagesUrl.length ||
                  product.imagesUrl[product.imagesUrl.length - 1]
                ">
                  <button class="btn btn-outline-primary"
                    @click="product.imagesUrl.push('')">
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <button class="btn btn-outline-danger"
                    @click="product.imagesUrl.pop('')">
                    刪除圖片
                  </button>
                </div>
              </div>
              <!-- imagesUrl End -->
              <div v-else>
                <button class="btn btn-outline-primary"
                  @click="createImages">
                  新增圖片
                </button>
              </div>
            </div>
            <!-- imageUrl & imagesUrl End -->
            <!-- Product Content Start -->
            <div class="col-sm-8">
              <div class="mb-3">
                <div class="form-check form-switch">
                  <span class="fw-bold">啟用狀態：</span>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="is_enabled"
                    v-model="product.is_enabled"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label v-if="product.is_enabled"
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
              <div class="mb-3">
                <label class="form-label" for="title">商品名稱</label>
                <input
                  class="form-control"
                  type="text"
                  id="title"
                  v-model="product.title"
                  placeholder="請輸入商品名稱"
                  required
                />
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label class="form-label" for="category">分類</label>
                  <input
                    class="form-control"
                    type="text"
                    id="category"
                    v-model="product.category"
                    placeholder="請輸入分類"
                    required
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label class="form-label" for="unit">單位</label>
                  <input
                    class="form-control"
                    type="text"
                    id="unit"
                    v-model="product.unit"
                    placeholder="請輸入單位"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label class="form-label" for="origin_price">原價</label>
                  <input
                    class="form-control"
                    type="number"
                    id="origin_price"
                    v-model.number="product.origin_price"
                    placeholder="請輸入原價"
                    min="0"
                    oninput="this.value = !!this.value
                      && Math.abs(this.value) >= 0
                      ? Math.abs(this.value) : null"
                    required
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label class="form-label" for="price">售價</label>
                  <input
                    class="form-control"
                    type="number"
                    id="price"
                    v-model.number="product.price"
                    placeholder="請輸入售價"
                    min="0"
                    oninput="this.value = !!this.value
                      && Math.abs(this.value) >= 0
                      ? Math.abs(this.value) : null"
                    required
                  />
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <label class="form-label" for="description">產品描述</label>
                <textarea
                  class="form-control"
                  type="text"
                  id="description"
                  v-model="product.description"
                  placeholder="請輸入產品描述"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label" for="content">說明內容</label>
                <textarea
                  class="form-control"
                  type="text"
                  id="content"
                  v-model="product.content"
                  placeholder="請輸入產品內容"
                ></textarea>
              </div>
            </div>
            <!-- Product Content End -->
          </div>
        </div>
        <!-- Post or Put Start -->
        <div class="modal-footer">
          <div v-if="isNewProduct">
            <button
              class="btn btn-success"
              type="button"
              @click="$emit('post-product', product)"
            >
              確認新增
            </button>
          </div>
          <div v-else>
            <button
              class="btn btn-primary"
              type="button"
              @click="$emit('put-product', product.id, product)"
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
      product: {},
      loader: {},
      isNewProduct: false,
      uploadStatus: false,
    };
  },
  inject: ['emitter'],
  methods: {
    openModal(isNewProduct, product) {
      this.isNewProduct = isNewProduct;
      // 判斷是否為「新增」或「編輯」產品
      if (isNewProduct) {
        this.product = {
          imagesUrl: [],
        };
      } else {
        // 使用深層拷貝避免 imagesUrl 物件被修改
        this.product = JSON.parse(JSON.stringify(product));
      }
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    // 將圖片從本機端上傳
    uploadImage() {
      this.loader = this.$loading.show();
      this.uploadStatus = true;
      const uploadImage = this.$refs.uploadInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadImage);
      const apiUrl = `
        ${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/upload
      `;
      this.$http.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          if (res.data.success) {
            this.product.imageUrl = res.data.imageUrl;
            this.$refs.uploadInput.value = '';
            this.emitter.emit('push-message', {
              style: 'success',
              title: '上傳圖片',
              content: '圖片上傳成功!',
            });
            this.uploadStatus = false;
            this.loader.hide();
          } else {
            this.$refs.uploadInput.value = '';
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '上傳圖片',
              content: res.data.message,
            });
            this.uploadStatus = false;
            this.loader.hide();
          }
        })
        .catch((err) => {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '上傳圖片',
            content: err.response.data.message,
          });
          this.uploadStatus = false;
          this.loader.hide();
        });
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.productModal, {
      backdrop: 'static',
      keyboard: false,
    });
  },
};
</script>
