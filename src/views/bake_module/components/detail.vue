<template>
  <div class="detail-comp">
    <el-row class="detail-comp-button-row">
      <el-button type="success" @click="showBakeRecordClick" icon="el-icon-s-order">设备烘烤记录</el-button>
      <el-button type="primary" @click="showHistoryLine">历史曲线</el-button>
      <el-button type="primary">控制参数</el-button>
      <el-button type="primary">曲线参数</el-button>
      <el-button type="primary">频率参数</el-button>
      <el-button type="primary">电源参数</el-button>
      <el-button type="primary">风机参数</el-button>
      <el-button type="primary">偏温报警</el-button>
      <el-button type="primary">照片查看</el-button>

    </el-row>
    <el-row class="detail-comp-info-row">
      <el-col :span="5" class="detail-comp-info-row-left">
        <el-row class="detail-comp-info-row-left-title">
          智能烘干系统
        </el-row>
        <el-row class="detail-comp-info-row-left-info">
          <el-row class="detail-comp-info-row-left-info-1">
            <el-col :span="12" class="detail-comp-info-row-left-info-1-left">
              <el-row>{{ detailData.dryBallTemp }}℃</el-row>
              <el-row>干球温度</el-row>
            </el-col>
            <el-col :span="12" class="detail-comp-info-row-left-info-1-right">
              <el-row>{{ detailData.wetBallTemp }}℃</el-row>
              <el-row>湿球温度</el-row>
            </el-col>
          </el-row>
          <el-row class="detail-comp-info-row-left-info-2">
            <el-col :span="12" class="detail-comp-info-row-left-info-2-left">
              <el-row>目标温度</el-row>
              <el-row>{{ detailData.dryBallTarget }}℃</el-row>
            </el-col>
            <el-col :span="12" class="detail-comp-info-row-left-info-2-right">
              <el-row>目标温度</el-row>
              <el-row>{{ detailData.wetBallTarget }}℃</el-row>
            </el-col>
          </el-row>
          <el-row class="detail-comp-info-row-left-info-3">
            <el-col :span="12" class="detail-comp-info-row-left-info-3-left">
              <el-row>非控温温度</el-row>
              <el-row>---℃</el-row>
            </el-col>
            <el-col :span="12" class="detail-comp-info-row-left-info-3-right">
              <el-row>非控温温度</el-row>
              <el-row>---℃</el-row>
            </el-col>
          </el-row>
          <el-row class="detail-comp-info-row-left-info-4">
            更新时间：{{ detailData.produce_date }}
          </el-row>
        </el-row>
        <el-row class="detail-comp-info-row-left-alert">
          <el-row class="detail-comp-info-row-left-alert-title">
            报警信息
          </el-row>
          <template>
            <ul class="infinite-list detail-comp-info-row-left-alert-list" v-infinite-scroll="load" style="overflow:auto">
              <li v-for="(item, index) in alertData" class="infinite-list-item" style="line-height: 30px;">{{ 'xxxxxxx报警：' + item.produce_date }}</li>
            </ul>
          </template>
<!--          <el-row class="detail-comp-info-row-left-alert-list">
           <el-row v-for="(item, index) in alertData.slice(0, 5)" :key="index">
              <el-col :span="12" class="detail-comp-info-row-left-alert-list-item-text">
                xxxxxx报警
              </el-col>
              <el-col :span="12" class="detail-comp-info-row-left-alert-list-item-datetime">
                {{item.produce_date}}
              </el-col>
            </el-row>
          </el-row> -->
 <!--         <el-row v-if="alertData.length > 5" class="detail-comp-info-row-left-alert-button">
            <el-button type="text">更多信息>></el-button>
          </el-row> -->
        </el-row>
      </el-col>

      <el-col :span="19" class="detail-comp-info-row-right">
        <el-descriptions class="detail-comp-info-row-info" :column="2" :size='small' border :label-style="label_style">
          <el-descriptions-item v-for="(item) in descriptionItem1">
            <template slot="label">
              {{ item.label }}
            </template>
            ---
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="detail-comp-info-row-info" :column="2" :size='small' border :label-style="label_style">
          <el-descriptions-item v-for="(item) in descriptionItem2">
            <template slot="label">
              {{ item.label }}
            </template>
            ---
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="detail-comp-info-row-info" :column="2" :size='small' border :label-style="label_style">
          <el-descriptions-item v-for="(item) in descriptionItem3">
            <template slot="label">
              {{ item.label }}
            </template>
            ---
          </el-descriptions-item>
        </el-descriptions>
      </el-col>

    </el-row>

    <el-dialog
    title="历史曲线"
    :visible.sync="HistoryLineVisible"
    v-if="HistoryLineVisible"
    destroy-on-close>
      <HistoryLine></HistoryLine>
    </el-dialog>

    <el-dialog
    title="设备烘烤记录"
    :visible.sync="DeviceRecordVisible"
    v-if="DeviceRecordVisible"
    destroy-on-close
    append-to-body
    width="75%">
      <DeviceRecordComp :device-msg="detailData"></DeviceRecordComp>
    </el-dialog>
  </div>
