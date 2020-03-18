import Request from '../../plugins/request/index';

// 内容动态中的求助相关

export default {

	// 1.2.4、 获取求助参与详情列表
	getList(content_id, page_default_num, page, page_num) {
		return Request().post('/app/content/help/getListById', {
			data: {
				content_id,
				page,
				page_num,
				page_default_num
			},
		});
	},

	// 1.2.20、 会员参与求助接口
	addRegist(content_id, add_text) {
		return Request().post('/app/content/help/registAdd', {
			data: {
				content_id,
				add_text
			},
		});
	},

	// 1.2.21、 会员参与求助回复接口
	replyRegist(regist_id, reply_text) {
		return Request().post('/app/content/help/registReply', {
			data: {
				regist_id,
				reply_text
			},
		});
	},

	// 1.2.22、 会员参与求助删除参与记录接口
	delRegist(regist_id) {
		return Request().post('/app/content/help/registDelete', {
			data: {
				regist_id
			},
		});
	},

	// 1.2.23、 会员参与求助删除参与记录回复接口
	delReply(regist_id) {
		return Request().post('/app/content/help/registDeleteReply', {
			data: {
				regist_id
			},
		});
	},
};
