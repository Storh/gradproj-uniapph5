<template>
	<view v-if="data">
		<!-- 取消和发布按键区域 -->
		<view class="buttom">
			<button @click="backView" class="cancel">取消</button>
			<button class="push" @click="pushContent(data)">确认</button>
		</view>
		<!-- 内容填写位置 -->
		<view class="details">
			<input class="title" v-model="data.title" placeholder="添加标题…" @blur="markPush" />
			<textarea class="content" maxlength="-1" v-model="data.content" placeholder="添加发布的内容…" @blur="markPush" />
			<input class="link_external_url" v-model="data.link_external_url" placeholder="添加外部链接" @blur="markPush" />
			<input class="link_external_name" v-model="data.link_external_name" placeholder="命名外部链接" @blur="markPush" />
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
			<ailin-icon class="icon-fabu-date" iconId="#icon-fabu-date"></ailin-icon>
			<view class="max_people">
				<text class="max">活动人数</text>
				<input class="max_num" placeholder="0" type="number" v-model="data.num_upper_limit" @blur="markPush" />
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ailin-image-cropper.vue';
import Base from '../../api/base';
import Content from '../../api/content';
import Activity from '../../api/info/activity';
import yuDatetimePicker from '@/components/yu-datetime-picker/yu-datetime-picker.vue';
export default {
	components: {
		yuDatetimePicker,
		ImageCropper
	},
	data() {
		return {
			doCrop: 0, //要被更换的
			rowImage: [],
			tempFilePath: '',
			// 是否显示上传按键
			addImgBtn: true,
			viewtypetext: ['仅本社区可见', '本街道可见'],
			imgList: [],
			data: {
				content_id: undefined,
				title: '',
				images: [],
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
			title: '编辑活动内容'
		});
		// 获取该记录的详细情况
		this.data.content_id = params.id;
		Activity.getDetail(params.id).then(res => {
			this.rowImage = [...res.data.data.images];
			this.data.title = res.data.data.title;
			this.data.images = res.data.data.images;
			this.data.content = res.data.data.content;
			this.data.show_type = res.data.data.show_type;
			this.data.keyword = res.data.data.keyword;
			this.data.closing_date = res.data.data.closing_date;
			this.data.num_upper_limit = res.data.data.num_upper_limit;
			this.data.link_external_name = res.data.data.link_external_name;
			this.data.link_external_url = res.data.data.link_external_url;
			if (res.data.data.images.length == 6) {
				this.addImgBtn = false;
			}
		});
	},
	onUnload() {
		// this.delNoSaveUploadFile();
	},
	methods: {
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
			} else if (data.images.length < 1) {
				this.pushFailed('图片必填');
			} else {
				uni.showLoading({
					title: '提交中'
				});
				Activity.editActivity(data).then(res => {
					uni.hideLoading();
					if (res.data.error === 0) {
						this.unPush = false;
						uni.showModal({
							title: '成功',
							content: '编辑成功',
							confirmColor: '#3CC51F',
							showCancel: false,
							success: function() {
								uni.navigateBack();
							}
						});
					}
				});
			}
		},
		// 修改可见范围
		changeViewType() {
			this.data.show_type = (this.data.show_type + 1) % 3;
		},
		// 标记内容未上传
		markPush() {
			this.unPush = true;
		},
		// 删除未保存的上传的文件
		delNoSaveUploadFile() {
			let unSaveList;
			Base.getListUnSave(2).then(res => {
				unSaveList = res.data.data.list;
				// console.log(unSaveList);
				this.delFile(unSaveList);
			});
		},
		delFile(fileList) {
			let num = fileList.length;
			for (let i = 0; i < num; i++) {
				let file = fileList.pop();
				// Base.delPhoto(file.id, 2);
			}
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
							uni.navigateBack();
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
				me.data.keyword = data.lab;
			});
			uni.navigateTo({
				url: '/pages/push/keyword?lab=' + this.data.keyword
			});
		},
		confirm(e) {
			this.tempFilePath = '';
			this.compressImg(e.detail.tempFilePath);
		},
		cancel() {
			this.tempFilePath = '';
			this.doCrop = 0;
		},
		// 图片裁剪
		imageCropper(index) {
			const imgObj = this.rowImage[index];
			this.doCrop = index + 1;
			if (imgObj.path) {
				this.tempFilePath = imgObj.path;
			} else {
				this.doCrop = 0;
				uni.showToast({
					title: '已上传的图片，无法裁剪',
					icon: 'none',
					duration: 3000
				});
			}
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
					// console.log(this.data.images);
					// console.log(this.rowImage);
					if (this.doCrop) {
						this.$set(this.data.images, this.doCrop - 1, item);
						this.doCrop = 0;
					} else {
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
					var title = '上传失败，请重新选择图片';
					if (this.doCrop) {
						this.doCrop = 0;
						title = '修改失败，请重新裁剪图片';
					} else {
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
			// console.log(e.selectRes);
			// this.cdate=e.selectRes;
			// console.log(this.cdate);
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
			// console.log(year);
			return year;
		}
	}
};
</script>

