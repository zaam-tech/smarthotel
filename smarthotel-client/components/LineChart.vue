<script>
import Vue from 'vue'
import { Line, mixins } from 'vue-chartjs'
import { mapState } from 'vuex'
import globalOptionsMixin from '@/components/Charts/globalOptionsMixin'

export default {
	extends: Line,
	mixins: [mixins.reactiveProp, globalOptionsMixin],
	props: {
		chartData: {
			type: Array
		},
		label: {
			type: String
		},
		options: {
			type: Object
		},
		extraOptions: {
			type: Object,
			default: () => ({})
		}
	},
	mounted() {
		const dates = this.chartData.map(stat => stat.date)
		const totals = this.chartData.map(stat => stat.totals)
		this.renderChart(
			{
				labels: dates,
				datasets: [
					{
						label: this.label,
						data: totals
					}
				]
			},
			this.options
		)
		this.$watch(
			'chartData',
			(newVal, oldVal) => {
				if (!oldVal) {
					this.renderChart(this.chartData, this.extraOptions)
				}
			},
			{ immediate: true }
		)
	}
}
</script>
<style lang="scss">
@import '../../assets/mixins/index.scss';
</style>
