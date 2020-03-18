<template>
	<view>
		<view class="kissmyass">
			<view class="rnmmmmmm" style="font-size: 24upx;color: #6C6C6C;line-height: 40upx;">
				<view class="qqqqq">商品</view>
				<view class="ddddd">单价</view>
				<view class="wwwww">销量</view>
				<view class="eeeee">剩余</view>
				<view class="rrrrr">销售额</view>
			</view>
			<view class="rnmmmmmm" v-for="(anal, index) in selfGoodsInfo">
				<view class="qqqqq">{{ anal.dickname }}</view>
				<view class="ddddd">¥ {{ anal.goodprice }}</view>
				<view class="wwwww">{{ anal.suckdicktimes }}</view>
				<view class="eeeee">{{ anal.penis }}</view>
				<view class="rrrrr">{{ anal.priapus }}</view>
			</view>
			<view class="hjjjjjj" style="font-size: 28upx;">
				<view class="qqqqq">合计</view>
				<view class="rrrrr">¥ {{ ymrfksum }}</view>
			</view>
		</view>
		<view style="font-size: 28upx;height: 116upx;background-color: #F2F2F2;display: flex;align-items: center;justify-content: center;">拼团明细</view>
		<view v-if="haiscpp">
			<view class="assholelist" v-for="(item, index) in orderlist" :key="index">
				<view class="asshloeitem">
					<block v-if=" item.nickname.indexOf(ManagePading)==0">
						<image style="position: absolute;left: 0px;" :src="ManageHimg"></image>
						<view style="position: absolute;left: 67upx;" :style="ManageStyle" class="asshloename">{{ ManageName }}</view>
					</block>
					<block v-else>
						<image style="position: absolute;left: 0px;" :src="item.headimgurl"></image>
						<view style="position: absolute;left: 67upx;" class="asshloename">{{ item.nickname }}</view>
					</block>
					<view style="position: absolute;right: 66upx;">合计:￥{{ item.order_amount }}</view>
					<view v-if="open[index]" style="transform:rotate(180deg);font-size: 60upx;opacity: 0.43;position: absolute;right: 0upx;"
					 @click="showasslist(index)">
						<ailin-icon iconId="#icon-down"></ailin-icon>
					</view>
					<view v-else style="font-size: 60upx;opacity: 0.43;position: absolute;right: 0upx;" @click="showasslist(index)">
						<ailin-icon iconId="#icon-down"></ailin-icon>
					</view>
				</view>
				<view v-if="open[index]" style="left: 43upx;width: 648upx;border-bottom: 1px solid #d0d0d0;position: relative;"></view>
				<view v-if="open[index]" class="asshloeinfo">
					<view class="rnmmmmmm" style="font-size: 24upx;color: #6C6C6C;line-height: 40upx;">
						<view class="qqqqq">商品</view>
						<view class="wwwww">单价</view>
						<view class="eeeee">数量</view>
						<view class="rrrrr">销售额</view>
					</view>
					<view v-for="(gitem, gindex) in item.goods">
						<view v-if="gindex + 1 == item.goods.length" class="nrnmmmmmm">
							<view class="qqqqq">{{ gitem.goods_name }}</view>
							<view class="wwwww">￥{{ gitem.goods_price }}</view>
							<view class="eeeee">{{ gitem.goods_number }}</view>
							<view class="rrrrr">{{ asshole(gitem.goods_price,gitem.goods_number) }}</view>
						</view>
						<view v-else class="rnmmmmmm">
							<view class="qqqqq">{{ gitem.goods_name }}</view>
							<view class="wwwww">￥{{ gitem.goods_price }}</view>
							<view class="eeeee">{{ gitem.goods_number }}</view>
							<view class="rrrrr">{{ asshole(gitem.goods_price,gitem.goods_number) }}</view>
						</view>
					</view>
				</view>
				<view v-if="open[index]" class="cocker">
					<view class="rnmmmmmm">
						<view style="width: 140upx;">收货人</view>
						<view style="width: 508upx;">{{ item.consignee }}</view>
					</view>
					<view class="rnmmmmmm">
						<view style="width: 140upx;">联系电话</view>
						<view style="width: 508upx;">{{ item.mobile }}</view>
					</view>
					<view class="rnmmmmmm">
						<view style="width: 140upx;">详细地址</view>
						<view style="width: 508upx;">{{ item.address }}</view>
					</view>
					<view class="nrnmmmmmm">
						<view style="width: 140upx;">留言</view>
						<view style="width: 508upx;">{{ item.message }}</view>
					</view>
				</view>
				<view style="background: #F2F2F2;height: 14upx;border-top: 1px solid #F2F2F2;"></view>
			</view>
		</view>
		<view style="text-align: center;font-size: 50upx;padding-top: 100upx;background-color: #f2f2f2;" v-else>暂无订单</view>
		<view class="bottomInfo"><text>—— 已经到底了 ——</text></view>
	</view>
</template>

