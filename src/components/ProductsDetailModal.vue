<template>
  <div class="modal-dialog modal-lg  modal-dialog-centered">
    <div class="modal-content border-0">
      <div class="modal-header bg-primary py-2">
        <h5 class="modal-title fw-bold text-light lh-sm">
          <span class="material-icons-round align-bottom">sort</span> {{ modalTitle }}
        </h5>
        <button type="button" class="btn text-light" data-bs-dismiss="modal" aria-label="Close">
          <span class="material-icons-round lh-base">close</span>
        </button>
      </div>
      <div class="modal-body py-4">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 col-md-4">
              <img
                :src="editProduct.image"
                :alt="editProduct.title"
                class="img-fluid rounded mb-4"
                :title="editProduct.title"
              />
            </div>
            <div class="col-12 col-md-8">
              <div class="row mb-2">
                <h5 class="col-12  mb-2">
                  <span class="badge rounded-pill bg-primary">{{ editProduct.category }}</span>
                </h5>
                <div class="col-12 mb-2">
                  <p>商品描述：{{ editProduct.content }}</p>
                  <p>商品內容：{{ editProduct.description }}</p>
                  <template v-if="editProduct.origin_price == editProduct.price">
                    <h5>只要 {{ editProduct.price }} 元</h5>
                  </template>
                  <template v-else>
                    <del>原價 {{ editProduct.origin_price }} 元</del>
                    <h5>現在只要 {{ editProduct.price }} 元</h5>
                  </template>
                </div>
                <div class="input-group col-12 mb-3">
                  <input
                    type="number"
                    class="form-control"
                    id="newQty"
                    min="1"
                    v-model.number="newQty"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    data-bs-dismiss="modal"
                    @click.prevent="addCartModal(editProduct)"
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editProduct: {},
      newQty: 1,
    };
  },
  watch: {
    newProduct() {
      this.editProduct = { ...this.newProduct };
    },
  },
  props: ['newProduct', 'modalTitle'],
  methods: {
    addCartModal(item) {
      this.$emit('add', item, this.newQty);
    },
  },
};
</script>
