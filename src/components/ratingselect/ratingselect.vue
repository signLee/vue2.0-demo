<!--评论选择组件-->
<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2,$event)" class="block positive" :class="{active:selectType===2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{active:selectType===0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{active:selectType===1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent" :class="{on:onlyContent}">
      {{onlyContent}}
      <i class="icon-keyboard_arrow_right"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;//正常评价
  const NEGATIVE = 1;//不满意
  const ALL = 2;//所有评价
  export default{
    props: {
      ratings: {
        type: Array,
        default(){
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default(){
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data(){
      return {
        selectType2: this.selectType,
        onlyContent2: this.onlyContent
      }
    },
    methods: {
      select(type, event){
        if (!event._constructed) {
          return;
        }
        this.selectType2 = type;
        this.$root.eventHub.$emit('ratingtype.select', this.selectType2);
      },
      toggleContent(event){
        if (!event._constructed) {
          return;
        }
        this.onlyContent2 = !this.onlyContent2;
        this.$root.eventHub.$emit('content.toggle', this.onlyContent2);
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        });
      },
      negatives(){
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        })
      }
    }
  }
</script>

<style scoped>
  .ratingselect .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    font-size: 0;
  }

  .ratingselect .rating-type .block {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 1px;
    margin-right: 8px;
    color: rgb(77, 89, 93);
    font-size: 12px;
    line-height: 16px;
  }

  .ratingselect .rating-type .block.active {
    color: #fff;
  }

  .count {
    font-size: 8px;
    margin-left: 2px;
  }

  .positive {
    background: rgba(0, 160, 220, 0.2);
  }

  .positive.active {
    background: rgb(0, 160, 220);
  }

  .negative {
    background: rgba(77, 85, 93, 0.2);
  }

  .negative.active {
    background: rgb(77, 85, 93);
  }

  .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    color: rgb(147, 153, 159);
    font-size: 0;
  }

  .icon-keyboard_arrow_right {
    display: inline-block;
    vertical-align: top;
    margin-right: 4px;
    font-size: 24px;
  }

  .switch.on .icon-keyboard_arrow_right {
    color: #00c850;
  }

  .switch .text {
    font-size: 12px;
    display: inline-block;
    vertical-align: top;
  }
</style>
