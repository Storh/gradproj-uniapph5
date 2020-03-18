<template>
	<view>
		<view v-if="push_info_open">
			<view class="push-info-list-page"></view>
			<view class="push-info-list">
				<block v-for="item in pushInfo" :key="item.key">
					<view class="push-info-btn" :data-key="item.key" :data-title="item.name" @click="toPushPage">
						<p style="line-height:0.5em;"><br /></p>
						<ailin-icon class="push-info-icon" :iconId="item.icon"></ailin-icon>
						<!-- <p style="line-height:0.5em;"><br /></p> -->
						<text style="color: #000000;">{{ item.name }}</text>
					</view>
				</block>
			</view>
			<view class="push-info-clouse-item">
				<view class="push-info-close-item"></view>
			</view>
			<view class="push-info-clouse" @click="closePushInfo">
				<ailin-icon class="push-info-close" iconId="#icon-off"></ailin-icon>
			</view>
		</view>
		<view v-else class="tabbar">
			<view :style="textcoler[0]" class="tabbar-item" @click="toIndexPage">
				<ailin-icon class="tabbar-item-icon" :iconId="iconlist[0]"></ailin-icon>
				首页
			</view>
			<view :style="textcoler[1]" class="tabbar-item" @click="toCartPage">
				<ailin-icon class="tabbar-item-icon" :iconId="iconlist[1]"></ailin-icon>
				乐享
			</view>
			<view class="mid" @click="openPushInfo">
				<ailin-icon class="tabbar-mid-push" iconId="#icon-jiahao2fill"></ailin-icon>
				<text class="mid-text">发布</text>
			</view>
			<view :style="textcoler[2]" class="tabbar-item" @click="toContactsPage">
				<ailin-icon class="tabbar-item-icon" :iconId="iconlist[2]"></ailin-icon>
				通讯
			</view>
			<view :style="textcoler[3]" class="tabbar-item" @click="toMinePage">
				<ailin-icon class="tabbar-item-icon" :iconId="iconlist[3]"></ailin-icon>
				我的
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ailin-tab-bar',
		props: {
			// 当前页面
			add: {
				type: Number,
				default () {
					0;
				}
			}
		},
		data() {
			return {
				push_info_open: false,
				textcoler: ['', '', '', ''],
				iconlist: ['#icon-shouye-off', '#icon-lexiang-off', '#icon-tongxun-off', '#icon-wode-off'],
				openiconlist: ['#icon-shouye-on', '#icon-lexiang-on', '#icon-tongxun-on', '#icon-wode-on'],
				pushInfo: [{
						icon: '#icon-huati',
						type: 'topic/topic',
						key: 6,
						name: '话题'
					},
					{
						icon: '#icon-huzhu',
						type: 'help/help',
						key: 1,
						name: '求助'
					},
					{
						icon: '#icon-wenti',
						type: 'question/question',
						key: 2,
						name: '问答'
					},

					{
						icon: '#icon-gongxiang',
						type: 'share/share',
						key: 3,
						name: '闲置'
					},
					{
						icon: '#icon-huodong',
						type: 'active/active',
						key: 4,
						name: '活动'
					},
					{
						icon: '#icon-pintuan',
						type: 'ping/ping',
						key: 5,
						name: '团购'
					}
				]
			};
		},
		methods: {
			// 前往发表页面
			toPushPage(e) {
				var key = e.currentTarget.dataset.key;
				var title = e.currentTarget.dataset.title;
				uni.navigateTo({
					url: '../push/push?key=' + key + '&title=' + title
				});
				this.push_info_open = false;
			},
			// 发布按键按下后的展开实现
			openPushInfo() {
				this.push_info_open = true;
			},
			// 关闭发布列表
			closePushInfo() {
				this.push_info_open = false;
			},
			// 前往首页
			toIndexPage() {
				uni.switchTab({
					url: '../index/index'
				});
			},
			// 前往乐享界面
			toCartPage() {
				uni.switchTab({
					url: '../cart/cart'
				});
			},
			// 前往通讯页面
			toContactsPage() {
				uni.switchTab({
					url: '../contacts/contacts'
				});
			},
			// 前往我的页面
			toMinePage() {
				uni.switchTab({
					url: '../mine/mine'
				});
			}
		},
		created() {
			this.iconlist[this.add] = this.openiconlist[this.add];
			this.textcoler[this.add] = 'color: #0CB957;';
		}
	};
</script>

<style>
	.tabbar {
		background-color: #ededed;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 0;
		position: fixed;
		width: 100%;
		height: 108upx;
		bottom: 0;
		left: 0;
		font-size: 20upx;
		border-top: 1upx solid #d9d9d9;
	}

	.tabbar-item {
		width: 100upx;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tabbar-item-icon {
		font-size: 41upx;
	}

	.mid{
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		top: -10upx;
	}
	
	.tabbar-mid-push {
		position: relative;
		top: -15upx;
		font-size: 80upx;
		/* font-size: 68upx; */
		/* border: 2upx solid #ededed; 
		border-radius: 50%; */
		/* height: 80upx;
		width: 80upx; */
	}

	.mid-text{
		position: relative;
		font-size: 20upx;
		top: -19upx;
	}
	
	.push-info-list-page {
		background-color: #ffffff;
		z-index: 3;
		opacity: 0.95;
		height: 40%;
		width: 750rpx;
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
	}

	.push-info-list {
		z-index: 4;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		/* justify-content: space-around; */
		padding: 0;
		position: fixed;
		width: 100%;
		bottom: 160upx;
		justify-content: center;
	}

	.push-info-btn {
		width: 200upx;
		height: 122upx;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 26upx;
		color: #ffffff;
		position: relative;
		margin-top: 30upx;
	}

	text {
		position: relative;
		bottom: 0;
	}

	/* .push-info-ring {
	flex-direction: column;
	align-items: center;
	width: 106upx;
	height: 106upx;
	border-radius: 50%;
	background-color: #ffffff;
} */

	.push-info-icon {
		padding: 0;
		flex-direction: column;
		align-items: center;
		top: 40upx;
		width: 76upx;
		height: 76upx;
		/* border-radius: 50%;
		background-color: #ECF4E9; */
		font-size: 60upx;
	}


	.push-info-clouse {
		z-index: 4;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 0;
		position: fixed;
		width: 100%;
		height: 108upx;
		bottom: 0;
		left: 0;
	}

	.push-info-clouse-item {
		z-index: 4;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 0;
		position: fixed;
		width: 100%;
		height: 100upx;
		bottom: 0;
		left: 0;
	}

	.push-info-close-item {
		width: 58upx;
		height: 58upx;
		border-radius: 50%;
		background-color: #ffffff;
	}

	.push-info-close {
		font-size: 70upx;
	}
</style>
