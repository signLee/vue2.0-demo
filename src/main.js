// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App';
import animate from 'animate.css';
import VueRouter from 'vue-router';
import VueResouce from 'vue-resource';
import Goods from './components/goods/goods.vue';
import Ratings from './components/ratings/ratings.vue';
import Seller from './components/seller/seller.vue';
Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueResouce);

//2.配置路由
var routes = [
  {path: '/goods', component: Goods},
  {path: '/ratings', component: Ratings},
  {path: '/seller', component: Seller},
  {path: '/*', redirect: '/goods'}//页面没找到也会跳转到这里
]
//3.生成路由实例
var router=new VueRouter({
  routes:routes
});
// //4.挂载路由
// const app = new Vue({
//   router
// }).$mount('#app')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data(){
    return{
      eventHub: new Vue()
    }
  }
})
