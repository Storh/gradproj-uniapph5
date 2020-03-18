import Request from '../plugins/request/index';

// 1.1、 会员登录等基本操作

export default {

	// 1.1.3、 微信绑定手机号
	bindPhone(phone, sms_code) {
		return Request().post('/app/member/phoneLogin/bindPhoneByWx', {
			data: {
				phone,
				sms_code
			},
		});
	},

	// 1.1.6、 注册后完善用户信息
	setInfo(nickname, district_id) {
		return Request().post('/app/member/info/reg', {
			data: {
				nickname,
				district_id
			},
		});
	},

	// 1.1.7、 退出登录
	setRead() {
		return Request().post('/app/member/login/logout', {
			data: {}
		});
	},
};
