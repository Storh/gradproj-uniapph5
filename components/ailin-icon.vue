<template>
	<view>
		<svg class="icon" aria-hidden="true">
		  <use :xlink:href="iconId"></use>
		</svg>
	</view>
</template>

<script>
	import AilinIconFont from "@/components/iconfont.js"
	export default {
		name: 'ailin-icon',
		props: {
			iconId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
			};
		},
		components:{
			AilinIconFont
		}
	}
	
</script>

<style>
	/* 引入图标 */
	.icon {
	  width: 1em;
	  height: 1em;
	  vertical-align: -0.15em;
	  fill: currentColor;
	  overflow: hidden;
	}
</style>
