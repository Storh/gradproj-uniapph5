<template>
	<view>
		<!-- 取消和发布按键区域 -->
		<view class="buttom">
			<button @click="backView" class="cancel">返回</button>
			<button class="push" @click="pushContent(data)">发布</button>
		</view>
		<!-- 内容填写位置 -->
		<view class="details">
			<input class="title" v-model="data.title" placeholder="添加标题…" @blur="markPush" />
			<textarea maxlength="-1" class="content" v-model="data.content" placeholder="添加发布的内容…" @blur="markPush" />
			<!-- 发布内容外部链接 -->
			<input class="link_external_url" v-model="data.link_external_url" placeholder="可添加链接" @blur="markPush" />
			<input class="link_external_name" v-model="data.link_external_name" placeholder="可命名链接" @blur="markPush" />
		</view>
		<view class="pictures">
			<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
			<block v-for="(item, index) in data.images" :key="index">
				<view class="pictures-item">
					<image mode="aspectFill" :src="item.src" @tap="imageCropper(index)"></image>
					<view :data-index="index" @tap="delImg"><ailin-icon class="delimg" iconId="#icon-fabu-off"></ailin-icon></view>
				</view>
			</block>
			<!-- 灰色方框+加号 -->
			<view v-if="addImgBtn" class="pictures-item" @tap="chooseImg">
				<view class="plusback"><ailin-icon class="plus" iconId="#icon-plus"></ailin-icon></view>
			</view>
		</view>
		<view class="add">
			<!-- 这里是分割线 -->
			<ailin-icon class="icon-biaoqian" iconId="#icon-biaoqian"></ailin-icon>
			<view class="add_label">
				<text class="label">添加标签，让更多人看到</text>
				<view @tap="toKeyWord">
					<text class="label_text">{{ data.keyword }}</text>
					<ailin-icon class="arrowright_1" iconId="#icon-right-copy"></ailin-icon>
				</view>
			</view>
			<!-- 这里是分割线 -->
			<ailin-icon class="icon-wode-off" iconId="#icon-wode-off"></ailin-icon>
			<view class="able_view">
				<text class="able">谁可以看</text>
				<view @tap="changeViewType">
					<text class="able_text">{{ viewtypetext[data.show_type - 1] }}</text>
					<ailin-icon class="arrowright_2" iconId="#icon-zhuan"></ailin-icon>
				</view>
			</view>
			<!-- 这里是分割线 -->
			<ailin-icon class="icon-fabu-deadline" iconId="#icon-fabu-deadline"></ailin-icon>
			<view class="deadline">
				<text class="deadline_date">截止日期</text>
				<yu-datetime-picker @confirm="onConfirm" :endYear="getYear()" ref="dateTime" :isAll="true" :current="true"></yu-datetime-picker>
				<text @tap="toggleTab()" class="date_input">{{ data.closing_date }}</text>
			</view>
			<!-- 这里是分割线 -->
			<ailin-icon class="icon-fabu-date" iconId="#icon-gouwuche"></ailin-icon>
			<view class="add-huowu">
				<view class="addtop">
					<view class="maxttttt">商品详情</view>
					<view @click="addShopItem"><ailin-icon class="icon-shangpin-tianjia" iconId="#icon-jiahao"></ailin-icon></view>
				</view>
				<view class="item-huowu" v-for="(item, index) in data.goods" :key="index">
					<view class="item-info">
						<view @click="editGoodsList(index)" class="item-name">{{ item.goods_name }}</view>
						<view class="price">
							<view @click="editGoodsList(index)" class="item-danjian">单价：￥{{ item.goods_price }}，</view>
							<view @click="editGoodsList(index)" class="item-guige">规格：{{ item.goods_specs }}，</view>
							<view @click="editGoodsList(index)" class="item-sum">总量：{{ item.goods_number }}</view>
						</view>
					</view>
					<view @click="f2kumt(index)"><ailin-icon iconId="#icon-jianhao" style="	font-size: 38upx;left: 18upx;position: relative;"></ailin-icon></view>
				</view>
			</view>
		</view>
		<view v-if="addgoods" class="additeninfo">
			<view class="textinfo">
				<text class="addgood">添加商品</text>
				<view class="goodbar">
					<view class="goodname">商品名称</view>
					<input class="goodinput" v-model="gooditem.goods_name" placeholder="例如：苹果" />
				</view>
				<view class="goodbar">
					<view class="goodname">商品单价（元）</view>
					<input class="goodinput" type="number" v-model="gooditem.goods_price" placeholder="例如：12.50" />
				</view>
				<view class="goodbar">
					<view class="goodname">商品规格</view>
					<input class="goodinput" v-model="gooditem.goods_specs" placeholder="例如：个" />
				</view>
				<view class="goodbar">
					<view class="goodname">商品总数量</view>
					<input class="goodinput" type="number" v-model="gooditem.goods_number" placeholder="例如：50" />
				</view>
			</view>
			<view class="botton" style="display: flex;justify-content: space-between;">
				<button class="quxiao" @click="nonaddgooditem">取消</button>
				<button class="queding" @click="addgooditem">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from "@/components/ailin-image-cropper.vue";