</template>

<script>
  import HistoryLine from './comps/HistoryLine'
  import ControlParams from './comps/ControlParams'
  import LineParams from './comps/LineParams'
  import FrequencyParams from './comps/FrequencyParams'
  import PowerParams from './comps/PowerParams'
  import FanParams from './comps/FanParams'
  import TempAlert from './comps/TempAlert'
  import DeviceRecordComp from './comps/DeviceBakeRecord'

  export default{
    name: 'DeviceDetail',
    components: {
      HistoryLine,
      ControlParams,
      LineParams,
      FrequencyParams,
      PowerParams,
      FanParams,
      TempAlert,
      DeviceRecordComp
    },
    data() {
      return {
        DeviceRecordVisible: false,
        HistoryLineVisible: false,
        ControlParamsVisible: false,
        LineParamsVisible: false,
        FrequencyParamsVisible: false,
        PowerParamsVisible: false,
        FanParamsVisible: false,
        TempAlertVisible: false,
        label_style: {
          'width': '15%',
        },
        descriptionItem1: [
          {key: 'deviceName', label:'设备名称'},
          {key: 'deviceID', label:'设备ID'},
        ],
        descriptionItem2: [
          {key: 'workState', label:'工作状态'},
          {key: 'deviceType', label:'设备类型'},
          {key: 'artState', label:'工艺状态'},
          {key: 'mode', label:'控制模式'},
          {key: 'runState', label:'运行状态'},
          {key: 'workTime', label:'工作时间'},
          {key: 'voltage', label:'控制器电压'},
          {key: 'remainTime', label:'剩余时间'},
          {key: 'heatState', label:'加热状态'},
          {key: 'drainMoisture', label:'排湿状态'},
          {key: 'loopOuput', label:'循环输出'},
          {key: 'loopFrequency', label:'循环变频'},
        ],
        descriptionItem3: [
          {key: 'deviceState', label:'设备状态'},
          {key: 'powerLevel', label:'火力级别'},
          {key: 'powerCycle', label:'火力周期'},
          {key: 'clearMode', label:'清渣模式'},
          {key: 'fanSpeed', label:'鼓风风速'},
          {key: 'clearTime', label:'清渣时间'},
          {key: 'inputState', label:'进料状态'},
          {key: 'clearInterval', label:'清渣间隔'},
          {key: 'inputTime', label:'进料时间'},
          {key: 'clearCycle', label:'清渣周期'},
          {key: 'inputCycle', label:'进料周期'},
        ],
        alertData: [],
        detailData: [],
      }
    },
    props: ['deviceMsg'],
    created(){
      this.detailData = {...this.deviceMsg}
      this.alertData = this.detailData.history
      this.detailData.history = undefined
      console.log(this.detailData)
    },
    methods: {
      showHistoryLine(){
        console.log('ads')
        // this.HistoryLineVisible = true
      },
      showBakeRecordClick(){
        this.DeviceRecordVisible = true
      }
    },
  }
</script>

<style>
  .detail-comp-button-row, .detail-comp-info-row{
    padding: 20px;
    padding-bottom: 10px;
  }
  .detail-comp-info-row-left{
    background-color: #1890FF;
    border-radius: 10px;
    padding: 5px;
  }
  .detail-comp-info-row-left-title, .detail-comp-info-row-left-alert-title{
    text-align: center;
    padding: 15px;
    margin: 5px;
    background-color: #0055ff;
    color: white;
    font-weight: bold;
    border-radius: 5px;
  }
  .detail-comp-info-row-left-info, .detail-comp-info-row-left-alert-list{
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin: 5px;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
  }
  .detail-comp-info-row-left-alert-list{
    color: black;
    text-align: left;
    height: 15rem;
  }
  .detail-comp-info-row-left-info-1, .detail-comp-info-row-left-info-2, .detail-comp-info-row-left-info-3, .detail-comp-info-row-left-info-4{
    padding: 20px;
  }
  .detail-comp-info-row-info{
    padding: 20px;
    padding-top: 0px;
  }

</style>
