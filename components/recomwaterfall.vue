<template>
	<view class="water">
		<view class="letffall" id="letf">
			<block v-for="(litem, index) in liftlist" :key="litem.content_id">
				<!-- 图片 -->
				<view :data-index="index" @click="lchoose"><image class="img" mode="aspectFill" :src="litem.image.src" :style="litem.image.heiclass"></image></view>
				<view class="content">
					<!-- 标题和类型 -->
					<view class="type-detail">{{ typedetail[litem.type_id - 1] }}</view>
					<text class="title" :data-index="index" @click="lchoose">{{ litem.title }}</text>
					<!-- 用户信息 -->
					<view class="user">
						<image class="user_image" :src="litem.headimgurl" @click="toUser(litem)"></image>
						<view class="nickname" @click="toUser(litem)">{{ litem.nickname }}</view>
						<view class="item-like" @click="likeThislItem(index)">
							<ailin-icon v-if="litem.like_state === '1'" iconId="#icon-dianzan-on"></ailin-icon>
							<ailin-icon v-else iconId="#icon-dianzan-off"></ailin-icon>
						</view>
						<text class="like_num">{{ litem.like_num }}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="rightfall" id="right">
			<block v-for="(ritem, index) in rightlist" :key="ritem.content_id">
				<view :data-index="index" @click="rchoose"><image class="img" mode="aspectFill" :src="ritem.image.src" :style="ritem.image.heiclass"></image></view>
				<view class="content">
					<!-- 标题和类型 -->
					<view class="type-detail">{{ typedetail[ritem.type_id - 1] }}</view>
					<text class="title" :data-index="index" @click="rchoose">{{ ritem.title }}</text>
					<!-- 用户信息 -->
					<view class="user">
						<image class="user_image" :src="ritem.headimgurl" @click="toUser(ritem)"></image>
						<view class="nickname" @click="toUser(ritem)">{{ ritem.nickname }}</view>
						<view class="item-like" @click="likeThisrItem(index)">
							<ailin-icon class="like_icon" v-if="ritem.like_state === '1'" iconId="#icon-dianzan-on"></ailin-icon>
							<ailin-icon class="like_icon" v-else iconId="#icon-dianzan-off"></ailin-icon>
						</view>
						<text class="like_num">{{ ritem.like_num }}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="bottomInfo"><text>—— 已经到底了 ——</text></view>
	</view>
</template>

<script>
import Content from '../api/content';
export default {
	name: 'recom-water-fall',
	props: {
		// 数据列表
		id: {}
	},
	data() {
		return {
			lefthetght: 0,
			rightheight: 0,
			liftlist: [],
			rightlist: [],
			showlist: [],
			typedetail: ['求助', '问答', '闲置', '活动', '团购', '话题']
		};
	},
	methods: {
		//前往头像用户
		toUser(item) {
			const mineinfo = uni.getStorageSync('userData');
			if (item.user_id == mineinfo.user_id) {
				uni.navigateTo({
					url: '/pages/mine/minebycon'
				});
			} else {
				uni.navigateTo({
					url: '/pages/user/user?id=' + item.user_id
				});
			}
		},
		// 点击喜欢按键
		likeThislItem(index) {
			if (this.liftlist[index].like_state === '1') {
				Content.setLike(this.liftlist[index].content_id, 0).then(res => {
					this.liftlist[index].like_state = '0';
					this.liftlist[index].like_num--;
				});
			} else {
				Content.setLike(this.liftlist[index].content_id, 1).then(res => {
					this.liftlist[index].like_state = '1';
					this.liftlist[index].like_num++;
				});
			}
		},
		likeThisrItem(index) {
			if (this.rightlist[index].like_state === '1') {
				Content.setLike(this.rightlist[index].content_id, 0).then(res => {
					this.rightlist[index].like_state = '0';
					this.rightlist[index].like_num--;
				});
			} else {
				Content.setLike(this.rightlist[index].content_id, 1).then(res => {
					this.rightlist[index].like_state = '1';
					this.rightlist[index].like_num++;
				});
			}
		},
		// 选中
		lchoose(e) {
			let index = e.currentTarget.dataset.index;
			this.$emit('click', this.liftlist[index]);
		},
		rchoose(e) {
			let index = e.currentTarget.dataset.index;
			this.$emit('click', this.rightlist[index]);
		},
		updatalist() {
			var me = this;
			this.getheight();
			if (me.showlist.length) {
				if (me.lefthetght > me.rightheight) {
					let item = me.showlist.shift();
					item.image.heiclass = 'height:' + 345 * (item.image.height / item.image.width) + 'upx;';
					me.rightlist.push(item);
				} else {
					let item = me.showlist.shift();
					item.image.heiclass = 'height:' + 345 * (item.image.height / item.image.width) + 'upx;';
					me.liftlist.push(item);
				}
			}
		},
		getheight() {
			var me = this;
			let lquery = uni.createSelectorQuery().select('#letf');
			let rquery = uni.createSelectorQuery().select('#right');
			lquery
				.boundingClientRect(function(data) {
					me.lefthetght = data.height;
				})
				.exec();
			rquery
				.boundingClientRect(function(data) {
					me.rightheight = data.height;
				})
				.exec();
		}
	},
	mounted() {
		// console.log(this.id);
		Content.getRecommendList(this.id).then(res => {
			this.showlist = res.data.data.list;
			this.updatalist();
		});
	},
	updated() {
		setTimeout(() => {
			this.updatalist();
		}, 120);
	}
};
</script>

