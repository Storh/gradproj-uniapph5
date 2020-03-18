<template>
	<view v-if="userinfo">
		<!-- 用户信息展示 -->
		<view class="name">
			<text class="left_text">姓名</text>
			<block v-if="userinfo.nickname.indexOf(ManagePading)==0">
				<text class="first_right_text" :style="ManageStyle">{{ ManageName }}</text>
			</block>
			<block v-else>
				<text class="first_right_text">{{ userinfo.nickname }}</text>
			</block>
		</view>
		<view class="estate">
			<text class="left_text">小区</text>
			<text class="first_right_text">{{ userinfo.districts.estate.name }}</text>
		</view>
		<view class="sex">
			<text class="left_text">性别</text>
			<text class="first_right_text">{{ sexlist[userinfo.sex] }}</text>
		</view>
		<block v-if="showInfoSp">
			<view class="career">
				<text class="left_text">职业特长</text>
				<text v-if="speciality" class="second_right_text">{{ speciality }}</text>
				<text v-else class="second_right_text">暂未填写</text>
			</view>
		</block>
		<block v-else>
			<view class="career">
				<text class="left_text">职业特长</text>
				<text style="color:#0081F8;" class="second_right_text">{{ notShowInfo }}</text>
			</view>
		</block>
		<block v-if="showInfoHb">
			<view class="hobby">
				<text class="left_text">兴趣爱好</text>
				<text v-if="hobby" class="second_right_text">{{ hobby }}</text>
				<text v-else class="second_right_text">暂未填写</text>
			</view>
		</block>
		<block v-else>
			<view class="hobby">
				<text class="left_text">兴趣爱好</text>
				<text style="color:#0081F8;" class="second_right_text">{{ notShowInfo }}</text>
			</view>
		</block>
		<view class="signture">
			<text class="left_text">个性签名</text>
			<text v-if="userinfo.personal_signature" class="right_sign_text">{{ userinfo.personal_signature }}</text>
			<text v-else class="right_sign_text">该用户没有个性签名</text>
		</view>
	</view>
</template>

<script>
	import User from '../../api/user';
	export default {
		data() {
			return {
				notShowInfo: '请先完善个人信息',
				showInfoSp: false,
				showInfoHb: false,
				showInfoSig: false,
				userinfo: undefined,
				sexlist: ['未知', '男', '女'],
				speciality: '',
				hobby: ''
			};
		},
		methods: {
			comdata(info) {
				let speclen = info.speciality.length;
				let hobblen = info.hobby.length;
				let specarr = [];
				let hobbarr = [];
				for (let i = 0; i < speclen; i++) {
					specarr.push(info.speciality[i].kind_name);
				}
				for (let i = 0; i < hobblen; i++) {
					hobbarr.push(info.hobby[i].kind_name);
				}
				this.speciality = specarr.join();
				this.hobby = hobbarr.join();
			}
		},
		onLoad(params) {
			// 获取用户详细信息
			User.getInfo(params.id).then(res => {
				this.userinfo = res.data.data;
				this.comdata(res.data.data);
			});
			const mineInfo = uni.getStorageSync('userData');
			if (mineInfo.speciality.length > 0) {
				this.showInfoSp = true;
			}
			if (mineInfo.hobby.length > 0) {
				this.showInfoHb = true;
			}
			if (mineInfo.personal_signature.length > 0) {
				this.showInfoSig = true;
			}
		}
	};
</script>

<style>
	page {
		font-size: 0;
		background: #f2f2f2;
	}

	.left_text {
		font-size: 28upx;
		color: #000000;
		text-align: center;
		height: 40upx;
		position: relative;
		top: 43upx;
		left: 0upx;
	}

	.name {
		position: relative;
		min-height: 112upx;
		width: auto;
		padding-left: 52upx;
		padding-right: 53upx;
		background: #ffffff;
	}

	.first_right_text {
		position: absolute;
		color: #000000;
		font-size: 28upx;
		top: 43upx;
		right: 53upx;
		opacity: 0.5;
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

	.estate {
		position: relative;
		min-height: 112upx;
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
		min-height: 112upx;
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

	.career {
		display: flex;
		position: relative;
		min-height: 112upx;
		width: auto;
		background: #ffffff;
		padding-left: 52upx;
		padding-right: 53upx;
	}

	.second_right_text {
		position: relative;
		color: #000000;
		font-size: 28upx;
		top: 43upx;
		right: -135upx;
		width: 400upx;
		min-height: 40upx;
		text-align: right;
		margin-bottom: 70upx;
		opacity: 0.5;
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

	.hobby {
		display: flex;
		position: relative;
		min-height: 112upx;
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

	.signture {
		display: flex;
		position: relative;
		min-height: 153upx;
		width: auto;
		background: #ffffff;
		border-bottom: 1upx solid #d0d0d0;
		padding-left: 52upx;
		padding-right: 53upx;
	}

	.right_sign_text {
		position: relative;
		color: #000000;
		font-size: 28upx;
		top: 43upx;
		right: -140upx;
		width: 400upx;
		min-height: 40upx;
		text-align: right;
		margin-bottom: 70upx;
		opacity: 0.5;
		word-wrap: break-word;
		word-break: break-all;
	}
</style>
