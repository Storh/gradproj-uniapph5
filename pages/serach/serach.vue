<template>
	<view v-if="stateList">
		<view class="search_bar">
			<view class="city">
				<text class="cityText" @click="wanaChange">{{ stateList[listType].name }}</text>
				<view class="street" v-if="showInfoTypeList" @click="chooseChange">{{ stateList[(listType + 1) % 2].name }}</view>
			</view>
			<view class="arrowdown" @click="wanaChange"><ailin-icon iconId="#icon-down"></ailin-icon></view>
			<view class="search" @tap="tapSrerch">
				<ailin-icon class="search_icon" iconId="#icon-sousuo"></ailin-icon>
				<input class="search_input" @blur="removeMask" v-model="search_key" placeholder="输入关键字" confirm-type="search" type="text" @confirm="confirm" />
			</view>
		</view>
		<water-fall class="waterFall" :list="list" :listUpdata="hasNewList" @click="choose"></water-fall>
		<ailin-tab-bar v-if="!focuseInput" style="z-index: 99;" :add="event_type-1"></ailin-tab-bar>
		<view v-if="mask" class="cpt-mask" @touchend="removeMask"></view>
	</view>
</template>

<script>
import Content from '../../api/content';
export default {
	data() {
		return {
			// 是否显示遮盖
			mask: true,
			// 是否聚焦输入框
			focuseInput: true,
			// 是否展示选项
			showInfoTypeList: false,
			// 展示的地区
			stateList: [],
			// 获取列表是要请求的数据
			// 页面类型1首页2乐享
			event_type: undefined,
			// 当前获取的列表的类型,0为社区,1为街道
			listType: undefined,
			page: 1,
			page_num: 10,
			search_key: undefined,
			list: [], // 列表
			infourllist: ['help/help', 'question/question', 'share/share', 'active/active', 'ping/ping', 'topic/topic'],
			hasNewList: true
		};
	},
	onLoad(params) {
		this.event_type = Number(params.eventType);
		this.listType = Number(params.listType);
		// 获取用户信息
		// 获取用户信息
		const userInfo = uni.getStorageSync('userData');
		if (userInfo) {
			this.stateList.push(userInfo.districts.estate);
			this.stateList.push(userInfo.districts.street);
		}
		// 模拟点击
		setTimeout(() => {
			this.inputtext();
		}, 120);
	},
	// 页面滚动到底部的事件
	onReachBottom() {
		if (this.hasNewList) {
			this.page++;
			this.getList();
		}
	},
	methods: {
		inputtext() {
			const input = document.querySelector('input');
			input.focus();
		},
		// 打算更换左上角显示的内容
		wanaChange() {
			this.showInfoTypeList = !this.showInfoTypeList;
			if (this.showInfoTypeList) {
				this.mask = true;
			} else {
				this.mask = false;
			}
		},
		// 更换左上角显示的内容
		chooseChange() {
			this.showInfoTypeList = !this.showInfoTypeList;
			this.listType = (this.listType + 1) % 2;
			this.confirm();
		},
		removeMask() {
			// 是否聚焦输入框
			this.focuseInput = false;
			// 是否展示选项
			this.showInfoTypeList = false;
			this.mask = false;
			const input = document.querySelector('input');
			input.blur();
		},
		// 点击了搜索处
		tapSrerch() {
			this.focuseInput = true;
			this.mask = true;
			this.inputtext();
		},
		confirm() {
			this.list = [];
			if (this.search_key) {
				this.getList();
			} else {
				uni.showToast({
					title: '未输入搜索内容',
					icon: 'none'
				});
			}
			this.removeMask();
		},
		// 选中
		choose(item) {
			// item 返回选中对象信息
			uni.navigateTo({
				url: '../content/content?contentId=' + item.content_id+ '&typeId=' + item.type_id
			});
		},
		// 加载数据
		getList() {
			Content.getList(this.event_type, this.listType + 1, this.page, this.page_num, this.search_key).then(res => {
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
	background-color: #f2f2f2;
}

.waterFall {
	/* position: absolute; */
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
	flex-basis: auto;
	font-size: 24upx;
}

/* 输入 */
.search_input {
	width: 100%;
	text-align: left;
	font-size: 24upx;
	padding-left: 20upx;
}
</style>