<style scoped>
.bottomBlankSpace {
	width: 100%;
	height: 108upx;
}

.bottomInfo {
	width: 100%;
	height: 150upx;
	font-size: 24upx;
	text-align: center;
	color: #858585;
}

.water {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
}

/*左方瀑布流*/
.letffall {
	font-size: 0;
	top: 0;
	width: 345upx;
	margin-left: 20upx;
}

/*右方瀑布流*/
.rightfall {
	font-size: 0;
	left: 20upx;
	top: 0;
	margin-right: 20upx;
	width: 345upx;
}

/*图片*/
.img {
	width: 345upx;
	border-top-left-radius: 7upx;
	border-top-right-radius: 7upx;
}

/*文本框*/
.content {
	background: #ffffff;
	border: 1upx solid #d7d7d7;
	border-bottom-left-radius: 7upx;
	border-bottom-right-radius: 7upx;
	border-top: none;
	font-size: 28upx;
	padding-bottom: 50upx;
	margin-bottom: 20upx;
}

/* 种类 */
.type-detail {
	position: relative;
	width: 64upx;
	height: 33upx;
	bottom: 60upx;
	left: 20upx;
	font-size: 20upx;
	background: #000000;
	color: #ffffff;
	text-align: center;
	padding: 2upx;
	border: #bdbcbc;
	border-radius: 7upx;
	line-height: 35upx;
}

/* 标题 */
.title {
	position: relative;
	display: flex;
	text-align: left;
	width: auto;
	top: 0;
	font-size: 26upx;
	letter-spacing: 0upx;
	padding-left: 20upx;
	padding-right: 20upx;
	color: #000000;
	word-break: break-all;
}

/*用户部分*/
.user {
	position: relative;
	display: flex;
	top: 20upx;
	align-items: center;
}

/* 头像 */
.user_image {
	position: relative;
	top: 0;
	left: 20upx;
	width: 38upx;
	height: 37upx;
	border-radius: 50%;
	margin-right: 10upx;
}

/* 用户名 */
.nickname {
	position: absolute;
	font-size: 20upx;
	color: #808080;
	top: 5upx;
	left: 67upx;
	max-width: 150upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 点赞 */
.item-like {
	position: absolute;
	left: 265upx;
	font-size: 28upx;
}

/* 点赞数 */
.like_num {
	position: absolute;
	left: 301upx;
	opacity: 0.53;
	font-size: 20upx;
	color: #000000;
}
</style>