import Base from '../../api/base';
import Content from '../../api/content';
import Pack from '../../api/info/pack';
import yuDatetimePicker from '@/components/yu-datetime-picker/yu-datetime-picker.vue';
export default {
	components: {
		yuDatetimePicker,
		ImageCropper
	},
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			doCrop:0,//要被更换的
			rowImage: [],
			tempFilePath: "",
			// 是否在修改物品信息
			editeditGoodsList: false,
			eddddf2knum: undefined,
			// 是否添加商品
			addgoods: false,
			// 单个商品信息
			gooditem: {
				goods_name: undefined,
				goods_price: undefined,
				goods_specs: undefined,
				goods_number: undefined
			},
			// 是否显示上传按键
			addImgBtn: true,
			lab: '',
			viewtypetext: ['仅本社区可见', '本街道可见'],
			typekey: false,
			data: {
				type_id: 4, // 活动
				title: '',
				images: [],
				goods: [],
				content: '',
				show_type: 1,
				keyword: '',
				closing_date: '',
				num_upper_limit: '',
				link_external_url: '',
				link_external_name: ''
			},
			// 未上传的标记
			unPush: false
		};
	},
	onLoad(params) {
		// 设置标题和发布题材类型
		uni.setNavigationBarTitle({
			title: '发布团购'
		});
	},
	onUnload() {},
	methods: {
		f2kumt(cnnnnm) {
			let me = this;
			uni.showModal({
				title: '提醒',
				content: '是否移除该商品',
				confirmText: '保留',
				cancelText: '移除',
				cancelColor: '#DD524D',
				success: function(showres) {
					if (showres.cancel) {
						me.data.goods.splice(cnnnnm, 1);
					}
				}
			});
		},
		editGoodsList(ind) {
			this.gooditem = {
				goods_name: this.data.goods[ind].goods_name,
				goods_price: this.data.goods[ind].goods_price,
				goods_specs: this.data.goods[ind].goods_specs,
				goods_number: this.data.goods[ind].goods_number
			};
			this.addgoods = true;
			this.eddddf2knum = ind;
			this.editeditGoodsList = true;
		},
		nonaddgooditem() {
			this.addgoods = false;
			this.editeditGoodsList = false;
		},
		// 添加商品
		addgooditem() {
			if (this.gooditem.goods_name && this.gooditem.goods_price && this.gooditem.goods_specs && this.gooditem.goods_number) {
				if (this.editeditGoodsList) {
					this.editeditediteaaaaaaaaaf2k();
				} else {
					this.gooditem.goods_number = Math.floor(this.gooditem.goods_number);
					this.data.goods.push(this.gooditem);
					this.addgoods = false;
					this.markPush();
				}
			} else {
				this.pushFailed('信息填写不完整');
			}
		},
		editeditediteaaaaaaaaaf2k() {
			this.data.goods[this.eddddf2knum].goods_name = this.gooditem.goods_name;
			this.data.goods[this.eddddf2knum].goods_price = this.gooditem.goods_price;
			this.data.goods[this.eddddf2knum].goods_specs = this.gooditem.goods_specs;
			this.data.goods[this.eddddf2knum].goods_number = Math.floor(this.gooditem.goods_number);
			this.addgoods = false;
			this.markPush();
			this.editeditGoodsList = false;
		},
		// 打开添加商品的界面
		addShopItem() {
			this.gooditem = { goods_name: undefined, goods_price: undefined, goods_specs: undefined, goods_number: undefined };
			this.addgoods = true;
			this.editeditGoodsList = false;
		},
		saveData() {
			uni.setStorageSync('HistoryPush', this.data);
		},
		pushFailed(mesg) {
			uni.showToast({
				title: mesg,
				icon: 'none',
				duration: 3000
			});
		},
		// 发布
		pushContent(data) {
			if (data.title === '') {
				this.pushFailed('标题必填');
			} else if (data.content === '') {
				this.pushFailed('内容必填');
			} else if (data.closing_date == '') {
				this.pushFailed('截止时间必填');
			} else if (data.goods.length < 1) {
				this.pushFailed('商品必填');
			} else if (data.images.length < 1) {
				this.pushFailed('图片必填');
			} else {
				uni.showLoading({
					title: '发布中'
				});
				Pack.addPack(data).then(res => {
					uni.hideLoading();
					if (res.data.data.content_id) {
						this.unPush = false;
						uni.showModal({
							title: '成功',
							content: '发布成功',
							confirmColor: '#3CC51F',
							showCancel: false,
							success: function() {
								uni.removeStorageSync('HistoryPush');
								// uni.navigateBack();
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						});
					}
				});
			}
		},
		// 修改可见范围
		changeViewType() {
			if (this.data.show_type == 1) {
				this.data.show_type = 2;
			} else {
				this.data.show_type = 1;
			}
		},
		// 标记内容未上传
		markPush() {
			this.unPush = true;
		},
		// 点击取消返回
		backView() {
			// 检查是否有未发布内容
			if (this.unPush) {
				uni.showModal({
					title: '提醒',
					content: '您有未发布的内容，是否继续编辑',
					confirmText: '编辑',
					cancelText: '放弃',
					cancelColor: '#DD524D',
					success: function(showres) {
						if (showres.cancel) {
							uni.removeStorageSync('HistoryPush');
							// uni.navigateBack();
							uni.switchTab({
								url: '/pages/index/index'
							});
						}
					}
				});
			} else {
				uni.navigateBack();
			}
		},
		// 前往关键词修改界面
		toKeyWord() {
			var me = this;
			uni.$once('updatekeyword', function(data) {
				if (data.lab) {
					me.data.keyword = data.lab;
				}
			});
			uni.navigateTo({
				url: 'keyword?lab=' + this.data.keyword
			});
		},
		confirm(e) {
				  this.tempFilePath = "";
				  this.compressImg(e.detail.tempFilePath);
				},
				cancel() {
					this.tempFilePath = "";
					this.doCrop=0
				},
				// 图片裁剪
				imageCropper(index) {
				  const imgObj = this.rowImage[index];
				  this.doCrop=index+1
		this.tempFilePath = imgObj.path;
				},
		// 移除预览图片
		delImg(e) {
			let imgindex = e.currentTarget.dataset.index;
			this.data.images.splice(imgindex, 1);
			this.rowImage.splice(imgindex, 1);
			this.addImgBtn = true;
		},
		chooseImg() {
			uni.chooseImage({
			  count: 1,
			  success: res => {
			    this.rowImage.push(res.tempFiles[0]); //保留原图片
			    this.checkImg(res.tempFiles[0]);
			  }
			});
		},
		checkImg(imgObj) {
			if (imgObj.size > 204800) {
				// 图片大于200k
				this.compressImg(imgObj.path);
			} else {
				this.upLoadImg(imgObj.path);
			}
		},
		upLoadImg(imgURL) {
			uni.showLoading({
				title: '上传中'
			});
			Base.uploadPhoto(imgURL, 2)
				.then(res => {
					let item = {};
					item.id = res.data.data.id;
					item.src = res.data.data.src;
					if(this.doCrop)
					  {
						  this.$set(this.data.images, (this.doCrop-1), item);
						  this.doCrop=0
					  }else{
					this.data.images.push(item);
					  }
					if (this.data.images.length === 6) {
						this.addImgBtn = false;
					}
					this.markPush();
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					var title="上传失败，请重新选择图片"
					  if(this.doCrop)
					  {
						  this.doCrop=0
					title="修改失败，请重新裁剪图片"
					}else{
					this.rowImage.pop();
					  }
					uni.showToast({
						title: title,
						icon: 'none',
						duration: 3000
					});
				});
		},
		compressImg(imageObj) {
			var me = this;
			// 新建图片对象
			var quality = 0.92;
			var img = new Image();
			img.src = imageObj;
			img.onload = function() {
				var that = this;
				var w = that.width,
					h = that.height,
					scale = w / h;
				if (w > h) {
					w = 720;
					h = Math.floor(w / scale);
				} else {
					h = 720;
					w = Math.floor(h * scale);
				}
				//生成canvas
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				// 创建属性节点
				var anw = document.createAttribute('width');
				anw.nodeValue = w;
				var anh = document.createAttribute('height');
				anh.nodeValue = h;
				canvas.setAttributeNode(anw);
				canvas.setAttributeNode(anh);
				ctx.drawImage(that, 0, 0, w, h);
				var base64 = canvas.toDataURL('image/jpeg', quality);
				me.upLoadImg(base64);
			};
		},
		onConfirm(e) {
			this.data.closing_date = e.selectRes;
			console.log(this.data.closing_date);
		},
		//显示时间选择
		toggleTab(item, index) {
			this.$refs.dateTime.show();
		},
		//获取截止年
		getYear() {
			const ydate = new Date();
			let year = ydate.getFullYear() + 5;
			return year;
		},
		//获取当前日期
		getDate() {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			return `${year}-${month}-${day} 00:00`;
		}
	}
};
</script>

