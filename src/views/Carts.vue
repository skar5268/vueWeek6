<template>
  <div class="container mt-5">
    <div class="row mb-7">
      <div class="col-12 col-lg-6">
        <h2 class="fw-bold">購物車</h2>
        <table class="table table-hover align-middle">
          <thead class="text-center">
            <tr>
              <th scope="col">品名</th>
              <th scope="col">數量</th>
              <th scope="col">單價</th>
              <th scope="col">小計</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="cartData.length == 0">
              <tr>
                目前沒有商品
              </tr>
            </template>
            <template v-else>
              <tr v-for="item in cartData" :key="item.id" class="text-center">
                <th>{{ item.product.title }}</th>
                <td style="width: 150px">
                  <div class="input-group">
                    <input type="number" class="form-control" v-model="item.qty" min="1" />
                    <span class="input-group-text"> {{ item.product.unit }}</span>
                  </div>
                </td>
                <td>{{ item.product.price }}</td>
                <td>{{ item.product.price * item.qty }}</td>
                <td>
                  <button class="btn text-danger" @click.prevent="openModal('del', item)">
                    <span class="material-icons-round align-bottom h3 mb-0">delete_forever</span>
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot class="border-top">
            <tr>
              <td colspan="3" class="align-top">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="請輸入優惠碼"
                    v-model.lazy="coupon"
                  />
                  <button class="btn btn-outline-secondary" type="button" @click="useCoupon">
                    套用優惠碼
                  </button>
                </div>
              </td>
              <td colspan="2" class="text-end">
                <p>總計：{{ finalTotal }}</p>
                <p class="text-success">折扣價： {{ finalTotal }}</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="col-10 col-lg-6">
        <Form class="row g-3" v-slot="{ errors }" @submit="sendOrder">
          <h2 class="fw-bold">訂購資訊</h2>
          <div class="col-12">
            <label for="email" class="form-label d-block">Email</label>
            <Field
              type="email"
              class="form-control"
              id="email"
              name="Email"
              v-model="data.user.email"
              rules="required|email"
              :class="{ 'is-invalid': errors['Email'] }"
            ></Field>
            <error-message name="Email" class="invalid-feedback"></error-message>
          </div>
          <div class="col-12">
            <label for="name" class="form-label d-block">收件人姓名</label>
            <Field
              type="text"
              class="form-control"
              id="name"
              name="收件人姓名"
              v-model="data.user.name"
              rules="required"
              :class="{ 'is-invalid': errors['收件人姓名'] }"
            ></Field>
            <error-message name="收件人姓名" class="invalid-feedback"></error-message>
          </div>
          <div class="col-12">
            <label for="tel" class="form-label d-block">收件人手機號碼</label>
            <Field
              type="tel"
              class="form-control"
              id="tel"
              name="收件人手機號碼"
              v-model="data.user.tel"
              :rules="isPhone"
              :class="{ 'is-invalid': errors['收件人手機號碼'] }"
            ></Field>
            <error-message name="收件人手機號碼" class="invalid-feedback"></error-message>
          </div>
          <div class="col-12">
            <label for="address" class="form-label d-block">收件人地址</label>
            <Field
              type="text"
              class="form-control"
              id="address"
              name="收件人地址"
              v-model="data.user.address"
              rules="required"
              :class="{ 'is-invalid': errors['收件人地址'] }"
            >
            </Field>
            <error-message name="收件人地址" class="invalid-feedback"></error-message>
          </div>
          <div class="col-12">
            <label for="payment" class="form-label d-block">付款方式</label>
            <Field
              type="text"
              class="form-control d-none"
              name="付款方式"
              v-model="data.user.payment"
              rules="required"
            ></Field>
            <select
              id="payment"
              class="form-select"
              v-model="data.user.payment"
              :class="{ 'is-invalid': errors['付款方式'] }"
            >
              <option value="" selected hidden>請選擇付款方式...</option>
              <option value="ATM">ATM</option>
              <option value="Barcode">Barcode</option>
              <option value="Credit">Credit</option>
              <option value="ApplePay">ApplePay</option>
              <option value="GooglePay">GooglePay</option>
            </select>
            <error-message name="付款方式" class="invalid-feedback"></error-message>
          </div>
          <div class="col-12">
            <label for="exampleFormControlTextarea1" class="form-label d-block">留言</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              v-model="data.message"
            ></textarea>
          </div>
          <div class="col-12">
            <button class="btn btn-primary" type="submit">送出訂單</button>
          </div>
        </Form>
      </div>
    </div>
  </div>

  <!-- 移除購物車 -->
  <div class="modal fade" tabindex="-1" id="delProductModal" ref="delProductModal">
    <del-modal
      :new-product="newProduct"
      :modal-title="modalTitle"
      :products="products"
      :title="newProductTitle"
      @update="openModal"
      @get-error="openModal"
    ></del-modal>
  </div>

  <!-- 操作失敗 -->
  <div class="modal fade" tabindex="-1" id="errorAlertModal" ref="errorAlertModal">
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content border-0 border-bottom border-danger border-5">
        <div
          class="d-flex justify-content-between align-items-center
          flex-column py-5 mb-0 text-danger"
          role="alert"
        >
          <p class="material-icons-round h1 mb-3 alert-icon">error</p>
          <p class="h3 fw-bold px-4">操作失敗</p>
          <p class="mb-4">{{ alertMessage }}</p>
          <button
            type="button"
            class="btn btn-danger w-25 mt-2 mb-1"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 操作成功 -->
  <div class="modal fade" tabindex="-1" id="successAlertModal" ref="successAlertModal">
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content border-0 border-bottom border-success border-5">
        <div
          class="d-flex justify-content-between align-items-center
          flex-column py-5 mb-0 text-success"
          role="alert"
        >
          <p class="material-icons-round h1 mb-3 alert-icon">check_circle</p>
          <p class="h3 fw-bold px-4 mb-4">{{ alertMessage }}</p>
          <button
            type="button"
            class="btn btn-success w-25 mt-2 mb-1"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click.prevent="getCartData"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import delModal from '../components/DelModal.vue';

