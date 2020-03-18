import Request from '../../plugins/request/index';

// 内容动态中的话题相关

export default {

	// 1.2.9、 获取话题参与详情列表
	getList(content_id, page_default_num, page, page_num) {
		return Request().post('/app/content/topic/getListById', {
			data: {
				content_id,
				page,
				page_num,
				page_default_num
			},
		});
	},

	// 1.2.34、 会员参与话题接口
	addRegist(content_id, add_text) {
		return Request().post('/app/content/topic/registAdd', {
			data: {
				content_id,
				add_text
			},
		});
	},

	// 1.2.35、 会员参与话题回复接口
	replyRegist(regist_id, reply_text) {
		return Request().post('/app/content/topic/registReply', {
			data: {
				regist_id,
				reply_text
			},
		});
	},

	// 1.2.36、 会员参与话题删除参与记录接口
	delRegist(regist_id) {
		return Request().post('/app/content/topic/registDelete', {
			data: {
				regist_id
			},
		});
	},

	// 1.2.37、 会员参与话题删除参与记录回复接口
	delReply(regist_id) {
		return Request().post('/app/content/topic/registDeleteReply', {
			data: {
				regist_id
			},
		});
	},
};
