<!--购物车组件-->
<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{hightLight:totalCount>0}">
              <i class="icon-close" :class="{hightLight:totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{hightLight:totalPrice>0}">&yen;{{totalPrice}}元</div>
          <div class="desc">另需配送费&yen;{{deliveryPrice}}</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop.prevent="pay">
            {{payDesc}}
        </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop"
                          @before-enter="beforeEnter"
                          @enter="enter"
                          @after-enter="afterEnter"
        >
          <div v-for="(ball,index) in balls" v-show="ball.show" :key="{index}" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>&yen;{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mark" v-show="listShow" @click="hideList">
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartControl/cartControl.vue';
  const ADJUSTX = 12;
  const ADJUSTY = 24;
  export default{
    data(){
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        showBalls: [],
        fold: true
      }
    },
    props: {
      deliveryPrice: {
        type: Number
      },
      minPrice: {
        type: Number
      },
      selectFoods: {
        type: Array,
        default(){
          return [
            {
              price: 10,
              count: 3
            }
          ];
        }
      }
    },
    computed: {
      totalPrice(){
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        })
        return total;
      },
      totalCount(){
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        })
        return count;
      },
      payDesc(){
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`
        } else {
          return '去结算';
        }
      },
      payClass(){
        if (this.totalPrice < this.minPrice) {
          return 'not-enought'
        } else {
          return 'enought'
        }
      },
      listShow(){
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          })
        }
        return show;
      }
    },
    methods: {
      drop (target) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.target = target;
            this.showBalls.push(ball);
            return;
          }
        }
      },
      // 动画函数
      beforeEnter (el) {
        let ballCount = this.balls.length;
        while (ballCount--) {
          let ball = this.balls[ballCount];
          if (ball.show) {
            let pos = ball.target.getBoundingClientRect();
            let x = pos.left - 44 + ADJUSTX;
            let y = -(window.innerHeight - pos.top - 16 - ADJUSTY);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
            return;
          }
        }
      },
      enter (el) {
        /* eslint-disable no-unused-vars */
        // refresh作用是主动触发浏览器重绘
        let refresh = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter (el) {
        setTimeout(() => {
          let ball = this.showBalls.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }, 100)
      },
      toggleList(){
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty(){
        this.selectFoods.forEach((food) => {
          food.count = 0;
        })
      },
      hideList(){
          this.fold=true;
      },
      pay(){
          if(this.totalPrice<this.minPrice){
            return;
          }
          window.alert(`支付${this.totalPrice}元`);
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style scoped>
  .shopCart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    background: #000;
  }

  .shopCart .content {
    display: flex;
    background: #141d27;
    font-size: 0;
  }

  .shopCart .content .content-left {
    flex: 1;
  }

  .content-left .logo-wrapper {
    display: inline-block;
    position: relative;
    top: -10px;
    margin: 0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    vertical-align: top;
    border-radius: 50%;
    background: #141d27;
  }

  .content-left .logo-wrapper .logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #2b343c;
    text-align: center;
  }

  .content-left .logo-wrapper .num {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 16px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: rgb(240, 20, 20);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  }

  .content-left .logo-wrapper .logo .icon-close {
    font-size: 24px;
    color: #80858a;
    line-height: 44px;
  }

  .content-left .logo-wrapper .logo.hightLight {
    background: rgb(0, 160, 220);
  }

  .content-left .logo-wrapper .logo .icon-close.hightLight {
    color: #fff;
  }

  .content-left .price {
    display: inline-block;
    vertical-align: top;
    line-height: 24px;
    margin-top: 12px;
    line-height: 24px;
    box-sizing: border-box;
    padding-right: 12px;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
  }

  .content-left .price.hightLight {
    color: #fff;
  }

  .content-left .desc {
    display: inline-block;
    vertical-align: top;
    line-height: 24px;
    margin: 12px 0 0 6px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 10px;
  }

  .shopCart .content .content-right {
    flex: 0 0 105px;
    width: 105px;
  }

  .shopCart .content .content-right .pay {
    font-size: 14px;
    line-height: 48px;
    height: 48px;
    text-align: center;
    font-weight: 700;
    background: #2b333b;
    color: rgba(255, 255, 255, 0.4);
  }

  .shopCart .content .content-right .pay.not-enought {
    background: #2b333b;
  }

  .shopCart .content .content-right .pay.enought {
    background: #00b43c;
    color: #fff;
  }

  .shopCart .ball-container .ball {
    position: fixed;
    left: 48px;
    bottom: 22px;
    z-index: 200;
    transition: all .2s cubic-bezier(0.49, -0.29, 0.75, 0.41);
  }

  .shopCart .ball-container .ball .inner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgb(0, 160, 220);
    transition: all 0.2s linear;
  }

  .shopCart .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);
    opacity: 1;
  }

  .shopCart .shopcart-list.fold-enter-active, .shopCart .shopcart-list.fold-leave-active {
    transition: all .5s;
  }

  .shopCart .shopcart-list.fold-enter, .shopCart .shopcart-list.fold-leave-active {
    opacity: 0;
    transform: translate3d(0, 0, 0);
  }

  .shopCart .shopcart-list .list-header {
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    background: #f3f5f7;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    overflow: hidden;
  }

  .shopCart .shopcart-list .title {
    float: left;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .shopCart .shopcart-list .empty {
    float: right;
    font-size: 12px;
    color: rgb(0, 160, 226);
  }

  .shopCart .shopcart-list .list-content {
    padding: 0 18px;
    max-height: 217px;
    background: #fff;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .shopCart .shopcart-list .list-content .food {
    position: relative;
    padding: 12px 0;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    margin-top: -1px;
  }

  .shopCart .shopcart-list .list-content .name {
    line-height: 24px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .shopCart .shopcart-list .list-content .price {
    position: absolute;
    right: 90px;
    bottom: 12px;
    line-height: 24px;
    font-weight: 700;
    color: rgb(240, 20, 20);
  }

  .shopCart .shopcart-list .list-content .cartcontrol-wrapper {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .list-mark{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index: 40;
    -webkit-backdrop-filter: blur(10px);
    opacity:1;
    background: rgba(7,17,27,0.6);
    transition:0.5s all;
  }
  .list-mark.fade-enter,.list-mark.fade-leave{
    opacity:0;
    background: rgba(7,17,27,0);
  }
</style>
