<template>
	<view>
		<view class="communication">
			<block v-if="pagetype">
				<button class="leftbtn">通讯录</button>
				<button class="rightbtn" @click="shownotice">通知</button>
			</block>
			<block v-else>
				<button class="leftbtn2" @click="showadd">通讯录</button>
				<button class="rightbtn2">通知</button>
			</block>
			<view v-if="bigdian" class="icon-hongdiannot">
				<ailin-icon style="font-size: 25upx;" iconId="#icon-hongdian"></ailin-icon>
			</view>
		</view>
		<!-- 通讯录 -->
		<view class="common" v-if="pagetype">
			<block v-if="addlist.length > 0">
				<contacts-select-user :obtainContacts="addlist" @focuseInput="masktabbar"></contacts-select-user>
			</block>
		</view>
		<!-- 通知 -->
		<view class="common" v-else>
			<view class="showaddlist" v-for="(nitem, index) in noticelist" :key="'n' + index" @click="choose(nitem, index)">
				<view v-if="nitem.notice_type == 1">
					<image class="img" :src="nitem.headimgurl"></image>
					<text class="nickname">系统通知</text>
					<image class="sysimg" src="../../static/icon/home.png"></image>
					<view class="message">{{ nitem.desc }}</view>
				</view>
				<view v-else>
					<block v-if="nitem.nickname.indexOf(ManagePading)==0">
						<image class="img" :src="ManageHimg"></image>
						<text class="nickname" :style="ManageStyle">
							{{ ManageName }}
							<span>{{ noticeTypeList[nitem.notice_type - 2] }}了你的{{ contentTypeList[nitem.content_type - 1] }}</span>
						</text>
					</block>
					<block v-else>
						<image class="img" :src="nitem.headimgurl"></image>
						<text class="nickname">
							{{ nitem.nickname }}
							<span>{{ noticeTypeList[nitem.notice_type - 2] }}了你的{{ contentTypeList[nitem.content_type - 1] }}</span>
						</text>
					</block>
					<view class="message">{{ nitem.desc }}</view>
				</view>
				<view v-if="nitem.read_state == 0" class="icon-hongdian">
					<ailin-icon style="font-size: 15upx;" iconId="#icon-hongdian"></ailin-icon>
				</view>
			</view>
			<view v-if="noticeHasNewList" class="bottomBlankSpace"></view>
			<view v-else class="bottomInfo"><text>—— 已经到底了 ——</text></view>
		</view>
		<ailin-tab-bar v-if="tabbarshow" id="#tabbar" :add="2"></ailin-tab-bar>
	</view>
</template>

<script>
	import User from '../../api/user';
	import Notice from '../../api/notice';
	import ContactsSelectUser from '../../components/contacts-select-user.vue';
	export default {
		components: {
			ContactsSelectUser
		},
		data() {
			return {
				tabbarshow: true,
				// 是否有通知的红点
				bigdian: false,
				// 控制页面是显示通讯录还是显示通知
				pagetype: true,
				// 联系人列表
				addlist: [],
				addpage: 1,
				noticepage: 1,
				noticeHasNewList: true,
				addHasNewList: true,
				page_num: 15,
				noticelist: [],
				noticeTypeList: ['参加', '评论', '点赞'],
				contentTypeList: ['求助', '问答', '闲置', '活动', '团购', '话题']
			};
		},
		// 下拉刷新
		onPullDownRefresh() {
			var me = this;
			setTimeout(function() {
				uni.stopPullDownRefresh();
				// 初始化数据
				if (me.pagetype) {
					// me.addlist = [];
					// me.addpage = 1;
					// me.addHasNewList = true;
					// me.getContactsList();
				} else {
					me.noticelist = [];
					me.noticepage = 1;
					me.noticeHasNewList = true;
					me.getNoticeList();
				}
			}, 1000);
		},
		methods: {
			// 是否隐藏tabbar
			masktabbar(e) {
				if (e) {
					this.tabbarshow = false;
				} else {
					this.tabbarshow = true;
				}
			},
			//前往头像用户
			toUser(user) {
				const mineinfo = uni.getStorageSync('userData');
				if (user.user_id == mineinfo.user_id) {
					uni.navigateTo({
						url: '/pages/mine/minebycon'
					});
				} else {
					uni.navigateTo({
						url: '/pages/user/user?id=' + user.user_id
					});
				}
			},
			// 选中信息跳转
			choose(notice, index) {
				if (notice.notice_type == 1) {
					Notice.setRead(notice.id).then(res => {
						this.noticelist[index].read_state = 1;
					});
					uni.navigateTo({
						url: 'office?id=' + notice.content_id
					});
				} else {
					Notice.setRead(notice.id).then(res => {
						this.noticelist[index].read_state = 1;
					});
					uni.navigateTo({
						url: '../content/content?contentId=' + notice.content_id+ '&typeId=' + notice.content_type
					});
				}
			},
			addlistcomp(list) {
				let num = list.length;
				for (let i = 0; i < num; i++) {
					let item = list[i];
					item.nickname = list[i].nickname.slice(0, 17);
					this.addlist.push(item);
				}
			},
			noticlistcomp(list) {
				let num = list.length;
				for (let i = 0; i < num; i++) {
					let item = list[i];
					if (list[i].nickname) {
						item.nickname = list[i].nickname.slice(0, 17);
					}
					this.noticelist.push(item);
				}
			},
			// 加载通讯录数据
			getContactsList() {
				User.getAddressBookList().then(res => {
					this.addlist = res.data.data.list;
				});
			},
			getNoticeListfirst() {
				Notice.getList(1, 3).then(res => {
					if (res.data.data.list[0].read_state == 0) {
						this.bigdian = true;
					}
					if (res.data.data.list[1].read_state == 0) {
						this.bigdian = true;
					}
					if (res.data.data.list[2].read_state == 0) {
						this.bigdian = true;
					}
				});
				this.getNoticeList();
			},
			// 获取通知列表信息
			getNoticeList() {
				Notice.getList(this.noticepage, this.page_num).then(res => {
					if (res.data.data.list.length) {
						this.noticlistcomp(res.data.data.list);
					} else {
						// 无新数据
						this.noticeHasNewList = false;
					}
				});
			},
			// 切换到通讯录
			showadd() {
				this.pagetype = true;
			},
			// 切换到通知
			shownotice() {
				this.pagetype = false;
			}
		},
		onLoad() {
			this.getContactsList();
			this.getNoticeListfirst();
		}, // 页面滚动到底部的事件
		onReachBottom() {
			// 通讯录
			if (this.pagetype) {
				// if (this.addHasNewList) {
				// 	this.addpage++;
				// 	this.getContactsList();
				// }
			} else {
				if (this.noticeHasNewList) {
					this.noticepage++;
					this.getNoticeList();
				}
			}
		}
	};
