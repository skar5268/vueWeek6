<template>
  <div class="modal-dialog  modal-dialog-centered">
    <div class="modal-content border-0 border-bottom border-warning border-5">
      <div
        class="d-flex justify-content-between align-items-center
           flex-column py-5 mb-0 text-warning"
        role="alert"
      >
        <p class="material-icons-round h1 mb-3 alert-icon">info</p>
        <p class="h3 fw-bold px-4">{{ alertTitle }}</p>
        <p class="mb-4">{{ alertMessage }}</p>
        <a class="btn btn-warning w-25 mt-2 mb-1 text-light" @click.prevent="nextAction">確認 </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['alertTitle', 'alertMessage'],
  methods: {
    nextAction() {
      this.$emit('action');
    },
  },
};
</script>
