<template>
  <div class="curve-execution-chart-comp">
    <div id="curve-execution-chart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'CurveExecutionChart',
    components: {

    },
    created() {
      this.fetchData()
    },
    mounted() {
      this.initChart()
    },
    data() {
      return {
        chart: null,
      }
    },
    methods: {
      fetchData() {

      },
      initChart(){
        this.chart = echarts.init(document.getElementById('curve-execution-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}选择次数: {c}次'
          },
          title: {
            text: '工艺执行情况',
            left: '0'
          },
          grid: [
            {
              right: '5%',
              width: '25%'
            },
          ],
          xAxis: [
            {
              type: 'category',
              data: ['推荐', '自定义'],
              gridIndex: 0,
            },
          ],
          yAxis: [
            {
              type: 'value',
              gridIndex: 0,
            },
          ],
          series: [
            {
              type: 'pie',
              radius: '60%',
              center: ["30%", "50%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold',
                position: 'inside',
                formatter: '{b}\n{d}%'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '14',
                  fontWeight: 'bold',
                  formatter: '{b}\n{d}%'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 735, name: '推荐曲线' },
                { value: 2048, name: '自定义曲线' },
              ]
            },
            {
              data: [735, 2048],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        };
        this.chart.setOption(option)
      }
    }
  }
</script>

<style>
  .curve-execution-chart-comp, #curve-execution-chart{
    height: 100%;
  }
</style>
