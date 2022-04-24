<template>
  <div class="card" v-loading="dataLoading">
    <div style="display: flex; width: 50rem; padding-top: 1rem; margin: 0 auto">
      <DateTimeComp @watchDateTime='setDateTime'></DateTimeComp>
      <el-input v-model="roomNum" placeholder="烤房编号" label="烤房编号" />
      <el-button type="primary" style="margin-left: 1rem" @click="chooseRoom">确定</el-button>
    </div>
    <ul v-infinite-scroll="load" class="infinite-list" style="overflow:auto">
      <!--      <v-chart id="home-temperature-data-monitoring" class="home-chart"-->
      <!--               :options="runningDeviceOption"/>-->
      <li v-for="(item,index) in optionList" :key="line" class="infinite-list-item">
        <v-chart
          id="home-temperature-data-monitoring"
          class="home-chart"
          :options="item"
        />
      </li>
    </ul>
    <!--    <v-chart id="home-temperature-data-monitoring" class="home-chart"-->
    <!--             :options="runningDeviceOption"/>-->
    <!--    <v-chart id="home-humidity-data-monitoring" class="home-chart" style="margin-top: -2vh" :options="abnormalDeviceOption"/>-->
  </div>
</template>
<script>
import DateTimeComp from '../../components/DateTimeComp'
import { getLinesData } from '@/api/control'
import { dataMonitoringRequest } from '@/api/home'
import postcodeJSON from '../../../public/static/map/postcode.json'

