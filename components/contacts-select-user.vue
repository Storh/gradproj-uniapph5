<template>
	<view class="usercontacts">
		<!-- 搜索-->
		<view class="user-serach" id="user-letter-input"><input @input="keyInput" placeholder="请输入用户昵称" class="user-serach-input" /></view>
		<!-- 用户列表(搜索前) -->
		<view class="users" v-if="!serachUser">
			<view v-for="(user, index) in handleContacts" :key="'fc' + index">
				<block v-if="user.isUser">
					<view class="users-item-letter" :id="'user-letter-' + user.firstLetter">{{ user.firstLettershow }}</view>
					<view class="showaddlist" v-for="(citem, index) in user.users" :key="index" @click="toUser(citem)">
						<block v-if="citem.nickname.indexOf(ManagePading)==0">
							<image class="img" :src="ManageHimg"></image>
							<text class="nickname" :style="ManageStyle">{{ ManageName }}</text>
						</block>
						<block v-else>
							<image class="img" :src="citem.headimgurl"></image>
							<text class="nickname">{{ citem.nickname }}</text>
						</block>
						<view class="message" style="widows: 100upx;" v-if="citem.personal_signature">{{ citem.personal_signature }}</view>
						<view class="message" style="widows: 100upx;" v-else>该用户没有个性签名</view>
						<view v-if="index + 1 != user.users.length" class="showaddlistafter"></view>
					</view>
				</block>
			</view>
		</view>
		<!-- 用户列表(搜索后)  -->
		<view class="users" v-if="serachUser">
			<view class="showaddlist" v-for="(item, index) in searchDatas" :key="'s' + index" @click="toUser(item)">
				<block v-if="item.nickname.indexOf(ManagePading)==0">
					<image class="img" :src="ManageHimg"></image>
					<text class="nickname" :style="ManageStyle">{{ ManageName }}</text>
				</block>
				<block v-else>
					<image class="img" :src="item.headimgurl"></image>
					<text class="nickname">{{ item.nickname }}</text>
				</block>
				<view class="message" style="widows: 100upx;" v-if="item.personal_signature">{{ item.personal_signature }}</view>
				<view class="message" style="widows: 100upx;" v-else>该用户没有个性签名</view>
			</view>
		</view>
		<view class="bottomInfo"><text>—— 已经到底了 ——</text></view>
		<!-- 用户选择索引-->
		<view class="user-indexs-view" v-if="!serachUser">
			<view class="user-indexs">
				<view @click="userIndex(0)">0</view>
				<view v-for="(userIns, index) in contactsIndexs" :key="index">
					<view v-if="userIns > '9'" @click="userIndex(userIns)">{{ userIns }}</view>
					<view v-else-if="userIns < '0'" @click="userIndex(userIns)">{{ userIns }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'contacts-select-user',
		props: {
			//通讯录清单
			obtainContacts: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				contactsData: [],
				handleContacts: [], // 要显示的通讯录
				contactsIndexs: [], // 通讯录索引
				serachUser: '', // 搜索的用户
				// 顶部内容高度
				xxhight: 50
			};
		},
		created() {
			// 初始化通讯录数据
			this.contactsData = this.obtainContacts;
			this.xxhight = uni.upx2px(119);
			this.initializationContacts();
			this.buildContactsindexs();
		},
		computed: {
			/**
			 * @desc 搜索后的用户列表
			 * @return Array
			 */
			searchDatas() {
				var searchData = [];
				for (let i = 0; i < this.contactsData.length; i++) {
					if (this.contactsData[i].nickname.indexOf(this.serachUser) !== -1) {
						searchData.push(this.contactsData[i]);
					}
				}
				return searchData;
			}
		},
		methods: {
			//前往用户
			toUser(user) {
				const mineinfo = uni.getStorageSync('userData');
				if (user.user_id == mineinfo.user_id) {
					uni.navigateTo({
						url: '/pages/mine/minebycon'
					});
				} else {
					uni.navigateTo({
						url: '/pages/user/user?id=' + user.user_id
					});
				}
			},
			/**
			 * @desc 滑动到城市索引所在的地方
			 * @param id String 城市索引
			 */
			userIndex(id) {
				if (id == '#') id = '00';
				if (id == '0') id = 'input';
				//创建节点查询器
				const query = uni.createSelectorQuery().in(this);
				var that = this;
				//滑动到指定位置
				var item = 'user-letter-' + id;
				var element = document.getElementById(item); //利用Id找到对应的需要滚动的区域
				uni.pageScrollTo({
					scrollTop: element.offsetTop + that.xxhight,
					duration: 150
				});
			},
			/**
			 * @desc 监听输入框的值
			 */
			keyInput(event) {
				this.serachUser = event.detail.value;
				this.$emit('focuseInput', event.detail.value);
			},
			/**
			 * @desc 初始化通讯录数据
			 * @return undefind
			 */
			initializationContacts() {
				this.handleContacts = [];
				const contactsLetterArr = [
					'0',
					'1',
					'2',
					'3',
					'4',
					'5',
					'6',
					'7',
					'8',
					'9',
					'A',
					'B',
					'C',
					'D',
					'E',
					'F',
					'G',
					'H',
					'I',
					'J',
					'K',
					'L',
					'M',
					'N',
					'O',
					'P',
					'Q',
					'R',
					'S',
					'T',
					'U',
					'V',
					'W',
					'X',
					'Y',
					'Z',
					'00'
				];
				const contactsLetterArrShow = [
					'0',
					'1',
					'2',
					'3',
					'4',
					'5',
					'6',
					'7',
					'8',
					'9',
					'A',
					'B',
					'C',
					'D',
					'E',
					'F',
					'G',
					'H',
					'I',
					'J',
					'K',
					'L',
					'M',
					'N',
					'O',
					'P',
					'Q',
					'R',
					'S',
					'T',
					'U',
					'V',
					'W',
					'X',
					'Y',
					'Z',
					'#'
				];
				for (let index = 0; index < contactsLetterArr.length; index++) {
					this.handleContacts.push({
						firstLetter: contactsLetterArr[index],
						firstLettershow: contactsLetterArrShow[index],
						isUser: false, // 用于区分是否含有当前字母开头用户
						users: [] // 存放用户首字母含是此字母的数组
					});
				}
			},
			/**
			 * @desc 构建通讯录索引
			 * @return undefind
			 */
			buildContactsindexs() {
				this.contactsIndexs = [];
				for (let i = 0; i < this.contactsData.length; i++) {
					// 获取首字母
					let firstLetter = this.contactsData[i].name_first_letter;
					let index = this.userIndexPosition(firstLetter);
					if (this.contactsIndexs.indexOf(firstLetter) === -1) {
						this.handleContacts[index].isUser = true;
						this.contactsIndexs.push(firstLetter);
					}
					this.handleContacts[index].users.push(this.contactsData[i]);
				}
			},
			userIndexPosition(letter) {
				const userLetterArr = [
					'0',
					'1',
					'2',
					'3',
					'4',
					'5',
					'6',
					'7',
					'8',
					'9',
					'A',
					'B',
					'C',
					'D',
					'E',
					'F',
					'G',
					'H',
					'I',
					'J',
					'K',
					'L',
					'M',
					'N',
					'O',
					'P',
					'Q',
					'R',
					'S',
					'T',
					'U',
					'V',
					'W',
					'X',
					'Y',
					'Z',
					'#'
				];
				return userLetterArr.indexOf(letter);
			}
		}
	};
