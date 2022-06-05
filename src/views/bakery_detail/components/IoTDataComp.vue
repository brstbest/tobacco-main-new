<template>
  <div class="iot-data-comp">
    <el-empty v-if="empty" description="暂无数据"></el-empty>
    <el-row v-if="!empty" class="iot-data-body" :gutter="10">
      <el-row class="iot-data-info-row" :gutter="10">
        <el-col :span="12">
          <el-descriptions direction="vertical" :column="5" border>
            <template v-for="(item, index) in descFirstLabels">
              <el-descriptions-item
                :label="item.label"
                :span="item.span"
                :contentStyle="{'text-align': 'center'}"
                :labelStyle="{'text-align': 'center'}">
                {{ descFirstData[item.key] }}
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <el-descriptions direction="vertical" :column="4" border>
            <template v-for="(item, index) in descSecondLabels">
              <el-descriptions-item
                :label="item.label"
                :span="item.span"
                :contentStyle="{'text-align': 'center'}"
                :labelStyle="{'text-align': 'center'}">
                {{ descSecondData[item.key] + '℃' }}
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </el-col>
        <el-col :span="4">
          <el-descriptions direction="vertical" :column="3" border>
            <template v-for="(item, index) in descThirdLabels">
              <el-descriptions-item
                :label="item.label"
                :span="item.span"
                :contentStyle="{'text-align': 'center'}"
                :labelStyle="{'text-align': 'center'}">
                {{ descThirdData[item.key] }}
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </el-col>
      </el-row>
      <el-row class="iot-data-chart-row">
        <div id="iot-data-chart"></div>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { timeFormat } from '/src/utils/index.js'
  import { getSensor } from '@/api/sensor'

  export default{
    name: 'IoTDataComp',
    components: {

    },
    props: ['recordMsg'],
    data() {
      return {
        empty: true,
        timer: null,
        recordData: null,
        currenTime: null,
        totalTime: null,
        usedTime: null,
        leftTime: null,
        chart: null,
        chartData: {
          dryBallTarget: [],
          dryBallTemp: [],
          wetBallTarget: [],
          wetBallTemp: [],
        },
        descFirstLabels: [
          { key: 'start_time', label: '烘烤开始时间', span: 1 },
          { key: 'end_time', label: '烘烤结束时间', span: 1 },
          { key: 'bake_total_time', label: '烘烤总时间', span: 1 },
          { key: 'bake_used_time', label: '烘烤已用时间', span: 1 },
          { key: 'bake_left_time', label: '烘烤剩余时间', span: 1 },
        ],
        descSecondLabels: [
          { key: 'dryBallTarget', label: '干球目标', span: 1 },
          { key: 'wetBallTarget', label: '湿球目标', span: 1 },
          { key: 'dryBallTemp', label: '干球温度', span: 1 },
          { key: 'wetBallTemp', label: '湿球温度', span: 1 },
        ],
        descThirdLabels: [
          { key: 'fire', label: '助燃', span: 1 },
          { key: 'voltage', label: '电压', span: 1 },
          { key: 'wind', label: '循环风速', span: 1 },
        ],
        descFirstData: {
          start_time: null,
          end_time: null,
          bake_total_time: null,
          bake_used_time: null,
          bake_left_time: null,
        },
        descSecondData: {
          dryBallTarget: null,
          wetBallTarget: null,
          dryBallTemp: null,
          wetBallTemp: null,
        },
        descThirdData: {
          fire: null,
          voltage: null,
          wind: null,
        },
      }
    },
    created() {
      if(this.recordMsg !== null) {
        this.empty = false
        this.fetchData()
      }
    },
    mounted() {
      if(this.recordMsg !== null) {
        this.empty = false
        this.initChart()
        this.timeCount()
      }
    },
    beforeDestroy() {
      if(this.recordMsg !== null) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    methods: {
      fetchData() {
        // descFirst
        this.currenTime = new Date('2021-12-30 00:00:00')
        this.recordData = this.recordMsg
        console.log('this.recordData', this.recordData)
        let start_time = new Date(this.recordData.start_time)
        let end_time = new Date(this.recordData.end_time)
        this.totalTime = end_time.getTime() - start_time.getTime()
        this.usedTime = this.currenTime.getTime() - start_time.getTime()
        this.leftTime = end_time.getTime() - this.currenTime.getTime()
        this.descFirstData.start_time = timeFormat(start_time, 0, 5)
        this.descFirstData.end_time = timeFormat(end_time, 0, 5)
        this.descFirstData.bake_total_time = this.timeChange(this.totalTime)
        if(this.usedTime < this.totalTime){
          this.descFirstData.bake_used_time = this.timeChange(this.usedTime)
        }
        else{
          this.descFirstData.bake_used_time = this.timeChange(this.totalTime)
        }
        if(this.leftTime > 0){
          this.descFirstData.bake_left_time = this.timeChange(this.leftTime)
        }
        else{
          this.descFirstData.bake_left_time = '00:00:00'
        }

        // descSecond
        let rdata = {
          device_id: this.recordData.device_id,
          // start_time: this.descFirstData.start_time,
          // end_time: this.descFirstData.end_time
          start_time: timeFormat(new Date('2021-09-24 00:00:00'), 0, 5),
          end_time: timeFormat(new Date('2021-09-26 00:00:00'), 0, 5),
        }
        this.requestSensor(rdata)

        console.log('fetch', this.recordData)
      },
      timeCount(){
        this.timer = setInterval(() => {
          if(this.usedTime < this.totalTime){
            this.usedTime += 1000
            this.descFirstData.bake_used_time = this.timeChange(this.usedTime)
          }
          else{
            this.descFirstData.bake_used_time = this.timeChange(this.totalTime)
          }
          if(this.leftTime > 0){
            this.leftTime -= 1000
            this.descFirstData.bake_left_time = this.timeChange(this.leftTime)
          }
          else{
            this.descFirstData.bake_left_time = '00:00:00'
          }
        }, 1000)
      },
      timeChange(time){
        let hours=Math.floor(time/(3600*1000))
        //计算相差分钟数
        let leave1=time%(3600*1000)        //计算小时数后剩余的毫秒数
        let minutes=Math.floor(leave1/(60*1000))
        //计算相差秒数
        let leave2=leave1%(60*1000)      //计算分钟数后剩余的毫秒数
        let seconds=Math.round(leave2/1000)
        if(hours < 10){
          hours = '0' + hours
        }
        if(minutes < 10){
          minutes = '0' + minutes
        }
        if(seconds < 10){
          seconds = '0' + seconds
        }
        return hours + ':' + minutes + ':' + seconds
      },
      requestSensor(rdata){
        getSensor(rdata).then(res => {
          console.log('getSensor', res)
          if(res.code === 200) {
            if(res.data.length > 0){
              this.solveResponse(res.data)
            }
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      solveResponse(data){
        // descSecond
        this.descSecondData.dryBallTarget = data[data.length - 1].dryBallTarget
        this.descSecondData.wetBallTarget = data[data.length - 1].wetBallTarget
        this.descSecondData.dryBallTemp = data[data.length - 1].dryBallTemp
        this.descSecondData.wetBallTemp = data[data.length - 1].wetBallTemp

        // chart
        data.forEach(sdata => {
          let time = new Date(sdata.produce_date)
          time = time.getTime()
          this.chartData.dryBallTarget.push({
            name: time,
            value: [time, sdata.dryBallTarget]
          })
          this.chartData.dryBallTemp.push({
            name: time,
            value: [time, sdata.dryBallTemp]
          })
          this.chartData.wetBallTarget.push({
            name: time,
            value: [time, sdata.wetBallTarget]
          })
          this.chartData.wetBallTemp.push({
            name: time,
            value: [time, sdata.wetBallTemp]
          })
        })
        for(let item in this.chartData) {
          this.chartData[item].sort((a, b) => {return a.name - b.name})
        }
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('iot-data-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions() {
        // let data = [{
        //   "name": 1596038400000,
        //   "value": [1596038400000, 53]
        // }, {
        //   "name": 1596039040000,
        //   "value": [1596039040000, 51]
        // }, {
        //   "name": 1596039680000,
        //   "value": [1596039680000, 51]
        // }, {
        //   "name": 1596040320000,
        //   "value": [1596040320000, 51]
        // }, {
        //   "name": 1596040832000,
        //   "value": [1596040832000, 58]
        // }, {
        //   "name": 1596041472000,
        //   "value": [1596041472000, 67]
        // }, {
        //   "name": 1596042112000,
        //   "value": [1596042112000, 68]
        // }, {
        //   "name": 1596042624000,
        //   "value": [1596042624000, 54]
        // }, {
        //   "name": 1596043264000,
        //   "value": [1596043264000, 51]
        // }, {
        //   "name": 1596043904000,
        //   "value": [1596043904000, 57]
        // }, {
        //   "name": 1596044416000,
        //   "value": [1596044416000, 52]
        // }, {
        //   "name": 1596045056000,
        //   "value": [1596045056000, 54]
        // }, {
        //   "name": 1596045696000,
        //   "value": [1596045696000, 51]
        // }, {
        //   "name": 1596046208000,
        //   "value": [1596046208000, 51]
        // }, {
        //   "name": 1596046848000,
        //   "value": [1596046848000, 52]
        // }, {
        //   "name": 1596047488000,
        //   "value": [1596047488000, 51]
        // }, {
        //   "name": 1596048000000,
        //   "value": [1596048000000, 53]
        // }, {
        //   "name": 1596048640000,
        //   "value": [1596048640000, 52]
        // }, {
        //   "name": 1596049280000,
        //   "value": [1596049280000, 67]
        // }, {
        //   "name": 1596049920000,
        //   "value": [1596049920000, 59]
        // }, {
        //   "name": 1596050432000,
        //   "value": [1596050432000, 58]
        // }, {
        //   "name": 1596051072000,
        //   "value": [1596051072000, 52]
        // }, {
        //   "name": 1596051712000,
        //   "value": [1596051712000, 55]
        // }, {
        //   "name": 1596052224000,
        //   "value": [1596052224000, 53]
        // }, {
        //   "name": 1596052864000,
        //   "value": [1596052864000, 54]
        // }, {
        //   "name": 1596053504000,
        //   "value": [1596053504000, 54]
        // }, {
        //   "name": 1596054016000,
        //   "value": [1596054016000, 54]
        // }, {
        //   "name": 1596054656000,
        //   "value": [1596054656000, 52]
        // }, {
        //   "name": 1596055296000,
        //   "value": [1596055296000, 54]
        // }, {
        //   "name": 1596055808000,
        //   "value": [1596055808000, 65]
        // }, {
        //   "name": 1596056448000,
        //   "value": [1596056448000, 59]
        // }, {
        //   "name": 1596057088000,
        //   "value": [1596057088000, 55]
        // }, {
        //   "name": 1596057600000,
        //   "value": [1596057600000, 53]
        // }, {
        //   "name": 1596058240000,
        //   "value": [1596058240000, 55]
        // }, {
        //   "name": 1596058880000,
        //   "value": [1596058880000, 54]
        // }, {
        //   "name": 1596059520000,
        //   "value": [1596059520000, 55]
        // }, {
        //   "name": 1596060032000,
        //   "value": [1596060032000, 64]
        // }, {
        //   "name": 1596060672000,
        //   "value": [1596060672000, 57]
        // }, {
        //   "name": 1596061312000,
        //   "value": [1596061312000, 56]
        // }, {
        //   "name": 1596061824000,
        //   "value": [1596061824000, 55]
        // }, {
        //   "name": 1596062464000,
        //   "value": [1596062464000, 55]
        // }, {
        //   "name": 1596063104000,
        //   "value": [1596063104000, 55]
        // }, {
        //   "name": 1596063616000,
        //   "value": [1596063616000, 58]
        // }, {
        //   "name": 1596064256000,
        //   "value": [1596064256000, 79]
        // }, {
        //   "name": 1596064896000,
        //   "value": [1596064896000, 60]
        // }, {
        //   "name": 1596065408000,
        //   "value": [1596065408000, 63]
        // }, {
        //   "name": 1596066048000,
        //   "value": [1596066048000, 63]
        // }, {
        //   "name": 1596066688000,
        //   "value": [1596066688000, 82]
        // }, {
        //   "name": 1596067200000,
        //   "value": [1596067200000, 81]
        // }, {
        //   "name": 1596067840000,
        //   "value": [1596067840000, 78]
        // }, {
        //   "name": 1596068480000,
        //   "value": [1596068480000, 78]
        // }, {
        //   "name": 1596069120000,
        //   "value": [1596069120000, 65]
        // }, {
        //   "name": 1596069632000,
        //   "value": [1596069632000, 76]
        // }, {
        //   "name": 1596070272000,
        //   "value": [1596070272000, 80]
        // }, {
        //   "name": 1596070912000,
        //   "value": [1596070912000, 78]
        // }, {
        //   "name": 1596107040000,
        //   "value": [1596107040000, 70]
        // }, {
        //   "name": 1596124799000,
        //   "value": [1596124799000, 0]
        // }]
        let option = {
          title: [],//
          legend: {
            bottom: 'bottom'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {

              let str = timeFormat(new Date(params[0].axisValue), 0, 2);
              str += '<br/>'
              str += timeFormat(new Date(params[0].axisValue), 3, 5)
              str = str.replace(' ', '')
              str += '<br/><br/>'
              params.forEach((item, idx) => {
                str += item.marker + item.seriesName + ':' + item.data.value[1] + '℃<br/>'
              })
              return str;
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            axisLabel:{
              formatter:function(value,index){
                var date = new Date(value);
                let str1 = timeFormat(date, 0, 2)
                let str2 = timeFormat(date, 3, 5)
                str2 = str2.replace(' ', '')
                return str1 + '\n' + str2;
              },
            }
          },
          yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
              formatter: '{value} °C'
            }
          },
          grid: {
            left: '5%',
            right: '3%',
            top: '5%'
          },
          series: [{
            name: '干球目标温度',
            type: 'line',
            hoverAnimation: false,
            smooth: true,
            symbolSize: 4,
            data: this.chartData.dryBallTarget
          },
          {
            name: '湿球目标温度',
            type: 'line',
            hoverAnimation: false,
            smooth: true,
            symbolSize: 4,
            data: this.chartData.wetBallTarget
          },
          {
            name: '干球实际温度',
            type: 'line',
            hoverAnimation: false,
            smooth: true,
            symbolSize: 4,
            data: this.chartData.dryBallTemp
          },
          {
            name: '湿球实际温度',
            type: 'line',
            hoverAnimation: false,
            smooth: true,
            symbolSize: 4,
            data: this.chartData.wetBallTemp
          }]
        };
        // let option = {
        //   tooltip: {
        //     trigger: 'axis',
        //   },
        //   legend: {
        //     bottom: 'bottom'
        //   },
        //   toolbox: {
        //     show: true,
        //     feature: {
        //       dataZoom: {
        //         yAxisIndex: 'none'
        //       },
        //       dataView: { readOnly: false },
        //       magicType: { type: ['line', 'bar'] },
        //       restore: {},
        //       saveAsImage: {}
        //     }
        //   },
        //   xAxis: {
        //     type: 'category',
        //     boundaryGap: false,
        //     data: ['2021-07-18 00:00:00', '2021-07-19 00:00:00', '2021-07-20 00:00:00', '2021-07-21 00:00:00', '2021-07-22 00:00:00', '2021-07-23 00:00:00', '2021-07-24 00:00:00', '2021-07-24 00:00:00']
        //   },
        //   yAxis: {
        //     type: 'value',
        //     max: 100,
        //     axisLabel: {
        //       formatter: '{value} °C'
        //     }
        //   },
        //   grid: {
        //     left: '5%',
        //     right: '3%',
        //     top: '5%'
        //   },
        //   series: [
        //     {
        //       name: '干球目标温度',
        //       type: 'line',
        //       data: [20, 31, 43, 51, 62, 72, 89, 92],
        //     },
        //     {
        //       name: '湿球目标温度',
        //       type: 'line',
        //       data: [11, 21, 21, 31, 45, 57, 69, 78],
        //     },
        //     {
        //       name: '干球实际温度',
        //       type: 'line',
        //       data: [21, 32, 44, 52, 63, 73, 86, 91],
        //     },
        //     {
        //       name: '湿球实际温度',
        //       type: 'line',
        //       data: [12, 22, 22, 30, 43, 55, 70, 76],
        //     }
        //   ]
        // };
        this.chart.setOption(option)
      }
    }
  }
</script>

<style>
  .iot-data-comp, .iot-data-body{
    height: 100%;
  }
  #iot-data-chart{
    height: 100%;
  }
  .iot-data-info-row{
    height: 20%;
  }
  .iot-data-chart-row{
    height: 80%;
  }
</style>
