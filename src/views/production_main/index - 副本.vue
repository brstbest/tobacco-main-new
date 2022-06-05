<template>
  <div class="production-main">
    <el-row class="production-main-search-row">
      <LocationComp></LocationComp>
    </el-row>
    <el-row :gutter="20" class="production-main-info-row">
      <el-col :span="8" style="height: 100%;">
        <el-row class="production-main-chart-row" style="padding-bottom: 0.625rem;">
          <el-card class="production-main-chart">
            <LossRateChart></LossRateChart>
          </el-card>
        </el-row>
        <el-row class="production-main-chart-row" style="padding-top: 0.625rem;">
          <el-card class="production-main-chart">
            <YellowGreenRateChart></YellowGreenRateChart>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="16" style="height: 100%;">
        <el-row :gutter="20" class="production-main-text-row">
          <el-col :span="6" class="production-main-text-row-item">
            <el-card style="height: 100%;">
              <el-row class="production-main-text-row-card-title">
                烘烤总进度
              </el-row>
              <el-row class="production-main-text-row-card-text" type="flex" justify="center" align="middle" style="color: limegreen;">
                {{ totalProgress }}
                <div style="font-size: 30px;">%</div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6" class="production-main-text-row-item">
            <el-card style="height: 100%;">
              <el-row class="production-main-text-row-card-title">
                烘烤完成量
              </el-row>
              <el-row class="production-main-text-row-card-text" type="flex" justify="center" align="middle" style="color: limegreen;">
                900
                <div style="font-size: 30px;">kg</div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6" class="production-main-text-row-item">
            <el-card style="height: 100%;">
              <el-row class="production-main-text-row-card-title">
                烟叶均叶重
              </el-row>
              <el-row class="production-main-text-row-card-text" type="flex" justify="center" align="middle" style="color: limegreen;">
                93.75
                <div style="font-size: 30px;">g</div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6" class="production-main-text-row-item">
            <el-card style="height: 100%;">
              <el-row class="production-main-text-row-card-title">
                烘烤炉数
              </el-row>
              <el-row class="production-main-text-row-card-text" type="flex" justify="center" align="middle" style="color: limegreen;">
                900
                <div style="font-size: 30px;">炉</div>
              </el-row>
            </el-card>
          </el-col>
        </el-row>

        <el-row class="production-main-list-row">
          <el-card style="height: 100%;">
            <el-row class="production-main-list-row-card-title">
              烘烤进度
            </el-row>
            <el-table
              :data="tableData"
              style="width: 100%"
              size="small">
              <el-table-column
                prop="unit"
                label="单位"
                width="70px">
              </el-table-column>
              <el-table-column
                prop="stage"
                label="当前阶段"
                width="100px">
                <template v-slot="scope">
                  <el-tag type="warning">
                    {{ scope.row.stage === 0 ? '变色' : '无' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="progress"
                label="进度">
                <template v-slot="scope">
                  <el-progress :text-inside="true" :stroke-width="16" :percentage="scope.row.progress" :color="customColors"></el-progress>
                </template>
              </el-table-column>
              <el-table-column
                prop="ltime"
                label="剩余时间"
                width="80px">
              </el-table-column>
              <el-table-column
                prop="weight"
                label="计划完成量"
                width="100px">
                <template v-slot="scope">
                  {{ scope.row.weight + 'kg' }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import LocationComp from '/src/components/LocationComp'

  import LossRateChart from './components/LossRateChart'
  import YellowGreenRateChart from './components/YelloGreenRateChart'

  export default{
    name: 'ProductionMain',
    components: {
      LocationComp,
      LossRateChart,
      YellowGreenRateChart
    },
    data() {
      return {
        timer: null,
        tableData: [],
        totalProgress: 0,
        customColors: [
          {color: '#909399', percentage: 30},
          {color: '#e6a23c', percentage: 100},
          {color: '#67c23a', percentage: 100},
        ]
      }
    },
    created(){
      this.fetchData()
    },
    mounted() {
      this.timeCount()
    },
    beforeDestroy() {
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      fetchData(){
        let t = 16
        for(let i=0; i<5; i++){
          let tdata = {
            unit: 'XXX县',
            stage: 0,
            stime: '',
            etime: '',
            ttime: '',
            ltime: '',
            progress: '',
            weight: 10000
          }
          tdata.stime = new Date('2022/5/11 21:'+ (t-i-1) +':00')
          tdata.etime = new Date('2022/5/11 21:'+ (t+i+1) +':00')
          tdata.ttime = tdata.etime - tdata.stime
          let utime = new Date() - tdata.stime
          tdata.progress = ((utime / tdata.ttime) * 100).toFixed(0)
          if(tdata.progress >= 100) tdata.progress = 100
          tdata.ltime = tdata.etime - new Date()
          if(tdata.ltime > 0) {
            let h = Math.floor(tdata.ltime/(3600*1000))
            let l = tdata.ltime % (3600*1000)
            let m = Math.floor(l/(60*1000))
            l = tdata.ltime % (60*1000)
            let s = Math.round(l/1000)
            tdata.ltime = h + ':' + m + ':' + s
          }
          else {
            tdata.ltime = '0:0:0'
          }
          console.log(tdata)
          this.tableData.push(tdata)
        }

        this.tableData.forEach(data => {
          this.totalProgress += (1 / this.tableData.length) * data.progress
        })
      },
      timeCount() {
        this.timer = setInterval( () => {
          let curTime = new Date()
          for(let i=0; i<this.tableData.length; i++){
            let utime = curTime - this.tableData[i].stime
            let ltime = this.tableData[i].etime - curTime
            if(ltime < 0) {
              this.tableData[i].ltime = '0:0:0'
              this.tableData[i].progress = 100
              continue
            }
            this.tableData[i].progress = ((utime / this.tableData[i].ttime) * 100).toFixed(1)
            let h = Math.floor(ltime/(3600*1000))
            let l = ltime % (3600*1000)
            let m = Math.floor(l/(60*1000))
            l = ltime % (60*1000)
            let s = Math.round(l/1000)
            this.tableData[i].ltime = h + ':' + m + ':' + s
          }
          let tp = 0
          this.tableData.forEach(data => {
            tp += (1 / this.tableData.length) * data.progress
          })
          this.totalProgress = tp.toFixed(1)
        }, 1000)
      }
    }
  }
</script>

<style>
  .production-main-search-row{
    padding: 1.25rem;
    padding-bottom: 0.625rem;
  }
  .production-main-info-row{
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    height: 51.5625rem;
  }
  .production-main-chart-row{
    height: 50%;
  }
  .production-main-chart{
    height: 100%;
  }
  .el-card__body{
    height: 100%;
  }
  .production-main-text-row{
    height: 20%;
  }
  .production-main-text-row-item{
    height: 100%;
  }
  .production-main-text-row-card-title, .production-main-list-row-card-title{
    color: #333;
    font-style: normal;
    font-weight: bolder;
    font-family: sans-serif;
    font-size: 1.25rem;
  }
  .production-main-text-row-card-text{
    font-family: sans-serif;
    font-size: 40px;
    height: 80%;
  }
  .production-main-list-row{
    padding-top: 1.25rem;
    height: 80%;
  }
/*  .production-main-charts-row{
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 0.625rem;
  }
  .production-main-charts-row-top-card{
    height: 21.875rem;
  }
  .production-main-charts-row-bottom-card{
    height: 28.125rem;
  }
  .production-main-charts-row-card-text{
    font-weight: bolder;
    font-family: sans-serif;
    font-size: 3.125rem;
    height: 80%;
  } */
</style>
