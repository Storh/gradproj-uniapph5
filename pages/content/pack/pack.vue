<template>
	<view>
		<view class="black" style="background-color:#f0f0f0; height: 15upx;"></view>
		<view class="item-huowu" v-for="(item, index) in goodsList" :key="index">
			<view class="black" style="height: 30upx; "></view>
			<view class="item-name">{{ item.goods_name }}</view>
			<view class="item-danjian">
				<text style="color: #6C6C6C;">单价:</text>
				￥{{ item.goods_price }}
			</view>
			<view class="item-guige">({{ item.goods_specs }})</view>
			<view class="item-sum">
				<text style="color: #6C6C6C;">剩余:</text>
				{{ item.remaining_number }}
			</view>
			<view class="jianhao" @click="jianhao(index)"><ailin-icon iconId="#icon-jianhao"></ailin-icon></view>
			<view class="item-buynum">{{ buygoods[index].buy_number }}</view>
			<view class="jiahao" @click="jiahao(index)"><ailin-icon iconId="#icon-jiahao"></ailin-icon></view>
			<view class="black"></view>
		</view>
		<view class="black" style="background-color:#f0f0f0; height: 15upx;"></view>

		<view>
			<view class="shangping-heji">
				<view style="width: 350upx;">商品合计</view>
				<view style="width: 250upx; text-align: right;">￥{{ summmmm / 100 }}</view>
				<view class="black" style="height: 15upx;"></view>
			</view>
<!-- 			<view class="shangping-heji">
				<view style="width: 350upx;">快递费用</view>
				<view style="width: 250upx; text-align: right;">0</view>
				<view class="black" style="height: 15upx;"></view>
			</view> -->
			<!-- <view class="shangping-heji" style="border-bottom: 0px;">
				<view style="width: 350upx;">费用合计</view>
				<view style="width: 250upx; text-align: right;">￥{{ summmmm / 100 }}</view>
				<view class="black" style="height: 15upx;"></view>
			</view> -->
			<view class="black" style="background-color:#f0f0f0; height: 50upx;"></view>
		</view>
		<view class="black" style="background-color:#f0f0f0; height: 50upx; font-size: 30upx; text-align: center;">填写收货信息</view>
		<view style="display: flex;flex-wrap: wrap;align-items: center;">
			<textarea v-model="data.consignee" placeholder="收货人" class="shouhuoadd"></textarea>
			<!-- <textarea v-model="data.mobile" placeholder="联系电话" class="shouhuoadd"></textarea> -->
			<input type="number" v-model="data.mobile" placeholder="联系电话" class="shouhuoaddd" />
			<textarea v-model="data.address" placeholder="详细地址" class="shouhuoadd"></textarea>
			<textarea v-model="data.message" placeholder="留言" class="shouhuoadd" style="height: 150upx;"></textarea>
		</view>

		<button style="background-color: #3FB583; width: 100%;color: #FFFFFF;border-radius:0upx" @click="subbbbbbb">立即下单(合计￥{{ summmmm / 100 }})</button>
	</view>
</template>

