<template>
	<view></view>
</template>

<script>
	import User from '../../../api/user';
	export default {
		data() {
			return {
				// 微信登录授权的code
				code: undefined,
				userinfo: undefined
			};
		},
		methods: {
			toLogin() {
				var me = this;
				uni.request({
					url: this.DevSerUrl + '/app/member/wxLogin/authUserInfoLogin',
					method: 'POST',
					withCredentials: true,
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						code: me.code
					},
					success: res => {
						if (res.data.error == 0) {
							// 设置用户token
							uni.setStorageSync('webToken', res.data.data.token);
							if (res.data.data.need_info == 0) {
								// 用户不是首次登录
								User.getInfo(res.data.data.user_id).then(res => {
									uni.setStorageSync('userData', res.data.data);
									me.toView();
								});
							} else {
								this.checkPhone(res.data.data.user_id);
							}
						} else {
							me.loginError();
						}
					}
				});
			},
			loginError() {
				uni.showModal({
					title: '网络不稳定',
					content: '请退出后重新登录',
					showCancel: false,
					confirmColor: '#3CC51F',
					success: function() {
						window.location.reload()
					}
				});
			},
			checkPhone(uid) {
				var me = this;
				// 用户有无绑定手机
				User.getInfo(uid).then(res => {
					me.userinfo = res.data.data;
					if (res.data.data.phone) {
						// 有手机号
						uni.redirectTo({
							url: '/pages/register/register?uid=' + uid
						});
					} else {
						// 无手机号
						uni.redirectTo({
							url: '/pages/login/wxlogin/bandphone?id=' + uid
						});
					}
				});
			},
			// 根据不同情况进行页面跳转
			toView() {
				// 查看是否需要跳转
				// 只跳转活动和首页
				const redirectRoute = uni.getStorageSync('redirectRoute');
				const redirectUrl = uni.getStorageSync('redirectUrl');
				if (redirectRoute === 'pages/content/content') {
					uni.redirectTo({
						url: redirectUrl
					});
				} else {
					this.toIndex()
				};
				uni.removeStorageSync('redirectRoute');
				uni.removeStorageSync('redirectUrl');
			},
			toIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		onLoad(par) {
			var me = this
			const userInfo = uni.getStorageSync('userData');
			if (userInfo) {
				// 防止返回到微信授权页面
				uni.switchTab({
					url: '/pages/index/index'
				});
			} else {
				me.code = par.code;
				me.toLogin();
			}

		}
	};
</script>

<style></style>
