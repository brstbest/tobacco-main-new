<template>
  <div class="history-line">
    <el-row class="history-line-datetime-row">
      <DateTimeComp @watchDateTime="setDateTime"></DateTimeComp>
    </el-row>
    <el-row class="history-line-button-row">
      <el-button type="primary" @click="getLine()">刷新</el-button>
      <el-button type="primary">导出数据</el-button>
    </el-row>
    <el-row class="history-line-chart-row">
      <div style="height: 400px; width: 100%;" ref="chart"></div>
    </el-row>

  </div>
</template>

<script>
  import DateTimeComp from '../../../../components/DateTimeComp'
  import * as echarts from 'echarts'


  export default{
    name: 'HistoryLine',
    components: {
      DateTimeComp,
    },
    data() {
      return {
        start_time: '',
        end_time: '',
        chart: null,
        chart_option: {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [],
              type: 'line',
              smooth: true
            }
          ]
        }
      }
    },
    created() {
      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption(this.chart_option)
    },
    methods: {
      setDateTime(data) {
        this.start_time = data.start_time
        this.end_time = data.end_time
        this.getLine()
      },
      getLine(){
      }
    },
  }
</script>

<style>
</style>
