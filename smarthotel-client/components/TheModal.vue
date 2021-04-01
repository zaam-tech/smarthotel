<template>
	<div class="modal-overlay" v-if="showModal">
		<slot name="help-modal" @click="toggleModal"></slot>
		<slot name="verify-modal" class="modal"></slot>
	</div>
</template>

<script>
import { bus } from '../layouts/default'
export default {
	data() {
		return {}
	},
	props: {
		showModal: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	methods: {
		toggleModal(event) {
			bus.$emit('toggleModal', false)
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
.modal-overlay {
	@include absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 98;
	height: 100%;
	@include flexCenterBoth;
}
.modal-body {
	@include absolute;
	top: 30%;
	left: 50%;
	transform: translate(-50%, -30%);
	background: var(--white);
	border-radius: 4px;
	width: 50%;
	max-width: 450px;
	z-index: 99;
	.modal-title {
		background: var(--light_grey);
		font-size: 1.2em;
		padding: 0.75em;
		border-bottom: 2px solid var(--grey);
	}
	.modal-content {
		height: 350px;
		overflow-y: scroll;
		padding: 1em 3em;
		ul {
			padding: 0;
			li {
				padding: 0.25em 0;
				list-style-type: disc;
			}
		}
		.input-group {
			@include flex;
		}
	}
	.buttons {
		@include flexCenter;
		border-top: 1px solid var(--grey);
		background: var(--light_grey);
		padding: 0 0.5em;
		.button {
			@include button;
			margin: 1em 0;
		}
		.button:last-of-type {
			margin-left: 1em;
			background: var(--primary);
			color: var(--white);
			border-color: var(--primary);
		}
		.button:first-of-type {
			border-color: var(--grey);
		}
	}
}
</style>
