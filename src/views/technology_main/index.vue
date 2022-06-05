<template>
  <div class="technology-main">
    <el-row class="technology-main-body" :gutter="20">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="technology-main-tree-col">
        <LocationTreeComp @watchLocation="recieveLocation"></LocationTreeComp>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="technology-main-info-col" v-loading="loading">
        <el-row class="technology-main-info-top">
          <el-card style="height: 100%;">
            <el-row style="height: 20%; font-weight: bold; font-size: 1.125rem;">
              技术板块
            </el-row>
            <el-row style="height: 80%;">
              <el-col :span="4" style="border-right: 2px solid #DCDFE6;">
                <div class="technology-main-info-top-item-label">
                  烟叶平均含水率
                </div>
                <div class="technology-main-info-top-item-content">
                  {{ avgWaterNum }}
                  <div>%</div>
                </div>
              </el-col>
              <el-col :span="4" style="border-right: 2px solid #DCDFE6;">
                <div class="technology-main-info-top-item-label">
                  烟叶均叶重
                </div>
                <div class="technology-main-info-top-item-content">
                  {{ avgWeightNum }}
                  <div>g</div>
                </div>
              </el-col>
              <el-col :span="4" style="border-right: 2px solid #DCDFE6;">
                <div class="technology-main-info-top-item-label">
                  平均烘烤炉次
                </div>
                <div class="technology-main-info-top-item-content">
                  {{ avgStoveNum }}
                  <div>炉</div>
                </div>
              </el-col>
              <el-col :span="4" style="border-right: 2px solid #DCDFE6;">
                <div class="technology-main-info-top-item-label">
                  评分
                </div>
                <div class="technology-main-info-top-item-content">
                  {{ avgScoreNum }}
                  <div>分</div>
                </div>
              </el-col>
              <el-col :span="4" style="border-right: 2px solid #DCDFE6;">
                <div class="technology-main-info-top-item-label">
                  黄烟率
                </div>
                <div class="technology-main-info-top-item-content">
                  {{ avgYellowNum }}
                  <div>%</div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="technology-main-info-top-item-label">
                  预警处理率
                </div>
                <div class="technology-main-info-top-item-content">
                  {{ avgOvercomeNum }}
                  <div>%</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row class="technology-main-info-chart">
          <el-row class="technology-main-info-chart-row" :gutter="10">
            <el-col :span="12">
              <el-card style="height: 100%;">
                <OutputStatisticsChart v-if="showChart" :data-msg="OutputStatisticsChartData"></OutputStatisticsChart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card style="height: 100%;">
                <BakeryStateChart v-if="showChart"></BakeryStateChart>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="technology-main-info-chart-row" :gutter="10">
            <el-col :span="12">
              <el-card style="height: 100%;">
                <YellowGreenRateChart v-if="showChart" :data-msg="YellowGreenRateChartData"></YellowGreenRateChart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card style="height: 100%;">
                <AlertSolveChart v-if="showChart" :data-msg="AlertSolveChartData"></AlertSolveChart>
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
  import OutputStatisticsChart from '../charts/OutputStatisticsChart'
  import BakeryStateChart from '../charts/BakeryStateChart'
  import AlertSolveChart from '../charts/AlertSolveChart'

  import { getRequestDataOnPermission } from '/src/utils/auth.js'
  import { searchDevice } from '@/api/device'
  import { getBakeRecord } from '@/api/bake'
  import { searchWarning } from '@/api/warning'

  export default{
    name: 'TechnologyMain',
    components: {
      LocationTreeComp,
      YellowGreenRateChart,
      OutputStatisticsChart,
      BakeryStateChart,
      AlertSolveChart
    },
    data() {
      return {
        fetchFlag: true,
        showChart: true,
        loading: false,
        recordNum: 0,
        avgWaterNum: 0,
        avgWeightNum: 0,
        avgStoveNum: 0,
        avgScoreNum: 0,
        avgYellowNum: 0,
        avgOvercomeNum: 0,
        YellowGreenRateChartData: 0,
        OutputStatisticsChartData: {},
        AlertSolveChartData: [0, 0],
      }
    },
    created(){
      this.fetchData()
    },
    methods: {
      // 初始化技术板块数据
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
        // 根据单位编号请求烤房数据、烘烤记录数据以及预警记录
        let deviceData = await this.requestDevcie(rdata)
        let recordData = await this.requestBakeRecord(rdata)
        let warningData = await this.requestWarning(rdata)
        // 将烘烤数据按烤房编号分组，方便处理
        recordData = this.groupByDevice(recordData)
        // 处理数据
        this.solveResponse(recordData, deviceData, warningData)
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
      async requestWarning(rdata) {
        let warningRes = await searchWarning(rdata)
        let warningData = warningRes.data
        return warningData
      },
      async solveResponse(recordData, deviceData, warningData) {
        let sumWater = 0      // 总和含水重量
        let sumYellow = 0     // 总和黄烟重量
        let sumWeight = 0     // 总和单叶重
        let sumScore = 0      // 总和评分
        let sumOvercome = 0   // 总和预警数
        let deviceCount = 0   // 总烤房数

        // 遍历每个烘烤记录分组
        for(let device_id in recordData){
          // 在烤房数据中找到当前当前烘烤记录分组的烤房（以防出现烤房不存在的情况）
          let device = deviceData.find(device => device.device_id === device_id)
          if(device !== undefined && device.kind < 4) {
            // 记录有效烤房数
            deviceCount += 1
            // 遍历当前烘烤记录分组的每个记录
            recordData[device_id].forEach((record, index) => {
              // 累加叶重、含水、黄烟
              sumWeight += record.baking_weight_after
              sumWater += record.baking_weight_after * record.water_rate
              sumYellow += record.baking_weight_after * record.yellow_rate
              sumScore += record.score

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
        // 记录已处理预警数
        warningData.forEach(warning => {
          this.AlertSolveChartData[warning.overcome] += 1
        })

        // 数据总处理
        this.avgWeightNum = (sumWeight / this.recordNum).toFixed(2)
        this.avgWaterNum = (sumWater / sumWeight).toFixed(2)
        this.YellowGreenRateChartData = (sumYellow / sumWeight).toFixed(2)
        this.avgStoveNum = (this.recordNum / deviceCount).toFixed(0)
        this.avgScoreNum = (sumScore / this.recordNum).toFixed(2)
        this.avgYellowNum = this.YellowGreenRateChartData
        this.avgOvercomeNum = (this.AlertSolveChartData[1] / warningData.length).toFixed(2)

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
        this.avgWaterNum = 0
        this.avgWeightNum = 0
        this.avgStoveNum = 0
        this.avgScoreNum = 0
        this.avgYellowNum = 0
        this.avgOvercomeNum = 0
        this.YellowGreenRateChartData = 0
        this.OutputStatisticsChartData = {}
        this.AlertSolveChartData = [0, 0]
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
        // 请求烤房数据、烘烤记录数据以及预警记录
        let deviceData = await this.requestDevcie(rdata)
        let recordData = await this.requestBakeRecord(rdata)
        let warningData = await this.requestWarning(rdata)
        console.log(recordData)
        recordData = this.groupByDevice(recordData)
        this.solveResponse(recordData, deviceData, warningData)
      }
    }
  }
</script>

<style>
  .technology-main{
    height: 56.5625rem;
  }
  .technology-main-body, .technology-main-info-col, .technology-main-tree-col, .el-card__body{
    height: 100%;
  }
  .technology-main-tree-col{
    border-right: 1px solid lightgray;
  }
  .technology-main-info-col{
    padding-top: 1.25rem;
  }
  .technology-main-info-col .el-col{
    height: 100%;
  }
  .technology-main-info-top{
    width: 100%;
    height: 15%;
    padding-right: 0.625rem;
  }
  .technology-main-info-chart{
    height: 85%;
    padding-right: 0.625rem;
  }
  .technology-main-info-top-item-label, .technology-main-info-top-item-content{
    height: 50%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .technology-main-info-top-item-label{
    font-size: 0.875rem;
    font-weight: bold;
    color: #909399;
  }
  .technology-main-info-top-item-content{
    font-size: 1.5rem;
    font-weight: bold;
    color: #606266;
  }
  .technology-main-info-top-item-content div{
    font-size: 0.875rem;
    font-weight: bold;
    color: #606266;
    padding-left: 0.3125rem;
  }
  .technology-main-info-chart{
    height: 85%;
    padding-right: 0.625rem;
  }
  .technology-main-info-chart-row{
    height: 50%;
    padding-top: 0.625rem;
  }
</style>
