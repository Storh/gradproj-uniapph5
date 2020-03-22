<template>
	<view class="png">
		<view class="logo">
			<ailin-icon style="font-size: 100upx;" iconId="#icon-shouye-on"></ailin-icon>
			<text style="color: #0CB957;font-size: 34upx;">畅享社区美好生活</text>
			<br />
		</view>
		<view v-else class="sjbtn" @click="toSjLogin">
			<ailin-icon iconId="#icon-shouji"></ailin-icon>
			<text>注册/登录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			toSjLogin() {
				uni.redirectTo({
					url: 'sjlogin/sjlogin'
				});
			},
		},
		onLoad() {}
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
