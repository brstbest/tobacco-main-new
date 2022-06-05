<template>
  <div class="technology-main">
    <el-row class="technology-main-row" :gutter="20">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="technology-main-tree-col">
        <LocationTreeComp></LocationTreeComp>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="technology-main-info-col">
        <el-row :gutter="20" class="technology-main-info-row" type="flex" justify="center" align="middle">
          <el-col :span="24" style="height: 90%;width: 95%;">
            <el-row :gutter="10" class="technology-main-info-row-item">
              <el-col :span="8" style="height: 100%;">
                <el-card class="technology-main-info-row-item-card">
                  <CurveExecutionChart></CurveExecutionChart>
                </el-card>
              </el-col>
              <el-col :span="8" style="height: 100%;">
                <el-card class="technology-main-info-row-item-card">
                  <BakeryStateChart></BakeryStateChart>
                </el-card>
              </el-col>
              <el-col :span="8" style="height: 100%;">
                <el-card class="technology-main-info-row-item-card">
                  <AlertSolveRateChart></AlertSolveRateChart>
                </el-card>
              </el-col>
            </el-row>

            <el-row :gutter="10" class="technology-main-info-row-item">
              <el-col :span="8" style="height: 100%;">
                <el-card class="technology-main-info-row-item-card">
                  <LeafStateChart></LeafStateChart>
                </el-card>
              </el-col>
              <el-col :span="8" style="height: 100%;">
                <el-card class="technology-main-info-row-item-card">
                  <LossRateChart></LossRateChart>
                </el-card>
              </el-col>
              <el-col :span="8" style="height: 100%;">
                <el-card class="technology-main-info-row-item-card">
                  <YellowGreenRateChart></YellowGreenRateChart>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import LocationTreeComp from '/src/components/LocationTreeComp'

  import CurveExecutionChart from './components/CurveExecutionChart'
  import LossRateChart from './components/LossRateChart'
  import YellowGreenRateChart from './components/YelloGreenRateChart'
  import LeafStateChart from './components/LeafStateChart'
  import BakeryStateChart from './components/BakeryStateChart'
  import AlertSolveRateChart from './components/AlertSolveRateChart'

  export default{
    name: 'TechnologyMain',
    components: {
      LocationTreeComp,
      CurveExecutionChart,
      LossRateChart,
      YellowGreenRateChart,
      LeafStateChart,
      BakeryStateChart,
      AlertSolveRateChart
    },
    data() {
      return {
        showCharts: false,
      }
    }
  }
</script>

<style>
  .technology-main{
    height: 56.5625rem;
  }
  .technology-main-row, .technology-main-info-col, .technology-main-info-row, .technology-main-tree-col, .el-card__body, .technology-main-info-row-item-card{
    height: 100%;
  }
  .technology-main-tree-col{
    border-right: 1px solid lightgray;
  }
  .technology-main-info-row-item{
    height: 50%;
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
  }
  .technology-main-info-row-item-card-title{
    font-size: 1.5rem;
    font-weight: bold;
  }
  .technology-main-info-row-item-card-text{
    font-size: 2rem;
  }
</style>
