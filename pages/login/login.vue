<template>
	<view>
		<view class="logo">
			<ailin-icon style="font-size: 100upx;" iconId="#icon-shouye-on"></ailin-icon>
			<text style="color: #0CB957;font-size: 34upx;">畅享社区美好生活</text>
			<br />
		</view>
		<text class="verify">手机验证登录</text>
		<view class="phone_number"><input type="number" v-model="phoneNumb" placeholder="请输入手机号" /></view>
		<view class="ver_code">
			<input password type="text" v-model="codeNumb" placeholder="请输入密码" />
		</view>
		<button class="agree" @click="toLogin">注册/登录</button>
	</view>
</template>

<script>
	import User from '../../api/user';
	export default {
		data() {
			return {
				phoneNumb: '',
				codeNumb: '',
				getCodeBtnNoClick: true,
				firstlogin: true
			};
		},
		methods: {
			// 等待一分钟
			waitCode() {
				// 设定一个定时器。每一秒执行一次回调函数
				var interval = setInterval(() => {
					--this.waittime;
				}, 1000);
				setTimeout(() => {
					clearInterval(interval);
					this.waitCodeType = false;
					this.waittime = 60;
				}, 60000);
			},
			checkPhoneNumb(num) {
				// 获取手机号码长度
				const lon = num.length;
				if (lon === 11 && num[0] === '1') {
					return true;
				} else {
					return false;
				}
			},
			// 确认是否可以发送
			checkCode() {
				var me = this;
				if (me.checkPhoneNumb(me.phoneNumb)) {
					if (me.codeNumb) {
						// 已经输入code
						return true;
					} else {
						// 未输入code
						const message = '请输入密码';
						me.toastMeg(message);
						return false;
					}
				} else {
					const message = '手机号码错误';
					me.toastMeg(message);
				}
			},
			// 消息提醒
			toastMeg(mesg) {
				uni.showToast({
					title: mesg,
					icon: 'none',
					duration: 3000
				});
			},
			// 登录
			toLogin() {
				var me = this;
				if (me.checkCode()) {
					uni.request({
						url: this.GradProUrl + '/app/member/phoneLogin/bindPhone',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
						},
						data: {
							phone: me.phoneNumb,
							passWord: me.codeNumb
						},
						success: res => {
							console.log(res.data); //egg 后端status获取方式
							if (res.data.error === 0) {
								// 设置用户token
								uni.setStorageSync('webToken', res.data.data.token);
								// 用户不是首次登录
								if (res.data.data.need_info === 0) {
									User.getInfo(res.data.data.user_id).then(res => {
										uni.setStorageSync('userData', res.data.data);
										me.toView();
									});
								} else {
									uni.redirectTo({
										url: '/pages/register/register?uid=' + res.data.data.user_id
									});
								}
							} else if (res.data.error === 1001) {
								uni.showModal({
									title: '密码错误',
									content: '密码错误，请重新输入',
									showCancel: false,
									confirmColor: '#3CC51F',
									success: function() {
									}
								});
							} else {
								me.loginError();
							}
						}
					});
				}
			},
			loginError() {
				uni.showModal({
					title: '发生错误',
					content: '发生错误，请重新登录',
					showCancel: false,
					confirmColor: '#3CC51F',
					success: function() {
						this.phoneNumb = '';
						this.waitCodeType = false;
						this.waittime = 60;
						this.codeNumb = '';
						this.getCodeBtnNoClick = true;
						this.firstlogin = true;
					}
				});
			},
			// 根据不同情况进行页面跳转
			toView() {
				this.toIndex()
				uni.removeStorageSync('redirectRoute');
				uni.removeStorageSync('redirectUrl');
			},
			toIndex() {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		}
	};
</script>

<style>
	page {
		background: #f2f2f2;
	}

	.logo {
		position: relative;
		top: 200upx;
		text-align: center;
	}

	.verify {
		position: absolute;
		top: 536upx;
		left: 273upx;
		font-size: 36upx;
		color: #000000;
		text-align: center;
	}

	.phone_number {
		border: 1px solid #b1b1b1;
		border-radius: 45upx;
		width: 548upx;
		height: 90upx;
		position: absolute;
		top: 648upx;
		left: 102upx;
	}

	.phone_number input {
		font-size: 28upx;
		color: #000000;
		position: absolute;
		left: 37upx;
		top: 25upx;
		width: 85%;
	}

	.ver_code {
		border: 1px solid #b1b1b1;
		border-radius: 45upx;
		width: 548upx;
		height: 90upx;
		position: absolute;
		top: 773upx;
		left: 102upx;
	}

	.ver_code input {
		font-size: 28upx;
		color: #000000;
		position: absolute;
		left: 37upx;
		top: 25upx;
		width: 50%;
	}

	.getPhoneCode {
		font-size: 24upx;
		color: #000000;
		position: absolute;
		left: 390upx;
		top: 29upx;
	}

	.waitPhoneCode {
		font-size: 24upx;
		color: #000000;
		position: absolute;
		right: 20upx;
		top: 29upx;
	}

	.agree {
		background: #3fb583;
		font-size: 32upx;
		line-height: 92upx;
		color: #ffffff;
		text-align: center;
		border-radius: 45upx;
		width: 550upx;
		height: 92upx;
		position: absolute;
		top: 897upx;
		left: 102upx;
	}

	.agree_text_1 {
		font-size: 24upx;
		position: absolute;
		top: 1020upx;
		left: 161upx;
		color: rgba(0, 0, 0, 0.25);
	}

	.agree_text_2 {
		font-size: 24upx;
		position: absolute;
		top: 1020upx;
		left: 377upx;
		color: #3fb583;
	}

	.agree_text_3 {
		font-size: 24upx;
		position: absolute;
		top: 1020upx;
		left: 473upx;
		color: rgba(0, 0, 0, 0.25);
	}

	.agree_text_4 {
		font-size: 24upx;
		position: absolute;
		top: 1020upx;
		left: 497upx;
		color: #3fb583;
	}
</style>
