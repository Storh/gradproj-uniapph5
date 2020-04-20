<template>
	<view v-if="data">
		<!-- 取消和发布按键区域 -->
		<view class="buttom">
			<button @click="backView" class="cancel">返回</button>
			<button class="push" @click="pushContent(data)">确认</button>
		</view>
		<!-- 内容填写位置 -->
		<view class="details">
			<input class="title" v-model="data.title" placeholder="添加标题…" @blur="markPush" />
			<textarea class="content" maxlength="-1" v-model="data.content" placeholder="添加发布的内容…" @blur="markPush" />
			<input class="link_external_url" v-model="data.link_external_url" placeholder="可添加链接" @blur="markPush" />
			<input class="link_external_name" v-model="data.link_external_name" placeholder="可命名链接" @blur="markPush" />
		</view>
		<view class="pictures">
			<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
			<block v-for="(item, index) in data.images" :key="index">
				<view class="pictures-item">
					<image mode="aspectFill" :src="item.src"></image>
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
					<text class="label_text">{{ lab }}</text>
					<ailin-icon class="arrowright_1" iconId="#icon-right-copy"></ailin-icon>
				</view>
			</view>
			<!-- 这里是分割线 -->
			<ailin-icon class="icon-wode-off" iconId="#icon-wode-off"></ailin-icon>
			<view class="able_view">
				<text class="able">谁可以看</text>
				<view @tap="changeViewType">
					<text class="able_text">{{ viewtypetext[viewtype] }}</text>
					<ailin-icon class="arrowright_2" iconId="#icon-zhuan"></ailin-icon>
				</view>
			</view>
			<!-- 这里是分割线 -->
			<ailin-icon v-if="typekey" class="icon-fabu-deadline" iconId="#icon-fabu-deadline"></ailin-icon>
			<view v-if="typekey" class="deadline">
				<text class="deadline_date">截止日期</text>
				<view class="date_input">
					<!-- <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<text class="uni-input">{{ date }}</text>
					</picker> -->
					<input class="uni-input" maxlength="17" v-model="data.closing_date" style="text-align: right;" placeholder="年-月-日 时:分" />
				</view>
			</view>
			<!-- 这里是分割线 -->
			<ailin-icon v-if="typekey" class="icon-fabu-date" iconId="#icon-fabu-date"></ailin-icon>
			<view v-if="typekey" class="max_people">
				<text class="max">活动人数</text>
				<input class="max_num" placeholder="0" type="number" v-model="data.num_upper_limit" @blur="markPush" />
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from "@/components/ailin-image-cropper.vue";
import Base from '../../api/base';
import Content from '../../api/content';
export default {
	components: { ImageCropper },
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			doCrop:0,//要被更换的
			getCanvPoint: new Array(), //识别结果数组
			rowImage: [],
			tempFilePath: "",
			// 是否显示上传按键
			addImgBtn: true,
			lab: '',
			viewtype: 0,
			viewtypetext: ['仅本社区可见', '本街道可见'],
			imgList: [],
			typekey: false,
			content_id: undefined,
			type_id: 0,
			data: {
				content_id: undefined,
				title: '',
				images: [],
				content: '',
				show_type: 1,
				keyword: '',
				closing_date: '',
				num_upper_limit: '',
				type_id: 0,
				link_external_url: '',
				link_external_name: ''
			},
			// 未上传的标记
			unPush: false
			// date: currentDate
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	onLoad(params) {
		// 设置标题和发布题材类型
		this.data.content_id = params.id;
		uni.setNavigationBarTitle({
			title: '编辑发布内容'
		});
		// 获取该记录的详细情况
		Content.getDetail(params.id).then(res => {
			this.data.title = res.data.data.title;
			this.data.images = res.data.data.images;
			this.rowImage=res.data.data.images
			this.data.content = res.data.data.content;
			this.data.show_type = res.data.data.show_type;
			this.lab = res.data.data.keyword;
			this.viewtype = res.data.data.show_type - 1;
			this.data.closing_date = res.data.data.closing_date;
			this.data.num_upper_limit = res.data.data.num_upper_limit;
			this.type_id = res.data.data.type_id;
			this.data.link_external_url= res.data.data.link_external_url;
			this.data.link_external_name= res.data.data.link_external_name;
			if (res.data.data.images.length == 6) {
				this.addImgBtn = false;
			}
			if (res.data.data.type_id == 4) {
				uni.redirectTo({
					url: '/pages/edit/activity?id=' + params.id
				});
			}else if(res.data.data.type_id == 5){
				uni.redirectTo({
					url: '/pages/edit/pack?id=' + params.id
				});
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
				Content.editDetail(data).then(res => {
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
			this.viewtype = (this.viewtype + 1) % 2;
			this.data.show_type = this.viewtype + 1;
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
				console.log(unSaveList);
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
				me.lab = data.lab;
				if (data.lab) {
					me.data.keyword = data.lab;
				}
			});
			uni.navigateTo({
				url: 'keyword?lab=' + this.lab
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
					this.data.images.pop();
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
		// 日期修改
		bindDateChange: function(e) {
			this.date = e.target.value;
		},
		// 获取日期
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
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
	top: 124upx;
	left: 58upx;
	width: 634upx;
	font-size: 28upx;
}
.content {
	position: absolute;
	top: 192upx;
	left: 58upx;
	width: 634upx;
	height: 145upx;
	font-size: 28upx;
}

.pictures {
	display: flex;
	font-size: 0;
	position: absolute;
	top: 377upx;
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
	top: 804upx;
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
	/* left: 400upx; */
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
	top: 833upx;
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
	top: 914upx;
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
	top: 935upx;
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
	top: 1014upx;
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
	top: 1035upx;
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
	top: 1114upx;
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
	top: 1135upx;
	left: 80upx;
	font-size: 38upx;
}
.link_external_name{
	position: absolute;
	top: 310upx;
	right: 30upx;
	width: 200upx;
	font-size: 28upx;
}
.link_external_url{
	position: absolute;
	top: 310upx;
	left: 58upx;
	width: 400upx;
	font-size: 28upx;
}
</style>
