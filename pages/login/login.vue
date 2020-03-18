<template>
	<view class="png">
		<view class="logo">
			<ailin-icon style="font-size: 100upx;" iconId="#icon-shouye-on"></ailin-icon>
			<text style="color: #0CB957;font-size: 34upx;">畅享社区美好生活</text>
			<br />
		</view>
		<view v-if="ua" class="wxbtn" @click="toWxLogin">
			<ailin-icon iconId="#icon-weixin"></ailin-icon>
			<text>微信授权</text>
		</view>
		<view v-else class="sjbtn" @click="toSjLogin">
			<ailin-icon iconId="#icon-shouji"></ailin-icon>
			<text>手机登录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ua: undefined,
				// 登录完成后的跳转
				logintype: 'toIndex',
				// wxloginUrl: 'http%3A%2F%2F192.168.16.18%3A8080%2F%23%2Fpages%2Flogin%2Fwxlogin%2Fwxlogin'
				wxloginUrl: 'http%3A%2F%2Failin.feiqing.net%2F%23%2Fpages%2Flogin%2Fwxlogin%2Fwxlogin'
			};
		},
		methods: {
			isWeiXin() {
				var ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					this.ua = true;
				} else {
					this.ua = false;
				}
			},
			toWxLogin() {
				uni.setStorageSync('wxlogin', true);
				// 稍后改为关闭当前并打开新页面
				const url = 'http://www.chinaclick.com.cn/ailin/app/member/wxLogin/authUserInfo?redirectUrl=' + this.wxloginUrl;
				window.location.replace(url)
			},
			toSjLogin() {
				uni.redirectTo({
					url: 'sjlogin/sjlogin'
				});
			},
			getRedirectUrl() {
				const redirectUrl = uni.getStorageSync('redirectUrl');
				if (redirectUrl) {} else {
					// 获取先前页面路径
					const pages = getCurrentPages();
					if (pages.length < 2) {
						uni.setStorageSync("redirectUrl", '/');
						uni.setStorageSync("redirectRoute", '');
					} else {
						const route = pages[pages.length - 2].route
						const fullPath = pages[pages.length - 2].$route.fullPath
						uni.setStorageSync("redirectUrl", fullPath);
						uni.setStorageSync("redirectRoute", route);
					}
				}
			}
		},
		onLoad(params) {
			this.isWeiXin();
			const userInfo = uni.getStorageSync('userData');
			if (userInfo) {
				if (userInfo.districts.estate.id) {
					uni.redirectTo({
						url: '../../index/index'
					});
				}
			}
			// 设置分享跳回
			this.getRedirectUrl();
		}
	};
</script>

<style>
	.png {
		height: 100%;
		width: 100%;
		position: absolute;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url('~@/static/login.png');
	}

	.logo {
		position: relative;
		top: 200upx;
		text-align: center;
	}

	.wxbtn {
		background-color: #0cb957;
		color: #ffffff;
		width: 340upx;
		height: 90upx;
		border-radius: 45upx;
		position: absolute;
		top: 1000upx;
		left: 205upx;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		font-size: 32upx;
	}

	.sjbtn {
		background-color: #000000;
		color: #ffffff;
		width: 340upx;
		height: 90upx;
		border-radius: 45upx;
		position: absolute;
		top: 1140upx;
		left: 205upx;
		text-align: center;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		font-size: 32upx;
	}
</style>
