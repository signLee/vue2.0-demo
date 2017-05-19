<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
    </div>

  </div>
</template>

<script>
  import header from './components/header/header.vue';
  const ERR_OK = 0;
  export default {
    data(){
      return {
        seller: {}
      }
    },
    created(){
      var _this = this;
      this.$http.get('api/seller').then((res) => {
        if (res.body.errno === ERR_OK) {
          _this.seller = res.body.data;
        }
      });
    },
    components: {
      "v-header": header
    }
  }
</script>

<style>
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }

  .tab .tab-item {
    flex: 1;
    text-align: center;
    position: relative;
  }

  .tab .tab-item a {
    display: block;
    width: 100%;
  }

  .tab .tab-item a.router-link-active {
    color: red;
  }

  .tab .tab-item:after {
    display: block;
    left: 0;
    bottom: 0;
    border-bottom: 1px solid #ccc;
    content: '';
  }

  @media (-webkit-min-device-pixel-ratio: 1.5),(min-device-aspect-ratio: 1.5) {
    .tab .tab-item:after {
      -webkit-transform: scaleY(0.7);
      transform: scaleY(0.7);
    }
  }

  @media (-webkit-min-device-pixel-ratio: 2),(min-device-aspect-ratio: 2) {
    .tab .tab-item:after {
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }


</style>
