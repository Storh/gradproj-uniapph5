import Request from '../../plugins/request/index';

// 内容动态中的评论相关

export default {

	// 1.2.15、 获取动态记录评论列表
	getList(content_id, page_default_num, page, page_num) {
		return Request().post('/app/content/review/getListById', {
			data: {
				content_id,
				page,
				page_num,
				page_default_num
			},
		});
	},

	// 1.2.16、 为动态添加评论接口
	addReview(content_id, review_text) {
		return Request().post('/app/content/review/add', {
			data: {
				content_id,
				review_text
			},
		});
	},

	// 1.2.17、 回复评论接口
	replyReview(review_id, reply_text) {
		return Request().post('/app/content/review/reply', {
			data: {
				review_id,
				reply_text
			},
		});
	},

	// 1.2.18、 删除评论接口
	delReview(review_id) {
		return Request().post('/app/content/review/delete', {
			data: {
				review_id
			}
		});
	},

	// 1.2.19、 删除评论回复接口
	delReply(review_id) {
		return Request().post('/app/content/review/deleteReply', {
			data: {
				review_id
			}
		});
	},

	// 1.2.40、 为评论点赞
	setLike(review_id, like_state) {
		return Request().post('/app/content/review/setLike', {
			data: {
				review_id,
				like_state
			}
		});
	},
};
