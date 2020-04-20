<template>
	<view class="back">
		<view class="add_label"><input placeholder="添加标签，让更多人看到" v-model="lab" /></view>
		<!-- 叉号 -->
		<view class="cleanInput" @tap="cleanInput"><ailin-icon iconId="#icon-fabu-off"></ailin-icon></view>
		<text>可最多输入三个标签，用空格分开。</text>
		<button class="save" @click="saveKeyword(lab)">确定</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			lab: '',
			cancack: false,
			save: false
		};
	},
	methods: {
		// 清除输入内容
		cleanInput() {
			this.lab = '';
		},
		// 保存标签
		saveKeyword(keyword) {
			// console.log(keyword);
			var me = this;
			if (keyword) {
				let anskeyword = [];
				let keywordarr = [];
				keywordarr = keyword.split(' ');
				console.log(keywordarr);
				let num = keywordarr.length;
				for (let getkeywordnum = 0, times = 0; times < num && getkeywordnum < 3; times++) {
					let item = keywordarr[times];
					if (item) {
						anskeyword.push(item);
						getkeywordnum++;
					}
				}
				// console.log(anskeyword);
				if (anskeyword.length) {
					let ansstr = anskeyword.join();
					console.log(ansstr);
					uni.$emit('updatekeyword', {
						lab: ansstr
					});
					me.save = true;
					uni.navigateBack();
				} else {
					uni.showToast({
						title: '请重新填写标签',
						icon: 'none',
						duration: 2000
					});
				}
			} else {
				uni.showToast({
					title: '请填写标签',
					icon: 'none',
					duration: 2000
				});
			}
		}
	},
	onLoad(parme) {
		this.lab = parme.lab.replace(/,/g, ' ');
		uni.setNavigationBarTitle({
			title: '添加标签'
		});
	},
	onUnload() {
		if (!this.save) {
			uni.$emit('updatekeyword', {
				lab: ''
			});
		}
	}
};
</script>

<style>
page {
	background-color: #ededed;
}
.back {
	font-size: 0;
}
.add_label {
	position: relative;
	top: 0;
	width: 100%;
	height: 98upx;
	background: #ffffff;
}
.add_label input {
	position: absolute;
	left: 34upx;
	top: 29upx;
	font-size: 28upx;
	width: 85%;
	color: #000000;
	line-height: 40upx;
}
.cleanInput {
	position: absolute;
	top: 28upx;
	right: 28upx;
	font-size: 28upx;
	color: #b5b5b5;
}
text {
	position: relative;
	left: 34upx;
	top: 21upx;
	font-size: 28upx;
	color: #8c8c8c;
}
.save {
	position: relative;
	top: 60upx;
	background: #0cb957;
	border-radius: 45upx;
	width: 478upx;
	height: 80upx;
	font-size: 32upx;
	color: #ffffff;
	text-align: center;
}
</style>
