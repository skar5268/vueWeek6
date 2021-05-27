<template>
  <div class="container mt-5">
    <div class="row g-0 mb-5">
      <h2 class="col-12 col-md-8 text-center text-md-start fw-bold mb-3 mb-md-0">商品管理頁面</h2>
      <div class="col-12 col-md-4 text-center text-md-end">
        <button class="btn btn-primary mb-3" v-on:click="openModal('new')">
          <span class="material-icons-round align-bottom">add</span> 建立新的商品
        </button>
      </div>
    </div>
    <div class="row">
      <table class="table table-striped table-borderless table-hover align-middle mb-5">
        <thead class="text-center">
          <tr>
            <th scope="col">分類</th>
            <th scope="col">商品名稱</th>
            <th scope="col">原價</th>
            <th scope="col">售價</th>
            <th scope="col">單位</th>
            <th scope="col">是否啟用</th>
            <th scope="col" colspan="2" class="text-center">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id" class="text-center">
            <th scope="row">{{ item.category }}</th>
            <td>{{ item.title }}</td>
            <td>$ {{ item.origin_price }}</td>
            <td>$ {{ item.price }}</td>
            <td>{{ item.unit }}</td>
            <td>
              <a
                href="#"
                class="fw-bold"
                @click.prevent="changeEnabled(item)"
                :class="item.is_enabled ? 'text-success' : 'text-danger'"
              >
                {{ item.is_enabled ? '啟用' : '不啟用' }}</a
              >
            </td>
            <td>
              <button class="btn btn-primary mb-2 mb-md-0" @click.prevent="openModal('edit', item)">
                <span class="h5 material-icons-round align-bottom mb-0">mode</span> 編輯
              </button>
              <button
                class="btn btn-danger mx-0 mx-md-2"
                @click.prevent="openModal('delete', item)"
              >
                <span class="h5 material-icons-round align-bottom mb-0">delete_forever</span> 刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <page-navigation
      :total-page="pagination.total_pages"
      :current-page="pagination.current_page"
      @update="getData"
    >
    </page-navigation>
  </div>

  <!-- 新增 / 編輯產品 -->
  <div class="modal fade" tabindex="-1" id="productModal" ref="productModal">
    <edit-modal
      :new-product="newProduct"
      :modal-title="modalTitle"
      :products="products"
      @update="openModal"
      @get-error="openModal"
    >
    </edit-modal>
  </div>

  <!-- 刪除產品 -->
  <div class="modal fade" tabindex="-1" id="delProductModal" ref="delProductModal">
    <del-modal
      :new-product="newProduct"
      :modal-title="modalTitle"
      :products="products"
      :title="newProduct.title"
      @update="openModal"
      @get-error="openModal"
    ></del-modal>
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
      @action="updateData"
    ></success-alert-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import pageNavigation from '../components/PageNavigation.vue';
import editModal from '../components/EditModal.vue';
import delModal from '../components/DelModal.vue';
import successAlertModal from '../components/CorrectAlertModal.vue';
import errorAlertModal from '../components/ErrorAlertModal.vue';

const apiPath = 'pingu';
const baseUrl = 'https://dev-vue-course-api.hexschool.io/api';

let productModal = null;
let delProductModal = null;
let successModal = null;
let errorModal = null;

export default {
  data() {
    return {
      modalTitle: '',
      alertTitle: '',
      alertMessage: '',
      newProduct: {},
      products: [],
      pagination: {},
    };
  },

  mounted() {
    productModal = new Modal(this.$refs.productModal);
    delProductModal = new Modal(this.$refs.delProductModal);
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
    editModal,
    delModal,
    successAlertModal,
    errorAlertModal,
  },

  methods: {
    getData(num = 1) {
      const url = `${baseUrl}/${apiPath}/admin/products?page=${num}`;

      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', 0, res.data.message);
          } else {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
        });
    },
    changeEnabled(item) {
      this.newProduct = { ...item };

      const url = `${baseUrl}/${apiPath}/admin/product/${this.newProduct.id}`;

      this.newProduct.is_enabled = !this.newProduct.is_enabled;

      axios
        .put(url, { data: this.newProduct })
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', 0, res.data.message);
          } else {
            this.openModal('success', 0, res.data.message);
          }
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
        });
    },

    openModal(isNew, item, message) {
      this.alertMessage = message;
      switch (isNew) {
        case 'new':
          this.modalTitle = '新增商品';
          this.newProduct = {};
          productModal.show();
          // console.log(this.newProduct);
          break;

        case 'edit':
          this.modalTitle = '編輯商品';
          this.newProduct = { ...item };
          productModal.show();
          break;

        case 'delete':
          this.modalTitle = '刪除商品';
          this.newProduct = { ...item };
          delProductModal.show();
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
    updateData() {
      successModal.hide();
      this.getData();
    },
  },
};
</script>
