<template>
	<view v-if="contentinfo">
		<view class="content_detail">
			<!-- 动态内容详情 创建者信息、正文、参与者 -->
			<ailin-content-info :contentinfo="contentinfo"></ailin-content-info>
			<!-- 评论区或非参与人式的 -->
			<view v-if="reviewlist">
				<block v-if="reviewlist.length">
					<ailin-content-review :reviewlist="reviewlist" :contentinfo="contentinfo" @click="replyReview"></ailin-content-review>
					<br />
					<br />
				</block>
				<block v-else>
					<view class="nonReview">添加第一条{{ btnreviewtext[contentinfo.type_id] }}</view>
					<br />
				</block>
			</view>
		</view>
		<!-- 底端栏 -->
		<view v-if="pushByMe">
			<view class="bottombar">
				<view class="like" @click="likeThisContent">
					<ailin-icon v-if="contentinfo.like_state == 1" iconId="#icon-dianzan-on"></ailin-icon>
					<ailin-icon v-else iconId="#icon-dianzan-off"></ailin-icon>
				</view>
				<text class="likenum">{{ contentinfo.like_num }}</text>
				<view class="collect" @click="cllentThisContent">
					<ailin-icon v-if="contentinfo.collect_state == 1" iconId="#icon-shoucang-on"></ailin-icon>
					<ailin-icon v-else iconId="#icon-shoucang-off"></ailin-icon>
				</view>
				<text class="collectnum">{{ contentinfo.collect_num }}</text>
				<view class="comm" @click="pusherCom()">
					<ailin-icon iconId="#icon-pinglun"></ailin-icon>
					<text class="comm_text">评论</text>
				</view>
				<button @click="editContent">重新编辑</button>
			</view>
		</view>
		<view v-else>
			<view class="bottombar">
				<view class="like" @click="likeThisContent">
					<ailin-icon v-if="contentinfo.like_state == 1" iconId="#icon-dianzan-on"></ailin-icon>
					<ailin-icon v-else iconId="#icon-dianzan-off"></ailin-icon>
				</view>
				<text class="likenum">{{ contentinfo.like_num }}</text>
				<view class="collect" @click="cllentThisContent">
					<ailin-icon v-if="contentinfo.collect_state == 1" iconId="#icon-shoucang-on"></ailin-icon>
					<ailin-icon v-else iconId="#icon-shoucang-off"></ailin-icon>
				</view>
				<text class="collectnum">{{ contentinfo.collect_num }}</text>
				<view v-if="reviewType">
					<view class="comm" @click="inputtext()">
						<ailin-icon iconId="#icon-pinglun"></ailin-icon>
						<text class="comm_text">评论</text>
					</view>
				</view>
				<block v-if="contentinfo.type_id == 5">
					<block v-if="contentinfo.is_end == 1"><button disabled="true">已结束</button></block>
					<block v-if="contentinfo.is_end == 0">
						<button @click="joinContent(contentinfo.content_id, contentinfo.type_id)">{{ btntext[contentinfo.type_id] }}</button>
					</block>
				</block>
				<block v-if="contentinfo.type_id == 4">
					<block v-if="num_end == 1"><button disabled="true">人数已满</button></block>
					<block v-if="num_end == 0">
						<button @click="joinContent(contentinfo.content_id, contentinfo.type_id)">{{ btntext[contentinfo.type_id] }}</button>
					</block>
				</block>
				<block v-else>
					<button @click="joinContent(contentinfo.content_id, contentinfo.type_id)">{{ btntext[contentinfo.type_id] }}</button>
				</block>
			</view>
		</view>
		<!-- 说点什么 -->
		<view :style="inputStyle" class="comment">
			<image @click="inputtextagain()" class="commentImg" :src="mineInfo.headimgurl"></image>
			<input @click="inputtextagain()" class="commentInput" @confirm="sendText" v-model="reviewAndReplyText" :placeholder="commentPlaceholder" />
			<button class="buttom" @click="sendText">发送</button>
		</view>
	</view>
</template>

