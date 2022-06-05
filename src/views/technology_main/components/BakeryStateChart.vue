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
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}'
          },
          title: {
            text: '烤房状态',
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
              data: ['使用', '闲置', '故障'],
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
                { value: 735, name: '使用' },
                { value: 2048, name: '闲置' },
                { value: 379, name: '故障' },
              ]
            },
            {
              data: [735, 2048, 379],
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
  .bakery-state-chart-comp{
    height: 100%;
  }
  #bakery-state-chart{
    height: 100%;
  }
</style>
