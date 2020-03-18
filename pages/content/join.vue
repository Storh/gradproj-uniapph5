<template>
	<view>
		<view class="act"><text></text></view>
		<view class="cancel_btn">
		<button class="cancel" @click="cancel">返回</button>
		</view>
		<view class="leave_word">
			<text class="leave_word_text">备注说明</text>
			<textarea v-model="remark" class="leave_word_detail"></textarea>
		</view>
		<view class="confirm"><button class="con_button" @click="sendinfo">确认参与</button></view>
	</view>
</template>

<script>
import Activity from '../../api/info/activity';
export default {
	data() {
		return {
			remark: '',
			id: ''
		};
	},
	methods: {
		cancel(){
			uni.navigateBack();
		},
		sendinfo() {
			var me = this;
			uni.showLoading({
				title: '提交中'
			});
			Activity.addRegist(me.id, me.remark).then(res => {
				uni.hideLoading();
				if (res.data.data.regist_id) {
					uni.showToast({
						title: '参与成功',
						duration: 2000,
						success: function() {
							uni.navigateBack();
						}
					});
				}
			});
		}
	},
	onLoad(p) {
		this.id = p.id;
	}
};
</script>

<style>
page {
	background-color: #ffffff;
}

.leave_word {
	position: relative;
	top: 150upx;
	padding-top: 30upx;
	margin-left: 50upx;
	font-size: 0;
	display: flex;
	justify-content: space-between;
	margin-right: 130upx;
}

.leave_word_text {
	font-size: 28upx;
	color: #000000;
}

.leave_word_detail {
	border: 1upx solid #d9d9d9;
	width: 420upx;
	height: 100upx;
	border-radius: 10upx;
}

.confirm {
	position: relative;
	top: 250upx;
}

.con_button {
	font-size: 30upx;
	width: 250upx;
	background-color: #0cb957;
	color: #ffffff;
}
.cancel {
	width: 80upx;
	height: 60upx;
	line-height: 60upx;
	font-size: 28upx;
	text-align: center;
	position: absolute;
	top: 31upx;
	left: 40upx;
	padding: 0;
	border: none;
/* 	background-color: #0cb957; */
	color: #000000;
}
.cancel_btn{
	width: 100%;
	align-items: flex-start;
}
</style>
