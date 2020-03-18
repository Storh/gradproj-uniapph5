<template>
	<view>
		<view class="communication">
			<block v-if="pagetype">
				<button class="leftbtn">团购管理</button>
				<button class="rightbtn" @click="showPart">我参与的</button>
			</block>
			<block v-else>
				<button class="leftbtn2" @click="showLaunch">团购管理</button>
				<button class="rightbtn2">我参与的</button>
			</block>
		</view>
		<view class="pack-list">
			<block v-if="pagetype">
				<view class="pack-item" v-for="(item, index) in pushList" :key="index">
					<!-- <view class="pack-text" @click="choose(item)">
						<view class="item-title">{{ item.title }}</view>
						<view class="unit">
							<text>商品</text>
							<view class="unit_2">
								<text style="width: 170upx;">销量</text>
								<text style="width: 160upx;">剩余</text>
								<text style="width: 200upx;">销售额</text>
							</view>
						</view>
						<view class="item-huowu" v-for="good in item.goods">
							<view class="item-name">{{ good.goods_name }}</view>
							<view class="unit_1" style="width: 280upx;">
								<view class="item-sum">{{ good.goods_number }}</view>
								<view class="item-shengyu">{{ good.remaining_number }}</view>
								<view class="item-danjian">￥{{ xiaoshoue(good) / 10000 }}</view>
							</view>
						</view>
						
						<view class="total">
							<text>合计</text>
							<text>￥{{ total(item.goods) / 10000 }}</text>
						</view>
					</view>
					<view class="message" style="display: flex;	font-size: 30upx;">
						<block v-if="item.is_end"><text class="item-type-now" style="color: #797979;">已结束</text></block>
						<block v-else><text class="item-type-now" style="color: #0CB957;">进行中</text></block>
						<view class="item-touser" @click="gof2korderself(item.content_id)">查看销售明细 ></view>
					</view> -->
					<view class="pack-text">
						<view @click="choose(item)">
							<view class="acttype">
								<ailin-icon class="actincontype" iconId="#icon-pintuan"></ailin-icon>
								<text>团购</text>
							</view>
							<view style="width: 100%; height: 178upx;" class="content">
								<text class="title">{{ item.title }}</text>
								<text class="time">{{ item.add_time.slice(0, 16) }}</text>
							</view>
							<view class="message" style="display: flex;	font-size: 30upx;">
								<block v-if="item.is_end"><text class="item-type-now" style="color: #797979;">已结束</text></block>
								<block v-else><text class="item-type-now" style="color: #0CB957;">进行中</text></block>
							</view>
						</view>
						<view class="item-touser" @click="gof2korderself(item.content_id)">查看销售明细 ></view>
					</view>
				</view>
				<view v-if="NonPushDate" class="bottomInfo"><text>—— 已经到底了 ——</text></view>
			</block>
			<block v-else>
				<view class="pack-item" v-for="(item, index) in registList" :key="index">
					<!-- <view class="pack-text">
						<view class="item-title">{{ item.title }}</view>
						<view class="all">
							<text>合计：</text>
							<text>￥{{ item.order_amount }}</text>
						    <text style="color:#DD8B20;">￥{{ item.order_amount }}</text> -->
					<!-- </view>
						<view class="unit" style="padding-top: 30upx;">
							<text>商品</text>
							<view class="unit_2">
								<text style="width: 225upx;">单价</text>
								<text style="width: 100upx;">数量</text>
							</view>
						</view>
						<view class="item-buy" v-for="good in item.goods">
							<view class="item-buy-name">{{ good.goods_name }}</view>
							<view class="unit_1">
								<view class="item-buy-danjia">￥{{ good.goods_price }}</view>
								<view class="item-buy-has">{{ good.buy_number }}</view>
							</view>
						</view> -->
					<view class="pack-text">
						<view style="width: 100%; height: 178upx;" @click="choose(item)">
							<view class="acttype">
								<ailin-icon class="actincontype" iconId="#icon-pintuan"></ailin-icon>
								<text>团购</text>
							</view>
							<view style="width: 100%; height: 178upx;" class="content">
								<text class="title">{{ item.title }}</text>
								<text class="time">{{ item.add_time.slice(0, 16) }}</text>
							</view>
							<view class="message" style="display: flex;	font-size: 30upx;">
								<block v-if="item.is_end"><text class="item-type-now" style="color: #797979;">已结束</text></block>
								<block v-else><text class="item-type-now" style="color: #0CB957;">进行中</text></block>
							</view>
						</view>
						<!-- <view class="item-touser" @click="gof2korderself(item.content_id)">查看销售明细 ></view> -->
					</view>
				</view>
				<view v-if="NonRegistDate" class="bottomInfo"><text>—— 已经到底了 ——</text></view>
			</block>
		</view>
	</view>
