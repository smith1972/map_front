<template>
  <header>
    <div class="container">
      <a href="/" class="logo">
        <img src="@/assets/logo.png" />
      </a>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Header',
  }
</script>

<style scoped>

header {
  background: linear-gradient(to right, #FF8C00, #f1da36);
  height: 80px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #666;
  width: 100%;
  z-index: 1000;
  margin-bottom: 20px;
}

header .logo img{
  height: 60px;
  margin-top: 10px;
}

</style>