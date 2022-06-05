<template>
  <div class="yellow-green-rate-chart-comp">
    <div id='yellow-green-rate-chart'></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'YellowGreenRateChart',
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
        this.chart = echarts.init(document.getElementById('yellow-green-rate-chart'))
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}率: {d}%'
          },
          legend: {
            orient: 'vertical',
            top: '5%',
            right: '5%',
          },
          title: {
            text: '出烟状态占比',
            left: '0'
          },
          series: [
            {
              type: 'pie',
              radius: '75%',
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              data: [
                { value: this.chartData, name: '黄烟' },
                { value: 100 - this.chartData, name: '青杂烟' },
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
  .yellow-green-rate-chart-comp{
    height: 100%;
  }
  #yellow-green-rate-chart{
    height: 100%;
  }
</style>
