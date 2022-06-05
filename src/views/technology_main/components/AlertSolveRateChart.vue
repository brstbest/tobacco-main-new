<template>
  <div class="alert-solve-rate-chart-comp">
    <div id='alert-solve-rate-chart'></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'AlertSolveRateChart',
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
        this.chart = echarts.init(document.getElementById('alert-solve-rate-chart'))
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
            text: '预警处理率',
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
              data: ['处理数', '总数'],
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
              radius: ['40%', '60%'],
              center: ["30%", "50%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                fontSize: '16',
                fontWeight: 'bold',
                position: 'center',
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
                { value: 2048, name: '处理' },
                { value: 97, name: '未处理' },
              ]
            },
            {
              data: [2048, 2048+97],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
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
  .alert-solve-rate-chart-comp{
    height: 100%;
  }
  #alert-solve-rate-chart{
    height: 100%;
  }
</style>
