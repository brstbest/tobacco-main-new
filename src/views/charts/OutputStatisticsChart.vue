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
    props: ['dataMsg'],
    data() {
      return {
        chart: null,
        // xData: [],
        waterData: [],
        weightData: [],
        count: ['第一炉', '第二炉', '第三炉', '第四炉', '第五炉', '第六炉'],
        xData: ['第一炉', '第二炉', '第三炉', '第四炉', '第五炉', '第六炉']
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
        for(let i=0; i<6; i++){
          let w_sum = 0
          let wt_sum = 0
          for(let j=0; j<this.dataMsg[i.toString()].water.length; j++){
            w_sum += this.dataMsg[i.toString()].water[j] * this.dataMsg[i.toString()].weight[j]
            wt_sum += this.dataMsg[i.toString()].weight[j]
          }
          if(wt_sum !== 0){
            this.waterData.push((w_sum / wt_sum).toFixed(2))
            this.weightData.push((wt_sum / this.dataMsg[i.toString()].weight.length).toFixed(2))
          }
        }
        // let i = 0
        // for(let item in this.dataMsg){
        //   let w_sum = 0
        //   let wt_sum = 0
        //   this.xData.push(this.count[i++])
        //   for(let i=0; i<this.dataMsg[item].water.length; i++){
        //     w_sum += this.dataMsg[item].water[i] * this.dataMsg[item].weight[i]
        //     wt_sum += this.dataMsg[item].weight[i]
        //   }
        //   this.waterData.push((w_sum / wt_sum).toFixed(2))
        //   this.weightData.push((wt_sum / this.dataMsg[item].weight.length).toFixed(2))
        // }
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('output-statistics-chart'))
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
              data: this.xData,
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
              data: this.waterData
            },
            {
              name: '均叶重',
              type: 'bar',
              barGap: '0%',
              barWidth: '20%',
              data: this.weightData
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
