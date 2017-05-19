<!--商家页组件-->
<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{ seller.name }}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{ seller.ratingCount }})</span>
          <span class="text">月售{{ seller.sellCount }}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元

            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span>元

            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span>分钟

            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <i class="icon-favorite" :class="{'active': favorite}"></i>
          <span class="text">{{ favoriteText }}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper ">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item " v-for="(item, index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{ seller.supports[index].description }}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title ">商家信息</h1>
        <ul>
          <li class="info-item " v-for="info in seller.infos">{{ info }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from '../../common/js/store';
  const MARGIN = 6;
  const PIC_WIDTH = 120;
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    },
    mounted() {
     //DOM加载完毕
      this._initScroll();
      this._picScroll();//组件切换的时候DOM会重新加载
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    methods: {
      _initScroll () {
          //BScroll需要在内容区DOM更新完成后触发
        this.$nextTick(() => {
          if (!this.initScroll) {
            this.initScroll = new BScroll(this.$refs.seller, {
              click: true
            })//页面刷新的时候调用
          } else {
            this.initScroll.refresh();//组件切换的时候调用
          }
        })
      },
      _picScroll () {
        if (this.seller.pics) {
          let width = (PIC_WIDTH + MARGIN) * this.seller.pics.length - MARGIN;//图片数组的宽度
          this.$refs.picList.style.width = width + 'px';
        }
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrought: 'vertical'
            })
          } else {
            this.picScroll.refresh();
          }
        })
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      },
    },
    watch: {
      'seller' () {
        this._initScroll();//监听数据发生变化后调用bscroll
        this._picScroll();
      }
    }
  }
</script>

<style scoped>
  .seller {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }

  .seller .overview {
    position: relative;
    padding: 18px;
  }

  .seller .overview .title {
    margin-bottom: 8px;
    line-height: 14px;
    color: rgb(7, 17, 27);
    font-size: 14px;
  }

  .seller .overview .desc {
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    font-size: 0;
  }

  .seller .overview .desc .star {
    display: inline-block;
    vertical-align: top;
    margin-right: 8px;
  }

  .seller .overview .desc .text {
    display: inline-block;
    vertical-align: top;
    margin-right: 12px;
    line-height: 18px;
    font-size: 10px;
    color: rgb(77, 85, 93);
  }

  .seller .overview .remark {
    display: flex;
    padding-top: 18px;
  }

  .seller .overview .remark .block {
    flex: 1;
    text-align: center;
    border-right: 1px solid rgba(7, 17, 27, .1);
  }

  .seller .overview .remark .block:last-child {
    border: none;
  }

  .seller .overview .remark .block h2 {
    margin-bottom: 4px;
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .seller .overview .remark .block .content {
    line-height: 24px;
    font-size: 10px;
    color: rgb(7, 17, 27);
  }

  .seller .overview .remark .block .stress {
    font-size: 24px;
  }

  .seller .overview .favorite {
    position: absolute;
    right: 11px;
    top: 18px;
    width: 50px;
    text-align: center;
  }

  .seller .overview .favorite .icon-favorite {
    display: block;
    margin-bottom: 4px;
    line-height: 24px;
    font-size: 24px;
    color: #d4d6d9;
  }

  .seller .overview .favorite .icon-favorite.active {
    color: rgb(240, 20, 20);
  }

  .seller .overview .favorite .text {
    line-height: 10px;
    font-size: 10px;
    color: rgb(77, 85, 93);
  }

  .seller .seller-content .bulletin {
    padding: 18px 18px 0 18px;
  }

  .seller .seller-content .bulletin .title {
    margin-bottom: 8px;
    line-height: 14px;
    color: rgb(7, 17, 27);
    font-size: 14px;
  }

  .seller .seller-content .bulletin .content-wrapper {
    padding: 0 12px 16px 12px;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
  }

  .seller .seller-content .bulletin .content-wrapper .content {
    line-height: 24px;
    font-size: 12px;
    color: rgb(240, 20, 20);
  }

  .seller .seller-content .bulletin .supports .support-item {
    padding: 16px 12px;
    font-size: 0;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
  }

  .seller .seller-content .bulletin .supports .support-item:last-child {
    border: none;
  }

  .seller .seller-content .bulletin .supports .support-item .icon {
    display: inline-block;
    vertical-align: top;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
  }

  .seller .seller-content .bulletin .supports .support-item .icon.decrease {
    background-image: url("decrease_4@2x.png");
  }

  .seller .seller-content .bulletin .supports .support-item .icon.discount {
    background-image: url("discount_4@2x.png");
  }

  .seller .seller-content .bulletin .supports .support-item .icon.guarantee {
    background-image: url("guarantee_4@2x.png");
  }

  .seller .seller-content .bulletin .supports .support-item .icon.invoice {
    background-image: url("invoice_4@2x.png");
  }

  .seller .seller-content .bulletin .supports .support-item .icon.special {
    background-image: url("special_4@2x.png");
  }

  .seller .seller-content .bulletin .supports .support-item .text {
    line-height: 16px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .seller .seller-content .pics {
    padding: 18px 0 18px 18px;
  }

  .seller .seller-content .pics .title {
    margin-bottom: 12px;
    line-height: 14px;
    color: rgb(7, 17, 27);
    font-size: 14px;
  }

  .seller .seller-content .pics .pic-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }

  .seller .seller-content .pics .pic-list {
    font-size: 0;
  }

  .seller .seller-content .pics .pic-list .pic-item {
    display: inline-block;
    margin-right: 6px;
    width: 120px;
    height: 90px;
  }

  .seller .seller-content .pics .pic-list:last-child {
    margin: 0;
  }

  .seller .seller-content .info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);
  }

  .seller .seller-content .info .title {
    padding-bottom: 8px;
    line-height: 14px;
    font-size: 14px;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
  }

  .seller .seller-content .info .info-item {
    padding: 16px 12px;
    line-height: 16px;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    font-size: 12px;
  }

  .seller .seller-content .info .info-item :last-child {
    border: none;
  }
</style>