export default {
  name: 'Index',
  components: {
    DateTimeComp,
  },
  data() {
    return {
      postcodeJSON,
      dataLoading: false,
      roomNum: '',
      start_time: '',
      end_time: '',
      optionList: [],
      deviceData: [],
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    window.addEventListener(resizeEvt, this.resizeHandle, false)
    document.addEventListener('DOMContentLoaded', this.resizeHandle, false)
    /*
    * 页面挂载发起一次数据监测数据请求并开启定时器
    * */
    // let temperatureData = []; let humidData = []; let time = []; let titleData = []
    // getLinesData().then(res => {
    //   console.log(res)
    //   console.log(res.data)
    //   temperatureData = res.data.red
    //   humidData = res.data.blue
    //   time = res.data.time
    //   titleData = [
    //     { 'title': '整体移动式电能烤房精准工艺曲线' },
    //     { 'title': '云烟系列上部烟叶精准工艺曲线' }
    //   ]
    //   // time = res.data.run_time
    // }).catch(err => {
    //   console.log(err)
    // }).finally(() => {
    //   this.setDataDeviceOption(temperatureData, humidData, time, titleData)
    // })
    this.fetchData()
  },
  beforeDestroy() {
  },
  methods: {
    setDateTime(data) {
      console.log(data)
    },
    initDeviceData(){
      let t = []
      this.deviceData.forEach(data => {
        let index = t.findIndex(item => item.device_id === data.device_id)
        if(index != -1){
          let date1 = new Date(t[index].produce_date)
          let date2 = new Date(data.produce_date)
          if(date1.getTime() <= date2.getTime()){
            t[index].history.push(data)
            data.history = t[index].history
            t[index].history = undefined
            t[index] = data
          }
        }
        else{
          data.history = []
          t.push(data)
        }
      })
      this.deviceData = t
      console.log(this.deviceData)
    },
    fetchData(p) {
      let params = {
        "start_time":"2021-09-10 10:39:44",
        "end_time":"2021-09-12 15:09:44"
      }
      this.dataLoading = true
      let temperatureData = []; let humidData = []; let time = []; let titleData = []
      dataMonitoringRequest(params).then(response => {
        console.log('line', response)
        this.deviceData = response.data
        this.initDeviceData()

        this.deviceData = this.deviceData.slice(0, 5)
        this.deviceData.forEach(data => {
          let temperatureData_t = []; let humidData_t = []; let time_t = []
          data.history.forEach(h => {
            temperatureData_t.push(h.dryBallTemp)
            humidData_t.push(h.wetBallTemp)
            time_t.push(h.produce_date)
          })
          temperatureData.push(temperatureData_t)
          humidData.push(humidData_t)
          time.push(time_t)
          titleData.push({'title': this.postcodeJSON[data.location]+':'+data.device_id})
        })
        this.setDataDeviceOption(temperatureData, humidData, time, titleData)
        this.dataLoading = false
      })
    },
    chooseRoom() {
      this.optionList = []
      getLinesData(this, this.timeValue, this.roomNum)
      // let data = [
      //   {"title": "整体移动式电能烤房精准工艺曲线"},
      //   {"title": "云烟系列上部烟叶精准工艺曲线"},
      // ]
    },
    getOptions(title, name1, name2) {
      return {
        title: {
          text: title,
          textStyle: {
            align: 'center',
            color: 'rgb(25, 144, 255)',
            fontSize: 17
          },
          top: '0%',
          left: 'center'
        },
        legend: {
          data: [name1, name2],
          left: 'center',
          bottom: '0%',
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(param) {
            return `${param[0].axisId.replace('\u00000', '')}:${param[0].name}<br/>${param[0].seriesName}:${param[0].value}<br/>${param[1].seriesName}:${param[1].value}`
          }
        },
        xAxis: [{
          type: 'category',
          name: '时间',
          splitNumber: 8,
          nameTextStyle: {
            color: '#000',
            fontSize: '12px',
            grid: {
              x: '12px'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#EFF3F6'
            }
          },
          splitArea: {
            color: '#f00',
            lineStyle: {
              color: '#f00'
            }
          },
          axisLabel: {
            lineStyle: {
              color: '#EFF3F6'
            },
            formatter: function(param) {
              return param.split(' ')[1]
            },
            textStyle: {
              color: '#000',
              fontSize: '12px'
            }
          },
          // 竖线
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#EFF3F6'
          //   }
          // },
          boundaryGap: false
          // data: [],
        }],
        yAxis: [{
          type: 'value',
          name: name1,
          min: 0,
          max: 100,
          splitNumber: 5,
          nameTextStyle: {
            color: '#A1A0AE',
            fontSize: '12px'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EFF3F6'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#EFF3F6'
            }
          },
          axisLabel: {
            show: true,
            margin: 10,
            textStyle: {
              color: '#000',
              fontSize: '12px'
            }
          },
          axisTick: {
            show: false
          }
        },
        {
          type: 'value',
          name: name2,
          min: 0,
          max: 100,
          splitNumber: 5,
          nameTextStyle: {
            color: '#A1A0AE',
            fontSize: '12px'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EFF3F6'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#EFF3F6'
            }
          },
          axisLabel: {
            show: true,
            margin: 20,
            textStyle: {
              color: '#000',
              fontSize: '12px'
            }
          },
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            name: name1,
            type: 'line',
            smooth: true, // 是否平滑
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: 'circle',
            showSymbol: false,
            symbolSize: '12px',
            lineStyle: {
              normal: {
                color: '#54D8FF'
              }
            },
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#54D8FF',
                fontSize: '12px'
              }
            },
            itemStyle: {
              color: '#54D8FF',
              borderColor: '#54D8FF',
              borderWidth: '12px'
            },
            tooltip: {
              show: true
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(84,216,255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(255,255,255,0)'
                }
                ], false)
              }
            }
          },
          {
            name: name2,
            type: 'line',
            smooth: true, // 是否平滑
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: 'circle',
            showSymbol: false,
            symbolSize: '12px',
            lineStyle: {
              normal: {
                color: '#f00'
              }
            },
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#f00',
                fontSize: '12px'
              }
            },

            itemStyle: {
              color: '#f00',
              borderColor: '#f00',
              borderWidth: '12px'
            },
            tooltip: {
              show: true
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#f00'
                },
                {
                  offset: 1,
                  color: 'rgba(255,255,255,0)'
                }
                ], false)
              }
            },
            data: []
          }
        ]
      }
    },
    load() {
      if (this.count <= 16) {
        this.count += 2
      }
    },
    formatDateTime(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      var second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    // 图表响应式处理（未启用）
    resizeHandle() {
      const myChart1 = this.$echarts.init(document.getElementById('home-temperature-data-monitoring'))
      const myChart2 = this.$echarts.init(document.getElementById('home-humidity-data-monitoring'))
      const myChart3 = this.$echarts.init(document.getElementById('home-Illumination-data-monitoring'))
      myChart1.resize()
      myChart2.resize()
      myChart3.resize()
    },
    setDataDeviceOption(temperatureData, humidData, date, titleData) {
      titleData.forEach(t => {
        this.optionList.push(this.getOptions(t['title'], '干球温度', '湿球温度'))
      })
      for (let i = 0; i < this.optionList.length; i++) {
        this.optionList[i].xAxis[0].data = date[i]
        this.optionList[i].series[1].data = humidData[i]
        this.optionList[i].series[0].data = temperatureData[i]
      }
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
}

.infinite-list {
  height: 720px;
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* Firefox */
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.home-chart {
  height: 30rem;
  width: 66rem;
  margin: 0 auto;
  z-index: 2;
  margin-top: 20px;
}
</style>
