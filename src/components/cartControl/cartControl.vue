<!--购物车增加删除组件-->
<template>
  <div class="cartControl">
    <transition-group name="fade" enter-active-class="fadeInRight animated" leave-active-class="fadeOut animated">
      <div class="cart-decrease icon-shopping_cart" v-show="food.count>0" :key="1" @click.stop.prevent="decreaseCart"></div>
      <div class="cart-count" :key="2" v-show="food.count>0">{{food.count}}</div>
    </transition-group>
    <div class="cart-add icon-thumb_down" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default{
    props: {
      food: {
        type: Object
      }
    },
    created(){
      // console.log(this.food);
    },
    methods: {
      addCart(event){
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$root.eventHub.$emit('cart-add', event.target);
      },
      decreaseCart(event){
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>

<style scoped>
  .cartControl {
    font-size: 0;
  }

  .fade {
    transition: 1s all linear;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    opacity: 1;
  }

  .fade-leave {
    opacity: 0;
  }

  .fade-leave-active {
    opacity: 0;
  }

  .cartControl .cart-decrease {
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    line-height: 24px;
    color: rgb(0, 160, 220);
  }

  .cartControl .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    text-align: center;
    padding-top: 6px;
    font-size: 10px;
    line-height: 24px;
    color: rgb(147, 153, 159);
  }

  .cartControl .cart-add {
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    line-height: 24px;
    color: rgb(0, 160, 220);
  }
</style>
