<template>
  <div class="bake-completion-stove-chart-comp">
    <div id="bake-completion-stove-chart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'BakeCompletionStoveChart',
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
        this.chartData = this.dataMsg
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('bake-completion-stove-chart'))
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = {
          title: {
            text: '烘烤完成量炉数          {label|计划烘烤炉数:}  {num|100} {label|炉}',
            textStyle: {
              rich: {
                label: {
                  fontSize: 18,
                  fontWeight: 'bold',
                },
                num: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#E6A23C',
                }
              }
            },
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
              name: '完成炉数',
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
  .bake-completion-stove-chart-comp, #bake-completion-stove-chart{
    height: 100%;
  }
</style>
