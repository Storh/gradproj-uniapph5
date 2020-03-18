import Request from '../plugins/request/index';

// 1.6、 基础数据接口

export default {
	// 1.6.1、 获取街道小区列表
	getDistList() {
		return Request().post('/app/baseData/distList', {
			data: {}
		});
	},
	// 1.6.2、 获取职业特长列表
	getSpecialityList() {
		return Request().post('/app/baseData/specialityList', {
			data: {}
		});
	},

	// 1.6.3、 获取业余爱好列表
	getHobbyList() {
		return Request().post('/app/baseData/hobbyList', {
			data: {}
		});
	},

	// 1.7.1、 上传图片通用接口
	uploadPhoto(path, file_type) {
		let token = uni.getStorageSync('webToken');
		let r = Request();
		let instance = r.upload('/app/uploadFile/uploadPhoto', {
			name: 'file_data',
			filePath: path,
			header: {},
			formData: {
				token: token,
				file_type
			},
			// onProgressUpdate(res) {
			//     console.log('onProgressUpdate',res);
			// }
		});

		// 10s 之后还没上传完成就中断上传，会进入 catch 回调中
		setTimeout(() => {
			r.abort(instance);
		}, 10000);

		return instance;
	},

	// 1.7.2、 删除文件通用接口
	delPhoto(id, file_type) {
		return Request().post('/app/uploadFile/delete', {
			data: {
				id,
				file_type
			}
		});
	},

	// 1.7.3、 获取用户未提交保存的上传文件接口
	getListUnSave(file_type) {
		return Request().post('/app/uploadFile/getListUnSave', {
			data: {
				file_type
			}
		});
	},
};
