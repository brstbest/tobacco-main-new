<template>
  <div class="device-main">
    <el-row class="device-main-body" :gutter="20">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="device-main-tree-col">
        <LocationTreeComp @watchLocation="recieveLocation"></LocationTreeComp>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="device-main-info-col" v-loading="loading">
        <el-row class="device-main-info-top">
          <el-card style="height: 100%;">
            <el-row style="height: 20%; font-weight: bold; font-size: 1.125rem;">
              设备板块
            </el-row>
            <el-row style="height: 80%;">
              <el-col :span="6" style="border-right: 2px solid #DCDFE6;">
                <div class="device-main-info-top-item-label">
                  烤房总数
                </div>
                <div class="device-main-info-top-item-content">
                  {{ bakeryNum }}
                  <div>座</div>
                </div>
              </el-col>
              <el-col :span="6" style="border-right: 2px solid #DCDFE6;">
                <div class="device-main-info-top-item-label">
                  烤房使用率
                </div>
                <div class="device-main-info-top-item-content">
                  {{ usageNum }}
                  <div>%</div>
                </div>
              </el-col>
              <el-col :span="6" style="border-right: 2px solid #DCDFE6;">
                <div class="device-main-info-top-item-label">
                  故障烤房数
                </div>
                <div class="device-main-info-top-item-content">
                  {{ faultNum }}
                  <div>座</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="device-main-info-top-item-label">
                  正常运行占比
                </div>
                <div class="device-main-info-top-item-content">
                  {{ normalNum }}
                  <div>%</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row class="device-main-info-chart">
          <el-row class="device-main-info-chart-row" :gutter="10">
            <el-col :span="12">
              <el-card style="height: 100%;">
                <BakeryKindChart v-if="showChart" :data-msg="BakeryKindChartData"></BakeryKindChart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card style="height: 100%;">
                <BakeryStateChart v-if="showChart" :data-msg="BakeryStateChartData"></BakeryStateChart>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="device-main-info-chart-row" :gutter="10">
            <el-col :span="24">
              <el-card style="height: 100%;">
                <AlertChart v-if="showChart" :data-msg="AlertChartData"></AlertChart>
              </el-card>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import LocationTreeComp from '/src/components/LocationTreeComp'

  import BakeryStateChart from '../charts/BakeryStateChart'
  import BakeryKindChart from '../charts/BakeryKindChart'
  import AlertChart from '../charts/AlertChart'

  import { getRequestDataOnPermission } from '/src/utils/auth.js'
  import { searchDevice } from '@/api/device'
  import { searchWarning } from '@/api/warning'

  import echarts from 'echarts'

  export default{
    name: 'DeviceMain',
    components: {
      LocationTreeComp,
      BakeryStateChart,
      BakeryKindChart,
      AlertChart
    },
    data() {
      return {
        fetchFlag: true,
        showChart: true,
        loading: false,
        bakeryNum: 0,
        usageNum: 0,
        faultNum: 0,
        normalNum: 0,
        BakeryKindChartData: [0, 0, 0, 0],
        BakeryStateChartData: [0, 0, 0],
        AlertChartData: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ],
      }
    },
    created(){
      this.fetchData()
    },
    methods: {
      // 初始化设备板块数据
      async fetchData(){
        // 如果有已被选择的节点，则不初始化
        if(sessionStorage.getItem('defaultSelected')){
          this.fetchFlag = false
          return
        }
        // 清空之前的数据
        this.reset()
        // 等待数据加载时页面loading
        this.loading = true
        this.showChart = false
        // 获取当前用户的层级和负责单位编号
        let rdata = getRequestDataOnPermission()
        // 记录当前初始化的单位编号
        for(let item in rdata){
          this.location_id = rdata[item]
        }
        // 根据单位编号请求烤房数据以及预警记录
        let deviceData = await this.requestDevcie(rdata)
        let warningData = await this.requestWarning(rdata)
        // 处理数据
        this.solveResponse(deviceData, warningData)
        // 修改初始化标识
        this.fetchFlag = false
      },
      async requestDevcie(rdata) {
        let deviceRes = await searchDevice(rdata)
        let deviceData = deviceRes.data
        return deviceData
      },
      async requestWarning(rdata) {
        let warningRes = await searchWarning(rdata)
        let warningData = warningRes.data
        return warningData
      },
      async solveResponse(deviceData, warningData) {
        let faultDeviceNum = 0    // 总故障烤房数
        
        // 遍历每个预警记录
        warningData.forEach(warning => {
          let device = deviceData.find(device => device.device_id === warning.device_id)
          // console.log('device', device)
          if(device !== undefined && device.kind < 4) {
            if(warning.overcome === 0){
              faultDeviceNum += 1
            }
            this.AlertChartData[device.kind][0] += warning.warning_1
            this.AlertChartData[device.kind][1] += warning.warning_2
            this.AlertChartData[device.kind][2] += warning.warning_3
            this.AlertChartData[device.kind][3] += warning.warning_4
            this.AlertChartData[device.kind][4] += warning.warning_5
            this.AlertChartData[device.kind][5] += warning.warning_6
            this.AlertChartData[device.kind][6] += warning.warning_7
          }
        })

        deviceData.forEach(device => {
          if(device.kind < 4){
            this.BakeryKindChartData[device.kind] += 1
          }
        })

        this.bakeryNum = deviceData.length
        // 烤房使用率不清楚
        this.faultNum = faultDeviceNum
        // 正常运行不清楚

        this.loading = false
        this.showChart = true
      },
      reset() {
        this.bakeryNum = 0
        this.usageNum = 0
        this.faultNum = 0
        this.normalNum = 0
        this.BakeryKindChartData = [0, 0, 0, 0]
        this.BakeryStateChartData = [0, 0, 0]
        this.AlertChartData = [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ]
      },
      // 接收到单位树的数据后执行
      async recieveLocation(data) {
        // 连续重复点击同一单位不执行，必须初始化时不执行
        if(this.location_id === data.id || this.fetchFlag){
          return
        }
        // 清空之前的数据
        this.reset()
        // 记录当前选择单位编号
        this.location_id = data.id
        // 数据处理时不显示
        this.loading = true
        this.showChart = false
        // 根据单位数据生成请求数据
        let rdata = {}
        switch(data.level){
          case 'province':
            rdata.province = data.id
            break
          case 'city':
            rdata.parent_location = data.id
            break
          case 'county':
            rdata.location = data.id
            break
          case 'station':
            rdata.station_id = data.id
            break
          case 'group':
            rdata.group_id = data.id
            break
          case 'device':
            rdata.device_id = data.id
            break
        }
        // 请求烤房数据以及预警记录
        let deviceData = await this.requestDevcie(rdata)
        let warningData = await this.requestWarning(rdata)
        // this.recordNum = recordData.length
        this.solveResponse(deviceData, warningData)
        this.fetchFlag = false
      }
    }
  }
</script>

<style>
  .device-main{
    height: 56.5625rem;
  }
  .device-main-body, .device-main-info-col, .device-main-tree-col, .el-card__body{
    height: 100%;
  }
  .device-main-tree-col{
    border-right: 1px solid lightgray;
  }
  .device-main-info-col{
    padding-top: 1.25rem;
  }
  .device-main-info-col .el-col{
    height: 100%;
  }
  .device-main-info-top{
    width: 100%;
    height: 15%;
    padding-right: 0.625rem;
  }
  .device-main-info-chart{
    height: 85%;
    padding-right: 0.625rem;
  }
  .device-main-info-top-item-label, .device-main-info-top-item-content{
    height: 50%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .device-main-info-top-item-label{
    font-size: 0.875rem;
    font-weight: bold;
    color: #909399;
  }
  .device-main-info-top-item-content{
    font-size: 1.5rem;
    font-weight: bold;
    color: #606266;
  }
  .device-main-info-top-item-content div{
    font-size: 0.875rem;
    font-weight: bold;
    color: #606266;
    padding-left: 0.3125rem;
  }
  .device-main-info-chart-row{
    height: 50%;
    padding-top: 0.625rem;
  }
</style>
