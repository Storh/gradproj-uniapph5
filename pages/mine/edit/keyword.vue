<template>
	<view>
		<view class="labe_view">
			<view class="label" v-for="(item, index) in list" :key="index">
				<!-- 被选中的样式 -->
				<view v-if="item.checked == true" @click="chooseItem(index)" style="color: #007aaf;">{{ item.kind_name }}</view>
				<!-- 未被选中 -->
				<view v-else @click="chooseItem(index)">{{ item.kind_name }}</view>
			</view>
		</view>
		<text class="text">可以多选，但尽量不要超过5个。</text>
		<button class="save" @click="pushInfo()">确认</button>
	</view>
</template>

<script>
import Base from '../../../api/base';
export default {
	data() {
		return {
			type: undefined,
			info: undefined,
			list: []
		};
	},
	methods: {
		chooseItem(index) {
			if (this.list[index].checked) {
				this.$set(this.list, index, { checked: false, kind_id: this.list[index].kind_id, kind_name: this.list[index].kind_name });
			} else {
				this.$set(this.list, index, { checked: true, kind_id: this.list[index].kind_id, kind_name: this.list[index].kind_name });
			}
		},
		lightChecked(checkedlist) {
			let alllist = this.list;
			let allnum = alllist.length;
			for (let i = 0; i < allnum; i++) {
				this.list[i].checked = false;
			}
			let allitem = [];
			for (let i = 0; i < allnum; i++) {
				allitem.push(alllist[i].kind_id);
			}
			let checkednum = checkedlist.length;
			for (let i = 0; i < checkednum; i++) {
				let add = allitem.indexOf(checkedlist[i].kind_id);
				if (add >= 0) {
					console.log(add);
					this.list[add].checked = true;
				}
			}
		},
		pushInfo() {
			this.info = [];
			let num = this.list.length;
			for (let i = 0; i < num; i++) {
				if (this.list[i].checked) {
					let item = {};
					item.kind_id = this.list[i].kind_id;
					item.kind_name = this.list[i].kind_name;
					this.info.push(item);
				}
			}
			uni.navigateBack();
		}
	},
	onUnload() {
		uni.$emit('edituserkeyword', {
			type: this.type,
			info: this.info
		});
	},
	onLoad() {
		this.type = sessionStorage.getItem('keywordtype');
		let info = sessionStorage.getItem('keywordindfo');
		this.info = JSON.parse(decodeURIComponent(info));
		console.log(this.type);
		console.log(this.info);
		let title = '';
		let url = '';
		if (this.type === 'speciality') {
			title = '职业特长';
			Base.getSpecialityList().then(res => {
				this.list = res.data.data.list;
				this.lightChecked(this.info);
			});
		} else {
			title = '兴趣爱好';
			Base.getHobbyList().then(res => {
				this.list = res.data.data.list;
				this.lightChecked(this.info);
			});
		}
		uni.setNavigationBarTitle({
			title: title
		});

		// uni.request({
		// 	url: this.SerUrl + url,
		// 	method: 'POST',
		// 	data: {
		// 		token: "token",
		// 	},
		// 	success: (res) => {
		// 		this.list = res.data.data.list
		// 		this.lightChecked(this.info, this.list)
		// 	}
		// })
	}
};
</script>

<style>
.labe_view {
	position: absolute;
	width: 690upx;
	left: 44upx;
}
.label {
	position: relative;
	top: 83upx;
	left: 0upx;
	margin-right: 25upx;
	margin-bottom: 17upx;
	font-size: 24upx;
	color: #000000;
	text-align: center;
	background: #f2f2f2;
	border: 1px solid #979797;
	border-radius: 11upx;
	display: inline-block !important;
	display: inline;
	height: 56upx;
	line-height: 56upx;
	padding-left: 20upx;
	padding-right: 20upx;
}
.text {
	position: absolute;
	top: 721upx;
	left: 212upx;
	font-size: 24upx;
	color: #858585;
	line-height: 38upx;
}
.save {
	position: absolute;
	top: 798upx;
	left: 137upx;
	background: #0cb957;
	border-radius: 45upx;
	border-radius: 45upx;
	width: 478upx;
	height: 90upx;
	font-size: 32upx;
	color: #ffffff;
	text-align: center;
	line-height: 90upx;
}
</style>
