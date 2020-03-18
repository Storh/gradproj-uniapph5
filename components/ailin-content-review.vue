<template>
	<view v-if="showlist">
		<!-- 评论数 -->
		<view class="comm_num">
			<text>共{{ showlist.length }}条评论</text>
		</view>
		<!-- 详情页评论 -->
		<view v-for="(item, index) in showlist" v-if="index < showNum" class="reply" :key="index">
			<view class="reply_1">
				<!-- 评论人信息 -->
				<view @click="toUser(item.user_id)">
					<block v-if="item.nickname.indexOf(ManagePading)==0">
						<image class="reg_img" :src="ManageHimg"></image>
						<text class="nickname" :style="ManageStyle">{{ ManageName}}</text>
					</block>
					<block v-else>
						<image class="reg_img" :src="item.headimgurl"></image>
						<text class="nickname">{{ item.nickname }}</text>
					</block>
				</view>
				<!-- 是否喜欢 -->
				<view class="likes">
					<view class="likebutton" @click="dianzanThisItem(index)">
						<ailin-icon v-if="item.like_state == '1'" iconId="#icon-PLdianzan-on"></ailin-icon>
						<ailin-icon v-else iconId="#icon-PLdianzan-off"></ailin-icon>
					</view>
					<text class="like_num">{{ item.like_num }}</text>
				</view>
				<!-- 评论内容 -->
				<view>
					<!-- 发起人可点击 -->
					<view v-if="mineId == contentinfo.user_id" class="add_text" @click="replyThisReview(item, index)">
						<block v-if="reviewType">
							<text>{{ item.review_text }}</text>
						</block>
						<block v-else>
							<text>{{ item.add_text }}</text>
						</block>
						<view class="add_time">
							<text>{{ item.time }}</text>
						</view>
					</view>
					<!-- 其他不能点击 -->
					<view v-else class="add_text" :style="tcolor" @click="wannaDelete">
						<!-- 评论者可点击 -->
						<view v-if="(mineId == item.user_id)&& showInfoTypeList" style="color:#FFFFFF" class="show_delete" @click="deletecomment(item, index)">
							删除评论
						</view>
						<block v-if="reviewType">
							<text>{{ item.review_text }}</text>
						</block>
						<block v-else>
							<text>{{ item.add_text }}</text>
						</block>
						<view class="add_time">
							<text>{{ item.time }}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="item.reply_text" class="reply_2">
				<!-- 发起人回复 -->
				<view @click="toUser(contentinfo.user_id)">
					<block v-if="contentinfo.nickname.indexOf(ManagePading)==0">
						<image :src="ManageHimg"></image>
						<text class="nickname_2" :style="ManageStyle">{{ ManageName }}</text>
					</block>
					<block v-else>
						<image :src="contentinfo.headimgurl"></image>
						<text class="nickname_2">{{ contentinfo.nickname }}</text>
					</block>
				</view>
				<text class="add_text_2">{{ item.reply_text }}</text>
			</view>
			<view v-if="index" class="replyafter"></view>
		</view>
		<!-- 评论展开 -->
		<view class="more" @click="openReview" :style="listshow"><text>更多精彩评论</text></view>
		<view v-if="showInfoTypeList" class="cpt-mask" @touchend="removeMask"></view>
	</view>
</template>

<script>
	import Review from '../api/info/review';
	import Content from '../api/content';
	export default {
		name: 'ailin-content-review',
		props: {
			// 评论列表
			reviewlist: {
				type: Array,
				default () {
					return [];
				}
			},
			// 动态信息
			contentinfo: {}
		},
		data() {
			return {
				// 是否展示选项
				showInfoTypeList: false,
				mineId: undefined,
				// 展示的评论个数
				showNum: 3,
				// 用于评论展示的列表
				showlist: undefined,
				content_id: undefined,
				listshow: '',
				// 是否为评论
				reviewType: true,
				contentType: [false, false, false, false, true, true, false],
				tcolor: ''
			};
		},
		methods: {
			// 发起人回复
			replyThisReview(item, index) {
				if (item.reply_text) {
					uni.showToast({
						title: '您已回复过',
						icon: 'none',
						duration: 3000
					});
				} else {
					item.index = index;
					this.$emit('click', item);
				}
			},
			// 移除遮盖
			removeMask() {
				this.showInfoTypeList = !this.showInfoTypeList;
			},
			//前往头像用户
			toUser(id) {
				const mineinfo = uni.getStorageSync('userData');
				if (id == mineinfo.user_id) {
					uni.navigateTo({
						url: '/pages/mine/minebycon'
					});
				} else {
					uni.navigateTo({
						url: '../../pages/user/user?id=' + id
					});
				}
			},
			// 打算删除评论
			wannaDelete() {
				this.showInfoTypeList = !this.showInfoTypeList;
			},
			// 点赞
			dianzanThisItem(dzdex) {
				// 该页面为评论内容
				if (this.reviewType) {
					if (this.showlist[dzdex].like_state == 1) {
						this.showlist[dzdex].like_state = '0';
						this.showlist[dzdex].like_num--;
						Review.setLike(this.showlist[dzdex].review_id, 0).then(res => {

						});
					} else {
						this.showlist[dzdex].like_state = '1';
						this.showlist[dzdex].like_num++;
						Review.setLike(this.showlist[dzdex].review_id, 1).then(res => {

						});
					}
				} else {
					if (this.showlist[dzdex].like_state == 1) {
						this.showlist[dzdex].like_state = '0';
						this.showlist[dzdex].like_num--;
						Content.registSetLike(this.showlist[dzdex].regist_id, this.contentinfo.type_id, 0).then(res => {

						});
					} else {
						this.showlist[dzdex].like_state = '1';
						this.showlist[dzdex].like_num++;
						Content.registSetLike(this.showlist[dzdex].regist_id, this.contentinfo.type_id, 1).then(res => {

						});
					}
				}
			},
			// 时间格式处理
			timeComp() {
				let num = this.reviewlist.length;
				this.showlist = [];
				for (let i = 0; i < num; i++) {
					let item = this.reviewlist[i];
					if (item.add_time) {
						item.time = item.add_time.slice(5, 16);
						this.showlist.push(item);
					} else {
						this.showlist.push(item);
					}
				}
			},
			// 打开评论
			openReview() {
				this.showNum = this.reviewlist.length;
				this.listshow = 'display:none;';
			},
			//删除自己评论
			deletecomment(item, dzdex) {
				Review.delReview(this.showlist[dzdex].review_id).then(res => {
					uni.showToast({
						title: "删除成功",
						duration: 3000
					});
					this.showlist[dzdex].review_text = "该评论已被删除";
					this.tcolor = 'color:#D0D0D0';
				});
			}
		},
		created() {
			// console.log(this.reviewlist);
			const userInfo = uni.getStorageSync('userData');
			this.mineId = userInfo.user_id;
			this.reviewType = this.contentType[this.contentinfo.type_id];
			// 时间处理和评论展示
			if (this.reviewlist.length < 4) {
				this.listshow = 'display:none;';
			}
			this.timeComp();
		},
		watch: {
			// 数据更新
			reviewlist: function(newVal) {
				this.reviewlist = newVal;
				this.timeComp();
				this.showNum++;
			}
		}
	};
