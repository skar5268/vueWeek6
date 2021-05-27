<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-10">
        <table class="table table-striped table-borderless table-hover align-middle mb-5">
          <thead class="text-center">
            <tr>
              <th scope="col">訂單編號</th>
              <th scope="col">聯絡人</th>
              <th scope="col">訂單品項</th>
              <th scope="col">訂單日期</th>
              <th scope="col">訂單狀態</th>
              <th scope="col" colspan="1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orders" :key="item.id" class="listContent">
              <td class="text-align-center">{{ item.id }}</td>
              <td class="text-align-center">
                {{ item.user.name }} <br />
                {{ item.user.email }}
              </td>
              <td>{{ item.user.address }}</td>
              <td>
                {{ new Date(item.create_at * 1000).getFullYear() }} /
                {{ new Date(item.create_at * 1000).getMonth() + 1 }} /
                {{ new Date(item.create_at * 1000).getDate() }}
              </td>
              <td>{{ item.is_paid ? '已付款' : '未付款' }}</td>
              <td class="text-align-center">
                <button class="btn btn-primary" @click.prevent="openModal('detail', '', item)">
                  詳細
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <page-navigation
          :total-page="pagination.total_pages"
          :current-page="pagination.current_page"
          @update="getOrders"
        >
        </page-navigation>
      </div>
    </div>
  </div>

  <div class="modal fade" tabindex="-1" id="orderModal" ref="orderModal">
    <order-detail-modal :new-order="newOrder"></order-detail-modal>
  </div>

  <!-- 操作失敗 -->
  <div class="modal fade" tabindex="-1" id="errorModal" ref="errorModal">
    <error-alert-modal :alert-title="alertTitle" :alert-message="alertMessage"></error-alert-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import pageNavigation from '../components/PageNavigation.vue';
import orderDetailModal from '../components/OrderDetailModal.vue';
import errorAlertModal from '../components/ErrorAlertModal.vue';

let orderModal = null;
let errorModal = null;

const apiPath = 'pingu';
const baseUrl = 'https://dev-vue-course-api.hexschool.io/api';
export default {
  data() {
    return {
      alertTitle: '',
      alertMessage: '',
      orders: [],
      newOrder: {},
      pagination: {},
    };
  },
  mounted() {
    orderModal = new Modal(this.$refs.orderModal);
    errorModal = new Modal(this.$refs.errorModal);
  },
  created() {
    this.getOrders();
  },
  components: {
    pageNavigation,
    orderDetailModal,
    errorAlertModal,
  },
  methods: {
    getOrders(num = 1) {
      const url = `${baseUrl}/${apiPath}/admin/orders?page=${num}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.openModal('error', res.data.message, 0);
          } else {
            this.orders = res.data.orders;
            this.pagination = res.data.pagination;
          }
        })
        .catch((err) => {
          this.openModal('error', 0, err.message);
        });
    },
    openModal(modal, message, item) {
      this.alertMessage = message;
      switch (modal) {
        case 'detail':
          this.newOrder = { ...item };
          orderModal.show();
          break;

        case 'error':
          errorModal.show();
          break;

          // case 'success':
          //   successAlertModal.show();
          //   break;

        default:
          break;
      }
    },
  },
};
</script>
