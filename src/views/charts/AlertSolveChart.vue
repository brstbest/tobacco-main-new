<template>
  <div class="alert-solve-chart-comp">
    <div id='alert-solve-chart'></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'AlertSolveChart',
    components: {

    },
    props: ['dataMsg'],
    data() {
      return {
        chart: null,
        chartData: null,
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      this.initChart()
    },
    methods: {
      fetchData() {
        this.chartData = this.dataMsg
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('alert-solve-chart'))
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}预警: {c}个'
          },
          legend: {
            orient: 'vertical',
            top: '5%',
            right: '5%',
          },
          title: {
            text: '烘烤预警处理率',
            left: '0'
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '75%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              data: [
                { value: this.chartData[1], name: '已处理' },
                { value: this.chartData[0], name: '待处理' },
              ],
              label: {
                alignTo: 'edge',
                formatter: '{name|{b}}\n{time|{d}%}',
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 15,
                rich: {
                  time: {
                    fontSize: 16,
                    color: '#606266'
                  },
                  name: {
                    fontSize: 14,
                  }
                }
              },
            }
          ]
        };
        this.chart.setOption(option)
      }
    }
  }
</script>

<style>
  .alert-solve-chart-comp, #alert-solve-chart{
    height: 100%;
  }
</style>
