<!--title组件-->
<template>
  <div class="title">
    <!--如果用span的话在安卓上有兼容性问题-->
    <div class="line"></div>
    <div class="text">{{text}}</div>
    <div class="line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props:["text"]
  }
</script>

<style scoped>
  .detail-main .title {
    display: flex;
    width: 80%;
    margin: 28px auto 24px auto;
  }

  .detail-main .title .line {
    flex: 1;
    position: relative;
    top: -6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .detail-main .title .text {
    font-size: 14px;
    padding: 0 12px;
    font-weight: 700;
  }
</style>
