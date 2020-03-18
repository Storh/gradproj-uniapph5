<template>
	<view>
		<block v-if="addlist"><contacts-select-user :obtainContacts="addlist"></contacts-select-user></block>
	</view>
</template>

<script>
import User from '../../api/user';
import ContactsSelectUser from '../../components/contacts-select-user.vue';
export default {
	components: {
		ContactsSelectUser
	},
	data() {
		return {
			addlist: undefined
		};
	},
	methods: {},
	onLoad() {
		// 加载通讯录数据
		User.getAddressBookList(this.addpage, this.page_num).then(res => {
			this.addlist = res.data.data.list;
		});
	}
};
</script>

<style></style>