</script>

<style>
	.icon-hongdiannot {
		position: absolute;
		right: 201upx;
		top: 20upx;
	}

	.icon-hongdian {
		/* z-index: 1; */
		position: absolute;
		left: 90upx;
	}

	.bottomBlankSpace {
		width: 100%;
		height: 108upx;
	}

	.bottomInfo {
		width: 100%;
		height: 150upx;
		font-size: 24upx;
		text-align: center;
	}

	.communication {
		position: absolute;
		height: 119upx;
		width: 100%;
		background: #f2f2f2;
	}

	image {
		width: 74upx;
		height: 74upx;
		border-radius: 50%;
		position: relative;
		left: 28upx;
	}

	.sysimg {
		position: relative;
		left: -48upx;
		top: -2upx;
	}

	.nickname {
		font-size: 28upx;
		color: #000000;
		line-height: 38upx;
		font-weight: bold;
		position: absolute;
		left: 120upx;
	}

	.nickname span {
		font-weight: normal;
	}

	.message {
		position: absolute;
		left: 120upx;
		top: 55upx;
		font-size: 24upx;
		color: #858585;
		line-height: 38upx;
		max-width: 552upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.common {
		position: absolute;
		width: 100%;
		/* top: 131upx; */
		top: 119upx;
		font-size: 0;
	}

	.showaddlist {
		position: relative;
		display: flex;
		width: 100%;
		padding-top: 19upx;
		padding-bottom: 20upx;
		font-size: 0;
		height: auto;
		overflow: auto;
	}

	.showaddlist:after {
		content: '';
		position: absolute;
		left: 120upx;
		bottom: 0;
		height: 1px;
		width: 630upx;
		background-color: #d9d9d9;
	}

	.leftbtn {
		position: absolute;
		left: 201upx;
		height: 62upx;
		width: 178upx;
		top: 29upx;
		border-radius: 11upx 0 0 11upx;
		font-size: 24upx;
		background: #000000;
		color: #ffffff;
	}

	.leftbtn:after {
		border: 1upx solid #979797;
		border-right: none;
	}

	.leftbtn2 {
		position: absolute;
		left: 201upx;
		height: 62upx;
		width: 178upx;
		top: 29upx;
		border-radius: 11upx 0 0 11upx;
		font-size: 24upx;
		background: #f2f2f2;
		border: 1upx solid #979797;
		color: #000000;
	}

	.leftbtn2:after {
		border: none;
	}

	.rightbtn {
		position: absolute;
		right: 201upx;
		top: 29upx;
		width: 178upx;
		height: 62upx;
		border-radius: 0 11upx 11upx 0;
		font-size: 24upx;
		background: #f2f2f2;
		border: 1upx solid #979797;
		border-left: none;
		color: #000000;
	}

	.rightbtn:after {
		border: none;
	}

	.rightbtn2 {
		position: absolute;
		right: 201upx;
		top: 29upx;
		width: 178upx;
		height: 62upx;
		border-radius: 0 11upx 11upx 0;
		font-size: 24upx;

		background: #000000;
		color: #ffffff;
	}

	.rightbtn2:after {
		border: none;
	}
</style>
