<template>
	<view>
		<text>投诉反馈</text>
		<textarea :placeholder="words"></textarea>
		<button @click="subInfo">发送</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			words: ''
		};
	},
	methods: {
		subInfo() {}
	},
	onLoad(par) {
		if ((par.type = 'content')) {
			this.words = '请填写您的举报内容';
		}
	}
};
</script>

<style></style>