</script>

<style>
	.comm_num {
		font-size: 24upx;
		color: #929292;
		background: #ffffff;
		position: relative;
		padding-top: 35upx;
		padding-left: 37upx;
	}

	/* 详情页评论 */
	.reply {
		position: relative;
		font-size: 0;
		padding-bottom: 60upx;
		padding-top: 23upx;
		background: #ffffff;
	}

	.replyafter {
		content: '';
		position: absolute;
		left: 110upx;
		top: 1upx;
		height: 1upx;
		width: 608upx;
		background-color: #d8d8d8;
	}

	/* 评论 */
	.reply_1 {
		position: relative;
		width: 100%;
	}

	/* 评论头像 */
	.reg_img {
		border-radius: 50%;
		left: 31upx;
		width: 52upx;
		height: 52upx;
		position: absolute;
	}

	/* 评论用户名 */
	.nickname {
		font-size: 26upx;
		height: 37upx;
		left: 110upx;
		/* top: 4upx; */
		position: absolute;
	}

	/* 评论内容 */
	.add_text {
		font-size: 24upx;
		left: 110upx;
		top: 40upx;
		width: 536upx;
		height: auto;
		position: relative;
	}

	/* 发布时间 */
	.add_time {
		padding-left: 15upx;
		font-size: 20upx;
		color: #929292;
		bottom: 0upx;
		right: 0upx;
		display: inline;
		position: relative;
	}

	.likes {
		position: absolute;
		right: 70upx;
		top: 20upx;
		height: 50upx;
		width: auto;
		display: flex;
	}

	/* 点赞按钮 */
	.likebutton {
		font-size: 35upx;
		position: absolute;
		left: 50%;
		top: 0;
		transform: translate(-50%, -50%);
	}

	/* 点赞数 */
	.like_num {
		width: 50upx;
		font-size: 18upx;
		color: #929292;
		text-align: center;
		position: absolute;
		left: 50%;
		top: 58%;
		transform: translate(-50%, -50%);
	}

	/* 评论回复 */
	.reply_2 {
		height: auto;
		display: flex;
		font-size: 0;
		position: relative;
		top: 58upx;
		left: 0upx;
		width: 608upx;
		margin-left: 110upx;
		margin-right: 32upx;
		padding-bottom: 68upx;
	}

	/* 评论回复头像 */
	.reply_2 image {
		border-radius: 50%;
		width: 38upx;
		height: 37upx;
		left: 0upx;
		top: 0;
		position: absolute;
	}

	/* 评论回复用户名 */
	.nickname_2 {
		font-size: 24upx;
		left: 51upx;
		top: 0;
		position: absolute;
	}

	/* 评论回复内容 */
	.add_text_2 {
		font-size: 24upx;
		left: 51upx;
		top: 37upx;
		width: 503upx;
		color: #878787;
		position: relative;
	}

	/* 更多 */
	.more {
		position: relative;
		text-align: center;
		background: #ffffff;
		width: 100%;
		top: -10upx;
		padding-top: 30upx;
		padding-bottom: 49upx;
		font-size: 20upx;
		color: #878787;
	}

	.recommend {
		background: #f2f2f2;
		top: -2upx;
		padding-top: 42upx;
		font-size: 24upx;
		color: #929292;
		position: relative;
		text-align: center;
	}

	.like {
		position: absolute;
		left: 45upx;
	}

	.likenum {
		position: absolute;
		left: 90upx;
		top: 45upx;
		font-size: 20upx;
		opacity: 0.53;
	}

	/* 删除按钮 */
	.show_delete {
		background-color: #434343;
		position: absolute;
		top: -50upx;
		left: 200upx;
		height: 40upx;
		width: 140upx;
		font-size: 26upx;
		text-align: center;
		line-height: 40upx;
		border-radius: 10upx;
	}

	.show_delete:before {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border: 10upx solid transparent;
		border-top-color: #434343;
		left: 10%;
		margin-left: -4upx;
		bottom: -20upx;
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
</style>
