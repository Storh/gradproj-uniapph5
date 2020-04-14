<template>
	<view>
		<view class="block" v-for="(item, index) in infoList" :key="index">
			<view :list="list" @click="choose(item)">
				<view class="type">
					<ailin-icon class="incontype" :iconId="mineInfo[item.type_id - 1].icon"></ailin-icon>
					<text>{{ mineInfo[item.type_id - 1].name }}</text>
				</view>
				<view class="content">
					<text class="title">{{ item.title }}</text>
					<text class="time">{{ item.time }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import User from '../../api/user';
export default {
	data() {
		return {
			infoList: [],
			list: [],
			mineInfo: [
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
				},
				{
					icon: '#icon-huati',
					type: 6,
					name: '话题'
				}
			]
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
		getInfoList() {
			var me = this;
			User.getCollectList().then(res => {
				this.timeComp(res.data.data.list);
			});
		},
		// 时间格式处理
		timeComp(newList) {
			let num = newList.length;
			for (let i = 0; i < num; i++) {
				let item = newList[i];
				item.time = item.add_time.slice(0, 16);
				this.infoList.push(item);
			}
		}
	},
	onLoad(parme) {
		uni.setNavigationBarTitle({
			title: '收藏'
		});
		this.getInfoList();
	}
};
</script>

<style>
page {
	background: #f2f2f2;
}
.type {
	position: absolute;
	top: 0;
	width: 131upx;
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
	position: absolute;
	top: 120upx;
	left: 131upx;
	white-space: nowrap;
}
.block {
	font-size: 0;
	position: relative;
	left: 0;
	width: 100%;
	height: 178upx;
	background: #ffffff;
	margin-bottom: 14upx;
	background: #ffffff;
	box-sizing: border-box;
	border: 1px solid #d0d0d0;
	border-left: none;
	border-right: none;
}
</style>
