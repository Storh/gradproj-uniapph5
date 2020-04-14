<script>
	import User from 'api/user';
	export default {
		onLaunch: function() {
			// 隐藏底边栏
			uni.hideTabBar({});
			// 验证用户是否登录
			this.checkLogin();
		},
		globalData: {
			// 用于全局分别当前页面类型是首页还是乐享
			TypeIndexCart: 0
		},
		methods: {
			// 验证是否登录过 登录超时在发送信息时验证
			checkLogin() {
				const token = uni.getStorageSync('webToken');
				const userInfo = uni.getStorageSync('userData');
				if (userInfo&&token) {
					// 必须用户曾经的信息和token都存在才算用户已登录过
					User.getInfo(userInfo.user_id).then(res => {
						uni.setStorageSync('userData', res.data.data);
						// 是否已经添加小区信息
						if (!userInfo.districts.estate.id) {
							uni.showModal({
								title: '信息不完整',
								content: '信息不完整，请先补充信息',
								showCancel: false,
								confirmColor: '#3CC51F',
								success: function() {
									uni.redirectTo({
										url: '/pages/register/register?uid=' + userInfo.user_id
									});
								}
							});
						}
					});
				} else {
					// 用户从未登录或清理缓存
					this.toLogin();
				}
			}, // 获取当前页面路径并跳转去登录
			toLogin() {
				uni.showModal({
					title: '未登录',
					content: '未登录，请登录或注册',
					showCancel: false,
					confirmColor: '#3CC51F',
					success: function() {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				});
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
