<template>
  <div class="production-main">
    <el-row class="production-main-row" :gutter="20">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="production-main-tree-col">
        <LocationTreeComp></LocationTreeComp>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="production-main-info-col">
        <el-row :gutter="20" class="production-main-info-row" type="flex" justify="center" align="middle">
          <el-col :span="24" style="height: 90%;width: 95%;">
            <el-row :gutter="10" class="production-main-info-row-item">
              <el-col :span="12" style="height: 100%;">
                <!-- 卡片1 -->
                <el-card class="production-main-info-row-item-card">
                  <div id="progress-chart"></div>
                </el-card>
              </el-col>
              <el-col :span="12" style="height: 100%;">
                <!-- 卡片2 完成量 均叶重 炉数 -->
                <el-card class="production-main-info-row-item-card">
                  <el-row style="height: 100%;">
                    <el-col :span="12" style="height: 100%;border-right: 1px solid lightgray;">
                      <el-row style="height: 50%; border-bottom: 1px solid lightgray;" type="flex" justify="center" align="middle">
                        <el-col :span="24" style="text-align: center;">
                          <span class="production-main-info-row-item-card-title">已完成烘烤的干烟总量</span><br /><br />
                          <span class="production-main-info-row-item-card-text">750000kg</span>
                        </el-col>
                      </el-row>
                      <el-row style="height: 50%;" type="flex" justify="center" align="middle">
                        <el-col :span="24" style="text-align: center;">
                          <span class="production-main-info-row-item-card-title">计划收购干烟总量</span><br /><br />
                          <span class="production-main-info-row-item-card-text">900000kg</span>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12" style="height: 100%">
                      <el-row style="height: 50%; border-bottom: 1px solid lightgray;" type="flex" justify="center" align="middle">
                        <el-col :span="24" style="text-align: center;">
                          <span class="production-main-info-row-item-card-title">烟叶均叶重</span><br /><br />
                          <span class="production-main-info-row-item-card-text">100g</span>
                        </el-col>
                      </el-row>
                      <el-row style="height: 50%;" type="flex" justify="center" align="middle">
                        <el-col :span="24" style="text-align: center;">
                          <span class="production-main-info-row-item-card-title">已完成烘烤炉数</span><br /><br />
                          <span class="production-main-info-row-item-card-text">900炉</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="production-main-info-row-item">
              <el-col :span="12" style="height: 100%;">
                <!-- 卡片3 -->
                <el-card class="production-main-info-row-item-card">
                  <LossRateChart></LossRateChart>
                </el-card>
              </el-col>
              <el-col :span="12" style="height: 100%;">
                <!-- 卡片4 -->
                <el-card class="production-main-info-row-item-card">
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

  import LossRateChart from './components/LossRateChart'
  import YellowGreenRateChart from './components/YelloGreenRateChart'

  import echarts from 'echarts'

  export default{
    name: 'ProductionMain',
    components: {
      LocationTreeComp,
      LossRateChart,
      YellowGreenRateChart
    },
    data() {
      return {
        chart: null,
      }
    },
    created(){
      this.fetchData()
    },
    mounted() {
      this.initChart()
    },
    methods: {
      fetchData(){

      },
      initChart(){
        this.chart = echarts.init(document.getElementById('progress-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions(){
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}量: {c}kg'
          },
          title:{
            text: '烘烤完成进度'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center',
                formatter: '{d}%',
                fontSize: '40',
                fontWeight: 'bold'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '34',
                  fontWeight: 'bold',
                  formatter: '{b|{b}}\n{d}%',
                  rich: {
                    b: {
                      fontSize: '24',
                      fontWeight: 'bold'
                    }
                  }
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 750000, name: '已完成' },
                { value: 150000, name: '未完成' },
              ]
            }
          ]
        };
        this.chart.setOption(option)
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0,
        });
        this.chart.on('mouseover', (e) => {
          if (e.dataIndex !== 0) { // 当鼠标移除的时候 使默认的索引值去除默认选中
            this.chart.dispatchAction({ type: 'downplay', dataIndex: 0 });
          }
        });
        this.chart.on('globalout', (e) => {
          this.chart.dispatchAction({ type: 'highlight', dataIndex: 0 });
        });
      }
    }
  }
</script>

<style>
  .production-main{
    height: 56.5625rem;
  }
  .production-main-row, .production-main-info-col, .production-main-info-row, .production-main-tree-col, .el-card__body, .production-main-info-row-item-card, #progress-chart{
    height: 100%;
  }
  .production-main-tree-col{
    border-right: 1px solid lightgray;
  }
  .production-main-info-row-item{
    height: 50%;
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
  }
  .production-main-info-row-item-card-title{
    font-size: 1.5rem;
    font-weight: bold;
  }
  .production-main-info-row-item-card-text{
    font-size: 2rem;
  }
</style>