<script>
	import Content from '../../api/content';
	import Help from '../../api/info/help';
	import Pack from '../../api/info/pack';
	import Question from '../../api/info/qusetion';
	import Topic from '../../api/info/topic';
	import Unused from '../../api/info/unused';
	import Activity from '../../api/info/activity';
	import Review from '../../api/info/review';
	import AilinContentInfo from '../../components/ailin-content-info.vue';
	import AilinContentReview from '../../components/ailin-content-review.vue';
	import RecomWaterFall from '../../components/recomwaterfall.vue';
	import jweixin from '../../components/wxjsjdk.js';
	export default {
		components: {
			AilinContentInfo,
			AilinContentReview,
			RecomWaterFall
		},
		data() {
			return {
				num_end: 0,
				replyReviewType: false,
				num: 0,
				join_num: 0,
				toindex: false,
				pushByMe: false,
				inputStyle: 'bottom: -2000upx;',
				mineInfo: undefined,
				mineId: undefined,
				replyId: undefined,
				replyIndex: undefined,
				reviewType: true,
				// 动态id
				content_id: undefined,
				district_type: undefined,
				// 动态记录详情
				contentinfo: undefined,
				// 评论列表
				reviewlist: undefined,
				// 类型判断
				btntext: [' ', '参与求助', '我来回答', '我想要', '立即参与', '立即参与', '说点什么'],
				contentType: [false, false, false, true, true, true, false],
				btnreviewtext: [' ', '评论', '回答', '评论', '评论', '评论', '评论'],
				commentPlaceholder: '说点什么',
				reviewAndReplyText: ''
			};
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onUnload() {
			console.log('跳回');
			// 点击分享链接=》进入首页onload判断动态分享链接，设置监听器，阻止首页列表获取=》详情页浏览=》浏览结束返回首页触发监听器，读取首页列表
			uni.$emit('intoIndexBySher', {});
		},
		methods: {
			// 发布者评论
			pusherCom() {
				// 获取输入框焦点
				this.inputtext();
				this.replyReviewType = false;
			},
			wxsss(shareType) {
				let me = this;
				if (shareType == 5) {
					Pack.getList(me.contentinfo.content_id, 3).then(res => {
						let usernum = res.data.data.list.length;
						let desc = '';
						for (let i = 0; i < usernum; i++) {
							if (res.data.data.list[i].nickname.indexOf(me.ManagePading) == 0) {
								desc = desc + '#' + me.ManageName;
							} else {
								desc = desc + '#' + res.data.data.list[i].nickname;
							}
						}
						let title = '虹桥正荣府|' + me.contentinfo.title; // 分享标题
						me.wxss(title, desc);
					});
				} else {
					let title = '虹桥正荣府|' + me.contentinfo.title; // 分享标题
					let desc = me.contentinfo.content.slice(0, 15) + '...'; // 分享描述
					me.wxss(title, desc);
				}
			},
			wxss(shareTitle, shareDesc) {
				var me = this;
				let consturl = 'http://ailin.feiqing.net/#/pages/content/content?contentId=' + me.content_id + '&typeId=' + me.contentinfo
					.type_id;
				// 生成该页面的绝对链接
				let urlnow = 'http://ailin.feiqing.net/#' + window.location.href.split('#')[1];
				let wxsharurl = 'http://ailin.feiqing.net/static/html/redirect.html?app3Redirect=' + encodeURIComponent(consturl);
				uni.request({
					url: 'http://www.chinaclick.com.cn/ailin/app/wxApi',
					method: 'GET',
					data: {
						url: consturl
					},
					success: res => {
						jweixin.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: res.data.appId, // 必填，公众号的唯一标识
							timestamp: res.data.timestamp, // 必填，生成签名的时间戳
							nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
							signature: res.data.signature, // 必填，签名，见附录1
							jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
						});
						jweixin.ready(function() {
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
							jweixin.updateAppMessageShareData({
								// title: '虹桥正荣府|' + me.contentinfo.title, // 分享标题
								// desc: me.contentinfo.title, // 分享描述
								title: shareTitle,
								desc: shareDesc,
								// link: window.location.href, // 分享链接
								link: wxsharurl, // 分享链接
								imgUrl: me.contentinfo.images[0].src, // 分享图标
								success: function() {
									// 用户确认分享后执行的回调函数
									console.log('用户确认分享');
									console.log(wxsharurl);
								},
								cancel: function() {
									// 用户取消分享后执行的回调函数
									console.log('用户取消分享');
								}
							});
							//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
							jweixin.updateTimelineShareData({
								title: '虹桥正荣府|' + me.contentinfo.title, // 分享标题
								link: wxsharurl, // 分享链接
								imgUrl: me.contentinfo.images[0].src, // 分享图标
								success: function() {
									// 用户确认分享后执行的回调函数
									console.log('用户确认分享');
								},
								cancel: function() {
									// 用户取消分享后执行的回调函数
									console.log('用户取消分享');
								}
							});
						});
					},
					fail: () => {
						console.log('request fail', err);
					},
					complete: () => {
						console.log('WX request done');
					}
				});
			},
			// 喜欢和收藏
			likeThisContent() {
				if (this.contentinfo.like_state === '1') {
					Content.setLike(this.content_id, 0).then(res => {
						this.contentinfo.like_state = '0';
						this.contentinfo.like_num--;
					});
				} else {
					Content.setLike(this.content_id, 1).then(res => {
						this.contentinfo.like_state = '1';
						this.contentinfo.like_num++;
					});
				}
			},
			cllentThisContent() {
				if (this.contentinfo.collect_state === '1') {
					Content.setCollect(this.content_id, 0).then(res => {
						this.contentinfo.collect_state = '0';
						this.contentinfo.collect_num--;
					});
				} else {
					Content.setCollect(this.content_id, 1).then(res => {
						this.contentinfo.collect_state = '1';
						this.contentinfo.collect_num++;
					});
				}
			},
			inputtextagain() {
				this.inputStyle = 'bottom: 0upx;';
				const input = document.querySelector('input');
				input.focus();
			},
			inputtext() {
				this.reviewAndReplyText = '';
				this.inputStyle = 'bottom: 0upx;';
				const input = document.querySelector('input');
				input.focus();
			},
			sendText() {
				this.inputStyle = 'bottom: -2000upx;';
				const input = document.querySelector('input');
				input.blur();
				if (this.pushByMe) {
					if (this.replyReviewType) {
						this.sendReplyReview(this.replyId, this.contentinfo.type_id, this.reviewAndReplyText);
					} else {
						this.addRegist(this.contentinfo.content_id, this.contentinfo.type_id);
					}
				} else {
					this.addRegist(this.contentinfo.content_id, this.contentinfo.type_id);
				}
			},
			addSucess(mesg, id) {
				uni.showToast({
					title: mesg,
					duration: 3000
				});
				let item = {};
				if (this.reviewType) {
					// 评论
					item.review_id = id;
					item.user_id = this.mineInfo.user_id;
					item.nickname = this.mineInfo.nickname;
					item.headimgurl = this.mineInfo.headimgurl;
					item.review_text = this.reviewAndReplyText;
					item.time = '刚刚';
					item.like_num = 0;
					item.like_state = 0;
				} else {
					item.regist_id = id;
					item.user_id = this.mineInfo.user_id;
					item.nickname = this.mineInfo.nickname;
					item.headimgurl = this.mineInfo.headimgurl;
					item.add_text = this.reviewAndReplyText;
					item.time = '刚刚';
					item.like_num = 0;
					item.like_state = 0;
				}
				this.reviewlist.unshift(item);
			},
			addRegist(id, type) {
				uni.showLoading({
					title: '提交中'
				});
				if (type == 1) {
					// 求助
					Help.addRegist(id, this.reviewAndReplyText).then(res => {
						uni.hideLoading();
						if (res.data.data.regist_id) {
							this.addSucess('评论成功', res.data.data.regist_id);
						}
					});
				} else if (type == 2) {
					// 问答
					Question.addRegist(id, this.reviewAndReplyText).then(res => {
						uni.hideLoading();
						if (res.data.data.regist_id) {
							this.addSucess('回答成功', res.data.data.regist_id);
						}
					});
				} else if (type == 3) {
					// 闲置
					Unused.addRegist(id, this.reviewAndReplyText).then(res => {
						uni.hideLoading();
						if (res.data.data.regist_id) {
							this.addSucess('评论成功', res.data.data.regist_id);
						}
					});
				} else if (type == 6) {
					// 话题
					Topic.addRegist(id, this.reviewAndReplyText).then(res => {
						uni.hideLoading();
						if (res.data.data.regist_id) {
							this.addSucess('评论成功', res.data.data.regist_id);
						}
					});
				} else {
					// 4、5活动团购为评论
					Review.addReview(id, this.reviewAndReplyText).then(res => {
						uni.hideLoading();
						if (res.data.data.review_id) {
							this.addSucess('评论成功', res.data.data.review_id);
						}
					});
				}
			},
			// 发起者编辑
			editContent() {
				uni.redirectTo({
					url: '../push/edit?id=' + this.content_id
				});
			},
			// 参与
			joinContent(id, type) {
				if (type == 3) {
					// 闲置,弹发起者信息
					this.showOrgPhoneNum();
				} else if (type == 4) {
					// 活动,弹自己信息

					uni.navigateTo({
						url: '../../pages/content/join?id=' + this.contentinfo.content_id + '&type=' + this.contentinfo.type_id
					});
				} else if (type == 5) {
					// 团购页面跳转
					uni.navigateTo({
						url: '/pages/content/pack/pack?id=' + this.contentinfo.content_id
					});
				} else {
					// 打开输入栏
					this.inputtext();
				}
			},
			// 手机号展示
			showOrgPhoneNum() {
				uni.showModal({
					title: '与TA联系',
					confirmColor: '#3CC51F',
					content: '联系方式:' + this.contentinfo.phone,
					showCancel: false
				});
			},
			showMinePhoneNum(type) {
				var me = this;
				uni.showModal({
					title: '确认信息',
					confirmColor: '#3CC51F',
					// content: '我的电话:' + me.mineInfo.phone,
					content: '是否确认参与',
					success: function(modalres) {
						if (modalres.confirm) {
							uni.showLoading({
								title: '提交中'
							});
							if (type) {
								Pack.addRegist(me.content_id).then(res => {
									uni.hideLoading();
									if (res.data.data.regist_id) {
										uni.showToast({
											title: '参与成功',
											duration: 2000
										});
									}
								});
							}
						}
					}
				});
			},
			replySucess() {
				uni.hideLoading();
				uni.showToast({
					title: '回复成功',
					duration: 2000
				});
				this.reviewlist[this.replyIndex].reply_text = this.reviewAndReplyText;
			},
			// 发起者对内容进行回复
			sendReplyReview(id, type, text) {
				uni.showLoading({
					title: '提交中'
				});
				if (type == 1) {
					// 求助
					Help.replyRegist(id, text).then(res => {
						this.replySucess();
					});
				} else if (type == 2) {
					// 问答
					Question.replyRegist(id, text).then(res => {
						this.replySucess();
					});
				} else if (type == 3) {
					// 闲置
					Unused.replyRegist(id, text).then(res => {
						this.replySucess();
					});
				} else if (type == 6) {
					// 话题
					Topic.replyRegist(id, text).then(res => {
						this.replySucess();
					});
				} else {
					// 4、5活动团购为评论
					Review.replyReview(id, text).then(res => {
						this.replySucess();
					});
				}
			},
			replyReview(replyItem) {
				if (this.pushByMe) {
					this.replyReviewType = true;
					if (replyItem.nickname.indexOf(this.ManagePading) == 0) {
						let text = '您正在回复@' + this.ManageName;
						this.commentPlaceholder = text;
					} else {
						let text = '您正在回复@' + replyItem.nickname;
						this.commentPlaceholder = text;
					}
					this.replyIndex = replyItem.index;
					if (this.reviewType) {
						this.replyId = replyItem.review_id;
					} else {
						this.replyId = replyItem.regist_id;
					}
					// 打开输入栏
					this.inputtext();
				}
			},
			//选中
			choose(item) {
				// item 返回选中对象信息
				uni.navigateTo({
					url: '../content/content?contentId=' + item.content_id
				});
			},
			// 获取评论或问答等的列表
			getReviewList(id, type) {
				var me = this;
				// 1:求助；help 2：问答；question 3：闲置；unused 4：活动；activity 5：团购；pack 6：话题topic
				if (type == 1) {
					Help.getList(id).then(res => {
						me.reviewlist = res.data.data.list;
					});
				} else if (type == 2) {
					Question.getList(id).then(res => {
						me.reviewlist = res.data.data.list;
					});
				} else if (type == 3) {
					Unused.getList(id).then(res => {
						me.reviewlist = res.data.data.list;
					});
				} else if (type == 6) {
					Topic.getList(id).then(res => {
						me.reviewlist = res.data.data.list;
					});
				} else {
					Review.getList(id).then(res => {
						me.reviewlist = res.data.data.list;
					});
				}
			}
		},
		onLoad(params) {
			var me = this;
			// 获取页面栈
			const pages = getCurrentPages();
			const userInfo = uni.getStorageSync('userData');
			if (userInfo) {
				if (pages.length < 2) {
					// 页面栈中无首页
					// 携带当前页面回到首页再次跳转
					window.location.replace(this.WebUrl + '/#/?nextTo=content&contentId=' + params.contentId + '&typeId=' +
						params.typeId);
				} else {
					// 获取页面参数
					me.content_id = params.contentId;
					me.mineInfo = userInfo;
					me.mineId = userInfo.user_id;
					// 获取该记录的详细情况
					if (params.typeId == 4) {
						// 为活动
						Activity.getDetail(me.content_id).then(res => {
							me.contentinfo = res.data.data;
							// me.wxsss(params.typeId);
							if (me.mineId == res.data.data.user_id) {
								me.pushByMe = true;
							}
							me.reviewType = me.contentType[me.contentinfo.type_id];
							me.contentinfo.time = me.contentinfo.add_time.slice(5, 16);
							// 获取动态记录评论列表
							me.getReviewList(me.content_id, me.contentinfo.type_id);

							me.num = me.contentinfo.num_upper_limit;
							Activity.getList(me.content_id).then(res => {
								me.join_num = res.data.data.list.length;
								console.log(me.num);
								console.log(me.join_num);
								if (me.num == me.join_num) {
									me.num_end = 1;
								}
							});
						});
					} else if (params.typeId == 5) {
						// 为拼团
						Pack.getPackDetail(me.content_id).then(res => {
							me.contentinfo = res.data.data;
							// me.wxsss(params.typeId);
							if (me.mineId == res.data.data.user_id) {
								me.pushByMe = true;
							}
							me.reviewType = me.contentType[me.contentinfo.type_id];
							me.contentinfo.time = me.contentinfo.add_time.slice(5, 16);
							// 获取动态记录评论列表
							me.getReviewList(me.content_id, me.contentinfo.type_id);
						});
					} else {
						Content.getDetail(me.content_id).then(res => {
							me.contentinfo = res.data.data;
							// me.wxsss(0);
							if (me.mineId == res.data.data.user_id) {
								me.pushByMe = true;
							}
							me.reviewType = me.contentType[me.contentinfo.type_id];
							me.contentinfo.time = me.contentinfo.add_time.slice(5, 16);
							// 获取动态记录评论列表
							me.getReviewList(me.content_id, me.contentinfo.type_id);
						});
					}
				}
			}
		}
	};
