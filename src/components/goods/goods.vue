<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{current:currentIndex===index}"
            @click="selectMenu(index,$event)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item" @click="selectedFood(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">
                  {{food.name}}
                </h2>
                <p class="desc">
                  {{food.description}}
                </p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>月售{{food.rating}}份</span>
                </div>
                <div class="price">
                  <span class="now">&yen;{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">
                    &yen;{{food.oldPrice}}
                  </span>
                </div>
                <div class="cartControl-wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopCart ref="shopCart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopCart>
    <food :food="selectFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopCart from '../shopCart/shopCart.vue';
  import cartControl from '../cartControl/cartControl.vue';
  import food  from '../food/food.vue';
  const ERR_OK = 0;
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data(){
      return {
        goods: [],
        classMap: [],
        listHeight: [],
        scrollY: 0,
        selectFood:{}
      }
    },
    computed: {
      currentIndex: function () {
        for (var i = 0; i < this.listHeight.length; i++) {
          var scroll = this.scrollY;
          var height1 = this.listHeight[i];
          var height2 = this.listHeight[i + 1];
          if (!height2 || (scroll >= height1 && scroll < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        })
        return foods;
      }
    },
    created(){
      this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"]
      var _this = this;
      this.$http.get('api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          _this.goods = response.data;
          _this.$nextTick(() => {
            _this._initScroll();
            _this._calculateHeight();
          })
        }
      });
      this.$root.eventHub.$on('cart-add', (target) => {
        this._drop(target)
      });
    },
    methods: {
      selectMenu(index, event){
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      _initScroll(){
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true});
        this.foodsScroll = new BScroll(this.$refs.foodWrapper, {
          click: true,
          probeType: 3
        });
        var _this = this;
        this.foodsScroll.on('scroll', (pos) => {
          _this.scrollY = Math.abs(Math.round(pos.y))
        });
      },
      _calculateHeight(){
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += foodList[i].clientHeight;
          this.listHeight.push(height);
        }
      },
      _drop(target){
        this.$nextTick(() => {
          this.$refs.shopCart.drop(target);
        })
      },
      selectedFood(food,event){
          if(!event._constructed){
              return;
          }
          this.selectFood=food;
          this.$refs.food.show();
      }
    },
    components: {
      shopCart,
      cartControl,
      food
    }
  }
</script>

<style scoped>
  .goods {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    display: flex;
  }

  .goods .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
  }

  .goods .menu-wrapper .current {
    position: relative;
    z-index: 10;
    margin-top: -1px;
    background: #fff;
    font-weight: 700;
  }

  .goods .menu-wrapper .current .text {
    border: none;
  }

  .goods .menu-wrapper .menu-item {
    display: table;
    height: 54px;
    width: 56px;
    line-height: 14px;
    padding: 0 12px;
  }

  .goods .menu-wrapper .menu-item .icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 2px;
    vertical-align: top;
    background-repeat: no-repeat;
    background-size: 12px 12px;
  }

  .goods .menu-wrapper .menu-item .decrease {
    background-image: url("./decrease_2@3x.png");
  }

  .goods .menu-wrapper .menu-item .discount {
    background-image: url("./discount_2@3x.png");
  }

  .goods .menu-wrapper .menu-item .guarantee {
    background-image: url("./guarantee_2@3x.png");
  }

  .goods .menu-wrapper .menu-item .invoice {
    background-image: url("./invoice_2@3x.png");
  }

  .goods .menu-wrapper .menu-item .special {
    background-image: url("./special_2@3x.png");
  }

  .goods .menu-wrapper .menu-item .text {
    display: table-cell;
    width: 56px;
    vertical-align: middle;
    font-size: 12px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }

  .goods .foods-wrapper {
    flex: 1;
  }

  .goods .foods-wrapper .title {
    padding-left: 14px;
    height: 26px;
    line-height: 26px;
    border-left: 2px solid #d9dde1;
    font-size: 12px;
    color: rgb(147, 153, 159);
    background: #f3f5f7;
  }

  .goods .foods-wrapper .food-item {
    display: flex;
    margin: 18px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    position: relative;
  }

  .goods .foods-wrapper .food-item:last-child {
    border: none;
    margin-bottom: 0;
  }

  .goods .foods-wrapper .food-item .icon {
    flex: 0 0 57px;
    margin-right: 10px;
  }

  .goods .foods-wrapper .food-item .content {
    flex: 1;
  }

  .goods .foods-wrapper .food-item .content .name {
    margin: 2px 0 8px 0;
    line-height: 14px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .goods .foods-wrapper .food-item .content .desc, .goods .foods-wrapper .food-item .content .extra {
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .goods .foods-wrapper .food-item .content .desc {
    margin-bottom: 8px;
    line-height: 14px;
  }

  .goods .foods-wrapper .food-item .content .extra {
    line-height: 10px;
  }

  .goods .foods-wrapper .food-item .content .extra .count {
    margin-right: 10px;
  }

  .goods .foods-wrapper .food-item .content .price {
    font-weight: 700;
    line-height: 24px;
  }

  .goods .foods-wrapper .food-item .content .now {
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
  }

  .goods .foods-wrapper .food-item .content .old {
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .goods .foods-wrapper .food-item .content .cartControl-wrapper {
    position: absolute;
    right: 0;
    bottom: 0px;
  }
</style>
