<template>
	<view>
		<view class="communication">
			<block v-if="pagetype">
				<button class="leftbtn">我发起的</button>
				<button class="rightbtn" @click="showPart">我参与的</button>
			</block>
			<block v-else>
				<button class="leftbtn2" @click="showLaunch">我发起的</button>
				<button class="rightbtn2">我参与的</button>
			</block>
		</view>
		<view class="block" v-for="(item, index) in infoList" :key="index">
			<view :list="list" @click="choose(item)">
				<view class="type">
					<ailin-icon class="incontype" :iconId="incontype"></ailin-icon>
					<text>{{ typename }}</text>
				</view>
				<view class="content">
					<text class="title">{{ item.title }}</text>
					<text class="time">{{ item.time }}</text>
				</view>
			</view>
		</view>
		<view v-if="NonDateList" class="bottomInfo">
			<text>—— 暂无消息 ——</text>
		</view>
	</view>
</template>

<script>
	import User from '../../api/user';
	export default {
		data() {
			return {
				// 无数据
				NonDateList: false,
				infoList: [],
				arradd: undefined,
				incontype: undefined,
				typename: undefined,
				pagetype: true,
				list: [],
				mineInfo: [{
						icon: '#icon-huati',
						type: 6,
						name: '话题'
					},
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
					}
				]
			};
		},
		methods: {
			// 选中
			choose(item) {
				//  返回选中对象信息
				uni.navigateTo({
					url: '../content/content?contentId=' + item.content_id+ '&typeId=' + item.type_id
				});
			},
			showLaunch() {
				this.pagetype = true;
				this.infoList = [];
				this.getLauList();
			},
			showPart() {
				this.pagetype = false;
				this.infoList = [];
				this.getPartList();
			},
			// 获取我发起的
			getLauList() {
				var me = this;
				User.getSelfContentList(undefined, me.mineInfo[me.arradd].type).then(res => {
					if (res.data.data.list.length) {
						this.timeComp(res.data.data.list);
						this.NonDateList = false
					} else {
						this.NonDateList = true
					}
				});
			},
			getPartList() {
				var me = this;
				User.getRegistContentListBy(me.mineInfo[me.arradd].type).then(res => {
					if (res.data.data.list.length) {
						this.timeComp(res.data.data.list);
						this.NonDateList = false
					} else {
						this.NonDateList = true
					}
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
			this.arradd = parme.type;
			this.incontype = this.mineInfo[this.arradd].icon;
			this.typename = this.mineInfo[this.arradd].name;
			uni.setNavigationBarTitle({
				title: this.mineInfo[this.arradd].name
			});
			this.getLauList();
		}
	};
</script>

<style>
	page {
		background: #f2f2f2;
	}

	.bottomInfo {
		width: 100%;
		height: 150upx;
		font-size: 24upx;
		text-align: center;
		color: #858585;
	}

	.communication {
		position: relative;
		height: 119upx;
		width: 100%;
		background: #f2f2f2;
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
		border-left: none;
		color: #000000;
	}

	.leftbtn2:after {
		border: 1upx solid #979797;
		border-right: none;
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
		height: auto;
		top: 29upx;
		left: 131upx;
		word-wrap: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
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
