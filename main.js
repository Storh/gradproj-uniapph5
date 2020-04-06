import Vue from 'vue'
import App from './App'
// 引入icon组件
import ailinIcon from "@/components/ailin-icon.vue"
// 底部导航栏
import ailinTabBar from "@/components/ailin-tab-bar.vue";
// 瀑布流组件
import waterFall from "@/components/waterfall.vue";
// 拦截器插件
import Request from "@/plugins/request/index"

Vue.config.productionTip = false
// 全局变量,引入服务器地址
// Vue.prototype.SerUrl = 'http://39.105.169.18:7300/mock/5db865ea4be0621d2109ae8a'
// Vue.prototype.DevSerUrl = 'http://192.168.16.66:8080/ailin/serve'
// Vue.prototype.DevSerUrl = 'http://192.168.16.15:8080/ailin/serve'
Vue.prototype.DevSerUrl = 'http://www.chinaclick.com.cn/ailin'
// 毕设专用接口
Vue.prototype.GradProUrl = 'http://localhost:7001'
Vue.prototype.WebUrl = 'http://localhost:8080'

Vue.prototype.ManagePading = '@Dm1n:'
Vue.prototype.ManageHimg = '/static/icon/home.png'
Vue.prototype.ManageName = '社区居委'
Vue.prototype.ManageStyle = 'color: #A90000;'
// Vue.prototype.DevSerUrl = 'http://www.chinaclick.com.cn/ailin_test'
// 挂载拦截器
// global.$http = Request();
Vue.prototype.$http = Request();

App.mpType = 'app'

// 引入全局组件
Vue.component('ailin-icon', ailinIcon)
Vue.component('ailin-tab-bar', ailinTabBar)
Vue.component('water-fall', waterFall)
const app = new Vue({
	...App
})
app.$mount()
