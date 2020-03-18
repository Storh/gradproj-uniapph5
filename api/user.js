import Request from '../plugins/request/index';
// 通讯录和用户个人接口
export default {
	// 1.3.1、 获取通讯录列表
	getAddressBookList(page, page_num) {
		return Request().post('/app/addressBook/main/getList', {
			data: {
				page,
				page_num
			},
		});
	},

	// 1.5.1、 获取用户基本信息
	getInfo(user_id) {
		return Request().post('/app/member/info/getInfo', {
			data: {
				user_id
			},
		});
	},

	// 1.5.2、 编辑用户信息
	editInfo(data) {
		return Request().post('/app/member/info/edit', {
			data
		});
	},

	// 1.5.3、 用户发起的动态列表
	getSelfContentList(user_id, content_type, page, page_num) {
		return Request().post('/app/member/content/getListBySelf', {
			data: {
				page,
				page_num,
				user_id,
				content_type
			},
		});
	},

	// 1.5.4、 用户参与的动态列表
	getRegistContentListBy(content_type, page, page_num) {
		return Request().post('/app/member/content/getListByRegist', {
			data: {
				content_type,
				page,
				page_num
			},
		});
	},
	// 1.5.5、 我收藏的动态列表
	getCollectList(page, page_num) {
		return Request().post('/app/member/collect/getList', {
			data: {
				page,
				page_num
			},
		});
	},
};
