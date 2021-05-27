<template>
  <div class="container mt-5 fw-bold">
    <div class="row g-0 justify-content-end align-items-center mb-5">
      <router-link to="/admin/orders" class="col-1">訂單管理</router-link>
      <router-link to="/admin/bgProducts" class="col-1">產品管理</router-link>
      <button class="col-1 btn btn-primary" @click="logOut">登出</button>
    </div>
  </div>
  <router-view />

  <!-- 登出成功 -->
  <div class="modal fade" tabindex="-1" id="signOutModal" ref="signOutModal">
    <info-alert-modal :alert-title="alertTitle" @action="signOutSuccess"></info-alert-modal>
  </div>

  <!-- 錯誤訊息 -->
  <div class="modal fade" tabindex="-1" id="errorModal" ref="errorModal">
    <error-alert-modal :alert-message="alertMessage"></error-alert-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import errorAlertModal from '../components/ErrorAlertModal.vue';
import infoAlertModal from '../components/InfoAlertModal.vue';

let errorModal = null;
let signOutModal = null;

const token = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*=\s*([^;]*).*$)|^.*$/, '$1');
export default {
  data() {
    return {
      alertTitle: '',
      alertMessage: '',
    };
  },
  created() {
    if (token === '') {
      this.$router.push({
        name: 'Login',
      });
      return;
    }
    axios.defaults.headers.common.Authorization = token;
  },
  mounted() {
    signOutModal = new Modal(this.$refs.signOutModal, {
      backdrop: 'static',
      keyboard: false,
    });
    errorModal = new Modal(this.$refs.errorModal);
  },
  components: {
    errorAlertModal,
    infoAlertModal,
  },
  methods: {
    logOut() {
      const url = 'https://dev-vue-course-api.hexschool.io/logout';

      axios
        .post(url)
        .then((res) => {
          if (res.data.success) {
            document.cookie = 'user=; expires=; path=/';
            this.alertTitle = '成功登出';
            this.alertMessage = '';
            signOutModal.show();
          } else {
            this.alertTitle = '登出失敗';
            this.alertMessage = res.data.message;
            errorModal.show();
          }
        })
        .catch((err) => {
          this.alertTitle = '登出失敗';
          this.alertMessage = err.message;
          errorModal.show();
        });
    },
    signOutSuccess() {
      signOutModal.hide();
      this.$router.push({
        name: 'Home',
      });
    },
  },
};
</script>
