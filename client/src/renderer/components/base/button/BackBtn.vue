<template>
	<button @click="handleGoBack()" ref="button" class="btn back-btn disabled">
		<font-awesome-icon :icon="['fas', 'arrow-circle-left']" class="icon" />
		Back
	</button>
</template>

<script>
// Font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowCircleLeft)

export default {
	name: 'BackBtn',

	data() {
		return {
			lastRoutePath: null
		}
	},

	watch: {
		$route() {
			this.$refs.button.classList.remove('disabled')
		}
	},

	methods: {
		handleGoBack() {
			if (this.$route.name !== this.lastRoutePath) {
				this.lastRoutePath = this.$route.path
				this.$router.back()
				this.$refs.button.classList.add('disabled')
			} else {
				// console.log('trying to go to the same route')
				// console.log('lastRoutePath: ', this.lastRoutePath)
				// console.log('this.$route: ', this.$route.name)
				this.$refs.button.classList.add('disabled')
			}
		}
	}
}
</script>

<style scoped lang="scss">

	button.back-btn {
		color: #fff;
		
		// .icon {}
	}
</style>