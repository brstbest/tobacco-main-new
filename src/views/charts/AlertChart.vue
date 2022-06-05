<template>
  <div class="alert-chart-comp">
    <div id='alert-chart'></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'AlertChart',
    components: {

    },
    props: ['dataMsg'],
    data() {
      return {
        chart: null,
        chartData: [
          ['故障类型', '故障1', '故障2', '故障3', '故障4', '故障5', '故障6', '故障7'],
          ['1', 0, 0, 0, 0, 0, 0, 0],
          ['2', 0, 0, 0, 0, 0, 0, 0],
          ['3', 0, 0, 0, 0, 0, 0, 0],
          ['4', 0, 0, 0, 0, 0, 0, 0],
        ],
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
        for(let i=0; i<this.dataMsg.length; i++){
          for(let j=0; j<this.dataMsg[i].length; j++){
            this.chartData[i+1][j+1] = this.dataMsg[i][j]
          }
        }
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('alert-chart'))
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = option = {
          tooltip: {},
          title: {
            text: '烤房故障比',
            left: '0'
          },
          dataset: {
            source: this.chartData
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['11%', '50%'],
              seriesLayoutBy: 'row'
            },
            {
              type: 'pie',
              radius: '65%',
              center: ['37%', '50%'],
              encode: {
                itemName: '故障类型',
                value: '2'
              },
              seriesLayoutBy: 'row'
            },
            {
              type: 'pie',
              radius: '65%',
              center: ['63%', '50%'],
              encode: {
                itemName: '故障类型',
                value: '3'
              },
              seriesLayoutBy: 'row'
            },
            {
              type: 'pie',
              radius: '65%',
              center: ['89%', '50%'],
              encode: {
                itemName: '故障类型',
                value: '4'
              },
              seriesLayoutBy: 'row'
            },
          ]
        };
        this.chart.setOption(option)
      }
    }
  }
</script>

<style>
  .alert-chart-comp, #alert-chart{
    height: 100%;
  }
</style>
