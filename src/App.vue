<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light py-0">
    <div class="container py-0">
      <span class="navbar-brand"
        ><router-link class="nav-link py-0 active" to="/">Home</router-link></span
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <ul class="navbar-nav fw-bold ">
        <li class="nav-item">
          <router-link class="nav-link text-primary p-4" to="/products">前端產品列表</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-primary p-4" to="/carts">購物車</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-primary p-4" to="/login">後台登入</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-primary p-4" to="/admin">後台管理</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <router-view />
</template>

<style lang="scss">
.navbar-nav {
  .active {
    background: #0b5ed7;
    color: #f8f9fa !important;
  }
}
</style>