</script>

<style lang="scss">
	.user-select-main {
		position: relative;
		width: 100%;
	}

	// 索引列表
	.user-indexs-view {
		// position: absolute;
		position: fixed;
		right: 0;
		// top: 119upx;
		top: 0;
		// z-index: 999;
		display: flex;
		width: 40upx;
		height: 100%;
		text-align: center;

		.user-indexs {
			width: 40upx;
			text-align: center;
			vertical-align: middle;
			align-self: center;

			>view {
				// margin-bottom: 20upx;
				margin-bottom: 10upx;
				width: 40upx;
				// font-size: 12px;
				font-size: 8px;
				color: #96979d;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}

	// 首字母
	.users-item-letter {
		padding-left: 50upx;
		margin-top: 5upx;
		line-height: 70upx;
		font-size: 30upx;
		color: #9b9b9b;
		background: #f6f5fa;
	}

	// 用户列表
	.users {}

	// 搜索栏
	.user-serach {
		// width: 100%;
		color: #4a4a4a;
		padding-left: 30upx;
		padding-right: 40upx;
	}

	.user-serach-input {
		line-height: 80upx;
		margin: 16upx 0;
		height: 80upx;
		font-size: 26upx;
		padding: 0 20upx;
		border: 1px solid #d9d9d9;
		border-radius: 20px;
	}

	// 通讯录大体
	.usercontacts {
		width: 100%;
		// height: 444px;
		position: relative;

		// width: 100vw;
		// height: 100vh;
	}

	// 用户头像
	.img {
		width: 74upx;
		height: 74upx;
		border-radius: 50%;
		position: relative;
		left: 28upx;
	}

	// 用户昵称
	.nickname {
		font-size: 28upx;
		color: #000000;
		line-height: 38upx;
		font-weight: bold;
		position: absolute;
		left: 120upx;
	}

	.nickname span {
		font-weight: normal;
	}

	// 个性签名
	.message {
		position: absolute;
		left: 120upx;
		top: 55upx;
		font-size: 24upx;
		color: #858585;
		line-height: 38upx;
		max-width: 552upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.common {
		position: absolute;
		width: 100%;
		top: 131upx;
		font-size: 0;
	}

	.bottomInfo {
		width: 100%;
		height: 150upx;
		font-size: 24upx;
		text-align: center;
	}

	// 用户列表
	.showaddlist {
		position: relative;
		display: flex;
		width: 100%;
		padding-top: 19upx;
		padding-bottom: 20upx;
		font-size: 0;
		height: auto;
		overflow: auto;
	}

	.showaddlistafter {
		content: '';
		position: absolute;
		left: 120upx;
		bottom: 0;
		height: 1px;
		width: 630upx;
		background-color: #d9d9d9;
	}
</style>
