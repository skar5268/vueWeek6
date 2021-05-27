<template>
  <div class="container-fluid bg-light">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-6 py-6 rounded-3 bg-white shadow-sm">
        <div class="row  justify-content-center align-items-center">
          <div class="col-10 col-md-6 col-lg-5">
            <h2 class="h1 fw-bold text-center text-primary mb-5">
              <span class=" d-inline-block pb-2 border-bottom border-primary border-3"> LOGIN</span>
            </h2>
            <Form v-slot="{ errors }" @submit="login">
              <div class="form-floating mb-4">
                <Field
                  type="email"
                  class="form-control fw-bold"
                  id="username"
                  name="Email"
                  placeholder="Email Address"
                  v-model.lazy.trim="user.username"
                  rules="required|email"
                  :class="{ 'is-invalid': errors['Email'] }"
                ></Field>
                <label for="username" class="text-black-50 pb-5">Email Address</label>
              </div>
              <div class="form-floating mb-4">
                <Field
                  type="password"
                  class="form-control"
                  id="userPassword"
                  name="password"
                  placeholder="Password"
                  v-model.lazy.trim="user.password"
                  rules="required"
                  :class="{ 'is-invalid': errors['password'] }"
                ></Field>
                <label for="userPassword" class="text-black-50">Password</label>
              </div>
              <div class="form-check mb-4">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="rememberEmailCheck"
                  v-model="rememberEmailCheck"
                  value="rememberEmailCheck"
                />
                <label class="form-check-label d-block text-start" for="rememberEmailCheck">
                  記住帳號
                </label>
              </div>
              <button class="btn btn-lg btn-primary w-100" type="submit">登入</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 登入成功 -->
  <div class="modal fade" tabindex="-1" id="successModal" ref="successModal">
    <success-alert-modal
      :alert-title="alertTitle"
      :alert-message="alertMessage"
      @action="successLogin"
    ></success-alert-modal>
  </div>

  <!-- 錯誤訊息 -->
  <div class="modal fade" tabindex="-1" id="errorModal" ref="errorModal">
    <error-alert-modal :alert-title="alertTitle" :alert-message="alertMessage"></error-alert-modal>
  </div>

  <!-- 已登入 -->
  <div class="modal fade" tabindex="-1" id="infoModal" ref="infoModal">
    <info-alert-modal
      :alert-title="alertTitle"
      :alert-message="alertMessage"
      data-bs-dismiss="modal"
      aria-label="Close"
    ></info-alert-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import successAlertModal from '../components/CorrectAlertModal.vue';
import errorAlertModal from '../components/ErrorAlertModal.vue';
import InfoAlertModal from '../components/InfoAlertModal.vue';

let successModal = null;
let errorModal = null;
let infoModal = null;

export default {
  data() {
    return {
      alertTitle: '',
      alertMessage: '',
      user: {
        username: '',
        password: '',
      },
      rememberEmailCheck: false,
    };
  },
  created() {
    if (this.user.username !== '') this.rememberEmailCheck = true;
    this.checkLogin();
  },
  mounted() {
    successModal = new Modal(this.$refs.successModal, {
      backdrop: 'static',
      keyboard: false,
    });
    errorModal = new Modal(this.$refs.errorModal);
    infoModal = new Modal(this.$refs.infoModal);
  },
  components: {
    successAlertModal,
    errorAlertModal,
    InfoAlertModal,
  },

  methods: {
    checkLogin() {
      const api = 'https://dev-vue-course-api.hexschool.io/api/user/check';
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*=\s*([^;]*).*$)|^.*$/, '$1');

      axios
        .post(api)
        .then((res) => {
          if (res.data.success) {
            this.isLogin();
          } else {
            if (token !== '') {
              this.isLogin();
              return;
            }
            this.alertTitle = '請輸入 Email 與密碼';
            infoModal.show();
          }
        })
        .catch((err) => {
          this.alertMessage = err.message;
          infoModal.show();
        });
    },
    isLogin() {
      this.alertTitle = '目前已登入';
      this.alertMessage = '幫您跳轉至後台頁面';
      successModal.show();
    },
    login() {
      const api = 'https://dev-vue-course-api.hexschool.io/admin/signin';
      axios
        .post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            document.cookie = this.rememberEmailCheck
              ? `username=${this.user.username};`
              : 'username=;';
            const { token, expired } = res.data;
            document.cookie = ` user=${token}; expires=${new Date(expired)};`;
            this.alertTitle = '登入成功';
            this.alertMessage = '';
            successModal.show();
          } else {
            this.alertTitle = '登入失敗';
            this.alertMessage = '請重新輸入 Email 與密碼';
            errorModal.show();
            this.user.password = '';
          }
        })
        .catch((err) => {
          this.alertTitle = '登入失敗';
          this.alertMessage = err.message;
          errorModal.show();
          this.user.password = '';
        });
    },
    successLogin() {
      successModal.hide();
      this.$router.push({
        name: 'Admin',
      });
    },
  },
};
</script>
