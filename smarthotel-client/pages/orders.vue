<template>
    <div>

    </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
export default{
	data() {
		return {
			Orders: [],
		}
	},
	computed: mapState(['dates', 'orders']),
	created() {
		const { orders } = this.orders
		this.Orders = orders
		const { dates } = this.dates
		const date = {
			...dates,
		}
	},
	methods: {
		...mapActions({
			setDate: 'formatDate/setDate',
		}),
		formatDate(date) {
			this.setDate(date)
		},
	},
}
</script>

<style lang="scss" scoped>
</style>