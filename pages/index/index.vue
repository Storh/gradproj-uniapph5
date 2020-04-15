<template>
	<view v-if="list">
		<view v-if="stateList.length > 1" class="search_bar">
			<view class="city">
				<text class="cityText" @click="wanaChange">{{ stateList[listType].name }}</text>
				<view class="street" v-if="showInfoTypeList" @click="chooseChange">{{ stateList[(listType + 1) % 2].name }}</view>
			</view>
			<view class="arrowdown" @click="showUnShow">
				<ailin-icon iconId="#icon-down"></ailin-icon>
			</view>
			<view class="search" @tap="tapSrerch">
				<ailin-icon class="search_icon" iconId="#icon-sousuo"></ailin-icon>
				<text class="search_input">输入搜索关键词</text>
			</view>
		</view>
		<water-fall class="waterFall" :list="list" :listUpdata="hasNewList" @click="choose"></water-fall>
		<ailin-tab-bar :add="event_type - 1"></ailin-tab-bar>
		<view v-if="showInfoTypeList" class="cpt-mask" @touchend="removeMask"></view>
	</view>
</template>

<script>
	import Content from '../../api/content';
	import jweixin from '../../components/wxjsjdk.js';
	export default {
		data() {
			return {
				// 是否展示选项
				showInfoTypeList: false,
				// 展示的地区
				stateList: [],
				// 获取列表是要请求的数据
				// 页面类型1首页2乐享
				event_type: 1,
				// 当前获取的列表的类型,0为社区,1为街道
				listType: 0,
				page: 1,
				page_num: 10,
				list: [], // 列表
				infourllist: ['help/help', 'question/question', 'share/share', 'active/active', 'ping/ping', 'topic/topic'],
				hasNewList: true,
				userInfoForShar: undefined
			};
		},
		onLoad(par) {
			// 获取用户信息
			var me = this;
			const userInfo = uni.getStorageSync('userData');
			// 加载内容
			if (userInfo) {
				// 防止用户是没有登录的
				this.stateList.push(userInfo.districts.estate);
				this.stateList.push(userInfo.districts.street);
				this.getList();
			}
			// 预加载
			setTimeout(function() {
				me.preLoadList()
			}, 1500);
		},
		onShow() {
			const userInfo = uni.getStorageSync('userData');
			if (userInfo) {
				this.userInfoForShar = userInfo;
				if (this.userInfoForShar.nickname.indexOf(this.ManagePading) == 0) {
					this.userInfoForShar.nickname = this.ManageName;
				}
			}
			let TypeIndexCart = getApp().globalData.TypeIndexCart;
			if (TypeIndexCart != this.listType) {
				this.listType = TypeIndexCart;
				// 初始化数据
				this.page = 1;
				this.page_num = 10;
				this.hasNewList = true;
				this.list = [];
				this.getList();
			}
		},
		// 页面滚动到底部的事件
		onReachBottom() {
			if (this.hasNewList) {
				this.page++;
				this.getList();
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			var me = this;
			setTimeout(function() {
				uni.stopPullDownRefresh();
				// 初始化数据
				me.page = 1;
				me.page_num = 10;
				me.hasNewList = true;
				me.list = [];
				me.getList();
			}, 1000);
		},
		methods: {
			// 移除遮盖
			removeMask() {
				this.showInfoTypeList = !this.showInfoTypeList;
			},
			// 点击了搜索处
			tapSrerch() {
				uni.navigateTo({
					url: '../serach/serach?eventType=' + this.event_type + '&listType=' + this.listType
				});
			},
			// 选中了未显示的
			chooseUnShow() {
				this.showInfoTypeList = !this.showInfoTypeList;
				this.listType = (this.listType + 1) % 2;
				this.getList();
			},
			// 更换左上角显示的内容
			chooseChange() {
				this.showInfoTypeList = !this.showInfoTypeList;
				this.listType = (this.listType + 1) % 2;
				getApp().globalData.TypeIndexCart = (getApp().globalData.TypeIndexCart + 1) % 2;
				// 初始化数据
				this.page = 1;
				this.page_num = 10;
				this.hasNewList = true;
				this.list = [];
				this.getList();
			},
			// 打算更换左上角显示的内容
			wanaChange() {
				this.showInfoTypeList = !this.showInfoTypeList;
			},
			// 展示未显示的选项
			showUnShow() {
				this.showInfoTypeList = !this.showInfoTypeList;
			},
			// 选中
			choose(item) {
				// item 返回选中对象信息
				uni.navigateTo({
					url: '../content/content?contentId=' + item.content_id + '&typeId=' + item.type_id
				});
			},
			preLoadList() {
				// 预加载乐享
				Content.getList(2, this.listType + 1, 1, 5).then(res => {
					for (let item of res.data.data.list) {
						// console.log(item.image.src)
						let image = new Image()
						image.src = item.image.src
					}
				});
			},
			// 加载数据
			getList() {
				Content.getList(this.event_type, this.listType + 1, this.page, this.page_num).then(res => {
					if (res.data.data.list.length) {
						this.list = this.list.concat(res.data.data.list);
					} else {
						// 无新数据
						this.hasNewList = false;
					}
				});
			}
		}
	};
</script>

<style>
	page {
		background-color: #f2f2f2;
	}

	.cpt-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000000;
		opacity: 0;
	}

	.waterFall {
		top: 108upx;
	}

	.search_bar {
		z-index: 1;
		position: fixed;
		top: 0;
		font-size: 0;
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 87upx;
		background: #ededed;
		border-bottom: 1upx solid #d9d9d9;
	}

	/* 社区 */
	.city {
		display: flex;
		flex-basis: auto;
		white-space: nowrap;
		font-size: 0;
		align-items: center;
		padding-left: 30upx;
	}

	/* 社区名称 */
	.cityText {
		position: relative;
		font-size: 26upx;
		top: 0upx;
	}

	/* 箭头 */
	.arrowdown {
		display: flex;
		flex-basis: auto;
		align-items: center;
		position: relative;
		margin-left: 7upx;
		margin-right: 21upx;
		font-weight: bold;
		text-align: center;
		font-size: 40upx;
	}

	/* 街道 */
	.street {
		position: absolute;
		text-align: left;
		left: 20upx;
		font-size: 26upx;
		bottom: -30upx;
		background-color: #434343;
		line-height: 43upx;
		color: #ffffff;
		text-align: center;
		border-radius: 10upx;
		padding-left: 10upx;
		padding-right: 10upx;
	}

	.street:after {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border: 10upx solid;
		border-bottom-color: #434343;
		left: 8%;
		bottom: 100%;
		color: #f2f2f2;
	}

	/* 搜索 */
	.search {
		border-radius: 28upx;
		background: #ffffff;
		height: 57upx;
		margin-right: 22upx;
		margin-top: 15upx;
		position: relative;
		width: 100%;
		padding-left: 30upx;
		padding-right: 20upx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	/* 搜索符号 */
	.search_icon {
		font-size: 24upx;
	}

	/* 输入 */
	.search_input {
		color: #888888;
		text-align: left;
		font-size: 24upx;
		padding-left: 20upx;
	}
</style>