</template>

<script>
import Pack from '../../../api/info/pack';
export default {
	data() {
		return {
			pushList: [],
			registList: [],
			// 无数据
			NonPushDate: false,
			NonRegistDate: false,
			pagetype: true,
			mePushPagesNum: 1,
			meRegistPagesNum: 1
		};
	},
	// 下拉刷新
	onPullDownRefresh() {
		var me = this;
		setTimeout(function() {
			uni.stopPullDownRefresh();
			// 初始化数据
			if (me.pagetype) {
				// 发起视图
				me.pushList = [];
				me.NonPushDate = false;
				me.mePushPagesNum = 1;
				me.getLauList();
			} else {
				me.registList = [];
				me.NonRegistDate = false;
				me.meRegistPagesNum = 1;
				me.getPartList();
			}
		}, 1000);
	},
	// 页面滚动到底部的事件
	onReachBottom() {
		var me = this;
		if (me.pagetype) {
			// 发起视图
			if (!me.NonPushDate) {
				me.mePushPagesNum++;
				this.getLauList();
			}
		} else {
			if (!me.NonRegistDate) {
				me.meRegistPagesNum++;
				this.getPartList();
			}
		}
	},
	methods: {
		total(list) {
			let num = list.length;
			let sum = 0;
			for (let i = 0; i < num; i++) {
				sum = sum + this.xiaoshoue(list[i]);
			}
			return sum;
		},
		xiaoshoue(item) {
			let danjia = Number(item.goods_price);
			let sum = Number(item.goods_number) - item.remaining_number;
			let dingy = parseInt(danjia * 100, 10) * parseInt(sum * 100, 10);
			// let biiii =  String(dingy / 10000);
			return dingy;
		},
		sumGoodsNum(goodsList) {
			let sum = 0;
			let long = goodsList.length;
			for (let i = 0; i < long; i++) {
				sum = sum + Number(goodsList[i].buy_number);
			}
			return sum;
		},
		// 选中
		choose(item) {
			//  返回选中对象信息
			uni.navigateTo({
				url: '/pages/content/content?contentId=' + item.content_id + '&typeId=5'
			});
		},
		gof2korderself(id) {
			uni.navigateTo({
				url: '/pages/content/pack/order?id=' + id
			});
		},
		showLaunch() {
			this.pagetype = true;
		},
		showPart() {
			this.pagetype = false;
		},
		// 获取我发起的
		getLauList() {
			var me = this;
			Pack.userPushPackList(me.mePushPagesNum, 5).then(res => {
				if (res.data.data.list.length) {
					this.pushList = this.pushList.concat(res.data.data.list);
					if (res.data.data.list.length < 5) {
						this.NonPushDate = true;
					}
				} else {
					this.NonPushDate = true;
				}
			});
		},
		// 获取我参与的
		getPartList() {
			var me = this;
			Pack.userRegistPackList(me.mePushPagesNum, 5).then(res => {
				if (res.data.data.list.length) {
					this.registList = this.registList.concat(res.data.data.list);
					if (res.data.data.list.length < 5) {
						this.NonRegistDate = true;
					}
				} else {
					this.NonRegistDate = true;
				}
			});
		}
	},
	onLoad(parme) {
		uni.setNavigationBarTitle({
			title: '团购'
		});
		this.getLauList();
		this.getPartList();
	}
};
</script>

