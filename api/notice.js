import Request from '../plugins/request/index';

// 1.4、 通知页接口

export default {
	// 1.4.1、 获取通知列表
	getList(page, page_num) {
		return Request().post('/app/notice/main/getList', {
			data: {
				page,
				page_num
			},
		});
	},
	// 1.4.2、 标记通知已读状态
	setRead(id) {
		return Request().post('/app/notice/main/setRead', {
			data: {
				id
			},
		});
	},

	// 1.4.3、 获取系统通知详情
	getOfficialDetail(notice_id) {
		return Request().post('/app/notice/official/getDetailById', {
			data: {
				notice_id
			},
		});
	}
};
