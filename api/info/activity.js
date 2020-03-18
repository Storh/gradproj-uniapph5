import Request from '../../plugins/request/index';

// 内容动态中的活动相关

export default {
	// 1.2.3、 获取动态记录详情（活动）
	getDetail(content_id) {
		return Request().post('/app/content/activity/getDetailById', {
			data: {
				content_id
			},
		});
	},

	// 1.2.7、 获取活动参与详情列表
	getList(content_id, page_default_num, page, page_num) {
		return Request().post('/app/content/activity/getListById', {
			data: {
				content_id,
				page,
				page_num,
				page_default_num
			},
		});
	},

	// 1.2.11、 提交发布动态接口（活动）
	addActivity(data) {
		return Request().post('/app/content/activity/add', {
			data
		});
	},

	// 1.2.13、 编辑动态接口(活动)
	editActivity(data) {
		return Request().post('/app/content/activity/edit', {
			data
		});
	},

	// 1.2.32、 会员参与活动接口
	addRegist(content_id, remark) {
		return Request().post('/app/content/activity/registAdd', {
			data: {
				content_id,
				remark
			},
		});
	},
};