<style>
page {
	background: #f2f2f2;
}
.item-buy {
	display: flex;
	height: 103upx;
	align-items: center;
	border-top: 1px solid #d9d9d9;
}
.item-buy-name {
	width: 175upx;
	overflow: hidden;
	font-size: 24upx;
	color: #000000;
	text-overflow: ellipsis;
}
.item-buy-danjia {
	width: 225upx;
	overflow: hidden;
	font-size: 24upx;
	color: #6c6c6c;
	text-overflow: ellipsis;
}
.item-buy-has {
	width: 100upx;
	overflow: hidden;
	font-size: 32upx;
	color: #000000;
	text-overflow: ellipsis;
}
.item-buy-sum {
	position: relative;
	font-size: 28upx;
	left: 50upx;
}
.item-buy-money {
	/* position: relative; */
	font-size: 28upx;
	left: 100upx;
}
.bottomInfoline {
	padding-top: 20upx;
	width: 100%;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-bottom-color: #858585;
}
.bottomInfo {
	padding-top: 10upx;
	width: 100%;
	/* height: 150upx; */
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
	/* position: absolute; */
	/* top: 0; */
	/* flex-basis: auto; */
	width: 120upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.incontype {
	font-size: 60upx;
	/* position: absolute; */
	/* top: 23upx; */
	/* left: 36upx; */
}

.type-text {
	/* font-size: 24upx; */
	font-size: 12px;
	color: #000000;
	/* text-align: center; */
	/* position: absolute; */
	/* top: 110upx; */
	/* left: 42upx; */
	opacity: 0.6;
}
/* 我发起的团购列表 */
.pack-list {
	position: relative;
	top: 0;
}
/* 单个团购链接 */
.pack-item {
	/* background-color: #ffffff;
	padding-top: 33upx;
	border-bottom: 1px solid #e3e3e3;
	width: 654upx;
	padding-left: 48upx;
	padding-right: 48upx;
	margin-bottom: 31upx; */
	font-size: 0;
	position: relative;
	left: 0;
	width: 100%;
	height: 178upx;
	background: #ffffff;
	margin-bottom: 14upx;
	box-sizing: border-box;
	border: 1px solid #d0d0d0;
	border-left: none;
	border-right: none;
}
/* 团购链接中的文字 */
.pack-text {
	font-size: 30upx;
}
/* 团购状态 */
.item-type {
	position: absolute;
	left: 30upx;
}
/* 进行中 */
.item-type-now {
	position: absolute;
	/* left: 48upx; */
	right: 0;
	text-align: center;
}
/* 团购活动链接的标题 */
.item-title {
	font-size: 32upx;
	color: #000000;
	position: relative;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
	width: 100%;
	padding-bottom: 29upx;
}
/* 单位 */
/* .unit {
	position: relative;
	display: flex;
	width: 100%;
	font-size: 24upx;
	color: #6c6c6c;
	height: 40upx;
	padding-bottom: 14upx;
	justify-content: space-between;
	text-align: center;
} */
/* .unit_1 {
	display: flex;
	width: 280upx;
	justify-content: space-between;
	text-align: center;
	position: absolute;
	right: 48upx;
}
.unit_2 {
	display: flex;
	width: 280upx;
	justify-content: space-between;
	text-align: center;
	position: absolute;
	right: 0;
} */
/* 货物列表 */
/* .item-huowu {
	height: 95upx;
	align-items: center;
	font-size: 24upx;
	color: #000000;
	display: flex;
	padding-bottom: 10upx;
	font-size: 24upx;
	border-top: 1px solid #e3e3e3;
} */
/* 商品名称 */
/* .item-name {
	width: 312upx;
	overflow: hidden;
	text-overflow: ellipsis;
} */
/* 商品价格 */
/* .item-danjian {
	width: 200upx;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
} */
/* 商品总数 */
/* .item-sum {
	width: 170upx;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
} */
/* 商品规格 */

/* 剩余数量 */
/* .item-shengyu {
	width: 160upx;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
} */
/* 截止日期 */
/* .item-time {
	position: relative;
	left: 80upx;
	width: 300upx;
	font-size: 28upx;
	padding-bottom: 10upx;
	white-space: nowrap;
} */
/* .total {
	width: 100%;
	height: 113upx;
	border-top: 1px solid #e3e3e3;
	display: flex;
	align-items: center;
	font-size: 28upx;
	color: #000000;
	justify-content: space-between;
} */
.all {
	width: 100%;
	position: relative;
	font-size: 28upx;
	color: #000000;
	text-align: right;
	border-bottom: 1px solid #9e9e9e;
	padding-bottom: 39upx;
}
/* 跳转文字 */
.item-touser {
	position: absolute;
	font-size: 24upx;
	color: #000000;
	top: 118upx;
	right: 30upx;
}
.message {
	background-color: #ffffff;
	position: absolute;
	left: 0upx;
	width: 100upx;
	height: 40upx;
	left: 620upx;
	top: 29upx;
}
.acttype {
	position: absolute;
	top: 0;
	width: 131upx;
}

.actincontype {
	font-size: 60upx;
	position: absolute;
	top: 23upx;
	left: 36upx;
}

.acttype text {
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
	width: 400upx;
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
</style>
