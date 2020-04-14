<template>
	<view>
		<!-- 用户信息展示 -->
		<view class="me" v-if="userinfo">
			<block v-if="userinfo.nickname.indexOf(ManagePading)==0">
				<image :src="ManageHimg"></image>
				<text class="nickname" :style="ManageStyle">{{ ManageName }}</text>
			</block>
			<block v-else>
				<image :src="userinfo.headimgurl"></image>
				<text class="nickname">{{ userinfo.nickname }}</text>
			</block>
			<view class="signture" v-if="userinfo.personal_signature">{{ userinfo.personal_signature }}</view>
			<view class="signture" v-else>该用户没有个性签名</view>
			<ailin-icon class="icon-dizhi-wode" iconId="#icon-dizhi-wode"></ailin-icon>
			<text class="adress">{{ userinfo.districts.estate.name }}</text>
			<view @click="toUserInfoView">
				<text class="grjj">个人介绍</text>
				<ailin-icon class="icon-shezhi-wode" iconId="#icon-right"></ailin-icon>
			</view>
		</view>
		<!-- 选择列表类别 -->
		<view class="choice">
			<block v-for="(infoitem, index) in listInfo" :key="infoitem.type">
				<!-- 被选中 -->
				<view class="chosen" v-if="infoitem.clicked">
					<text>{{ infoitem.name }}</text>
				</view>
				<!-- 没有被选中的 -->
				<view class="unselected" v-else @click="changeInfoList(index)">
					<text>{{ infoitem.name }}</text>
				</view>
			</block>
		</view>
		<!-- 列表展示 -->
		<view class="block" v-for="(item, index) in infoList" :key="index">
			<view :list="list" @click="choose(item)">
				<view class="type">
					<ailin-icon class="incontype" :iconId="mineInfo[item.type_id-1].icon"></ailin-icon>
					<text>{{ mineInfo[item.type_id-1].name }}</text>
				</view>
				<view class="content">
					<text class="title">{{ item.title }}</text>
					<text class="time">{{ item.time }}</text>
				</view>
			</view>
		</view>
		<view v-if="NonDateList" class="bottomInfo">
			<br />
			<text style="color: #929292;">—— 暂未发起 ——</text>
		</view>
		<view v-else class="bottomInfo"></view>
	</view>
</template>

<script>
	import User from '../../api/user';
	export default {
		data() {
			return {
				NonDateList: false,
				userinfo: undefined,
				listClicked: 0,
				list: [],
				mineInfo: [{
						icon: '#icon-huzhu',
						name: '求助'
					},
					{
						icon: '#icon-wenti',
						name: '问答'
					},
					{
						icon: '#icon-gongxiang',
						name: '闲置'
					},
					{
						icon: '#icon-huodong',
						name: '活动'
					},
					{
						icon: '#icon-pintuan',
						name: '团购'
					},
					{
						icon: '#icon-huati',
						name: '话题'
					}
				],
				listInfo: [{
						clicked: true,
						type: 0,
						name: '全部'
					},
					{
						clicked: false,
						type: 6,
						name: '话题'
					},
					{
						clicked: false,
						type: 1,
						name: '求助'
					},
					{
						clicked: false,
						type: 2,
						name: '问答'
					},
					{
						clicked: false,
						type: 3,
						name: '闲置'
					},
					{
						clicked: false,
						type: 4,
						name: '活动'
					},
					{
						clicked: false,
						type: 5,
						name: '团购'
					}
				],
				infoList: []
			};
		},
		methods: {
			// 选中
			choose(item) {
				// item 返回选中对象信息
				uni.navigateTo({
					url: '../content/content?contentId=' + item.content_id+ '&typeId=' + item.type_id
				});
			},
			// 获取新的列表
			changeInfoList(index) {
				const olditem = this.listClicked
				this.infoList = [];
				this.listInfo[olditem].clicked = false;
				this.listInfo[index].clicked = true;
				this.listClicked = index;
				if (index) {
					this.getInfoList(this.listInfo[index].type);
				} else {
					this.getAllInfoList(this.userinfo.user_id);
				}

			},
			// 前往用户详细信息界面
			toUserInfoView() {
				uni.navigateTo({
					url: 'userinfo?id=' + this.userinfo.user_id
				});
			},
			// 获取用户发起的特定类型的动态列表
			getInfoList(type) {
				User.getSelfContentList(this.userinfo.user_id, type).then(res => {
					if (res.data.data.list.length) {
						//this.infoList = res.data.data.list;
						this.timeComp(res.data.data.list);
						this.NonDateList = false;
					} else {
						this.infoList = [];
						this.NonDateList = true;
					}
				});
			},
			getAllInfoList(uid) {
				// 获取用户发起的全部类型的动态列表
				User.getSelfContentList(uid).then(res => {
					if (res.data.data.list.length) {
						//this.infoList = res.data.data.list;
						this.timeComp(res.data.data.list);
						this.NonDateList = false;
					} else {
						this.infoList = [];
						this.NonDateList = true;
					}
				});
			},
			timeComp(newList) {
				let num = newList.length;
				for (let i = 0; i < num; i++) {
					let item = newList[i];
					item.time = item.add_time.slice(0, 10);
					this.infoList.push(item);
				}
			}
		},
		onLoad(params) {
			// 获取用户信息
			User.getInfo(params.id).then(res => {
				this.userinfo = res.data.data;
			});
			this.getAllInfoList(params.id);
		}
	};
</script>

<style>
	page {
		background: #f2f2f2;
	}

	.bottomInfo {
		width: 100%;
		height: 150upx;
		font-size: 24upx;
		text-align: center;
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
		top: 102upx;
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
		right: 65upx;
		top: 113upx;
		font-size: 24upx;
		color: #858585;
	}

	/* 选择栏 */
	.choice {
		display: flex;
		position: relative;
		background: #ffffff;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 30upx;
		color: #000000;
		text-align: center;
		border-bottom: 1upx solid #d0d0d0;
		padding-left: 37upx;
		padding-right: 37upx;
	}

	/* 被选择 */
	.chosen {
		position: relative;
		font-weight: bold;
		text-align: center;
		width: 80upx;
		line-height: 95upx;
	}

	.chosen:after {
		content: '';
		position: absolute;
		left: 9upx;
		bottom: 0;
		height: 5upx;
		width: 70upx;
		background-color: #000000;
	}

	/* 未背选择 */
	.unselected {
		position: relative;
		width: 80upx;
		line-height: 95upx;
		color: #797979;
	}

	.block {
		position: relative;
		height: 178upx;
		background: #ffffff;
		border: 1upx solid #d0d0d0;
		margin-top: 14upx;
	}

	.incontype {
		font-size: 60upx;
		position: absolute;
		top: 23upx;
		left: 36upx;
	}

	.type text {
		font-size: 24upx;
		color: #000000;
		text-align: center;
		position: absolute;
		top: 110upx;
		left: 42upx;
		opacity: 0.6;
	}

	.content {
		position: absolute;
		top: 0;
	}

	.title {
		font-size: 30upx;
		color: #000000;
		position: absolute;
		width: 586upx;
		top: 29upx;
		left: 131upx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.time {
		font-size: 20upx;
		color: #858585;
		line-height: 38upx;
		position: relative;
		top: 110upx;
		left: 131upx;
	}
</style>
