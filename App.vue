<script>
	import User from 'api/user';
	export default {
		onLaunch: function() {
			// 隐藏底边栏
			uni.hideTabBar({});
			// 验证用户是否登录
			this.checkLogin();
		},
		onShow: function() {
			// console.log('App Show');
		},
		onHide: function() {
			// console.log('App Hide');
		},
		globalData: {
			TypeIndexCart: 0
		},
		methods: {
			// 验证是否登录过 登录超时在发送信息时验证
			checkLogin() {
				const userInfo = uni.getStorageSync('userData');
				if (userInfo) {
					// 用户已登录过
					User.getInfo(userInfo.user_id).then(res => {
						uni.setStorageSync('userData', res.data.data);
						// 是否已经添加小区信息
						if (userInfo.districts.estate.id) {
							// 判断用户权限
							this.managecomping(userInfo)
						} else {
							uni.showModal({
								title: '信息不完整',
								content: '信息不完整，请先补充信息',
								showCancel: false,
								confirmColor: '#3CC51F',
								success: function() {
									// 获取当前页面路径
									const pages = getCurrentPages();
									const route = pages[pages.length - 1].route;
									const fullPath = pages[pages.length - 1].$route.fullPath;
									console.log(route);
									// 设置跳转路由
									uni.setStorageSync('redirectUrl', fullPath);
									uni.setStorageSync('redirectRoute', route);
									uni.redirectTo({
										url: '/pages/register/register?uid=' + userInfo.user_id
									});
								}
							});
						}
					});
				} else {
					const wxlogin = uni.getStorageSync('wxlogin');
					if (wxlogin) {
						uni.removeStorageSync('wxlogin');
						// 处于微信绑定跳转期间
					} else {
						// 用户从未登录或清理缓存
						this.toLogin();
					}
				}
			},
			// 管理员身份处理
			managecomping(userinfo) {
				// 是管理员
				if (userinfo.is_manage == 1) {
					// 判断昵称首位
					if (userinfo.nickname.indexOf(this.ManagePading) != 0) {
						userinfo.nickname = this.ManagePading + userinfo.nickname
						this.changename(userinfo)
					}
				} else {
					// 测试
					// if (userinfo.nickname.indexOf(this.ManagePading) != 0) {
					// 	userinfo.nickname = this.ManagePading + userinfo.nickname
					// 	this.changename(userinfo)
					// }
					// 正式
					if (userinfo.nickname.indexOf(this.ManagePading) == 0) {
						userinfo.nickname = '昵称不合格请重新修改'
						this.changename(userinfo)
					}
				}
			},
			changename(userinfo) {
				let data = {};
				data.nickname = userinfo.nickname;
				data.headimgurl = userinfo.headimgurl;
				data.sex = userinfo.sex;
				data.personal_signature = userinfo.personal_signature;
				data.speciality = userinfo.speciality;
				data.hobby = userinfo.hobby;
				User.editInfo(data).then(res => {
					uni.setStorageSync('userData', userinfo);
				});
			},
			// 获取当前页面路径并跳转去登录
			toLogin() {
				uni.showModal({
					title: '未登录',
					content: '未登录，请登录或注册',
					showCancel: false,
					confirmColor: '#3CC51F',
					success: function() {
						// 获取当前页面路径
						const pages = getCurrentPages();
						const route = pages[pages.length - 1].route;
						const fullPath = pages[pages.length - 1].$route.fullPath;
						console.log(route);
						console.log(fullPath);
						// 设置跳转路由
						uni.setStorageSync('redirectUrl', fullPath);
						uni.setStorageSync('redirectRoute', route);
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				});
			}
		}
	};
</script>

<style>
	/*每个页面公共css */
</style>
