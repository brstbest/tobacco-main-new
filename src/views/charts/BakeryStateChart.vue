<template>
  <div class="bakery-state-chart-comp">
    <div id='bakery-state-chart'></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'BakeryStateChart',
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
        this.chart = echarts.init(document.getElementById('bakery-state-chart'))
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}重量: {c}kg'
          },
          legend: {
            orient: 'vertical',
            top: '5%',
            right: '5%',
          },
          title: {
            text: '烤房状态占比',
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
                { value: 2048, name: '正常运行' },
                { value: 673, name: '待烤' },
                { value: 231, name: '异常运行' },
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
  .bakery-state-chart-comp, #bakery-state-chart{
    height: 100%;
  }
</style>
