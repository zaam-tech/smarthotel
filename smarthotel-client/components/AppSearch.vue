<template>
	<section>
		<form>
			<span class="material-icons">search</span>
			<input type="text" name="" v-model="value" class="input" placeholder="Search Product....">
			<input type="submit" @click.prevent="findProduct" value="search" class="btn">
		</form>
	</section>
</template>
<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
import { mapState, mapActions } from 'vuex'
export default {
	data() {
		return {
			value: '',
		}
	},
	computed: mapState(['product']),
	methods: {
		...mapActions({
			searchProduct: 'product/searchProduct',
			selectCategory: 'product/selectCategory',
		}),
		async search() {
			await this.searchProduct(this.value)
		},
		async findProduct() {
			await this.search()
			const category = {
				name: this.product.selectedProduct[0].category,
			}
			this.selectCategory(category)
			bus.$emit('productUpdated')
			const { response } = this.product
			if (!response.success) {
				bus.$emit('showPopup', response)
			}
		},
		
	},
}
</script>
<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
section {
	@include flexCenter;
	margin-bottom: 20px;
	width: 100%;
}
form {
	@include flex;
	@include relative;
	width: 87%;
	.material-icons {
		@include absolute;
		top: 10px;
		left: 10px;
	}
	.input {
		padding: 5px 0;
		padding-left: 40px;
		border: 1px solid #f0f0f0;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		width: 80%;
		font-family: Nunito;
		height: 40px;
		margin-right: 10px;
		color: #333;
		font-family: var(--mont);
		font-size: 15px;
		&:focus {
			outline: none;
		}
	}
}
.btn {
	@include btn;
	justify-self: center;
	padding: 10px 40px;
	width: auto;
	height: 40px;
}
</style>
