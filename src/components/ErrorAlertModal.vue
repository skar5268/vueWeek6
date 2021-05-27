<template>
  <div class="modal-dialog  modal-dialog-centered">
    <div class="modal-content border-0 border-bottom border-danger border-5">
      <div
        class="d-flex justify-content-between align-items-center
           flex-column py-5 mb-0 text-danger"
        role="alert"
      >
        <p class="material-icons-round h1 mb-3 alert-icon">error</p>
        <p class="h3 fw-bold px-4">{{ alertTitle }}</p>
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
</template>

<script>
export default {
  props: ['alertTitle', 'alertMessage'],
};
</script>
