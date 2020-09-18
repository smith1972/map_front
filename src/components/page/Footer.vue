<template>
  <footer>
    <div class="container">
      <a href="/" class="logo">
        <img src="@/assets/logo.png" />
      </a>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'Footer',
  }
</script>

<style scoped>

footer {
  background: linear-gradient(to right, #FF8C00, #f1da36);
  height: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #666;
  width: 100%;
  z-index: 1000;
  margin-top: 20px;
}

footer .logo img{
  height: 40px;
  margin-top: 5px;
}

</style>