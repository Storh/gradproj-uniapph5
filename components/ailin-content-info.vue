<template>
	<view v-if="contentinfo">
		<!-- 创建者信息 -->
		<view class="creator-info">
			<view @click="toUser(contentinfo)">
				<block v-if="contentinfo.nickname == ManagePading">
					<image :src="ManageHimg"></image>
					<text :style="ManageStyle">{{ ManageName }}</text>
				</block>
				<block v-else>
					<image :src="contentinfo.headimgurl"></image>
					<text>{{ contentinfo.nickname }}</text>
				</block>
				<view class="qianming" v-if="contentinfo.personal_signature">{{ contentinfo.personal_signature }}</view>
				<view class="qianming" v-else>该用户没有个性签名</view>
			</view>
			<!-- <view class="jubao" @click="toJubao"><ailin-icon iconId="#icon-jinggao"></ailin-icon></view> -->
		</view>
		<!-- 滚动图片 -->
		<swiper :indicator-dots="true" :autoplay="true" style="height: 750upx;">
			<swiper-item v-for="imglist in contentinfo.images" :key="imglist.id">
				<!-- <image mode="aspectFit" class="simg" :src="imglist.src"></image> -->
				<image mode="aspectFill" class="simg" :src="imglist.src" @tap="previewImage(imglist.src)"></image>
			</swiper-item>
		</swiper>
		<!-- 标题 -->
		<view class="ptitle">
			<text selectable="true">{{ contentinfo.title }}</text>
		</view>
		<!-- 参与人 -->
		<view v-if="showMember" class="member">
			<!-- <view @click="toUser(contentinfo)">
				<text class="originator">发起者:</text>
				<image class="origin_img" :src="contentinfo.headimgurl"></image>
			</view> -->
			<text class="participant" @click="toPeopleList">参与者:</text>
			<block v-for="(peoitem, index) in peoplelist" :key="index">
				<block v-if="peoitem.nickname == ManagePading">
					<view @click="toPeopleList">
						<image class="part_img" :src="ManageHimg"></image>
					</view>
				</block>
				<block v-else>
					<view @click="toPeopleList">
						<image class="part_img" :src="peoitem.headimgurl"></image>
					</view>
				</block>
			</block>
			<!-- <view class="icon_right" @click="toPeopleList"><ailin-icon iconId="#icon-right"></ailin-icon></view> -->
		</view>
		<!-- 截止日期 -->
		<view v-if="contentinfo.type_id == 4" class="closing_date">
			<text>截止：{{ contentinfo.closing_date.slice(0, 16) }}</text>
			<text>总量：{{ contentinfo.num_upper_limit }}</text>
			<text>剩余：{{ rest }}</text>
		</view>
		<view v-else-if="contentinfo.type_id == 5" class="closing_date">
			<text>团购截止日期：{{ contentinfo.closing_date.slice(0, 16) }}</text>
			<!-- <text>总量：{{ contentinfo.num_upper_limit }}</text> -->
			<!-- <text>剩余：{{ rest }}</text> -->
		</view>
		<!-- 正文 -->
		<view class="article">
			<text class="article_text" selectable="true">{{ contentinfo.content }}</text>
			<a v-if="contentinfo.link_external_name" :href="getLink(contentinfo.link_external_url)">{{ contentinfo.link_external_name }}</a>
			<a v-else :href="getLink(contentinfo.link_external_url)">
				<p>{{ contentinfo.link_external_url }}</p>
			</a>
			<text class="art_time">{{ contentinfo.time }}</text>
			<text class="visit_num">浏览量：{{ contentinfo.visit_num }}</text>
		</view>
	</view>
</template>

<script>
	// import jswx from '../static/index.js';
	import Activity from '../api/info/activity';
	import Pack from '../api/info/pack';
	export default {
		name: 'ailin-content-info',
		props: {
			// 当前页面
			contentinfo: {
				type: Object,
				default: {}
			}
		},
		// rest: 0,
		data() {
			return {
				link_external: '',
				rest: 0,
				peoplelist: undefined,
				// 是否展示参与人一栏
				showMember: false,
				contentType: [false, false, false, true, true, false]
			};
		},
		methods: {
			// 举报用户信息
			toJubao() {
				uni.navigateTo({
					url: '/pages/jubao/jubao?id=' + this.contentinfo.content_id + '&type=content'
				});
			},
			previewImage(url) {
				const previewList = [url];
				uni.previewImage({
					current: url,
					urls: previewList
				});
			},
			// 前往参加活动的人的页面
			toPeopleList() {
				if (this.contentinfo.type_id == 5) {
					const mineinfo = uni.getStorageSync('userData');
					if (this.contentinfo.user_id == mineinfo.user_id) {
						// 自己查看
						uni.navigateTo({
							url: '/pages/content/pack/order?id=' + this.contentinfo.content_id
						});
					} else {
						uni.navigateTo({
							url: '../../pages/content/people?id=' + this.contentinfo.content_id + '&type=' + this.contentinfo.type_id
						});
					}
				} else {
					uni.navigateTo({
						url: '../../pages/content/people?id=' + this.contentinfo.content_id + '&type=' + this.contentinfo.type_id
					});
				}
			},
			//前往头像用户
			toUser(contentinfo) {
				const mineinfo = uni.getStorageSync('userData');
				if (contentinfo.user_id == mineinfo.user_id) {
					uni.navigateTo({
						url: '/pages/mine/minebycon'
					});
				} else {
					uni.navigateTo({
						url: '../../pages/user/user?id=' + contentinfo.user_id
					});
				}
			},
			//外部链接
			getLink(link) {
				if (link.indexOf('https://') != -1) {
					this.link_external = link + '?go=true';
				} else {
					this.link_external = 'https://' + link + '?go=true';
				}
				return this.link_external;
			}
		},
		created() {
			if (this.contentinfo.type_id == 4) {
				Activity.getList(this.contentinfo.content_id).then(res => {
					this.rest = this.contentinfo.num_upper_limit - res.data.data.list.length;
				});
			}
			console.log(this.contentinfo);
			this.showMember = this.contentType[this.contentinfo.type_id - 1];
			// 获取参与人员列表
			if (this.showMember) {
				if (this.contentinfo.type_id == 4) {
					// 默认获取三条
					Activity.getList(this.contentinfo.content_id, 13).then(res => {
						this.peoplelist = res.data.data.list;
					});
				} else if (this.contentinfo.type_id == 5) {
					Pack.getList(this.contentinfo.content_id, 13).then(res => {
						this.peoplelist = res.data.data.list;
					});
				}
			}
		}
	};
