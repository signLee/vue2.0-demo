<!--商品详情组件-->
<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image"/>
          <div class="back" @click="hide">
            <i class="icon-add_circle"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">&yen;{{food.price}}</span><span v-show="food.oldPrice" class="old">
                &yen;{{food.oldPrice}}
            </span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartControl :food="food"></cartControl>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count||food.count===0" @click.stop.prevent="addFirst($event)">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings&&food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formateDate}}</div>
                <p class="text">
                  <span
                    :class="{'icon-arrow_lift':rating.rateType===0,'icon-check_circle':rating.rateType===1}"></span>
                  <span>{{rating.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings||!food.ratings.length">
              暂无评价

            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import cartControl from '../cartControl/cartControl.vue';
  import {formatDate} from '../../common/js/date';
  const POSITIVE = 0;//正常评价
  const NEGATIVE = 1;//不满意
  const ALL = 2;//所有评价
  export default{
    props: {
      food: {
        type: Object
      }
    },
    data(){
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show(){
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        })
      },
      hide(){
        this.showFlag = false;
      },
      addFirst(event){
        if (!event._constructed) {
          return;
        }
        this.$root.eventHub.$emit('cart-add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      needShow(type, text){
        if (this.onlyContent && !text) {
          return false;//没有内容
        }
        if (this.selectType === ALL) {
          return true;//显示所有
        } else {
          return type === this.selectType;//与要显示的类型一致的数据被显示
        }
      }
    },
    created() {
      //接受从ratingselect组件传过来的值
      this.$root.eventHub.$on('ratingtype.select', (type) => {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      });
      this.$root.eventHub.$on('content.toggle', (onlyContent) => {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      });
    },
    components: {
      cartControl,
      split,
      ratingselect
    },
    filters: {
      formateDate(time){
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  }

</script>

<style scoped>
  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 40px;
    z-index: 30;
    width: 100%;
    background: #fff;
    transition: all 0.2s linear;
    transform: translate3d(0, 0, 0);
  }

  .food.move-enter, .food.move-leave {
    transform: translate3d(100%, 0, 0);
  }

  .food .image-header {
    position: relative;
    width: 100%;
    height: 0px;
    padding-bottom: 100%;
  }

  .food .image-header img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .food .image-header .back {
    position: absolute;
    top: 10px;
    left: 0;
  }

  .food .image-header .back .icon-add_circle {
    display: block;
    padding: 10px;
    font-size: 20px;
    color: #fff;
  }

  .content {
    position: relative;
    padding: 18px;
  }

  .content .title {
    line-height: 14px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7, 17, 27);
  }

  .detail {
    margin-bottom: 18px;
    height: 10px;
    line-height: 10px;
    font-size: 0;
  }

  .sell-count, .rating {
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .sell-count {
    margin-right: 12px;
  }

  .price {
    font-weight: 700;
    line-height: 24px;
  }

  .now {
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
  }

  .old {
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cartcontrol-wrapper {
    position: absolute;
    right: 12px;
    bottom: 12px;
  }

  .buy {
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 10;
    height: 24px;
    line-height: 24px;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 10px;
    border-radius: 12px;
    color: #fff;
    background: rgb(0, 160, 220);
    opacity: 1;
    transition: all 0.2s;
  }

  .buy.fade-enter, .buy.fade-leave {
    opacity: 0;
  }

  .info {
    padding: 18px;
  }

  .info.title {
    line-height: 14px;
    margin-bottom: 6px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .info .text {
    line-height: 24px;
    padding: 0 8px;
    font-size: 12px;
    color: #07111b;
  }

  .rating {
    padding-top: 18px;
  }

  .rating .title {
    line-height: 14px;
    margin-left: 18px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .rating-wrapper {
    padding: 0 18px;
    margin-top: -1px;
  }

  .rating-wrapper .rating-item {
    position: relative;
    padding: 16px 0;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
  }

  .rating-wrapper .rating-item:nth-child(1) {
    border: none;
  }

  .rating-wrapper .rating-item .user {
    position: absolute;
    right: 0;
    top: 16px;
    font-size: 0;
    line-height: 12px;
  }

  .rating-wrapper .rating-item .user .name {
    display: inline-block;
    vertical-align: top;
    margin-right: 6px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .rating-wrapper .rating-item .user .avatar {
    border-radius: 50%;
  }

  .rating-wrapper .rating-item .time {
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
    margin-bottom: 6px;
  }

  .rating-wrapper .rating-item .text {
    line-height: 16px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .icon-arrow_lift, .icon-check_circle {
    margin-right: 4px;
    line-height: 16px;
    font-size: 12px;
  }

  .icon-arrow_lift {
    color: rgb(0, 160, 220);
  }

  .icon-check_circle {
    color: rgb(147, 153, 159);
  }

  .no-rating {
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }
</style>