<script>
	import Pack from '../../../api/info/pack';
	export default {
		data() {
			return {
				haiscpp: false,
				open: [],
				orderlist: [],
				selfGoodsInfo: [],
				ymrfksum: undefined
			};
		},
		methods: {
			showasslist(iii) {
				if (this.open[iii]) {
					this.$set(this.open, iii, false);
				} else {
					this.$set(this.open, iii, true);
				}
			},
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
			},
			ohCock(dick) {
				// egg.dickname = '商品';
				// egg.suckdicktimes = '销量';
				// egg.penis = '剩余';
				// egg.priapus = '销售额';
				let wick = dick.length;
				for (let wiener = 0; wiener < wick; wiener++) {
					let egg = {};
					egg.dickname = dick[wiener].goods_name;
					egg.suckdicktimes = Number(dick[wiener].goods_number) - dick[wiener].remaining_number;
					egg.penis = dick[wiener].remaining_number;
					egg.priapus = this.asshole(Number(dick[wiener].goods_price), egg.suckdicktimes);
					egg.goodprice = dick[wiener].goods_price;
					this.selfGoodsInfo.push(egg);
				}
			},
			asshole(pee, eff) {
				let dingy = parseInt(pee * 100, 10) * parseInt(eff * 100, 10);
				let biiii = '￥' + String(dingy / 10000);
				return biiii;
			}
		},
		onLoad(params) {
			// 获取该记录的详细情况
			this.content_id = params.id;
			// 获取团购参与详情列表
			Pack.getOrderList(this.content_id).then(res => {
				this.orderlist = res.data.data.list;
				if (res.data.data.list.length) {
					this.haiscpp = true;
				}
				for (let i = 0; i < res.data.data.list.length; i++) {
					this.open.push(false);
				}
			});
			Pack.getSelfGoodsInfo(this.content_id).then(res => {
				this.ohCock(res.data.data.list);
				this.ymrfksum = res.data.data.order_amount;
			});
			uni.setNavigationBarTitle({
				title: '销售统计'
			});
		}
	};
</script>

<style>
	.cocker {
		opacity: 0.5;
		background-color: #f2f2f2;
	}

	.assholelist {
		border-top: 1px solid #d0d0d0;
	}

	.asshloename {
		width: 300upx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.asshloeitem {
		font-size: 28upx;
		color: #000000;
		line-height: 38upx;
		position: relative;
		align-items: center;
		left: 43upx;
		width: 648upx;
		display: flex;
		color: #000000;
		height: 132upx;
		/* border-bottom: 1px solid #d0d0d0; */
	}

	.asshloeinfo {
		display: flex;
		flex-direction: column;
		width: 750upx;
		background: #ffffff;
		/* border-bottom: 1px solid #d0d0d0; */
	}

	.hjjjjjj {
		position: relative;
		align-items: center;
		left: 43upx;
		height: 98upx;
		width: 648upx;
		display: flex;
		font-size: 24upx;
		color: #000000;
	}

	.rrrrr {
		position: absolute;
		right: 0upx;
	}

	.eeeee {
		position: absolute;
		right: 110upx;
	}

	.wwwww {
		position: absolute;
		right: 200upx;
	}

	.qqqqq {}

	.ddddd {
		position: absolute;
		right: 300upx;
	}

	.nrnmmmmmm {
		position: relative;
		align-items: center;
		left: 43upx;
		height: 98upx;
		width: 648upx;
		display: flex;
		font-size: 24upx;
		color: #000000;
	}

	.rnmmmmmm {
		position: relative;
		align-items: center;
		left: 43upx;
		height: 98upx;
		width: 648upx;
		display: flex;
		font-size: 24upx;
		color: #000000;
		border-bottom: 1px solid #d9d9d9;
	}

	.page {
		background-color: #f2f2f2;
	}

	.kissmyass {
		display: flex;
		flex-direction: column;
		width: 750upx;
		background: #ffffff;
		border-bottom: 1px solid #d0d0d0;
	}

	.item-sssshuowu {
		margin-left: 30upx;
		width: 650upx;
		font-size: 30upx;
		padding-left: 30upx;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 10upx;
		border-bottom: 1px solid #d0d0d0;
	}

	/* 货物列表 */
	.item-huowu {
		margin-left: 100upx;
		width: 500upx;
		font-size: 30upx;
		padding-left: 30upx;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 10upx;
	}

	.addandmess {
		padding-left: 50upx;
		padding-top: 20upx;
		padding-bottom: 20upx;
		font-size: 30upx;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	/* 商品名称 */
	.item-name {
		width: 500upx;
		font-size: 28upx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 商品价格 */
	.item-danjian {
		width: 200upx;
		font-size: 28upx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 商品总数 */
	.item-sum {
		font-size: 28upx;
		width: 150upx;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
	}

	/* 剩余guige */
	.item-guige {
		font-size: 28upx;
		width: 150upx;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
	}

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
		/* background-color: #f2f2f2; */
	}

	.showaddlist {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		padding-top: 19upx;
		padding-bottom: 20upx;
		font-size: 0;
		/* height: auto; */
		/* overflow: hidden; */
		border-bottom: 1px solid #d0d0d0;
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
		width: 54upx;
		height: 54upx;
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
		top: 15upx;
		left: 120upx;
	}

	.remark {
		position: relative;
		font-size: 28upx;
		top: 36upx;
		bottom: 0;
		left: 347upx;
		width: 80%;
		word-wrap: break-word;
		padding-bottom: 25upx;
	}
</style>
