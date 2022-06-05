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
        this.chart = echarts.init(document.getElementById('yellow-green-rate-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}重量: {c}kg'
          },
          title: {
            text: '黄青杂烟占比',
            left: '0'
          },
          series: [
            {
              type: 'pie',
              radius: '70%',
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold',
                position: 'inside',
                formatter: '{b}率\n{d}%'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold',
                  formatter: '{b}率\n{d}%'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 2048, name: '黄烟' },
                { value: 673, name: '青杂烟' },
              ]
            }
          ]
        };
        this.chart.setOption(option)
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0,
        });
        this.chart.on('mouseover', (e) => {
          if (e.dataIndex !== 0) { // 当鼠标移除的时候 使默认的索引值去除默认选中
            this.chart.dispatchAction({ type: 'downplay', dataIndex: 0 });
          }
        });
        this.chart.on('globalout', (e) => {
          this.chart.dispatchAction({ type: 'highlight', dataIndex: 0 });
        });
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
