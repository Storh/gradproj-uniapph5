<template>
	<view class="vue-cropper" ref="cropper" :style="{ top : `${containerTop}px` }" v-show="show">
		<view class="cropper-box">
			<!-- 给一个元素同时绑定touchstart事件和click移动端会导致两个事件同时触发
			故需要使用preventDefault方法（阻止元素默认事件行为的发生）来解决
			在touchstart中添加e.preventDefault()阻止click事件触发
			同时也可采用vue事件修饰符@touchstart.stop.prevent实现 -->
			<view class="cropper-box-canvas" @touchstart.stop.prevent="imgTouchStart" @touchmove.stop.prevent="imgMoveing"
			 @touchend.stop.prevent="imgMoveEnd" :style="{
					'width': imageWidth + 'px',
					'height': imageHeight + 'px',
					'transform': 'scale(' + scale + ',' + scale + ') ' + 'translate3d('+ x / scale + 'px,' + y / scale + 'px,' + '0)'
					+ 'rotateZ('+ rotate * 90 +'deg)'
					}">
				<image :src="src" alt="cropper-img" ref="cropperImg" mode="scaleToFill" class="uni-image"></image>
			</view>
		</view>
		<view class="cropper-drag-box cropper-modal cropper-move pointer-events"></view>
		<!-- 选中框 -->
		<view class="cropper-crop-box" :class="{'pointer-events': cropFixed}" :style="{'width': cropW + 'px','height': cropH + 'px','transform': 'translate3d('+ cropOffsertX + 'px,' + cropOffsertY + 'px,' + '0)'}">
			<view class="cropper-view-box">
				<image :style="{'width': imageWidth + 'px','height': imageHeight + 'px','transform': 'scale(' + scale + ',' + scale + ') ' + 'translate3d('+ (x - cropOffsertX) / scale  + 'px,' + (y - cropOffsertY) / scale + 'px,' + '0)' + 'rotateZ('+ rotate * 90 +'deg)'}"
				 mode="scaleToFill" :src="src" alt="cropper-img"></image>
			</view>

			<view v-if="!cropFixed" class="cropper-face cropper-move" @touchstart.stop.prevent="touchStart"
			 @touchmove.stop.prevent="cropMoveing"></view>

			<view class="crop-line line-w"></view>
			<view class="crop-line line-a"></view>
			<view class="crop-line line-s"></view>
			<view class="crop-line line-d"></view>
			<block v-if="!cropFixed">
				<view class="crop-point point-lt" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'left-top')"></view>
				<view class="crop-point point-mt" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'middle-top')"></view>
				<view class="crop-point point-rt" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'right-top')"></view>
				<view class="crop-point point-ml" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'middle-left')"></view>
				<view class="crop-point point-mr" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'middle-right')"></view>
				<view class="crop-point point-lb" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'left-bottom')"></view>
				<view class="crop-point point-mb" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'middle-bottom')"></view>
				<view class="crop-point point-rb" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="dragMove($event, 'right-bottom')"></view>
			</block>
		</view>

		<canvas canvas-id="myCanvas" class="cropper-canvas" :style="{ 'width': cropW + 'px','height': cropH + 'px' }"></canvas>

		<view class="btn-group">
			<view class="btn-item reset-btn" v-show="showResetBtn" @tap="init"></view>
			<view class="btn-item rotate-btn" v-show="showRotateBtn" @tap="rotateHandler"></view>
		</view>

		<view class="uni-info__ft">
			<view class="uni-modal__btn uni-modal__btn_default" style="color: rgb(0, 0, 0);" @tap="cancel">取消</view>
			<view class="uni-modal__btn uni-modal__btn_primary" style="color: rgb(0, 122, 255);" @tap="confirm">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'image-cropper',
		props: {
			cropWidth: {
				type: Number,
				default: 200,
			},
			cropHeight: {
				type: Number,
				default: 200
			},
			cropFixed: {
				type: Boolean,
				default: false,
			},
			src: {
				type: String,
			},
			showResetBtn: {
				type: Boolean,
				default: true,
			},
			showRotateBtn: {
				type: Boolean,
				default: true,
			},
			// addrobj: {
			// 	type: Object,
			// }
		},
		data() {
			const sysInfo = uni.getSystemInfoSync();
			const pixelRatio = sysInfo.pixelRatio
			return {
				// src: '',
				addr: {},
				getCanvPoint: new Array(), //识别结果数组
				show: false,
				scale: 1, //缩放比
				rotate: 0, //旋转
				cropW: 0, //裁剪宽
				cropH: 0, //裁剪高
				cropOldW: 0,
				cropOldH: 0,
				sysInfo: sysInfo,
				pixelRatio: pixelRatio,
				imageRealWidth: 0,
				imageRealHeight: 0,
				cropOffsertX: 0,
				cropOffsertY: 0,
				startX: 0,
				startY: 0,
				// 裁剪框与边界间距
				border: 5,
				x: 0,
				y: 0,
				startL: 0,
				oldScale: 1,
			}
		},
		watch: {
			src(val) {
				// console.log(val)
				if (val) {
					console.log(val)
					this.init()
				}
			},
			show(val) {
				if (!val) {
					this.src = ''
					// this.addr = {}
				}
			},
		},
		computed: {
			containerTop() {
				let top = 0
				return top;
			},
			// 容器高度
			containerHeight() {
				return this.windowHeight - 48;
			},
			// 屏幕宽度
			windowWidth() {
				return this.sysInfo.windowWidth;
			},
			windowHeight() {
				return this.sysInfo.windowHeight;
			},
			// 图片宽高比
			imageRatio() {
				if (this.imageRealHeight > 0) {
					return this.imageRealWidth / this.imageRealHeight
				}
				return 0
			},
			// 等比缩放后传入图片的宽度
			imageWidth() {
				if (this.imageRatio >= 1) {
					// 比较宽的
					return this.windowWidth
				}
				return this.windowWidth * this.imageRatio
			},
			// 等比缩放后传入图片的高度
			imageHeight() {
				if (this.imageRatio >= 1) {
					return this.windowWidth / this.imageRatio
				}
				// 比较高的 为了兼容旋转，高用宽
				return this.windowWidth
			},
		},
		methods: {
			rotateHandler() {
				if (this.rotate == 3) {
					this.rotate = 0;
				} else {
					++this.rotate
				}
			},
			init() {
				this.rotate = 0;
				this.scale = 1;
				uni.showLoading({
					title: '图片加载中...',
				})
				this.loadImage(this.src).then((e) => {
					uni.hideLoading()
				}).catch((e) => {
					uni.hideLoading()
					uni.showModal({
						title: '标题',
						content: '图片加载失败'
					})
				})
			},
			loadImage(src) {
				const _this = this
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: src,
						success: (res) => {
							_this.imageRealWidth = res.width
							_this.imageRealHeight = res.height
							_this.show = true

							_this.$nextTick(() => {
								_this.getCropperAdd((res.width / res.height), src)
								_this.x = 0
								_this.y = 0
							});
							resolve(res)
						},
						fail: (e) => {
							_this.show = false
							reject(e)
						}
					})
				});
			},
			//获取裁剪位置
			getCropperAdd(ratio, imageObj) {
				var me = this;
				me.getCanvPoint = new Array()
				// 新建图片对象
				var img = new Image();
				img.src = imageObj;
				img.onload = function() {
					var that = this;
					// 图片识别
					var cropCanvas = document.createElement("canvas");
					var cropCtx = cropCanvas.getContext("2d");
					// 创建属性节点
					var cropCanvW = document.createAttribute("width");
					cropCanvW.nodeValue = 10;
					var cropCanvH = document.createAttribute("height");
					cropCanvH.nodeValue = 10;
					cropCanvas.setAttributeNode(cropCanvW);
					cropCanvas.setAttributeNode(cropCanvH);
					// 将图片压缩为10*10
					cropCtx.drawImage(that, 0, 0, 10, 10);
					const corpArr = cropCtx.getImageData(0, 0, 10, 10).data;
					var beforBinary = [];
					// 整体灰度值
					var graySum = 0;
					for (let i = 0; i < 100; i++) {
						// 获取rgba信息
						let item = corpArr.slice(i * 4, i * 4 + 4);
						// 处理为灰度信息
						let grayPoint = Math.floor(
							item[0] * 0.299 + item[1] * 0.578 + item[2] * 0.114
						);
						graySum += grayPoint;
						beforBinary.push(grayPoint);
					}
					const grayAvg = Math.floor(graySum / 100);
					let whitePoint = 0;
					const afterBinary = beforBinary.map(point => {
						if (point > grayAvg) {
							whitePoint++;
							return 0;
						}
						return 1;
					});
					// console.log(afterBinary);
					var lessPoint = whitePoint > 50 ? 1 : 0;
					// 分割为数组
					var lessArea = new Array();
					for (let i = 0; i < 10; i++) {
						lessArea.push(afterBinary.slice(i * 10, i * 10 + 10));
					}
					console.log(lessArea);
					var addrPoint = me.numIsArea(lessArea, lessPoint);

					let width
					let height
					if (ratio >= 1) {
						width = me.windowWidth
						height = me.windowWidth / ratio
					} else {
						width = me.windowWidth * ratio
						height = me.windowWidth
					}
					console.log(addrPoint)
					console.log(width, height)
					me.cropW = width * (addrPoint.rr - addrPoint.lr + 1) / 10
					me.cropH = height * (addrPoint.bc - addrPoint.tc + 1) / 10
					console.log(me.cropW, me.cropH)
					me.cropOffsertX = width * addrPoint.lr / 10
					me.cropOffsertY = height * addrPoint.tc / 10
					console.log(me.cropOffsertX, me.cropOffsertY)
				};
			},
			numIsArea(grid, point) {
				var count = 0; //区域总数
				var me = this;

				function traverseIsArea(i, j, grid) {
					var stack = [];
					stack.push([i, j]);
					while (stack.length) {
						var pair = stack.pop();
						i = pair[0];
						j = pair[1];
						if (
							i >= 0 &&
							i < grid.length &&
							j >= 0 &&
							j < grid[0].length &&
							grid[i][j] === point
						) {
							grid[i][j] = "2";
							stack.push([i + 1, j]);
							stack.push([i - 1, j]);
							stack.push([i, j + 1]);
							stack.push([i, j - 1]);
							me.getCanvPoint[count].sum++;
							if (j < me.getCanvPoint[count].lr) me.getCanvPoint[count].lr = j;
							if (j > me.getCanvPoint[count].rr) me.getCanvPoint[count].rr = j;
							if (i < me.getCanvPoint[count].tc) me.getCanvPoint[count].tc = i;
							if (i > me.getCanvPoint[count].bc) me.getCanvPoint[count].bc = i;
						}
					}
				}

				for (var i = 0; i < grid.length; i++) {
					for (var j = 0; j < grid[0].length; j++) {
						if (grid[i][j] === point) {
							// 焦点面积
							me.getCanvPoint[count] = {
								sum: 0, //区域面积
								lr: j, //最左角列标
								rr: j, //最右角列标
								tc: i, //最上行标
								bc: i //最下行标
							};
							traverseIsArea(i, j, grid);
							count++;
						}
					}
				}
				let sendArea = me.getCanvPoint[0]
				me.getCanvPoint.forEach(item => {
					if (item.sum > sendArea.sum)
						sendArea = item
				})

				return sendArea;
			},
			cancel() {
				this.show = false
				this.$emit('cancel')
			},
			confirm(event) {
				uni.showLoading({
					title: '裁剪中...',
				})
				const _this = this
				const ctx = uni.createCanvasContext('myCanvas', _this);

				const pixelRatio = _this.pixelRatio
				const imgage = _this.src
				const imgW = _this.imageWidth * _this.scale;
				const imgH = _this.imageHeight * _this.scale
				const rotate = _this.rotate
				let dx = _this.cropOffsertX - _this.x - (_this.imageWidth - imgW) / 2;
				let dy = _this.cropOffsertY - _this.y - (_this.imageHeight - imgH) / 2;

				ctx.setFillStyle('white')
				ctx.fillRect(0, 0, imgW, imgH)
				ctx.save()

				ctx.rotate((rotate * 90 * Math.PI) / 180);
				switch (rotate) {
					case 1:
						dx += (imgH - imgW) / 2
						dy -= (imgH - imgW) / 2
						ctx.drawImage(imgage, -dy, dx, imgW, -imgH);
						break;
					case 2:
						ctx.drawImage(imgage, dx, dy, -imgW, -imgH);
						break;
					case 3:
						dx += (imgH - imgW) / 2
						dy -= (imgH - imgW) / 2
						ctx.drawImage(imgage, dy, -dx, -imgW, imgH);
						break;
					default:
						ctx.drawImage(imgage, -dx, -dy, imgW, imgH);
						break;
				}
				ctx.restore()
				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						destWidth: _this.cropW * pixelRatio,
						destHeight: _this.cropH * pixelRatio,
						success: (res) => {
							uni.hideLoading()
							event.detail.tempFilePath = res.tempFilePath
							_this.show = false
							_this.$emit('confirm', event)
						},
						fail: (e) => {
							uni.hideLoading()
							uni.showModal({
								title: '提示',
								content: '裁剪失败'
							})
						}
					}, _this);
				})

			},
			imgTouchStart(e) {
				// touches：表示当前跟踪的触摸操作的touch对象的数组
				// 双指缩放
				if (e.touches.length == 2) {
					// 保存原缩放比
					this.oldScale = this.scale
					this.scaling = true
					const x = e.touches[0].pageX - e.touches[1].pageX
					const y = e.touches[0].pageY - e.touches[1].pageY
					const hypotenuse = Math.sqrt(
						Math.pow(x, 2) +
						Math.pow(y, 2)
					)

					this.startL = Math.max(x, y, hypotenuse)
					uni.showModal({
						content: this.startL
					})
				} else {
					// 单指多指时,按第一指进行移动
					this.startX = e.touches[0].pageX - this.x
					this.startY = e.touches[0].pageY - this.y
				}
			},
			imgMoveing(e) {
				if (this.scaling) {
					let scale = this.oldScale

					const x = e.touches[0].pageX - e.touches[1].pageX
					const y = e.touches[0].pageY - e.touches[1].pageY
					const hypotenuse = Math.sqrt(
						Math.pow(x, 2) +
						Math.pow(y, 2)
					)

					const newL = Math.max(x, y, hypotenuse)

					const cha = newL - this.startL;

					// 根据图片本身大小 决定每次改变大小的系数, 图片越大系数越小
					// 1px - 0.2
					let coe = 1;
					coe =
						coe / this.imageWidth > coe / this.imageHeight ?
						coe / this.imageHeight :
						coe / this.imageWidth;
					coe = coe > 0.1 ? 0.1 : coe;
					const num = coe * cha;

					if (cha > 0) {
						scale += Math.abs(num);
					} else if (cha < 0) {
						scale > Math.abs(num) ? (scale -= Math.abs(num)) : scale;
					}

					this.scale = scale;
				} else {
					const moveX = e.touches[0].pageX - this.startX
					const moveY = e.touches[0].pageY - this.startY

					this.x = moveX
					this.y = moveY
				}
			},
			imgMoveEnd() {
				setTimeout(() => {
					this.scaling = false
				}, 100)
			},
			touchStart(e) {
				this.startX = e.touches[0].pageX - this.cropOffsertX;
				this.startY = e.touches[0].pageY - this.cropOffsertY;

				this.cropOldW = this.cropW
				this.cropOldH = this.cropH
			},
			cropMoveing(e) {
				const moveX = this._cropX(e.touches[0].pageX - this.startX)
				const moveY = this._cropY(e.touches[0].pageY - this.startY)

				this.cropOffsertX = moveX
				this.cropOffsertY = moveY
			},
			dragMove(e, type) {
				if (this.cropFixed) {
					return false
				}
				const moveX = e.touches[0].pageX - this.startX
				const moveY = e.touches[0].pageY - this.startY
				switch (type) {
					case 'left-top':
						this._cropMoveLeft(moveX)
						this._cropMoveTop(moveY)
						break;
					case 'middle-top':
						this._cropMoveTop(moveY)
						break;
					case 'right-top':
						this._cropMoveTop(moveY)
						this._cropMoveRight(moveX)
						break;
					case 'middle-right':
						this._cropMoveRight(moveX)
						break;
					case 'right-bottom':
						this._cropMoveRight(moveX)
						this._cropMoveBottom(moveY)
						break;
					case 'middle-bottom':
						this._cropMoveBottom(moveY)
						break;
					case 'left-bottom':
						this._cropMoveBottom(moveY)
						this._cropMoveLeft(moveX)
						break;
					case 'middle-left':
						this._cropMoveLeft(moveX)
						break;
					default:
						break;
				}
			},
			_cropMoveTop(y) {
				const topY = this._cropY(y)
				this.cropH += this.cropOffsertY - topY
				this.cropOffsertY = topY
			},
			_cropMoveRight(x) {
				if (this.cropOldW + x >= this.windowWidth - this.border) {
					return false;
				}
				this.cropW = this.cropOldW + (x - this.cropOffsertX)
			},
			_cropMoveBottom(y) {
				if (this.cropOldH + y >= this.windowHeight - this.containerTop - this.border) {
					return false;
				}
				this.cropH = this.cropOldH + (y - this.cropOffsertY)
			},
			_cropMoveLeft(x) {
				const leftX = this._cropY(x)
				this.cropW += this.cropOffsertX - leftX
				this.cropOffsertX = leftX
			},
			_cropX(x) {
				if (x <= this.border) {
					return this.border
				}
				if (x + this.cropW >= this.windowWidth - this.border) {
					return this.windowWidth - this.cropW - this.border
				}
				return x
			},
			_cropY(y) {
				if (y <= this.border) {
					return this.border
				}
				if (y + this.cropH >= this.windowHeight - this.containerTop - this.border) {
					return this.windowHeight - this.cropH - this.containerTop - this.border
				}
				return y
			}
		}
	}