</script>

<style>
	page {
		background: #f2f2f2;
	}

	.jubao {
		position: absolute;
		top: 30upx;
		right: 50upx;
		font-size: 50upx;
		color: #999999;
	}

	.fenxiang {
		width: 69upx;
		height: 69upx;
	}

	/* 创建者 */
	.creator-info {
		height: 127upx;
		background: #f2f2f2;
	}

	/* 创建者头像 */
	.creator-info image {
		width: 69upx;
		height: 69upx;
		border-radius: 50%;
		left: 31upx;
		top: 32upx;
		position: relative;
	}

	/* 头像 */
	image {
		width: 64upx;
		height: 64upx;
		border-radius: 50%;
		left: 31upx;
		position: absolute;
	}

	/* 创建者用户名 */
	.creator-info text {
		font-size: 28upx;
		left: 115upx;
		top: 30upx;
		position: absolute;
		max-width: 300upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.qianming {
		color: #858585;
		font-size: 24upx;
		left: 115upx;
		position: absolute;
		top: 70upx;
		max-width: 400upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 滚动图片 */
	.simg {
		border-radius: 0;
		height: 750upx;
		width: 750upx;
		left: 0;
		position: relative;
		background: #ffffff;
	}

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
		word-wrap: break-word;
	}

	/* 成员 */
	.member {
		position: relative;
		display: flex;
		height: 62upx;
		font-size: 0;
		background: #ffffff;
	}

	.no-fall {
		position: relative;
		bottom: 0upx;
		height: 108upx;
	}

	/* 发起人 */
	.originator {
		padding-top: 10upx;
		font-size: 24upx;
		color: #7e7e7e;
		text-align: center;
		position: absolute;
		left: 38upx;
		top: 0;
	}

	/* 发起人头像 */
	.origin_img {
		position: absolute;
		left: 130upx;
	}

	/* 参与者 */
	.participant {
		padding-top: 10upx;
		font-size: 24upx;
		color: #7e7e7e;
		text-align: center;
		position: absolute;
		left: 38upx;
		top: 0;
	}

	/* 参与者头像 */
	.part_img {
		position: relative;
		left: 130upx;
		margin-right: -15upx;
		border: 1upx solid #ffffff;
	}

	/* 箭头 */
	.icon_right {
		position: absolute;
		font-size: 40upx;
		top: 0upx;
		right: 35upx;
		opacity: 0.81;
	}

	/* 成员头像 */
	.member image {
		width: 52upx;
		height: 52upx;
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
		word-wrap: break-word;
		align-items: center;
		display: flex;
		flex-direction: column;
	}

	.article_text {
		text-align: left;
		width: 100%;
	}

	.article:after {
		content: '';
		position: absolute;
		left: 38upx;
		bottom: 0;
		height: 1px;
		width: 676upx;
		background-color: #d8d8d8;
	}

	.art_time {
		position: absolute;
		bottom: 18upx;
		left: 37upx;
		height: 24upx;
		font-size: 24upx;
		color: #878787;
	}

	/* 浏览数 */
	.visit_num {
		position: absolute;
		bottom: 18upx;
		right: 40upx;
		height: 24upx;
		font-size: 24upx;
		color: #878787;
	}

	/* 评论用户名 */
	.nickname {
		font-size: 26upx;
		height: 37upx;
		left: 110upx;
		position: absolute;
	}

	/* 截止日期 */
	.closing_date {
		font-size: 28upx;
		background-color: #ffffff;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 30upx;
		padding-right: 30upx;
	}

	a {
		font-size: 28upx;
		position: relative;
		bottom: -10upx;
		left: 0upx;
		text-align: left;
		width: 100%;
	}
</style>
