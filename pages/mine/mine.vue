<template>
	<view>
		<view class="me" v-if="userinfo">
			<!-- <block v-if="userinfo.nickname==ManagePading"> -->
			<!-- {{userinfo.nickname.indexOf(ManagePading)}} -->
			<!-- {{userinfo.nickname.slice(ManagePading.length)}} -->
			<block v-if="userinfo.nickname.indexOf(ManagePading)==0">
				<image :src="ManageHimg"></image>
				<!-- <text class="nickname" :style="ManageStyle">{{ ManageName + userinfo.nickname.slice(ManagePading.length)}}</text> -->
				<text class="nickname" :style="ManageStyle">{{ ManageName}}</text>
			</block>
			<block v-else>
				<image :src="userinfo.headimgurl"></image>
				<text class="nickname">{{ userinfo.nickname }}</text>
			</block>
			<view class="signture">{{ userinfo.personal_signature }}</view>
			<ailin-icon class="icon-dizhi-wode" iconId="#icon-dizhi-wode"></ailin-icon>
			<text class="adress">{{ userinfo.districts.estate.name }}</text>
			<view @click="toEditView">
				<text class="grjj">编辑简介</text>
				<ailin-icon class="icon-shezhi-wode" iconId="#icon-shezhi-wode"></ailin-icon>
			</view>
		</view>
		<view class="pages" v-for="(item, index) in mineInfo" :key="index" @tap="toInfoView(index)">
			<ailin-icon class="item-icon" :iconId="item.icon"></ailin-icon>
			<text class="item-name">{{ item.name }}</text>
			<ailin-icon class="icon-right" iconId="#icon-right"></ailin-icon>
		</view>
		<view class="space"></view>
		<view>
			<view class="col" @tap="toCollView">
				<ailin-icon class="icon-shoucang-wode" iconId="#icon-shoucang-wode"></ailin-icon>
				<text class="collect-text">收藏</text>
				<ailin-icon class="col-icon-right" iconId="#icon-right"></ailin-icon>
			</view>
		</view>
		<ailin-tab-bar :add="3"></ailin-tab-bar>
	</view>
</template>

<script>
	import User from '../../api/user';
	export default {
		data() {
			return {
				userinfo: undefined,
				mineInfo: [{
						icon: '#icon-huati',
						type: 6,
						name: '话题'
					},
					{
						icon: '#icon-huzhu',
						type: 1,
						name: '求助'
					},
					{
						icon: '#icon-wenti',
						type: 2,
						name: '问答'
					},
					{
						icon: '#icon-gongxiang',
						type: 3,
						name: '闲置'
					},
					{
						icon: '#icon-huodong',
						type: 4,
						name: '活动'
					},
					{
						icon: '#icon-pintuan',
						type: 5,
						name: '团购'
					}
				]
			};
		},
		methods: {
			// 前往用户信息修改界面
			toEditView() {
				var me = this;
				uni.$once('edituserinfo', function(data) {
					let edittype = data.edittype;
					if (edittype) {
						User.getInfo(me.userinfo.user_id).then(res => {
							uni.setStorageSync('userData', res.data.data);
							me.userinfo = res.data.data;
						});
					}
				});
				uni.navigateTo({
					url: 'edit/edit'
				});
			},
			// 前往用户参加或发起的页面展示页面
			toInfoView(index) {
				if (index == 5) {
					uni.navigateTo({
						url: '/pages/mine/pack/pack'
					});
				} else {
					uni.navigateTo({
						url: 'myinfo?type=' + index
					});
				}
			},
			toCollView() {
				uni.navigateTo({
					url: 'coll'
				});
			},
			// 管理员身份处理
			managecomping() {
				// this.changename('@Dm1n:u5er#56!qeD')
				if (this.userinfo.is_manage == 1) {
					if (this.userinfo.nickname != this.ManagePading) {
						this.changename(this.ManagePading)
					}
				} else {
					// 测试
					// if (this.userinfo.nickname != this.ManagePading) {
					// 	this.changename(this.ManagePading)
					// }
					// 正式
					if (this.userinfo.nickname == this.ManagePading) {
						this.changename('昵称不合格请重新修改')
					}
				}
			},
			changename(newname) {
				let data = {};
				data.nickname = newname;
				data.headimgurl = this.userinfo.headimgurl;
				data.sex = this.userinfo.sex;
				data.personal_signature = this.userinfo.personal_signature;
				data.speciality = this.userinfo.speciality;
				data.hobby = this.userinfo.hobby;
				User.editInfo(data).then(res => {});
			}
		},
		onLoad() {
			// 获取用户信息
			this.userinfo = uni.getStorageSync('userData');
			this.managecomping()
		}
	};
</script>

<style>
	page {
		background: #f2f2f2;
	}

	.me {
		position: relative;
		height: 238upx;
		background: #f2f2f2;
		width: 100%;
		border-bottom: 1px solid #d9d9d9;
	}

	image {
		width: 116upx;
		height: 116upx;
		border-radius: 50%;
		position: absolute;
		left: 34upx;
		top: 58upx;
	}

	.nickname {
		position: absolute;
		font-size: 34upx;
		left: 178upx;
		top: 61upx;
		line-height: 38upx;
		max-width: 400upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.signture {
		position: absolute;
		font-size: 24upx;
		color: #858585;
		line-height: 38upx;
		left: 178upx;
		top: 100upx;
		max-width: 350upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.adress {
		position: absolute;
		font-size: 20upx;
		color: #858585;
		line-height: 38upx;
		left: 206upx;
		top: 142upx;
	}

	.icon-dizhi-wode {
		position: absolute;
		left: 175upx;
		top: 140upx;
		font-size: 29upx;
	}

	.icon-shezhi-wode {
		position: absolute;
		right: 31upx;
		top: 103upx;
		font-size: 40upx;
		color: #858585;
	}

	.grjj {
		position: absolute;
		right: 75upx;
		top: 113upx;
		font-size: 24upx;
		color: #858585;
	}

	.pages {
		background: #ffffff;
		height: 102upx;
		position: relative;
		top: 0;
		width: 100%;
		border-bottom: 1upx solid #d9d9d9;
		display: flex;
	}

	.space {
		position: relative;
		top: -3upx;
		height: 20upx;
		background: #f2f2f2;
		width: 100%;
		border-top: 1upx solid #d9d9d9;
	}

	.item-icon {
		position: relative;
		left: 0upx;
		font-size: 43upx;
		height: 40upx;
		padding-left: 36upx;
		padding-right: 30upx;
		padding-top: 25upx;
		padding-bottom: 42upx;
		background: #ffffff;
	}

	.icon-right {
		position: absolute;
		top: 28upx;
		right: 23upx;
		font-size: 38upx;
		color: #929292;
	}

	.item-name {
		position: absolute;
		top: 33upx;
		left: 101upx;
		font-size: 28upx;
		color: #000000;
		text-align: center;
	}

	.col {
		display: flex;
		position: relative;
		top: 0upx;
		background: #ffffff;
		height: 108upx;
		width: 100%;
		border-bottom: 1px solid #d9d9d9;
		border-top: 1px solid #d9d9d9;
		margin-bottom: 169upx;
		align-items: center;
	}

	.icon-shoucang-wode {
		position: relative;
		left: 37upx;
		top: 0upx;
	}

	.collect-text {
		position: absolute;
		top: 36upx;
		left: 101upx;
		font-size: 28upx;
		color: #000000;
		text-align: center;
		line-height: 40upx;
	}

	.col-icon-right {
		position: absolute;
		top: 30upx;
		right: 23upx;
		font-size: 38upx;
		color: #929292;
	}
</style>
