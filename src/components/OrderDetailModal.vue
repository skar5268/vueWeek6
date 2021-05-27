<template>
  <div class="modal-dialog modal-lg  modal-dialog-centered">
    <div class="modal-content border-0 border-bottom border-primary border-5">
      <div
        class="d-flex justify-content-between align-items-center
           flex-column p-5 mb-0 text-warning"
        role="alert"
      >
        <ul class="list-group list-group-flush w-100 text-start">
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">
              訂單編號
            </h5>
            <span class="px-3">{{ editOrder.id }}</span>
          </li>
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">
              訂單日期
            </h5>
            <span class="px-3">
              {{ new Date(editOrder.create_at * 1000).getFullYear() }} /
              {{ new Date(editOrder.create_at * 1000).getMonth() + 1 }} /
              {{ new Date(editOrder.create_at * 1000).getDate() }}
            </span>
          </li>
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">
              付款狀態
            </h5>
            <span class="px-3">
              {{ editOrder.is_paid ? '已付款' : '未付款' }}
            </span>
          </li>
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">
              留言資訊
            </h5>
            <span class="px-3">
              {{ editOrder.message }}
            </span>
          </li>
          <template v-if="!editOrder.paid_date">
            <li class="list-group-item py-3 d-flex disabled">
              <h5 class="px-2 mb-0">付款日期</h5>
            </li>
          </template>
          <template v-else>
            <li class="list-group-item py-3 d-flex">
              <h5 class="px-2 mb-0">付款日期</h5>
              <span class="px-3">
                {{ new Date(editOrder.paid_date * 1000).getFullYear() }} /
                {{ new Date(editOrder.paid_date * 1000).getMonth() + 1 }} /
                {{ new Date(editOrder.paid_date * 1000).getDate() }}
              </span>
            </li>
          </template>
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">購買產品</h5>
            <span class="px-3">
              <template v-for="item in editOrder.products" :key="item.id">
                <p>{{ item.product.title }} * {{ item.product.num }}</p>
              </template>
            </span>
          </li>
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">
              消費金額
            </h5>
            <span class="px-3">
              {{ editOrder.total }}
            </span>
          </li>
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">
              聯絡資訊
            </h5>
            <ul class="list-group list-group-flush text-start">
              <li class="list-group-item border-0 pt-0">姓名：{{ editOrder.user.name }}</li>
              <li class="list-group-item border-0">E-mail：{{ editOrder.user.email }}</li>
              <li class="list-group-item border-0">聯絡地址：{{ editOrder.user.address }}</li>
              <li class="list-group-item border-0">連絡電話：{{ editOrder.user.tel }}</li>
            </ul>
          </li>
          <li class="list-group-item py-3 d-flex">
            <h5 class="px-2 mb-0">
              付款方式
            </h5>
            <span class="px-3">
              {{ editOrder.user.payment }}
            </span>
          </li>
        </ul>
        <!-- <input type="text" class="border-0" readonly> -->
        <button class="btn btn-primary w-25 mt-2 mb-1" data-bs-dismiss="modal" aria-label="Close">
          確認
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editOrder: { user: {} },
    };
  },
  watch: {
    newOrder() {
      this.editOrder = { ...this.newOrder };
    },
  },
  props: ['newOrder'],
};
</script>