let delProductModal = null;
let errorAlertModal = null;
let successAlertModal = null;
const apiPath = 'pingu';
const baseUrl = 'https://dev-vue-course-api.hexschool.io/api';
export default {
  data() {
    return {
      alertMessage: '',
      modalTitle: '',
      newProduct: {},
      newProductTitle: '',
      products: [],
      pagination: {},
      cartData: [],
      finalTotal: 0,
      coupon: '',
      payement: '',
      data: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          payment: '',
        },
        message: '',
      },
    };
  },

  mounted() {
    delProductModal = new Modal(this.$refs.delProductModal);
    errorAlertModal = new Modal(this.$refs.errorAlertModal);
    successAlertModal = new Modal(this.$refs.successAlertModal, {
      backdrop: 'static',
      keyboard: false,
    });
  },

  created() {
    this.getData();
    this.getCartData();
  },

  components: {
    delModal,
  },

  methods: {
    getData(num = 1) {
      const url = `${baseUrl}/${apiPath}/products?page=${num}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', 0, res.data.message);
            return;
          }
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
        });
    },

    getCartData() {
      const url = `${baseUrl}/${apiPath}/cart`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', 0, res.data.message);
            return;
          }
          this.cartData = res.data.data.carts;
          this.finalTotal = res.data.data.final_total;
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
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
            this.openModal('error', 0, res.data.message);
            return;
          }
          this.openModal('success', 0, res.data.message);
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
        });
    },

    openModal(modal, item, message) {
      this.alertMessage = message;
      switch (modal) {
        case 'del':
          this.modalTitle = '移除購物車';
          this.newProduct = { ...item };
          this.newProductTitle = this.newProduct.product.title;
          delProductModal.show();
          break;

        case 'detail':
          this.newProduct = { ...item };
          this.modalTitle = this.newProduct.title;
          this.$refs.productDetailModal.openModal();
          break;

        case 'error':
          errorAlertModal.show();
          break;

        case 'success':
          successAlertModal.show();
          break;

        default:
          break;
      }
    },

    useCoupon() {
      const url = `${baseUrl}/${apiPath}/coupon`;
      const data = {
        data: {
          code: this.coupon,
        },
      };
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', 0, res.data.message);
            return;
          }
          this.openModal('success', 0, res.data.message);
          this.finalTotal = res.data.data.final_total;
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
        });
    },

    sendOrder(values, { resetForm }) {
      const url = `${baseUrl}/${apiPath}/order`;

      if (this.cartData.length === 0) {
        this.openModal('error', 0, '購物車目前沒有商品');
        return;
      }

      const orderUser = {
        data: this.data,
      };

      axios
        .post(url, orderUser)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', 0, res.data.message);
            return;
          }
          this.openModal('success', 0, res.data.message);
          resetForm();
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
        });
    },

    isPhone(value) {
      if (value === '') return '收件人手機號碼 為必填';
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '收件人手機號碼 需為正確的手機號碼';
    },
  },
};
</script>