</script>

<style scoped lang="css">
	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAR4AAsAAAAACKgAAAQsAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqEfIRGATYCJAMMCwgABCAFhG0HShugB8gOJUHBwAAAAAFEBNmwzd4dtatSmmpFoVAEhUThEAYkCozFKDCqCVO6RfH/89v869awDnTR1qrSANFt4GG4SNxreBn91fmV9f3+53J613ieHba+N1zmGM8PA7oXTaCAxpjei8IoLWFsGLu4jPME6vWJJdovqmgAO4U2LRBnep0K7GJmpYQWanXVOWuLuAFrtenK4haAa/f38QnKsCOpyrRFh6eFWsh5KXnfYcn958BGQNKfE8wmMmaAQpzkuo9Z+ukZluoltVV5abUipL5i/ysArlhWVut/eCRBVNPUjYg6oUo7JTHFoaYDSvdacnKTq9GAB4AY5y2dtL3qpFh1DENdnJC6Hq+xYb7pyRMDMzc/fYoJjY8flwO3m98rMucF+IZHj6Cagw5UeKpxyFbt2rHGY/8jpa7CYMvLfcIesLjY3bdqhaf+nqgQs2qT/+rjCH/VfA0VFGuAC3iE8NEr/Vau8vZsXiUy7+V3c3tQQXMAuNjDCC89KDIHH0OFhnUi81GEPwyc7wZUaN7DnUf4g+ZLQsMKYV/94NjK7R7TEM4niTY1oJ5zEU62aNVaasUub08YLUEam5EnT6a61/I17dNk+vTu9jpJjXhsTFwjqTtpCBxBIIgS6iQnc/Zod1YGKp0rAwsD8kkyP6AwcK0hcAwkiQmBhWvxPZWKDu86aUH2nLEdi9rGX1eXq5P6A1SrnAucMVMdZH/GKi/jyfCqJyucfK3mXpVujXOPfFf5LC4Dvx0X/943JyOq4HuCTZ8KiIPPAb6ro8akpT6ufiq39BQrNlk5mp8pO0JlJLk8f5QalRjoP60IMx0N8n7wGhSD3n6/F1zlcTVz/cR+Ev0lkLSTd7UiPbD/wCxGRMA2Krwro2O0bTQtImbwhjAJc0S3N4ROx15/PH60IzaIOjCbEelqkDOfETNxb/FMixnWNzeJp2KPQw9A5d76jGUOQOUvH7RE/o2RfkNatd3OGf9q0QKbnq8WB7qy+hVqJRjJn1BQgP/iErks0yy5iGJTrOayW7C/z0IoZH0qNH+7N+31XXc7G2p1hZDU6IWs1ghaqDNQpcEKVKu1BfWmFW9u0IFhKUodpswCEFodgqTZHWStbqOF+hqqdPsG1VrDEuodhfueDcZCj+QzuIrFtZh6BNNraIowbCzi1dbhOlOfionKXHoTzgzoY5hCKk/minEKZ/pYMDCoU7IsgREM3Y8Vgcvwvj4aMzK0AdewUpJljWkyGZH3IKmG7gfEHgZOhYXTwqiNwOhp0CiE3ZiFpL5fB6dj0keFKcGV+JvgGAP0vWMUpOQ10GI1VQt3LoMHDNJRYrEIPInAoPXDFEEnrk9P0zDG/FEGOA2WFNkiaZRGhuoRddXS8bX917cL6mn9c6TIUXSekybKHKQfJXFq2KSiRklLYU8dNKWDIX0cAA==') format('woff2');
	}

	.vue-cropper {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
		box-sizing: border-box;
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		direction: ltr;
		touch-action: none;
		text-align: left;
		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
	}

	.cropper-canvas {
		position: absolute;
		top: -9999px;
		left: -9999px;
		z-index: -998;
	}

	.vue-cropper .uni-info__ft {
		position: absolute;
		line-height: 48px;
		font-size: 18px;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 998;
	}

	.btn-group {
		position: absolute;
		right: 30px;
		bottom: 78px;
		z-index: 998;
	}

	.btn-item {
		position: relative;
		width: 40px;
		height: 40px;
		background: #fff;
		border-radius: 20px;
		padding: 10px;
		display: inline-block;
		margin-left: 10px;
	}

	.btn-item:active {
		background: #ccc;
	}

	/* 旋转按键 */
	.rotate-btn {
		font-family: "iconfont" !important;
		font-size: 24px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		line-height: 20px;
	}

	.rotate-btn:before {
		content: "\e65c";
		margin-left: -2px;
	}

	/* 重置按键 */
	.reset-btn {
		font-family: "iconfont" !important;
		font-size: 24px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		line-height: 20px;
	}

	.reset-btn:before {
		content: "\e648";
		margin-left: -2px;
	}

	.vue-cropper .uni-info__ft:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #d5d5d6;
		color: #d5d5d6;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		z-index: 998;
	}

	.vue-cropper .uni-modal__btn {
		display: block;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		color: #3cc51f;
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		position: relative;
		text-align: center;
		background-color: #fff;
		z-index: 998;
	}

	.vue-cropper .uni-modal__btn:first-child:after {
		display: none
	}

	.vue-cropper .uni-modal__btn:after {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		width: 1px;
		bottom: 0;
		border-left: 1px solid #d5d5d6;
		color: #d5d5d6;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleX(.5);
		transform: scaleX(.5);
		z-index: 998;
	}

	.vue-cropper .uni-modal__btn:active {
		background-color: #eee;
	}

	.cropper-box,
	.cropper-box-canvas,
	.cropper-drag-box,
	.cropper-crop-box,
	.cropper-face {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		user-select: none;
		/* 元素及其子元素的文本不可选中 */
		z-index: 998;
	}

	.uni-image {
		width: 100%;
		height: 100%;
	}

	.cropper-box-canvas image {
		position: relative;
		text-align: left;
		user-select: none;
		transform: none;
		max-width: none;
		max-height: none;
		z-index: 998;
	}

	.cropper-box {
		overflow: hidden;
	}

	.cropper-move {
		cursor: move;
		/* 被悬浮的物体可被移动 */
	}

	.cropper-crop {
		cursor: crosshair;
	}

	.cropper-modal {
		background: rgba(0, 0, 0, 0.5);
		/* 蒙版 */
	}

	.pointer-events {
		pointer-events: none;
		/* 元素永远不会成为鼠标事件的target */
	}

	.cropper-crop-box {
		/*border: 2px solid #39f;*/
	}

	.cropper-view-box {
		display: block;
		overflow: hidden;
		width: 100%;
		height: 100%;
		outline: 1px solid #39f;
		outline-color: rgba(51, 153, 255, 0.75);
		user-select: none;
	}

	.cropper-view-box image {
		user-select: none;
		text-align: left;
		max-width: none;
		max-height: none;
	}

	.cropper-face {
		top: 0;
		left: 0;
		background-color: #fff;
		/* 白 */
		opacity: 0.1;
		/* 透明度 */
	}

	.crop-line {
		position: absolute;
		display: block;
		/* 此元素将显示为块级元素，此元素前后会带有换行符 */
		width: 100%;
		height: 100%;
		opacity: 0.1;
		z-index: 998;
	}

	.line-w {
		top: -3px;
		left: 0;
		height: 5px;
		cursor: n-resize;
		/* ↑ */
	}

	.line-a {
		top: 0;
		left: -3px;
		width: 5px;
		cursor: w-resize;
		/* ← */
	}

	.line-s {
		bottom: -3px;
		left: 0;
		height: 5px;
		cursor: s-resize;
		/* ↓ */
	}

	.line-d {
		top: 0;
		right: -3px;
		width: 5px;
		cursor: e-resize;
		/* → */
	}

	.crop-point {
		position: absolute;
		width: 8px;
		height: 8px;
		opacity: 0.75;
		background-color: #39f;
		border-radius: 100%;
		z-index: 998;
	}

	.point-lt {
		top: -4px;
		left: -4px;
		cursor: nw-resize;
	}

	.point-mt {
		top: -5px;
		left: 50%;
		margin-left: -3px;
		cursor: n-resize;
	}

	.point-rt {
		top: -4px;
		right: -4px;
		cursor: ne-resize;
	}

	.point-ml {
		top: 50%;
		left: -4px;
		margin-top: -3px;
		cursor: w-resize;
	}

	.point-mr {
		top: 50%;
		right: -4px;
		margin-top: -3px;
		cursor: e-resize;
	}

	.point-lb {
		bottom: -5px;
		left: -4px;
		cursor: sw-resize;
	}

	.point-mb {
		bottom: -5px;
		left: 50%;
		margin-left: -3px;
		cursor: s-resize;
	}

	.point-rb {
		bottom: -5px;
		right: -4px;
		cursor: se-resize;
	}
</style>