<style>
page {
	background-color: #ffffff;
}
.delimg {
	width: 30upx;
	position: relative;
	top: -215upx;
	left: 180upx;
	font-size: 30upx;
	color: #96979d;
	z-index: 5;
}

.buttom {
	font-size: 0upx;
	height: 110upx;
	display: flex;
}

.cancel:after {
	border: none;
}

.cancel {
	width: 56upx;
	height: 60upx;
	font-size: 28upx;
	text-align: center;
	position: absolute;
	top: 31upx;
	left: 40upx;
	padding: 0;
	line-height: 60upx;
	border: none;
	background: #ffffff;
	line-height: 40upx;
}

.push {
	position: absolute;
	top: 25upx;
	left: 612upx;
	width: 103upx;
	height: 52upx;
	background: #0cb957;
	border-radius: 26upx;
	font-size: 24upx;
	color: #ffffff;
	text-align: center;
	padding: 0;
	line-height: 52upx;
}

.details {
	font-size: 0;
}

.title {
	position: absolute;
	top: 104upx;
	left: 58upx;
	width: 634upx;
	font-size: 28upx;
}

.content {
	position: absolute;
	top: 152upx;
	left: 58upx;
	width: 634upx;
	height: 145upx;
	font-size: 28upx;
}

.pictures {
	display: flex;
	font-size: 0;
	position: absolute;
	top: 387upx;
	width: 700upx;
	height: 430upx;
	left: 58upx;
	border-bottom: 1px solid #e3e3e3;
	flex-wrap: wrap;
}

.pictures-item {
	width: 218upx;
	height: 197upx;
}

image {
	position: relative;
	top: 0upx;
	left: 0upx;
	width: 197upx;
	height: 197upx;
}

.plus {
	position: relative;
	top: 59upx;
	left: 68.5upx;
	font-size: 60upx;
	color: #a5a5a5;
}

.plusback {
	position: relative;
	top: 0upx;
	left: 0upx;
	background: #ededed;
	width: 197upx;
	height: 197upx;
}

.add_label {
	position: absolute;
	width: 550upx;
	left: 142upx;
	top: 814upx;
	height: 107upx;
	border-bottom: 1px solid #e3e3e3;
}

.label {
	position: absolute;
	padding-top: 36upx;
	top: 0upx;
	left: 0upx;
	font-size: 28upx;
	color: #000000;
	padding-bottom: 31upx;
}

.label_text {
	position: absolute;
	top: 0upx;
	right: 40upx;
	font-size: 28upx;
	color: #000000;
	max-width: 110upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding-bottom: 31upx;
	padding-top: 36upx;
}

.icon-biaoqian {
	position: absolute;
	top: 843upx;
	left: 80upx;
	font-size: 42upx;
}

.arrowright_1 {
	color: '#333333';
	font-size: 28upx;
	position: absolute;
	top: 0upx;
	left: 518upx;
	padding-bottom: 31upx;
	padding-top: 36upx;
}

.able_view {
	position: absolute;
	width: 550upx;
	left: 142upx;
	top: 924upx;
	height: 100upx;
	border-bottom: 1px solid #e3e3e3;
}

.able {
	position: absolute;
	top: 0upx;
	left: 0upx;
	font-size: 28upx;
	padding-top: 28upx;
	color: #000000;
}

.able_text {
	position: absolute;
	top: 0upx;
	right: 40upx;
	/* left: 400upx; */
	font-size: 28upx;
	padding-top: 28upx;
	color: #000000;
}

.icon-wode-off {
	position: absolute;
	top: 945upx;
	left: 80upx;
	font-size: 40upx;
}

.arrowright_2 {
	color: '#333333';
	font-size: 28upx;
	position: absolute;
	top: 0upx;
	left: 518upx;
	padding-top: 28upx;
}

.deadline {
	position: absolute;
	width: 550upx;
	left: 142upx;
	top: 1024upx;
	height: 100upx;
	border-bottom: 1px solid #e3e3e3;
}

.deadline_date {
	position: absolute;
	top: 0upx;
	left: 0upx;
	font-size: 28upx;
	padding-top: 28upx;
	color: #000000;
}

.icon-fabu-deadline {
	position: absolute;
	top: 1045upx;
	left: 80upx;
	font-size: 40upx;
}

.uni-input {
	font-size: 28upx;
	position: absolute;
	top: 29upx;
	right: 0;
}

.max_people {
	position: absolute;
	width: 550upx;
	left: 142upx;
	top: 1124upx;
	height: 100upx;
	border-bottom: 1px solid #e3e3e3;
}

.max {
	position: absolute;
	top: 0upx;
	left: 0upx;
	font-size: 28upx;
	padding-top: 28upx;
	color: #000000;
}

.max_num {
	position: absolute;
	top: 0upx;
	right: 0upx;
	font-size: 28upx;
	padding-top: 28upx;
	color: #000000;
	text-align: right;
	padding-right: 5upx;
}

.icon-fabu-date {
	position: absolute;
	top: 1145upx;
	left: 80upx;
	font-size: 38upx;
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
