<template>
  <div class="supervise-device-comp">
    <el-row class="supervise-device-comp-row" :gutter="10">
      <el-col :xs="16" :sm="18" :md="18" :lg="20" :xl="20" >
        <el-row>
          <el-descriptions border :column="5">
              <el-descriptions-item label="助燃" :span="1"
                :labelStyle="{'text-align': 'center', 'width': '50px'}"
                :contentStyle="{'text-align': 'center'}">
                ---
              </el-descriptions-item>
              <el-descriptions-item label="电压" :span="1"
                :labelStyle="{'text-align': 'center', 'width': '50px'}"
                :contentStyle="{'text-align': 'center'}">
                214V
              </el-descriptions-item>
              <el-descriptions-item label="循环风速" :span="1"
                :labelStyle="{'text-align': 'center', 'width': '100px'}"
                :contentStyle="{'text-align': 'center'}">
                自动
              </el-descriptions-item>
              <el-descriptions-item label="其他" :span="1"
                :labelStyle="{'text-align': 'center', 'width': '50px'}"
                :contentStyle="{'text-align': 'center'}">
                {{ '第 烤  ' }}
              </el-descriptions-item>
              <el-descriptions-item label="当前时间" :span="1"
                :labelStyle="{'text-align': 'center', 'width': '100px'}"
                :contentStyle="{'text-align': 'center', 'width': '200px'}">
                {{ curDateTime }}
              </el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-row class="supervise-device-comp-chart-row">
          <div id="supervise-device-comp-chart"></div>
        </el-row>
      </el-col>
      <el-col :xs="8" :sm="6" :md="6" :lg="4" :xl="4">
        <el-row class="supervise-device-comp-right-info-row">
          <el-descriptions border :column="2" direction="vertical" >
              <el-descriptions-item label="控制棚" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                上棚
              </el-descriptions-item>
              <el-descriptions-item label="温控" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                恒温
              </el-descriptions-item>
              <el-descriptions-item label="干球温度" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                ---
              </el-descriptions-item>
              <el-descriptions-item label="湿球温度" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                ---
              </el-descriptions-item>
              <el-descriptions-item label="目标温度" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                ---
              </el-descriptions-item>
              <el-descriptions-item label="目标温度" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                ---
              </el-descriptions-item>
              <el-descriptions-item label="当前阶段" :span="2"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                变黄
              </el-descriptions-item>
              <el-descriptions-item label="阶段总时间" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                12:00:00
              </el-descriptions-item>
              <el-descriptions-item label="烘烤总时间" :span="1"
                :labelStyle="{'text-align': 'center'}"
                :contentStyle="{'text-align': 'center'}">
                24:00:00
              </el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-row class="supervise-device-comp-right-btn-row">
          <el-button :type="switchType" style="width: 100%;" @click="switchClick">{{ switchText }}</el-button>
        </el-row>
        <el-row class="supervise-device-comp-right-btn-row">
          <el-button type="primary" plain style="width: 100%;">参数设置</el-button>
        </el-row>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'SuperviseDeviceComp',
    components: {

    },
    props: ['rowMsg'],
    data() {
      return {
        chart: null,
        timer: null,
        rowData: null,
        curDateTime: '',
        switchType: 'success',
        switchText: '开机',
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      this.timeCount()
      this.initChart()
    },
    beforeDestroy() {
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      switchClick() {
        this.switchType = this.switchType === 'success' ? 'danger' : 'success'
        this.switchText = this.switchText === '开机' ? '停机' : '开机'
      },
      fetchData() {
        this.rowData = this.rowMsg
        console.log(this.rowMsg)
        let cdt = new Date()
        this.curDateTime = cdt.getFullYear()+'-'+cdt.getMonth()+'-'+cdt.getDay()+' '+cdt.getHours()+':'+cdt.getMinutes()+':'+cdt.getSeconds()
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('supervise-device-comp-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      timeCount() {
        this.timer = setInterval( () => {
          let cdt = new Date()
          this.curDateTime = cdt.getFullYear()+'-'+cdt.getMonth()+'-'+cdt.getDay()+' '+cdt.getHours()+':'+cdt.getMinutes()+':'+cdt.getSeconds()
        }, 1000)
      },
      setChartOptions() {
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: false },
              magicType: { type: ['line', 'bar'] },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            }
          },
          series: [
            {
              name: 'Highest',
              type: 'line',
              data: [10, 11, 13, 11, 12, 12, 9],
              markPoint: {
                data: [
                  { type: 'max', name: 'Max' },
                  { type: 'min', name: 'Min' }
                ]
              },
              markLine: {
                data: [{ type: 'average', name: 'Avg' }]
              }
            },
            {
              name: 'Lowest',
              type: 'line',
              data: [1, -2, 2, 5, 3, 2, 0],
              markPoint: {
                data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
              },
              markLine: {
                data: [
                  { type: 'average', name: 'Avg' },
                  [
                    {
                      symbol: 'none',
                      x: '90%',
                      yAxis: 'max'
                    },
                    {
                      symbol: 'circle',
                      label: {
                        position: 'start',
                        formatter: 'Max'
                      },
                      type: 'max',
                      name: '最高点'
                    }
                  ]
                ]
              }
            }
          ]
        };
        this.chart.resize()
        this.chart.setOption(option)
      },
    }
  }
</script>

<style>
  .supervise-device-comp-row-left{
    height: 48.4375rem;
  }
  #supervise-device-comp-chart{
    padding-top: 0.625rem;
    height: 45.3125rem;
  }
  .supervise-device-comp-right-btn-row{
    padding: 0.625rem;
    padding-bottom: 0rem;
  }
</style>
