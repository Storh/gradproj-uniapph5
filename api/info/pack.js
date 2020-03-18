import Request from '../../plugins/request/index';

// 内容动态中的团购相关

export default {

	// 1.2.5、 获取动态记录详情（拼团）
	getPackDetail(content_id) {
		return Request().post('/app/content/pack/getDetailById', {
			data: {
				content_id
			},
		});
	},

	// 1.2.6、 获取拼团参与列表（拼团-用户）
	getList(content_id, page_default_num, page, page_num) {
		return Request().post('/app/content/pack/getListById', {
			data: {
				content_id,
				page,
				page_num,
				page_default_num
			},
		});
	},

	// 1.2.7、 获取拼团商品列表（拼团-商品）
	getGoodsList(content_id) {
		return Request().post('/app/content/pack/getGoodsListById', {
			data: {
				content_id
			},
		});
	},
	// 1.2.8、 获取拼团参与列表（拼团-订单）
	getOrderList(content_id) {
		return Request().post('/app/content/pack/getOrderListById', {
			data: {
				content_id
			},
		});
	},
	// 1.2.9、 获取拼团商品列表（拼团-商品明细）
	getSelfGoodsInfo(content_id) {
		return Request().post('/app/content/pack/getSelfGoodsInfoById', {
			data: {
				content_id
			},
		});
	},
	// 1.2.16、 提交发布动态接口（拼团）
	addPack(data) {
		return Request().post('/app/content/pack/add', {
			data
		});
	},

	// 1.2.19、 编辑动态接口（拼团）
	editPackInfo(data) {
		return Request().post('/app/content/pack/edit', {
			data
		});
	},

	// 1.2.39、 会员参与拼团接口
	addRegist(data) {
		return Request().post('/app/content/pack/registAdd', {
			data
		});
	},
	// 1.5.4、 用户发起的动态列表（拼团）
	userPushPackList(page, page_num) {
		return Request().post('/app/member/contentPack/getListBySelf', {
			data: {
				page,
				page_num,
			},
		});
	},
	// 1.5.6、 用户参与的动态列表（拼团）
	userRegistPackList(page, page_num) {
		return Request().post('/app/member/contentPack/getListByRegist', {
			data: {
				page,
				page_num,
			},
		});
	},
};
