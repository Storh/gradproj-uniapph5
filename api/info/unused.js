import Request from '../../plugins/request/index';

// 内容动态中的闲置相关

export default {

	// 1.2.6、 获取闲置参与详情列表
	getList(content_id, page_default_num, page, page_num) {
		return Request().post('/app/content/unused/getListById', {
			data: {
				content_id,
				page,
				page_num,
				page_default_num
			},
		});
	},

	// 1.2.28、 会员参与闲置接口
	addRegist(content_id, add_text) {
		return Request().post('/app/content/unused/registAdd', {
			data: {
				content_id,
				add_text
			},
		});
	},

	// 1.2.29、 会员参与闲置回复接口
	replyRegist(regist_id, reply_text) {
		return Request().post('/app/content/unused/registReply', {
			data: {
				regist_id,
				reply_text
			},
		});
	},

	// 1.2.30、 会员参与闲置删除参与记录接口
	delRegist(regist_id) {
		return Request().post('/app/content/unused/registDelete', {
			data: {
				regist_id
			},
		});
	},

	// 1.2.31、 会员参与闲置删除参与记录回复接口
	delReply(regist_id) {
		return Request().post('/app/content/unused/registDeleteReply', {
			data: {
				regist_id
			},
		});
	},

};
