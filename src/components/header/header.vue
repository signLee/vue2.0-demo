<!--顶部header部分组件-->
<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="图片" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="背景图" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div class="detail" v-if="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <v-star :size="48" :score="seller.score"></v-star>
            </div>
            <v-title :text="title[0]"></v-title>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item,index) in seller.supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <v-title :text="title[1]"></v-title>
            <div class="bullentin">
              <p class="content">
                {{seller.bulletin}}
             </p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-remove_circle_outline"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';
  import title from '../title/title.vue';
  export default{
    props: {
      seller: {}
    },
    data(){
      return {
        classMap: [],
        detailShow: false,
        title:["优惠信息","商家公告"]
      }
    },
    methods: {
      showDetail(){
        this.detailShow = true;
      },
      hideDetail(){
        this.detailShow = false;
      }
    },
    created(){
      this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"]
    },
    components: {
      "v-star": star,
      "v-title":title
    }
  }
</script>

<style scoped>
  body, html {
    line-height: 1;
    font-weight: 200;
  }

  .header {
    color: #fff;
    position: relative;
    background: rgba(7, 17, 27, 0.5);
  }

  .content-wrapper {
    padding: 24px 12px 18px 24px;
    font-size: 0;
    position: relative;
  }

  .avatar {
    display: inline-block;
    vertical-align: top;
  }

  .avatar img {
    border-radius: 2px;
  }

  .content {
    display: inline-block;
    margin-left: 16px;
  }

  .title {
    margin: 2px 0 8px 0;
  }

  .brand {
    display: inline-block;
    vertical-align: top;
    width: 30px;
    height: 18px;
    background-size: 30px 18px;
    background-repeat: no-repeat;
    background-image: url("./brand@2x.png");
  }

  @media (-webkit-min-device-pixel-ratio: 3),(webkit-min-device-pixel-ratio: 3) {
    .bg-image {
      background-image: url("./brand@3x.png");
    }
  }

  .name {
    margin-left: 6px;
    font-size: 16px;
    line-height: 18px;
    font-weight: bold;
  }

  .description {
    margin-bottom: 10px;
    line-height: 12px;
    font-size: 12px;
  }

  .support .icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    vertical-align: top;
    background-repeat: no-repeat;
    background-size: 12px 12px;
  }

  .support .decrease {
    background-image: url("./decrease_2@2x.png");
  }

  .support .discount {
    background-image: url("./discount_2@2x.png");
  }

  .support .guarantee {
    background-image: url("./guarantee_2@2x.png");
  }

  .support .invoice {
    background-image: url("./invoice_2@2x.png");
  }

  .support .special {
    background-image: url("./special_2@2x.png");
  }

  .text {
    line-height: 12px;
    font-size: 12px;
  }

  .support-count {
    position: absolute;
    right: 12px;
    bottom: 14px;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .support-count .count {
    font-size: 10px;
  }

  .support-count .icon-keyboard_arrow_right {
    font-size: 10px;
    margin-left: 2px;
    line-height: 24px;
  }

  .bulletin-wrapper {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    background: rgba(7, 17, 27, 0.2);
  }

  .bulletin-wrapper .bulletin-title {
    display: inline-block;
    width: 22px;
    height: 12px;
    background-image: url("bulletin@2x.png");
    background-size: 22px 12px;
    background-repeat: no-repeat;
    vertical-align: top;
    margin-top: 10px;
  }

  .bulletin-wrapper .bulletin-text {
    font-size: 10px;
    margin: 0 4px;
  }

  .bulletin-wrapper .icon-keyboard_arrow_right {
    font-size: 10px;
    top: 8px;
    right: 6px;
    position: absolute;
  }

  .background {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    filter: blur(10px);
  }

  .detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7, 17, 27, 0.8);
  }

  .detail-wrapper {
    width: 100%;
    min-height: 100%;
  }

  .detail-main {
    margin-top: 64px;
    padding-bottom: 64px;
  }

  .detail-main .name {
    line-height: 16px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
  }

  .detail-main .star-wrapper {
    text-align: center;
    margin-top: 18px;
    padding: 2px 0;
  }
  .detail-main .supports {
    width: 80%;
    margin: 0 auto;
  }

  .detail-main .supports .support-item {
    padding: 0 12px;
    margin-bottom: 12px;
    font-size: 0;
  }

  .detail-main .supports .support-item:last-child {
    margin-bottom: 0;
  }

  .detail-main .supports .support-item .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: top;
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
  }

  .detail-main .supports .support-item .icon.decrease {
    background-image: url("./decrease_2@2x.png");
  }

  .detail-main .supports .support-item .icon.discount {
    background-image: url("./discount_2@2x.png");
  }

  .detail-main .supports .support-item .icon.guarantee {
    background-image: url("./guarantee_2@2x.png");
  }

  .detail-main .supports .support-item .icon.invoice {
    background-image: url("./invoice_2@2x.png");
  }

  .detail-main .supports .support-item .icon.special {
    background-image: url("./special_2@2x.png");
  }

  .detail-main .supports .support-item .text {
    line-height: 16px;
    font-size: 12px;
  }

  .detail-main .bullentin {
    width: 80%;
    margin: 0 auto;
  }

  .detail-main .bullentin .content {
    padding: 0 12px;
    line-height: 24px;
    font-size: 12px;
  }

  .detail-close {
    position: relative;
    width: 100%;
    text-align: center;
    height: 32px;
    margin: -64px auto 0 auto;
    clear: both;
    font-size: 32px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    background: rgba(7,17,27,0.8);
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
    background: rgba(7,17,27,0);
  }
</style>
