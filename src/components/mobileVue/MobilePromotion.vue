<template>
  <div class="promotion-container" ref="container">

    <div class="padding-top-container"></div>
    <div id="code">
      <Qrcode :size="size" :value="value"></Qrcode>
    </div>
    <img src="" class="promotion-img">

  </div>
</template>


<script>
  const root = {}

  import Qrcode from 'qrcode.vue'

  root.name = 'MobilePromotion'

  root.components = {
    Qrcode: Qrcode
  }


  root.data = function () {
    return {
      size: 100,
      value: '',
    }
  }

  root.created = function () {
    this.value = this.$route.query.a
  }

  root.mounted = function () {
    this.size = this.$refs.container.offsetWidth * 0.355
  }

  export default root
</script>


<style scoped>

  #code {
    margin: 0 auto;
    width: 35.5%;
    /*height: 20px;*/
    z-index: 200;
    position: relative;

  }

  .promotion-container {
    background-color: rgb(255, 62, 47);
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .padding-top-container {
    padding: 0;
    padding-top: 72.6%;
    display: block;
    width: 100%;
    z-index: 200;
    /*border: 1px solid green;*/
    /*background-color: #0a8415;*/
    position: relative;
  }

  .promotion-img {
    width: 100%;
    /*max-width: 800px;*/
    margin: 0 auto;
    display: block;
    position: absolute;
    top: 0;
    z-index: 100;
  }

</style>