<style>
@import url('push.css');
.quxiao {
	width: 260upx;
	height: 90upx;
	background: #707070;
	border-radius: 45upx;
	font-size: 32upx;
	color: #ffffff;
	text-align: center;
	line-height: 90upx;
	position: absolute;
	left: 95upx;
}
.queding {
	width: 260upx;
	height: 90upx;
	background: #707070;
	border-radius: 45upx;
	background-color: #0cb957;
	font-size: 32upx;
	color: #ffffff;
	text-align: center;
	line-height: 90upx;
	position: absolute;
	right: 88upx;
}
.goodbar {
	display: flex;
	flex-direction: row;
	height: 102upx;
	align-items: center;
	width: 100%;
	border-bottom: 1upx solid #d9d9d9;
}
.goodname {
	font-size: 28upx;
	color: #000000;
}
.goodinput {
	font-size: 28upx;
	color: #000000;
	text-align: right;
	position: absolute;
	right: 50upx;
}
.textinfo {
	display: flex;
	flex-wrap: wrap;
	padding-top: 86upx;
	flex-direction: column;
	padding-left: 51upx;
	padding-right: 50upx;
}
.addgood {
	font-size: 36upx;
	color: #000000;
	text-align: center;
	position: relative;
	padding-bottom: 60upx;
}
.additeninfo {
	z-index: 6;
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	opacity: 0.95;
	position: fixed;
	top: 0px;
}
.maxttttt {
	left: 0upx;
	font-size: 28upx;
	color: #000000;
}
.botton {
	position: relative;
	width: 100%;
	top: 120upx;
	display: flex;
}
.icon-shangpin-tianjia {
	position: absolute;
	left: 518upx;
	font-size: 38upx;
	top: 23upx;
}
.add-huowu {
	position: absolute;
	width: 550upx;
	left: 142upx;
	top: 1124upx;
	display: flex;
	flex-direction: column;
	margin-bottom: 84upx;
	/* height: 100upx; */
	/* border-bottom: 1px solid #e3e3e3; */
}
/* 货物列表 */
.item-huowu {
	position: relative;
	font-size: 30upx;
	flex-wrap: wrap;
	padding-bottom: 10upx;
	border-bottom: 1px solid #e3e3e3;
	display: flex;
	padding-top: 37upx;
	padding-bottom: 28upx;
	align-items: center;
}
.addtop {
	position: relative;
	width: 550upx;
	/* left: 142upx; */
	/* top: 1224upx; */
	height: 100upx;
	border-bottom: 1px solid #e3e3e3;
	align-items: center;
	display: flex;
}
.item-info {
	display: flex;
	flex-direction: column;
}
.price {
	display: flex;
	flex-direction: row;
	height: 40upx;
	padding-top: 7upx;
	justify-content: flex-start;
}
/* 商品名称 */
.item-name {
	width: 500upx;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 28upx;
}
/* 商品价格 */
.item-danjian {
	/* width: 175upx; */
	overflow: hidden;
	color: #6c6c6c;
	text-overflow: ellipsis;
	font-size: 24upx;
}
/* 商品总数 */
.item-sum {
	/* width: 150upx; */
	overflow: hidden;
	color: #6c6c6c;
	text-overflow: ellipsis;
	font-size: 24upx;
}
/* 剩余guige */
.item-guige {
	/* width: 150upx; */
	overflow: hidden;
	color: #6c6c6c;
	text-overflow: ellipsis;
	font-size: 24upx;
}
.date_input {
	position: absolute;
	top: 0upx;
	right: 0upx;
	font-size: 28upx;
	padding-top: 28upx;
	color: #000000;
	text-align: right;
	padding-right: 5upx;
	width: 250upx;
	height: 50upx;
}
.link_external_name {
	position: absolute;
	top: 310upx;
	right: 30upx;
	width: 200upx;
	font-size: 28upx;
}
.link_external_url {
	position: absolute;
	top: 310upx;
	left: 58upx;
	width: 400upx;
	font-size: 28upx;
}
</style>
