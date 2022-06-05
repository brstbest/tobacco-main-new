<template>
  <div class="bakery-kind-chart-comp">
    <div id="bakery-kind-chart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'BakeryKindChart',
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
        this.chart = echarts.init(document.getElementById('bakery-kind-chart'))
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = {
          title: {
            text: '烤房类型数量分布（座）',
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
  .bakery-kind-chart-comp, #bakery-kind-chart{
    height: 100%;
  }
</style>