</script>

<style>
	page {
		background: #f2f2f2;
	}

	.nonReview {
		background-color: #ffffff;
		text-align: center;
		height: 120upx;
		font-size: 28upx;
		color: #929292;
		padding-top: 70upx;
	}

	/* 发布评论 */
	.comment {
		height: 108upx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		position: fixed;
		/* bottom: 0upx; */

		width: 100%;
		background: #f2f2f2;
		border-top: 1upx solid #d0d0d0;
		border-bottom: 1upx solid #d0d0d0;
	}

	/* 输入栏 */
	.commentInput {
		background: #ffffff;
		color: #000000;
		font-size: 24upx;
		left: 110upx;
		padding-left: 30upx;
		padding-right: 30upx;
		width: 450upx;
		height: 65upx;
		position: absolute;
		border-radius: 28upx;
	}

	.buttom {
		width: 100upx;
		right: -50upx;
		height: 65upx;
		font-size: 24upx;
		text-align: center;
		line-height: 65upx;
	}

	/* 头像 */
	.commentImg {
		width: 64upx;
		height: 64upx;
		border-radius: 50%;
		left: 31upx;
		position: absolute;
	}

	/* 点赞按钮 */
	.likebutton {
		right: 51upx;
		top: -5upx;
		font-size: 30upx;
		position: absolute;
	}

	/* 点赞数 */
	.like_num {
		right: 55upx;
		top: 30upx;
		font-size: 18upx;
		color: #929292;
		position: absolute;
	}

	.recommend {
		position: relative;
		top: -2upx;
		text-align: center;
	}

	.recommendtext {
		width: 100%;
		padding-top: 44upx;
		padding-bottom: 44upx;
		font-size: 24upx;
		color: #929292;
	}

	/* 瀑布流 */
	.water_fall {
		position: relative;
		bottom: 0;
		background: #f2f2f2;
		margin-top: 38upx;
		top: 0upx;
	}

	.bottombar {
		display: flex;
		align-items: center;
		height: 108upx;
		position: fixed;
		bottom: 0upx;
		width: 100%;
		background: #f2f2f2;
		border-top: 1upx solid #d0d0d0;
		border-bottom: 1upx solid #d0d0d0;
	}

	.like {
		position: absolute;
		left: 45upx;
	}

	.collect {
		position: absolute;
		left: 130upx;
	}

	.likenum {
		position: absolute;
		left: 90upx;
		top: 45upx;
		font-size: 20upx;
		opacity: 0.53;
	}

	.collectnum {
		position: absolute;
		left: 174upx;
		top: 45upx;
		font-size: 20upx;
		opacity: 0.53;
	}

	.comm {
		position: absolute;
		left: 215upx;
		top: 31upx;
		font-size: 40upx;
	}

	.comm_text {
		position: absolute;
		left: 48upx;
		top: 14upx;
		opacity: 0.53;
		font-size: 20upx;
		width: 60upx;
		color: #000000;
	}

	button {
		position: absolute;
		left: 572upx;
		width: 141upx;
		height: 52upx;
		border-radius: 26upx;
		line-height: 52upx;
		padding: 0;
		background: #3fb583;
		text-align: center;
		font-size: 24upx;
		color: #ffffff;
	}
</style>
