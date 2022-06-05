<template>
  <div class="supervise-bakery-comp">
    <el-row class="supervise-bakery-comp-card-row" :gutter="10">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <el-row slot="header" class="supervise-bakery-comp-card-row-item-header">
            <el-col :span="24">
              <el-descriptions :column="2">
                  <el-descriptions-item label="烤房ID">{{ rowData.id }}</el-descriptions-item>
                  <el-descriptions-item label="烤房名称">{{ rowData.name }}</el-descriptions-item>
                  <el-descriptions-item label="其他信息">
                    <el-popover
                      placement="right-start"
                      width="500"
                      trigger="click">
                      <el-descriptions title="烤房信息" :column="2">
                        <template v-for="(item, index) in bakeryDetailDesc">
                          <el-descriptions-item :label="item.label" :span="item.span">-----</el-descriptions-item>
                        </template>
                      </el-descriptions>
                      <el-button type="text" slot="reference" style="padding: 0px;">查看</el-button>
                    </el-popover>
                  </el-descriptions-item>
                  <el-descriptions-item label="设备状态">
                    <el-tag type="success" effect="dark" size="small">{{rowData.state}}</el-tag>
                  </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
          <el-row>
            <el-descriptions :column="3" title="烘烤时间" direction="vertical" :colon="false">
                <el-descriptions-item label="烘烤总时间">
                  <div class="supervise-bakery-comp-card-row-data">
                    {{ bakeTime.th < 10 ? '0' + bakeTime.th : bakeTime.th }}:{{ bakeTime.tm < 10 ? '0' + bakeTime.tm : bakeTime.tm }}:{{ bakeTime.ts < 10 ? '0' + bakeTime.ts : bakeTime.ts }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="烘烤用时">
                  <div class="supervise-bakery-comp-card-row-data">
                    {{ bakeTime.uh < 10 ? '0' + bakeTime.uh : bakeTime.uh }}:{{ bakeTime.um < 10 ? '0' + bakeTime.um : bakeTime.um }}:{{ bakeTime.us < 10 ? '0' + bakeTime.us : bakeTime.us }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="烘烤剩余时间">
                  <div class="supervise-bakery-comp-card-row-data">
                    {{ bakeTime.lh < 10 ? '0' + bakeTime.lh : bakeTime.lh }}:{{ bakeTime.lm < 10 ? '0' + bakeTime.lm : bakeTime.lm }}:{{ bakeTime.ls < 10 ? '0' + bakeTime.ls : bakeTime.ls }}
                  </div>
                </el-descriptions-item>
            </el-descriptions>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <el-row slot="header" class="supervise-bakery-comp-card-row-item-header">
            <el-col :span="24">
              <el-descriptions :column="2" style="padding-top: 20px;">
                  <el-descriptions-item label="现场照片">
                    <el-popover
                      placement="right-start"
                      width="800"
                      trigger="click">
                      <div style="font-weight: bold;">变黄阶段</div>
                      <el-carousel type="card" height="200px" :autoplay="false">
                        <el-carousel-item v-for="(item, index) in picSrcs" :key="index">
                          <el-image
                            :src="item"
                            :preview-src-list="picSrcs">
                          </el-image>
                        </el-carousel-item>
                      </el-carousel>
                      <div style="font-weight: bold;">定色干叶阶段</div>
                      <el-carousel type="card" height="200px" :autoplay="false">
                        <el-carousel-item v-for="(item, index) in picSrcs" :key="index">
                          <el-image
                            :fit="fit"
                            :src="item"
                            :preview-src-list="picSrcs">
                          </el-image>
                        </el-carousel-item>
                      </el-carousel>
                      <div style="font-weight: bold;">干筋阶段</div>
                      <el-carousel type="card" height="200px" :autoplay="false">
                        <el-carousel-item v-for="(item, index) in picSrcs" :key="index">
                          <el-image
                            :src="item"
                            :preview-src-list="picSrcs">
                          </el-image>
                        </el-carousel-item>
                      </el-carousel>
                      <el-button type="text" slot="reference" style="padding: 0px;">查看</el-button>
                    </el-popover>
                  </el-descriptions-item>
                  <el-descriptions-item label="当前阶段">
                    <el-tag type="warning" effect="dark" size="small">{{rowData.stage}}</el-tag>
                  </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
          <el-row>
            <el-descriptions :column="3" title="阶段时间" direction="vertical" :colon="false">
                <el-descriptions-item label="阶段总时间">
                  <div class="supervise-bakery-comp-card-row-data">
                    {{ stageTime.th < 10 ? '0' + stageTime.th : stageTime.th }}:{{ stageTime.tm < 10 ? '0' + stageTime.tm : stageTime.tm }}:{{ stageTime.ts < 10 ? '0' + stageTime.ts : stageTime.ts }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="阶段用时">
                  <div class="supervise-bakery-comp-card-row-data">
                    {{ stageTime.uh < 10 ? '0' + stageTime.uh : stageTime.uh }}:{{ stageTime.um < 10 ? '0' + stageTime.um : stageTime.um }}:{{ stageTime.us < 10 ? '0' + stageTime.us : stageTime.us }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="阶段剩余时间">
                  <div class="supervise-bakery-comp-card-row-data">
                    {{ stageTime.lh < 10 ? '0' + stageTime.lh : stageTime.lh }}:{{ stageTime.lm < 10 ? '0' + stageTime.lm : stageTime.lm }}:{{ stageTime.ls < 10 ? '0' + stageTime.ls : stageTime.ls }}
                  </div>
                </el-descriptions-item>
            </el-descriptions>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <el-row slot="header" class="supervise-bakery-comp-card-row-item-header">
            <el-col :span="24">
              <el-descriptions :column="2" style="padding-top: 20px;">
                  <el-descriptions-item label="当前控制棚状态">
                    <el-tag type="primary" effect="dark" size="small">上棚</el-tag>
                  </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-descriptions :column="2" title="干球温度" direction="vertical" :colon="false">
                  <el-descriptions-item label="目标温度">
                    <div class="supervise-bakery-comp-card-row-data">
                      ---
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item label="当前温度">
                    <div class="supervise-bakery-comp-card-row-data">
                      ---
                    </div>
                  </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="12">
              <el-descriptions :column="2" title="湿球温度" direction="vertical" :colon="false">
                  <el-descriptions-item label="目标温度">
                    <div class="supervise-bakery-comp-card-row-data">
                      ---
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item label="当前温度">
                    <div class="supervise-bakery-comp-card-row-data">
                      ---
                    </div>
                  </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="supervise-bakery-comp-chart-row">
      <div id="supervise-bakery-comp-chart"></div>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'SuperviseBakeryComp',
    components: {
    },
    props: ['rowMsg'],
    data() {
      return {
        fit: 'scale-down',
        chart: null,
        timer: null,
        rowData: null,
        bakeTime: {
          start: '2022/5/9 00:00:00',
          end: '2022/5/12 00:00:00',
          th: 0, tm: 0, ts: 0,
          uh: 0, um: 0, us: 0,
          lh: 0, lm: 0, ls: 0,
        },
        stageTime: {
          start: '2022/5/9 00:00:00',
          end: '2022/5/10 00:00:00',
          th: 0, tm: 0, ts: 0,
          uh: 0, um: 0, us: 0,
          lh: 0, lm: 0, ls: 0,
        },
        bakeryDetailDesc: [
          {label: '烤房名称', span: 1},
          {label: '烤房编号', span: 1},
          {label: '所属单位', span: 2},
          {label: 'SN', span: 1},
          {label: 'MAC/IMEI', span: 1},
          {label: '烤房模版', span: 2},
          {label: '控制器安装', span: 1},
          {label: '设备电压', span: 1},
          {label: '烤房类型', span: 1},
          {label: '燃料类型', span: 1},
          {label: '气流下降式', span: 1},
          {label: '海拔（米）', span: 1},
          {label: '装烟容量', span: 1},
          {label: '体积（米）', span: 1},
          {label: '建造规格', span: 1},
          {label: '建造时间', span: 1},
          {label: '建造单位', span: 2},
          {label: '负责人', span: 1},
          {label: '联系方式', span: 1},
          {label: '调制能力（亩）', span: 2},
          {label: '所属合作社', span: 2},
          {label: '控制设备生产厂家', span: 2},
          {label: '烟草公司指定负责人', span: 1},
          {label: '联系方式', span: 1},
          {label: '烘烤辅导员', span: 1},
          {label: '联系方式', span: 1},
        ],
        picSrcs: [
          'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
          'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
          'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
          'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
          'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
        ]
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
      fetchData() {
        this.rowData = this.rowMsg
        console.log(this.rowMsg)
        this.bakeTime = this.timeSolve(this.bakeTime)
        this.stageTime = this.timeSolve(this.stageTime)
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('supervise-bakery-comp-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      timeSolve(data) {
        let start = new Date(data.start)
        let end = new Date(data.end)
        let cur = new Date()
        let total = end - start
        let use = cur - start
        let left = end - cur

        let show = [total, use, left]

        for(let i = 0; i < show.length; i++){
          let h = Math.floor(show[i]/(3600*1000))
          let l = show[i] % (3600*1000)
          let m = Math.floor(l/(60*1000))
          l = show[i] % (60*1000)
          let s = Math.round(l/1000)
          show[i] = [h, m, s]
        }
        data.th = show[0][0]
        data.tm = show[0][1]
        data.ts = show[0][2]
        data.uh = show[1][0]
        data.um = show[1][1]
        data.us = show[1][2]
        data.lh = show[2][0]
        data.lm = show[2][1]
        data.ls = show[2][2]
        if((data.th - data.uh) * 3600 + (data.tm - data.um) * 60 + (data.ts - data.us) <= 0){
          data.uh = data.th
          data.um = data.tm
          data.us = data.ts
          data.lh = 0
          data.lm = 0
          data.ls = 0
        }
        return data
      },
      timeCount() {
        this.timer = setInterval( () => {
          if(this.bakeTime.uh === this.bakeTime.th) {
            return
          }
          if(this.bakeTime.uh < this.bakeTime.th && this.bakeTime.um === 59 && this.bakeTime.us === 59){
            this.bakeTime.uh += 1
            this.bakeTime.um = 0
            this.bakeTime.us = 0
            this.bakeTime.ls -= 1
          }
          else if(this.bakeTime.um < 59 && this.bakeTime.us === 59){
            this.bakeTime.um += 1
            this.bakeTime.us = 0
            this.bakeTime.ls -= 1
          }
          else{
            this.bakeTime.us += 1
            if(this.bakeTime.lh > 0 && this.bakeTime.lm === 0 && this.bakeTime.ls === 0){
              this.bakeTime.lh -= 1
              this.bakeTime.lm = 59
              this.bakeTime.ls = 59
            }
            else if(this.bakeTime.lm > 0 && this.bakeTime.ls === 0){
              this.bakeTime.lm -= 1
              this.bakeTime.ls = 59
            }
            else{
              this.bakeTime.ls -= 1
            }
          }

          if(this.stageTime.uh === this.stageTime.th) {
            return
          }
          if(this.stageTime.uh < this.stageTime.th && this.stageTime.um === 59 && this.stageTime.us === 59){
            this.stageTime.uh += 1
            this.stageTime.um = 0
            this.stageTime.us = 0
            this.stageTime.ls -= 1
          }
          else if(this.stageTime.um < 59 && this.stageTime.us === 59){
            this.stageTime.um += 1
            this.stageTime.us = 0
            this.stageTime.ls -= 1
          }
          else{
            this.stageTime.us += 1
            if(this.stageTime.lh > 0 && this.stageTime.lm === 0 && this.stageTime.ls === 0){
              this.stageTime.lh -= 1
              this.stageTime.lm = 59
              this.stageTime.ls = 59
            }
            else if(this.stageTime.lm > 0 && this.stageTime.ls === 0){
              this.stageTime.lm -= 1
              this.stageTime.ls = 59
            }
            else{
              this.stageTime.ls -= 1
            }
          }
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
  .supervise-bakery-comp-card-row-data{
    font-size: x-large;
  }
  .supervise-bakery-comp-card-row-item-header{
    height: 60px;
  }
  #supervise-bakery-comp-chart{
    height: 32.8125rem;
  }
</style>
