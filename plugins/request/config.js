import Interceptor from "./core/interceptor";
import Request from "./index";

export const globalInterceptor = {
	request: new Interceptor(),
	response: new Interceptor()
};

/**
 * 全局配置
 * 只能配置 静态数据
 * `content-type` 默认为 application/json
 * `header` 中`content-type`设置特殊参数 或 配置其他会导致触发 跨域 问题，出现跨域会直接进入响应拦截器的catch函数中
 */
export const config = {
	// baseURL: "http://39.105.169.18:7300/mock/5db865ea4be0621d2109ae8a",
	// baseURL: "http://localhost:7001",
	baseURL:'http://water.glasssoda.cn:7001',
	// baseURL: "http://www.chinaclick.com.cn/ailin",
	// baseURL: "http://www.chinaclick.com.cn/ailin_test",
	withCredentials: true,
	header: {
		// 'X-Auth-Token': 'xxxx',
		// contentType: "application/x-www-form-urlencoded",
		contentType: 'application/json',
		// Authorization: 'Bearer ' + this.getToken(),
		// 'Content-Type': 'application/json'
	}
};

/**
 * 全局 请求拦截器, 支持添加多个拦截器
 * 例如: 配置token、添加一些默认的参数
 *
 * `return config` 继续发送请求
 * `return false` 会停止发送请求，不会进入错误数据拦截，也不会进入请求对象中的catch函数中
 * `return Promise.reject('xxxxx')` 停止发送请求, 会错误数据拦截，也会进入catch函数中
 *
 * @param {Object} config 发送请求的配置数据
 */
globalInterceptor.request.use(
	config => {
		// 设置发送时的token
		let token = getToken()
		if (token) {
			if (config.data) {
				// config.data.token = token;
				config.header.Authorization = 'Bearer ' + getToken()
			}
			// console.log(config)
			return config;
		} else {
			// console.log('false')
			// console.log(config)
			return false;
		}
		// getToken() && (config.data.token = getToken());
		// return config;
	},
	err => {
		console.error("is global fail request interceptor: ", err);
		return false;
	}
);

/**
 * 全局 响应拦截器, 支持添加多个拦截器
 * 例如: 根据状态码选择性拦截、过滤转换数据
 *
 * `return res` 继续返回数据
 * `return false` 停止返回数据，不会进入错误数据拦截，也不会进入catch函数中
 * `return Promise.reject('xxxxx')` 返回错误信息, 会错误数据拦截，也会进入catch函数中
 *
 * @param {Object} res 请求返回的数据
 * @param {Object} config 发送请求的配置数据
 * @return {Object|Boolean|Promise<reject>}
 */
globalInterceptor.response.use(
	(res, config) => {
		// 操作成功
		if (res.data.error === 0) {
			return res;
		} else if (res.data.error === -1) {
			// 没有权限,提示去登录
			toLogin();
		} else if (res.data.error === 1) {
			// 操作失败
			operationFailed(res.data.message);
		}
		// 目前保留 等对接后修改
		return res;
	},
	(err, config) => {
		console.error("is global response fail interceptor");
		console.error("err: ", err);
		console.error("config: ", config);
		operationFailed('发生错误,请刷新后重试');
		return Promise.reject(err);
	}
);

/**
 * 获取 `localStorage` 中的 `webToken`
 * @return {string} token字符串
 */
function getToken() {
	return uni.getStorageSync('webToken');
}

// 权限不足的相关处理
function toLogin() {
	// 清除token和用户信息
	console.log('清除token和用户信息')
	uni.removeStorageSync('webToken');
	uni.removeStorageSync('userData');
	// 获取当前页面路径
	// const pages = getCurrentPages()
	// console.log(pages)
	// const route = pages[pages.length - 1].route
	// const fullPath = pages[pages.length - 1].$route.fullPath
	// console.log(route)
	// 跳转提醒
	uni.showModal({
		title: '登录过期',
		content: '登录过期，请重新登录',
		showCancel: false,
		confirmColor: "#3CC51F",
		success: function() {
			// 设置跳转路由
			// uni.setStorageSync("redirectUrl", fullPath);
			// uni.setStorageSync("redirectRoute", route);
			uni.reLaunch({
				url: "/pages/login/login"
			})
		}
	});
}
// 操作失败的提醒
function operationFailed(mesg) {
	uni.showToast({
		title: mesg,
		icon: 'none',
		duration: 3000
	});
}
