import Request from '../../plugins/request/index';

// 内容动态中的问答相关

export default {

	// 1.2.5、 获取问答参与详情列表
	getList(content_id, page_default_num, page, page_num) {
		return Request().post('/app/content/question/getListById', {
			data: {
				content_id,
				page,
				page_num,
				page_default_num
			},
		});
	},

	// 1.2.24、 会员参与问答接口
	addRegist(content_id, add_text) {
		return Request().post('/app/content/question/registAdd', {
			data: {
				content_id,
				add_text
			},
		});
	},

	// 1.2.25、 会员参与问答回复接口
	replyRegist(regist_id, reply_text) {
		return Request().post('/app/content/question/registReply', {
			data: {
				regist_id,
				reply_text
			},
		});
	},

	// 1.2.26、 会员参与问答删除参与记录接口
	delRegist(regist_id) {
		return Request().post('/app/content/question/registDelete', {
			data: {
				regist_id
			},
		});
	},

	// 1.2.27、 会员参与问答删除参与记录回复接口
	delReply(regist_id) {
		return Request().post('/app/content/question/registDeleteReply', {
			data: {
				regist_id
			},
		});
	},
};
