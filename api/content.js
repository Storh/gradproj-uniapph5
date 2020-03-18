import Request from '../plugins/request/index';

// 1.2、 内容动态接口

export default {

	// 1.2.1、 获取动态记录列表
	getList(event_type, district_type, page, page_num, search_key) {
		return Request().post('/app/content/main/getList', {
			data: {
				event_type, // 页面类型（1：首页，2：乐享）
				district_type, // 社区筛选类型（1：社区，2：街道）
				page, // 页码，起始页为1，不填则表示不分页
				page_num, // 每页条数
				search_key // 搜索关键字
			},
		});
	},

	// 1.2.2、 获取动态记录详情
	getDetail(content_id) {
		return Request().post('/app/content/main/getDetailById', {
			data: {
				content_id
			},
		});
	},

	// 1.2.10、 提交发布动态接口
	addDetail(data) {
		return Request().post('/app/content/main/add', {
			data
		});
	},

	// 1.2.12、 编辑动态接口
	editDetail(data) {
		return Request().post('/app/content/main/edit', {
			data
		});
	},

	// 1.2.14、 删除动态接口
	delDetail(content_id) {
		return Request().post('/app/content/main/delete', {
			data: {
				content_id
			}
		});
	},

	// 1.2.38、 为动态点赞
	setLike(content_id, like_state) {
		return Request().post('/app/content/main/setLike', {
			data: {
				content_id,
				like_state
			}
		});
	},

	// 1.2.39、 为参与内容点赞
	registSetLike(regist_id, content_type_id, like_state) {
		return Request().post('/app/content/regist/setLike', {
			data: {
				regist_id,
				content_type_id,
				like_state
			}
		});
	},

	// 1.2.41、 收藏动态
	setCollect(content_id, collect_state) {
		return Request().post('/app/content/main/setCollect', {
			data: {
				content_id,
				collect_state
			}
		});
	},

	// 1.2.42、 获取推荐记录列表
	getRecommendList(content_id, district_type) {
		return Request().post('/app/content/main/recommendList', {
			data: {
				content_id,
				district_type
			}
		});
	},
};
