<template>
	<view>
		<view v-if="peoplelist">
			<view class="showaddlist" v-for="(item, index) in peoplelist" @click="toUser(item)">
				<block v-if="item.nickname.indexOf(ManagePading)==0">
					<image :src="ManageHimg"></image>
					<text class="nickname" :style="ManageStyle">{{ ManageName }}</text>
				</block>
				<block v-else>
					<image :src="item.headimgurl"></image>
					<text class="nickname">{{ item.nickname }}</text>
				</block>
				<text class="remark">{{ item.remark }}</text>
			</view>
		</view>
		<view class="bottomInfo"><text>—— 已经到底了 ——</text></view>
	</view>
</template>

<script>
	import Activity from '../../api/info/activity';
	import Pack from '../../api/info/pack';
	export default {
		data() {
			return {
				peoplelist: undefined
			};
		},
		methods: {
			toUser(item) {
				const mineinfo = uni.getStorageSync('userData');
				if (item.user_id == mineinfo.user_id) {
					uni.navigateTo({
						url: '/pages/mine/minebycon'
					});
				} else {
					uni.navigateTo({
						url: '../../pages/user/user?id=' + item.user_id
					});
				}
			}
		},
		onLoad(params) {
			// 获取该记录的详细情况
			this.content_id = params.id;
			this.type = params.type;
			// 获取团购参与详情列表
			if (this.type == 4) {
				Activity.getList(this.content_id).then(res => {
					this.peoplelist = res.data.data.list;
				});
			} else if (this.type == 5) {
				Pack.getList(this.content_id).then(res => {
					this.peoplelist = res.data.data.list;
				});
			}
		}
	};
</script>

<style>
	.buttom {
		font-size: 0upx;
		height: 110upx;
		display: flex;
	}

	.bottomInfo {
		width: 100%;
		height: 80upx;
		padding-top: 80upx;
		font-size: 24upx;
		text-align: center;
	}

	.showaddlist {
		position: relative;
		display: flex;
		width: 100%;
		padding-top: 19upx;
		padding-bottom: 20upx;
		font-size: 0;
		height: auto;
		/* overflow: hidden; */
	}

	.showaddlist:after {
		content: '';
		position: absolute;
		left: 120upx;
		bottom: 0;
		height: 1upx;
		width: 630upx;
		background-color: #d9d9d9;
	}

	image {
		width: 74upx;
		height: 74upx;
		border-radius: 50%;
		position: relative;
		left: 28upx;
	}

	.nickname {
		font-size: 28upx;
		color: #000000;
		line-height: 38upx;
		font-weight: bold;
		position: absolute;
		top: 16upx;
		left: 120upx;
	}

	.remark {
		position: relative;
		font-size: 28upx;
		top: 36upx;
		bottom: 0;
		left: 47upx;
		width: 80%;
		word-wrap: break-word;
		padding-bottom: 25upx;
	}
</style>
