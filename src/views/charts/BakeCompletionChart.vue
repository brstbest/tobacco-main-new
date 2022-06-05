<template>
  <div class="bake-completion-chart-comp">
    <div id="bake-completion-chart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'BakeCompletionChart',
    components: {

    },
    props: ['dataMsg'],
    data() {
      return {
        chart: null,
        chartData: [],
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
        this.dataMsg.forEach(data => {
          this.chartData.push(data.toFixed(2))
        })
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('bake-completion-chart'))
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = {
          title: {
            text: '烘烤完成量（担）',
            left: '0'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['燃煤供热', '生物质颗粒', '电能', '空气能热泵'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '完成量',
              type: 'bar',
              barWidth: '40%',
              data: this.chartData
            }
          ]
        };
        this.chart.setOption(option)
      }
    }
  }

</script>

<style>
  .bake-completion-chart-comp, #bake-completion-chart{
    height: 100%;
  }
</style>
