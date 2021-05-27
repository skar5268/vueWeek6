<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-10">
        <table class="table table-striped table-borderless table-hover align-middle mb-5">
          <thead class="text-center">
            <tr>
              <th scope="col">圖片</th>
              <th scope="col">商品名稱</th>
              <th scope="col">價格</th>
              <th scope="col" colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id" class="text-center">
              <td style="width: 150px; height: 150px;">
                <img :src="item.image" :alt="item.title" />
              </td>
              <td>{{ item.title }}</td>
              <td v-if="item.origin_price == undefined">$ {{ item.price }}</td>
              <td v-else>
                <p class="h5 mt-1">$ {{ item.price }}</p>
              </td>
              <td>
                <button
                  class="btn btn-primary mb-2 mb-md-0"
                  @click.prevent="openModal('detail', '', item)"
                >
                  <span class="material-icons-round align-bottom">sort</span> 查看更多
                </button>
                <button class="btn btn-danger mx-0 mx-md-2" @click.prevent="addCart(item)">
                  <span class="material-icons-round align-bottom">add</span> 加到購物車
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <page-navigation
          :total-page="pagination.total_pages"
          :current-page="pagination.current_page"
          @update="getData"
        >
        </page-navigation>
      </div>
    </div>
  </div>

  <!-- 操作失敗 -->
  <div class="modal fade" tabindex="-1" id="errorModal" ref="errorModal">
    <error-alert-modal :alert-title="alertTitle" :alert-message="alertMessage"></error-alert-modal>
  </div>

  <!-- 操作成功 -->
  <div class="modal fade" tabindex="-1" id="successModal" ref="successModal">
    <success-alert-modal
      :alert-title="alertTitle"
      :alert-message="alertMessage"
      @action="closeModal"
    ></success-alert-modal>
  </div>

  <!-- 產品資訊 -->
  <div class="modal fade" tabindex="-1" id="productModal" ref="productModal">
    <product-detail-modal
      :new-product="newProduct"
      :modal-title="modalTitle"
      @add="addCart"
    ></product-detail-modal>
  </div>
</template>
<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import pageNavigation from '../components/PageNavigation.vue';
import productDetailModal from '../components/ProductsDetailModal.vue';
import successAlertModal from '../components/CorrectAlertModal.vue';
import errorAlertModal from '../components/ErrorAlertModal.vue';

let productModal = null;
let errorModal = null;
let successModal = null;
const apiPath = 'pingu';
const baseUrl = 'https://dev-vue-course-api.hexschool.io/api';

export default {
  data() {
    return {
      alertTitle: '',
      alertMessage: '',
      modalTitle: '',
      newProduct: {},
      newProductTitle: '',
      products: [],
      pagination: {},
    };
  },

  mounted() {
    productModal = new Modal(this.$refs.productModal);
    errorModal = new Modal(this.$refs.errorModal);
    successModal = new Modal(this.$refs.successModal, {
      backdrop: 'static',
      keyboard: false,
    });
  },

  created() {
    this.getData();
  },

  components: {
    pageNavigation,
    productDetailModal,
    successAlertModal,
    errorAlertModal,
  },

  methods: {
    getData(num = 1) {
      const url = `${baseUrl}/${apiPath}/products?page=${num}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', res.data.message);
            return;
          }
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          this.openModal('error', err.message);
        });
    },

    addCart(item, num = 1) {
      const url = `${baseUrl}/${apiPath}/cart`;
      const productId = item.id;
      const qty = num;

      const data = {
        data: {
          product_id: productId,
          qty,
        },
      };

      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', res.data.message);
            return;
          }
          this.openModal('success', res.data.message);
        })
        .catch((err) => {
          this.openModal('error', err.message);
        });
    },

    openModal(modal, message, item) {
      this.alertMessage = message;
      switch (modal) {
        case 'detail':
          this.newProduct = { ...item };
          this.modalTitle = this.newProduct.title;
          productModal.show();
          break;

        case 'error':
          this.alertTitle = '操作失敗';
          errorModal.show();
          break;

        case 'success':
          this.alertTitle = message;
          this.alertMessage = '';
          successModal.show();
          break;

        default:
          break;
      }
    },
    closeModal() {
      successModal.hide();
    },
  },
};
</script>
