<template>

	<view v-if="distList">
		<view class="logo">
			<ailin-icon style="font-size: 100upx;" iconId="#icon-shouye-on"></ailin-icon>
			<text style="color: #0CB957;font-size: 34upx;">畅享社区美好生活</text>
			<br />
		</view>
		<text class="verify">完善您的信息</text>
		<view class="name">
			<input v-model="name" placeholder="姓名+门栋+单元" />
		</view>
		<view class="ver_code">
			<view @click="chooseList">
				<text style="width: 90%;">{{distname}}</text>
				<view class="choosebutton">
					<ailin-icon :style="trangleicon" iconId="#icon-triangle-bottom"></ailin-icon>
				</view>
			</view>
			<scroll-view scroll-y="true" class="showdistlist" :style="nonshowlist">
				<block v-for="item in distList">
					<view class="choosetext" @click="choosedDist(item)">
						{{item.name}}
					</view>
				</block>
			</scroll-view>
		</view>
		<button class="agree" @click="toOpen()">开启您的新旅程</button>
		<text class="agree_text_1">更多个人信息可在“我”板块里完善</text>
	</view>
</template>

<script>
	import Login from "../../api/login"
	import User from "../../api/user"
	import Base from "../../api/base"
	export default {
		data() {
			return {
				uid: undefined,
				// 您的姓名
				name: '',
				// 小区列表
				distList: undefined,
				// 小区选择框显示的文字
				distname: "选择所在小区",
				// 小区id
				distid: undefined,
				choosetype: true,
				// 小区选择列表展示
				nonshowlist: "display:none;",
				// 箭头操作
				trangleicon: "",
			}
		},
		methods: {
			checkSetInfo() {
				if (this.name && this.distid) {
					return true
				} else {
					uni.showToast({
						title: '请填充您的信息',
						icon: 'none',
						duration: 3000
					});
					return false
				}
			},
			// 点击选项
			choosedDist(item) {
				this.distid = item.id
				this.distname = item.name
				this.nonshowlist = "display:none;"
				this.trangleicon = ""
				this.choosetype = true
			},
			// 点击选择框
			chooseList() {
				if (this.choosetype) {
					this.nonshowlist = "display:block;"
					this.trangleicon = "transform: rotate(180deg);"
					this.choosetype = false
				} else {
					this.nonshowlist = "display:none;"
					this.trangleicon = ""
					this.choosetype = true
				}
			},

			// 进入爱邻，开启新旅程
			toOpen() {
				if (this.checkSetInfo()) {
					// 1.1.6、 注册后完善用户信息
					Login.setInfo(this.name, this.distid).then(res => {
						this.getUserData()
					})
				}
			},
			getUserData() {
				User.getInfo(this.uid).then(res => {
					uni.setStorageSync("userData", res.data.data);
					this.toView()
				})
			},
			// 根据不同情况进行页面跳转
			toView() {
				// 查看是否需要跳转
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
					url: "/pages/index/index"
				})
			}
		},
		onLoad(params) {
			this.uid = params.uid
			Base.getDistList().then(res => {
				this.distList = res.data.data.list
			})
		}
	}
</script>

<style>
	.logo {
		position: relative;
		top: 200upx;
		text-align: center;
	}

	.showdistlist {
		background: #F2F2F2;
		height: 300upx;
		width: 495upx;
		font-size: 28upx;
		position: absolute;
		left: 17upx;
		top: 90upx;
		z-index: 5;
		line-height: 200%;
		border-radius: 5upx;
	}

	.choosebutton {
		position: absolute;
		left: 475upx;
		top: 15upx;
	}

	.choosetext {
		position: relative;
		left: 20upx;
	}

	page {
		background: #F2F2F2;
	}

	.verify {
		position: absolute;
		top: 536upx;
		left: 273upx;
		font-size: 34upx;
		color: #000000;
		text-align: center;
	}

	.name {
		border: 1px solid #B1B1B1;
		border-radius: 45upx;
		width: 548upx;
		height: 90upx;
		position: absolute;
		top: 648upx;
		left: 102upx;
	}

	.name input {
		font-size: 28upx;
		color: #000000;
		position: absolute;
		left: 37upx;
		top: 25upx;
		width: 85%;
	}

	.ver_code {
		border: 1px solid #B1B1B1;
		border-radius: 45upx;
		width: 548upx;
		height: 90upx;
		position: absolute;
		top: 773upx;
		left: 102upx;
	}

	.ver_code text {
		font-size: 28upx;
		color: #000000;
		position: absolute;
		left: 37upx;
		top: 25upx;
	}

	.agree {
		background: #3FB583;
		font-size: 32upx;
		line-height: 92upx;
		color: #FFFFFF;
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
		width: 100%;
		top: 1020upx;
		text-align: center;
		color: rgba(0, 0, 0, 0.25);
	}
</style>
