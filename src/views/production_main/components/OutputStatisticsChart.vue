<template>
  <div class="output-statistics-chart-comp">
    <div id="output-statistics-chart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'OutputStatisticsChart',
    components: {

    },
    data() {
      return {
        chart: null,
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

      },
      initChart(){
        this.chart = echarts.init(document.getElementById('output-statistics-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = {
          title: {
            text: '出烟数据统计',
            left: '0'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            top: '5%',
            right: '5%'
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
              data: ['第一炉', '第二炉', '第三炉', '第四炉'],
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '平均含水率',
              type: 'bar',
              barGap: '0%',
              barWidth: '20%',
              data: [10, 52, 200, 334]
            },
            {
              name: '均叶重',
              type: 'bar',
              barGap: '0%',
              barWidth: '20%',
              data: [200, 334, 10, 52]
            }
          ]
        };
        this.chart.setOption(option)
      }
    }
  }

</script>

<style>
  .output-statistics-chart-comp, #output-statistics-chart{
    height: 100%;
  }
</style>
