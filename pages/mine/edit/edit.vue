<template>
	<view v-if="userinfo">
		<view class="name">
			<text>姓名</text>
			<block v-if="userinfo.nickname.indexOf(ManagePading)==0">
				<!-- <text :style="ManageStyle">{{ ManageName }}</text> -->
				<input disabled="true" maxlength="18" :style="ManageStyle" v-model="ManageName" />
			</block>
			<block v-else>
				<input maxlength="18" v-model="userinfo.nickname" />
			</block>
		</view>
		<view class="estate">
			<text>小区</text>
			<input disabled="true" v-model="userinfo.districts.estate.name" />
		</view>
		<view class="sex">
			<text>性别</text>
			<radio-group @change="radioChange">
				<block class="radio" v-for="(item, index) in radiolist" :key="item.value">
					<block>
						<label class="radio_name">
							<radio class="radio_button" :value="item.val" :checked="userinfo.sex == item.value" />
							{{ item.name }}
						</label>
					</block>
				</block>
			</radio-group>
		</view>
		<view class="career">
			<text>职业特长</text>
			<view @tap="toKeyWord('speciality', userinfo.speciality)">
				<text class="career_label">{{ speciality }}</text>
				<ailin-icon class="icon-right" iconId="#icon-right"></ailin-icon>
			</view>
		</view>
		<view class="hobby">
			<text>兴趣爱好</text>
			<view @tap="toKeyWord('hobby', userinfo.hobby)">
				<text class="hobby_label">{{ hobby }}</text>
				<ailin-icon class="icon-right" iconId="#icon-right"></ailin-icon>
			</view>
		</view>
		<view auto-height class="signture">
			<text>个性签名</text>
			<textarea style="background-color: #F2F2F2;border-radius: 7upx;" auto-height="true" v-model="userinfo.personal_signature" />
			</view>
		<view class="save">
			<text>完善个人信息，发现更多好邻居。</text>
			<button @click="pushEditInfo">保存修改信息</button>
		</view>
	</view>
</template>

<script>
import User from '../../../api/user';
export default {
	data() {
		return {
			// 是否成功修改信息
			editsucc: false,
			userinfo: undefined,
			speciality: '',
			hobby: '',
			radiolist: [
				{
					val: '1',
					value: 1,
					name: '男'
				},
				{
					val: '2',
					value: 2,
					name: '女'
				},
				{
					val: '0',
					value: 0,
					name: '保密'
				}
			]
		};
	},
	methods: {
		pushEditInfo() {
			let data = {};
			data.nickname = this.userinfo.nickname;
			data.headimgurl = this.userinfo.headimgurl;
			data.sex = this.userinfo.sex;
			data.personal_signature = this.userinfo.personal_signature;
			data.speciality = this.userinfo.speciality;
			data.hobby = this.userinfo.hobby;
			User.editInfo(data).then(res => {
				uni.hideLoading();
				if (res.data.error === 0) {
					this.editsucc = true;
					uni.showModal({
						title: '成功',
						content: '修改成功',
						confirmColor: '#3CC51F',
						showCancel: false,
						success: function() {
							uni.navigateBack();
						}
					});
				}
			});
		},
		toKeyWord(type, info) {
			var me = this;
			console.log(info);
			sessionStorage.setItem('keywordtype', type);
			sessionStorage.setItem('keywordindfo', encodeURIComponent(JSON.stringify(info)));
			uni.$once('edituserkeyword', function(data) {
				console.log(data);
				if (data.type === 'speciality') {
					me.userinfo.speciality = data.info;
					let speclen = me.userinfo.speciality.length;
					let specarr = [];
					for (let i = 0; i < speclen; i++) {
						specarr.push(me.userinfo.speciality[i].kind_name);
					}
					me.speciality = specarr.join();
				} else {
					me.userinfo.hobby = data.info;
					let hobblen = me.userinfo.hobby.length;
					let hobbarr = [];
					for (let i = 0; i < hobblen; i++) {
						hobbarr.push(me.userinfo.hobby[i].kind_name);
					}
					me.hobby = hobbarr.join();
				}
			});
			uni.navigateTo({
				url: 'keyword'
			});
		},
		radioChange: function(evt) {
			this.userinfo.sex = evt.target.value - '0';
		}
	},
	onUnload() {
		uni.$emit('edituserinfo', {
			edittype: this.editsucc
		});
	},
	onLoad() {
		var me = this;
		// 获取用户信息
		this.userinfo = uni.getStorageSync('userData');
		let speclen = this.userinfo.speciality.length;
		let hobblen = this.userinfo.hobby.length;
		let specarr = [];
		let hobbarr = [];
		for (let i = 0; i < speclen; i++) {
			specarr.push(this.userinfo.speciality[i].kind_name);
		}
		for (let i = 0; i < hobblen; i++) {
			hobbarr.push(this.userinfo.hobby[i].kind_name);
		}
		this.speciality = specarr.join();
		this.hobby = hobbarr.join();

		// uni.request({
		// 	url: this.SerUrl + '/app/member/info/getInfo',
		// 	method: 'POST',
		// 	data: {
		// 		token: "token",
		// 		user_id: 1,
		// 	},
		// 	success: (res) => {
		// 		this.userinfo = res.data.data
		// 		let speclen=res.data.data.speciality.length
		// 		let hobblen=res.data.data.hobby.length
		// 		let specarr=[]
		// 		let hobbarr=[]
		// 		for(let i=0;i<speclen;i++)
		// 		{
		// 			specarr.push(res.data.data.speciality[i].kind_name)
		// 		}
		// 		for(let i=0;i<hobblen;i++)
		// 		{
		// 			hobbarr.push(res.data.data.hobby[i].kind_name)
		// 		}
		// 		this.speciality=specarr.join()
		// 		this.hobby=hobbarr.join()
		// 		console.log(this.userinfo)
		// 	}
		// })
	}
};
</script>

