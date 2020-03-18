<template>
	<view v-if="detail">
		<!-- 标题 -->
		<view class="ptitle">
			<text>{{ detail.title }}</text>
		</view>
		<view class="article">
			<!-- <text>{{ detail.content }}</text> -->
			<rich-text :nodes="detail.content"></rich-text>
			<text class="art_time">{{ detail.time }}</text>
		</view>
		<ailin-tab-bar :add="2"></ailin-tab-bar>
	</view>
</template>

<script>
import Notice from '../../api/notice';
export default {
	data() {
		return {
			detail: undefined
			// 控制页面是显示通讯录还是显示通知
		};
	},
	methods: {
		// 获取通知信息
		getOfficeNotice(id) {
			Notice.getOfficialDetail(id).then(res => {
				this.detail = res.data.data;
				this.detail.time = this.detail.add_time.slice(5, 10);
			});
		}
	},
	onLoad(par) {
		this.getOfficeNotice(par.id);
	}
};
</script>

<style>
/* 标题 */
.ptitle {
	font-size: 36upx;
	color: #000000;
	padding-top: 42upx;
	width: 680upx;
	padding-left: 35upx;
	padding-right: 35upx;
	padding-bottom: 24upx;
	text-align: justify;
	position: relative;
	background: #ffffff;
}

/* 正文 */
.article {
	font-size: 28upx;
	text-align: justify;
	width: 680upx;
	position: relative;
	padding-top: 30upx;
	padding-bottom: 85upx;
	padding-left: 35upx;
	padding-right: 35upx;
	background: #ffffff;
}

.art_time {
	position: absolute;
	bottom: 35upx;
	left: 37upx;
	height: 24upx;
	font-size: 24upx;
	color: #878787;
}
</style>