<script>
import Pack from '../../../api/info/pack';
export default {
	data() {
		return {
			goodsList: [],
			buygoods: [],
			summmmm: 0,
			data: {
				content_id: undefined,
				consignee: '',
				mobile: '',
				address: '',
				message: '',
				goods: []
			}
		};
	},
	methods: {
		subbbbbbb() {
			var me = this;
			if (!me.summmmm) {
				me.failWarn('请先选择商品！');
			} else if (me.data.consignee.length < 1) {
				me.failWarn('收货人必填！');
			} else if (me.data.mobile.length < 1) {
				me.failWarn('联系电话必填！');
			} else if (me.data.mobile.length != 11) {
				me.failWarn('联系电话错误！');
			} else if (me.data.address.length < 1) {
				me.failWarn('收货地址必填！');
			} else {
				let num = me.buygoods.length;
				me.data.goods=[]
				for (let i = 0; i < num; i++) {
					if (me.buygoods[i].buy_number > 0) {
						me.data.goods.push(me.buygoods[i]);
					}
				}
				me.pushaaaaaa();
			}
		},
		pushaaaaaa() {
			Pack.addRegist(this.data).then(res => {
				uni.hideLoading();
				if (res.data.data.regist_id) {
					uni.showModal({
						title: '成功',
						content: '下单成功',
						confirmColor: '#3CC51F',
						showCancel: false,
						success: function() {
							uni.navigateBack();
						}
					});
				}
			});
		},
		failWarn(mesg) {
			uni.showToast({
				title: mesg,
				icon: 'none',
				duration: 3000
			});
		},
		jiahao(ind) {
			if (this.buygoods[ind].buy_number < this.goodsList[ind].remaining_number) {
				this.buygoods[ind].buy_number++;
				let jsssb = parseInt(Number(this.goodsList[ind].goods_price) * 100, 10);
				this.summmmm = this.summmmm + jsssb;
			} else {
				this.failWarn('超过限量');
			}
		},
		jianhao(ind) {
			if (this.buygoods[ind].buy_number != 0) {
				this.buygoods[ind].buy_number--;
				let jsssb = parseInt(Number(this.goodsList[ind].goods_price) * 100, 10);
				this.summmmm = this.summmmm - jsssb;
			}
		},
		buylist() {
			let long = this.goodsList.length;
			for (let i = 0; i < long; i++) {
				let item = {};
				item.goods_id = this.goodsList[i].goods_id;
				item.goods_name = this.goodsList[i].goods_name;
				item.goods_specs = this.goodsList[i].goods_specs;
				item.buy_number = 0;
				this.buygoods.push(item);
			}
		}
	},
	onLoad(par) {
		this.data.content_id = par.id;
		Pack.getGoodsList(par.id).then(res => {
			this.goodsList = res.data.data.list;
			this.buylist();
		});
	}
};
</script>

<style>
.shouhuoadd {
	margin-top: 27upx;
	font-size: 30upx;
	height: 70upx;
	padding-left: 40upx;
	display: flex;
	width: 640upx;
	left: 30upx;
	position: relative;
	flex-wrap: wrap;
	border-bottom: 1px solid #e3e3e3;
}
.shouhuoaddd {
	/* margin-top: 13.5upx; */
	padding: 13.5upx;
	font-size: 30upx;
	height: 70upx;
	padding-left: 40upx;
	display: flex;
	width: 640upx;
	left: 30upx;
	position: relative;
	flex-wrap: wrap;
	border-bottom: 1px solid #e3e3e3;
}

.liuyan {
	margin-top: 20upx;
	padding-top: 10upx;
	border: 1upx solid;
	border-radius: 10upx;
	height: 150upx;
	width: 500upx;
	font-size: 28upx;
}

.jianhao {
	font-size: 38upx;
}

.jiahao {
	font-size: 38upx;
}

.maxttttt {
	left: 34upx;
	position: relative;
	font-size: 34upxupx;
	padding-top: 28upx;
	padding-bottom: 10upx;
	color: #000000;
}

/* 货物列表 */
.item-huowu {
	font-size: 28upx;
	padding-left: 20upx;
	display: flex;
	width: 660upx;
	left: 30upx;
	position: relative;
	flex-wrap: wrap;
	padding-bottom: 10upx;
	border-bottom: 1px solid #e3e3e3;
}

/* 商品名称 */
.item-name {
	/* padding-right: 20%; */
	width: 100%;
	overflow: hidden;
	text-align: center;
	line-height: 40upx;
	text-overflow: ellipsis;
}

/* 商品价格 */
.item-danjian {
	width: 200upx;
	/* padding-right: 55upx; */
	overflow: hidden;
	line-height: 56upx;
	text-overflow: ellipsis;
}

/* 商品剩余 */
.item-sum {
	width: 150upx;
	overflow: hidden;
	line-height: 56upx;
	text-overflow: ellipsis;
}

/* 规格 */
.item-guige {
	padding-right: 55upx;
	width: 150upx;
	overflow: hidden;
	line-height: 56upx;
	color: #6c6c6c;
	text-overflow: ellipsis;
}

.item-buynum {
	width: 30upx;
	text-align: center;
	line-height: 56upx;
}

.black {
	width: 100%;
	height: 10upx;
}

.shangping-heji {
	font-size: 30upx;
	padding-left: 40upx;
	padding-top: 27upx;
	padding-bottom: 27upx;
	display: flex;
	width: 640upx;
	left: 30upx;
	position: relative;
	flex-wrap: wrap;
	padding-bottom: 10upx;
	border-bottom: 1px solid #e3e3e3;
}
</style>
