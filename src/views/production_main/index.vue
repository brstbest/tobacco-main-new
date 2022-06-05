<template>
  <div class="production-main">
    <el-row class="production-main-body" :gutter="20">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="production-main-tree-col">
        <LocationTreeComp @watchLocation="recieveLocation"></LocationTreeComp>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="production-main-info-col" v-loading="loading">
        <el-row class="production-main-info-top">
          <el-card style="height: 100%;">
            <el-row style="height: 20%; font-weight: bold; font-size: 1.125rem;">
              烘烤板块
            </el-row>
            <el-row style="height: 80%;">
              <el-col :span="9">
                <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                  <el-progress :text-inside="true" :stroke-width="24" :percentage="progressNum" style="width: 100%;" status="exception"></el-progress>
                </el-row>
              </el-col>
              <el-col :span="3" style="border-right: 2px solid #DCDFE6;">
                <div class="production-main-info-top-item-label">
                  烘烤完成进度
                </div>
                <div class="production-main-info-top-item-content">
                  {{ progressNum }}
                  <div>%</div>
                </div>
              </el-col>
              <el-col :span="3" style="border-right: 2px solid #DCDFE6;">
                <div class="production-main-info-top-item-label">
                  烘烤完成炉数
                </div>
                <div class="production-main-info-top-item-content">
                  {{ stoveNum }}
                  <div>炉</div>
                </div>
              </el-col>
              <el-col :span="3" style="border-right: 2px solid #DCDFE6;">
                <div class="production-main-info-top-item-label">
                  烟叶均叶重
                </div>
                <div class="production-main-info-top-item-content">
                  {{ avgWeightNum }}
                  <div>g</div>
                </div>
              </el-col>
              <el-col :span="3" style="border-right: 2px solid #DCDFE6;">
                <div class="production-main-info-top-item-label">
                  烟叶平均含水率
                </div>
                <div class="production-main-info-top-item-content">
                  {{ avgWaterNum }}
                  <div>%</div>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="production-main-info-top-item-label">
                  烘烤完成量
                </div>
                <div class="production-main-info-top-item-content">
                  {{ amountNum }}
                  <div>担</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row class="production-main-info-chart">
          <el-row class="production-main-info-chart-row" :gutter="10">
            <el-col :span="12">
              <el-card style="height: 100%;">
                <BakeCompletionChart v-if="showChart" :data-msg="BakeCompletionChartData"></BakeCompletionChart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card style="height: 100%;">
                <BakeCompletionStoveChart v-if="showChart" :data-msg="BakeCompletionStoveChartData"></BakeCompletionStoveChart>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="production-main-info-chart-row" :gutter="10">
            <el-col :span="12">
              <el-card style="height: 100%;">
                <YellowGreenRateChart v-if="showChart" :data-msg="YellowGreenRateChartData"></YellowGreenRateChart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card style="height: 100%;">
                <OutputStatisticsChart v-if="showChart" :data-msg="OutputStatisticsChartData"></OutputStatisticsChart>
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
  import YellowGreenRateChart from '../charts/YelloGreenRateChart'
  import BakeCompletionChart from '../charts/BakeCompletionChart'
  import OutputStatisticsChart from '../charts/OutputStatisticsChart'
  import BakeCompletionStoveChart from '../charts/BakeCompletionStoveChart'

  import echarts from 'echarts'

  import { getRequestDataOnPermission } from '/src/utils/auth.js'
  import { searchDevice } from '@/api/device'
  import { getBakeRecord } from '@/api/bake'

  export default{
    name: 'ProductionMain',
    components: {
      LocationTreeComp,
      YellowGreenRateChart,
      BakeCompletionChart,
      OutputStatisticsChart,
      BakeCompletionStoveChart,
    },
    data() {
      return {
        fetchFlag: true,
        showChart: true,
        loading: false,
        recordNum: 0,
        progressNum: 0,
        stoveNum: 0,
        avgWeightNum: 0,
        avgWaterNum: 0,
        amountNum: 0,
        BakeCompletionChartData: [0, 0, 0, 0],
        BakeCompletionStoveChartData: [0, 0, 0, 0],
        YellowGreenRateChartData: 0,
        OutputStatisticsChartData: {},
        location_id: null,
      }
    },
    created(){
      this.fetchData()
    },
    methods: {
      // 初始化生产板块数据
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
        // 根据单位编号请求烤房数据以及烘烤记录数据
        let deviceData = await this.requestDevcie(rdata)
        let recordData = await this.requestBakeRecord(rdata)
        // 将烘烤数据按烤房编号分组，方便处理
        recordData = this.groupByDevice(recordData)
        // 处理数据
        this.solveResponse(recordData, deviceData)
        // 修改初始化标识
        this.fetchFlag = false
      },
      async requestDevcie(rdata) {
        let deviceRes = await searchDevice(rdata)
        let deviceData = deviceRes.data
        return deviceData
      },
      async requestBakeRecord(rdata) {
        let recordRes = await getBakeRecord(rdata)
        let recordData = recordRes.data
        return recordData
      },
      // 数据处理
      async solveResponse(recordData, deviceData) {
        let sumWater = 0    // 含水率总和
        let sumYellow = 0   // 黄烟率总和
        let sumWeight = 0   // 单叶重总和
        
        // 遍历每个烘烤记录分组
        for(let device_id in recordData){
          // 在烤房数据中找到当前当前烘烤记录分组的烤房（以防出现烤房不存在的情况）
          let device = deviceData.find(device => device.device_id === device_id) 
          if(device !== undefined && device.kind < 4) {
            // 每个烘烤记录相当于烘烤一炉
            this.BakeCompletionStoveChartData[device.kind] += recordData[device_id].length
            // 遍历当前烘烤记录分组的每个记录
            recordData[device_id].forEach((record, index) => {
              // 累加叶重、含水、黄烟
              sumWeight += record.baking_weight_after
              sumWater += record.baking_weight_after * record.water_rate
              sumYellow += record.baking_weight_after * record.yellow_rate
              
              // 累加烘烤后干烟重量（一担 == 100斤）
              this.BakeCompletionChartData[device.kind] += record.baking_weight_after / 50
              
              // 记录有效烘烤记录的总数
              this.recordNum += 1
              
              // 按第x炉记录含水率和干烟重量
              if(index.toString() in this.OutputStatisticsChartData){
                this.OutputStatisticsChartData[index.toString()].water.push(record.water_rate)
                this.OutputStatisticsChartData[index.toString()].weight.push(record.single_leaf_after)
              }
              else{
                this.OutputStatisticsChartData[index.toString()] = {
                  water: [record.water_rate],
                  weight: [record.baking_weight_after]
                }
              }
            })
          }
        }
        
        // 数据总处理
        this.avgWeightNum = (sumWeight / this.recordNum).toFixed(2)
        this.avgWaterNum = (sumWater / sumWeight).toFixed(2)
        this.YellowGreenRateChartData = (sumYellow / sumWeight).toFixed(2)
        this.amountNum = (sumWeight / 50).toFixed(2)

        this.progressNum = ((this.recordNum / 100) * 100).toFixed(2)
        this.stoveNum = this.recordNum
        
        // 完成数据处理后展示数据
        this.loading = false
        this.showChart = true
      },
      groupByDevice(arr) {
        return arr.reduce((pre, current, index) => {
          pre[current.device_id] = pre[current.device_id] || [];
          pre[current.device_id].push(current);
          return pre;
        }, {});
      },
      reset() {
        this.recordNum = 0
        this.progressNum = 0
        this.stoveNum = 0
        this.avgWeightNum = 0
        this.avgWaterNum = 0
        this.amountNum = 0
        this.BakeCompletionChartData = [0, 0, 0, 0]
        this.BakeCompletionStoveChartData = [0, 0, 0, 0]
        this.YellowGreenRateChartData = 0
        this.OutputStatisticsChartData = {}
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
        // 请求烤房数据以及烘烤记录数据
        let deviceData = await this.requestDevcie(rdata)
        let recordData = await this.requestBakeRecord(rdata)
        recordData = this.groupByDevice(recordData)
        this.solveResponse(recordData, deviceData)
      }
    }
  }
</script>

<style>
  .production-main{
    height: 56.5625rem;
  }
  .production-main-body, .production-main-info-col, .production-main-tree-col, .el-card__body{
    height: 100%;
  }
  .production-main-tree-col{
    border-right: 1px solid lightgray;
  }
  .production-main-info-col{
    padding-top: 1.25rem;
  }
  .production-main-info-col .el-col{
    height: 100%;
  }
  .production-main-info-top{
    width: 100%;
    height: 15%;
    padding-right: 0.625rem;
  }
  .production-main-info-chart{
    height: 85%;
    padding-right: 0.625rem;
  }
  .production-main-info-top-item-label, .production-main-info-top-item-content{
    height: 50%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .production-main-info-top-item-label{
    font-size: 0.875rem;
    font-weight: bold;
    color: #909399;
  }
  .production-main-info-top-item-content{
    font-size: 1.5rem;
    font-weight: bold;
    color: #606266;
  }
  .production-main-info-top-item-content div{
    font-size: 0.875rem;
    font-weight: bold;
    color: #606266;
    padding-left: 0.3125rem;
  }
  .production-main-info-chart-row{
    height: 50%;
    padding-top: 0.625rem;
  }
</style>