<style>
page {
	font-size: 0;
	background: #f2f2f2;
}
.name {
	position: relative;
	height: 112upx;
	width: auto;
	padding-left: 52upx;
	padding-right: 53upx;
	background: #ffffff;
}
.name:after {
	content: '';
	position: absolute;
	left: 51upx;
	bottom: 0;
	height: 1px;
	width: 648upx;
	background-color: #d9d9d9;
}
text {
	font-size: 28upx;
	color: #000000;
	text-align: center;
	position: absolute;
	top: 43upx;
}
input {
	font-size: 28upx;
	color: #000000;
	text-align: right;
	position: absolute;
	top: 43upx;
	right: 55upx;
}
.estate {
	position: relative;
	height: 112upx;
	width: auto;
	background: #ffffff;
	padding-left: 52upx;
	padding-right: 53upx;
}
.estate:after {
	content: '';
	position: absolute;
	left: 51upx;
	bottom: 0;
	height: 1px;
	width: 648upx;
	background-color: #d9d9d9;
}

.sex {
	position: relative;
	height: 112upx;
	width: auto;
	background: #ffffff;
	padding-left: 52upx;
	padding-right: 53upx;
}
.sex:after {
	content: '';
	position: absolute;
	left: 51upx;
	bottom: 0;
	height: 1px;
	width: 648upx;
	background-color: #d9d9d9;
}
.radio {
	position: relative;
	display: flex;
	width: 106upx;
}
.radio_button {
	position: relative;
	padding-left: 36upx;
	left: 10upx;
	top: -3upx;
	transform: scale(0.7);
}
.radio_name {
	position: relative;
	font-size: 28upx;
	color: #000000;
	left: 250upx;
	top: 40upx;
	text-align: center;
}
.career {
	position: relative;
	height: 112upx;
	width: auto;
	background: #ffffff;
	padding-left: 52upx;
	padding-right: 53upx;
}
.career:after {
	content: '';
	position: absolute;
	left: 51upx;
	bottom: 0;
	height: 1px;
	width: 648upx;
	background-color: #d9d9d9;
}
.icon-right {
	position: absolute;
	top: 38upx;
	right: 45upx;
	font-size: 35upx;
}

.career_label {
	position: absolute;
	right: 35upx;
	width: 420upx;
	text-align: right;
	padding-left: 52upx;
	padding-right: 53upx;
	max-width: 280upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.hobby {
	position: relative;
	height: 112upx;
	width: auto;
	background: #ffffff;
	padding-left: 52upx;
	padding-right: 53upx;
}
.hobby:after {
	content: '';
	position: absolute;
	left: 51upx;
	bottom: 0;
	height: 1px;
	width: 648upx;
	background-color: #d9d9d9;
}
.hobby_label {
	position: absolute;
	right: 35upx;
	width: 420upx;
	text-align: right;
	padding-left: 52upx;
	padding-right: 53upx;
	max-width: 280upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.signture {
	position: relative;
	min-height: 153upx;
	width: auto;
	background: #ffffff;
	border-bottom: 1upx solid #d0d0d0;
	padding-left: 52upx;
	padding-right: 53upx;
}
.signture textarea {
	font-size: 28upx;
	color: #000000;
	text-align: left;
	position: relative;
	top: 43upx;
	margin-bottom: 83upx;
	width: 448upx;
	left: 198upx;
	min-height: 80upx;
}
.save {
	position: relative;
	bottom: 0;
	font-size: 0;
}
.save text {
	font-size: 24upx;
	color: #858585;
	line-height: 38upx;
	position: absolute;
	top: 25upx;
	left: 200upx;
	text-align: center;
}
.save button {
	position: absolute;
	top: 124upx;
	height: 90upx;
	width: 478upx;
	left: 137upx;
	background: #0cb957;
	border-radius: 45upx;
	font-size: 32upx;
	color: #ffffff;
	text-align: center;
	line-height: 90upx;
}
</style>
