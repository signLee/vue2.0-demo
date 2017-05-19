<!--评论页面组件-->
<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                    :ratings="ratings" @select="select" @onlyContent2="onlyContent2"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{ rating.username }}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-if="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
              </div>
              <p class="text">{{ rating.text }}</p>
              <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                <i :class="{'icon-arrow_lift':rating.rateType===0,'icon-check_circle':rating.rateType===1}"></i>
                <span v-for="item in rating.recommend" class="item">{{ item }}</span>
              </div>
              <div class="time">
                {{ rating.rateTime | formatDate }}

              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {formatDate} from '../../common/js/date';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import BScroll from 'better-scroll';

  const ALL = 2;
  const ERR_OK = 0;

  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    created() {
      var _this = this;
      this.$http.get('api/ratings').then((res) => {
        if (res.body.errno === ERR_OK) {
          _this.ratings = res.body.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            });
          })
        }
      });

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
      star,
      ratingselect,
      split
    },
    methods: {
      select(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      onlyContent2(onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  }
</script>

<style scoped>
  .ratings {
    position: fixed;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }

  .ratings .overview {
    display: flex;
    padding: 18px 0;
  }

  .ratings .overview .overview-left {
    flex: 0 0 137px;
    padding: 6px 0;
    width: 137px;
    border-right: 1px solid rgba(7, 17, 27, .1);
    text-align: center;
  }
  @media only screen and (max-width: 320px) {
    .ratings .overview .overview-left {
      flex: 0 0 120px;
      width:120px;
    }
  }

  .ratings .overview .overview-left .score {
    margin-bottom: 6px;
    line-height: 28px;
    font-size: 24px;
    color: rgb(255, 153, 0);
  }

  .ratings .overview .overview-left .title {
    margin-bottom: 8px;
    line-height: 12px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .ratings .overview .overview-left .rank {
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .ratings .overview .overview-right {
    flex: 1;
    padding: 6px 0 6px 24px;
  }
  @media only screen and (max-width: 320px) {
    .ratings .overview .overview-right{
      padding-left: 6px;
    }
  }
  .ratings .overview .overview-right .score-wrapper {
    margin-bottom: 8px;
    font-size: 0;
  }

  .ratings .overview .overview-right .score-wrapper .title {
    display: inline-block;
    line-height: 18px;
    vertical-align: top;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .ratings .overview .overview-right .score-wrapper .star {
    display: inline-block;
    vertical-align: top;
    margin: 0 12px;
  }

  .ratings .overview .overview-right .score-wrapper .score {
    display: inline-block;
    line-height: 18px;
    vertical-align: top;
    font-size: 12px;
    color: rgb(255, 153, 0);
  }

  .ratings .overview .overview-right .delivery-wrapper {
    font-size: 0;
  }

  .ratings .overview .overview-right .delivery-wrapper .title {
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .ratings .overview .overview-right .delivery-wrapper .delivery {
    margin-left: 12px;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }

  .rating-wrapper {
    padding: 0 18px;
  }

  .rating-wrapper .rating-item {
    display: flex;
    padding: 18px 0;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
  }

  .rating-wrapper .rating-item .avatar {
    flex: 0 0 28px;
    width: 28px;
    margin-right: 12px;
  }

  .rating-wrapper .rating-item .avatar img {
    border-radius: 50%;
  }

  .rating-wrapper .rating-item .content {
    flex: 1;
    position: relative;
  }

  .rating-wrapper .rating-item .content .name {
    margin-bottom: 4px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(7, 17, 27);
  }

  .rating-wrapper .rating-item .content .star-wrapper {
    margin-bottom: 6px;
    font-size: 0;
  }

  .rating-wrapper .rating-item .content .star-wrapper .star {
    display: inline-block;
    vertical-align: top;
    margin-right: 6px;
  }

  .rating-wrapper .rating-item .content .star-wrapper .delivery {
    display: inline-block;
    vertical-align: top;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .rating-wrapper .rating-item .content .text {
    margin-bottom: 8px;
    line-height: 18px;
    color: rgb(7, 17, 27);
    font-size: 12px;
  }

  .rating-wrapper .rating-item .content .recommend {
    line-height: 16px;
    font-size: 0;
  }

  .rating-wrapper .rating-item .content .recommend .icon-arrow_lift, .rating-wrapper .rating-item .content .recommend .item {
    display: inline-block;
    margin: 0 8px 4px 0;
    font-size: 9px;
  }

  .rating-wrapper .rating-item .content .recommend .icon-check_circle {
    display: inline-block;
    margin: 0 8px 4px 0;
    font-size: 9px;
    color: rgb(147, 153, 159);
  }

  .rating-wrapper .rating-item .content .recommend .icon-arrow_lift {
    color: rgb(0, 160, 220);
  }

  .rating-wrapper .rating-item .content .recommend .item {
    padding: 0 6px;
    border: 1px solid rgba(7, 17, 27, .1);
    border-radius: 1px;
    color: rgb(147, 153, 159);
    background: #fff;
    font-size: 9px;
  }

  .rating-wrapper .rating-item .content .time {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
</style>
