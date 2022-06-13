<template>
  <div class="bakery-detail">
    <el-row class="bakery-detail-header">
      <el-page-header @back="goBack" content="烤房">
      </el-page-header>
    </el-row>
    <el-row class="bakery-detail-body" :gutter="20">
      <el-row :gutter="10" class="bakery-detail-info">
        <el-col style="height: 100%; width: 70%;">
          <el-card style="height: 100%;">
            <el-descriptions title="烤房基本信息" :column="9">
              <template slot="extra">
                <el-popover
                  placement="bottom"
                  width="1300"
                  trigger="manual"
                  v-model="popVisible">
                  <FaultMaintenanceRecordComp></FaultMaintenanceRecordComp>
                  <el-button slot="reference" type="text" style="padding: 0rem;" @click="popVisible = !popVisible">故障及保养维护记录<i class="el-icon-caret-bottom"></i></el-button>
                </el-popover>
              </template>
              <!-- <template v-for="(item, index) in descLabels">
                <el-descriptions-item v-if="item.key === 'parent_location' || item.key === 'location'" :label="item.label" :span="item.span">{{ postcodeJSON[deviceData[item.key]] }}</el-descriptions-item>
                <el-descriptions-item v-else :label="item.label" :span="item.span">{{ deviceData[item.key] }}</el-descriptions-item>
              </template> -->
              <template v-for="(item, index) in newDescLabels">
                <el-descriptions-item :label="item.label" :span="item.span">{{ deviceData[item.key] }}</el-descriptions-item>
              </template>

            </el-descriptions>
          </el-card>
        </el-col>
        <el-col class="bakery-detail-weather">
          <el-card style="height: 100%;">
            <el-descriptions
              direction="vertical"
              :column="3"
              :colon="false"
              :contentStyle="{'text-align': 'center', 'width': '33%', 'font-size': '16px', 'font-weight': 'bold'}"
              :labelStyle="{'text-align': 'center', 'width': '33%'}">
              <template v-for="(item, index) in weatherDescLabels">
                <el-descriptions-item :label="item.label">
                  <div v-if="item.key === 'temp'">{{weatherData[item.key]+'℃'}}</div>
                  <div v-else-if="item.key === 'precip'">{{weatherData[item.key]+' mm'}}</div>
                  <div v-else-if="item.key === 'windScale'">{{weatherData[item.key]+'级'}}</div>
                  <div v-else-if="item.key === 'windSpeed'">{{weatherData[item.key]+' km/h'}}</div>
                  <div v-else>{{weatherData[item.key]}}</div>
                </el-descriptions-item>
              </template>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="bakery-detail-tabs">
        <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="bakery-detail-history-col">
          <BakeryHistoryComp :bakery-msg="deviceData" @watchHistory="historyRecieve"></BakeryHistoryComp>
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="bakery-detail-tab-col">
          <el-tabs v-if="showTabs" v-model="activeName" type="border-card" @tab-click="handleClick" style="height: 100%;">
            <el-tab-pane label="物联网采集数据" name="iot">
              <IoTDataComp v-if="activeName === 'iot'" :record-msg="selectedRecord"></IoTDataComp>
            </el-tab-pane>
            <el-tab-pane label="人员采集信息" name="manual">
              <ManualDataComp v-if="activeName === 'manual'" :record-msg="selectedRecord"></ManualDataComp>
            </el-tab-pane>
            <el-tab-pane label="报警记录" name="alert">
              <BakeRecordAlertComp v-if="activeName === 'alert'" :record-msg="selectedRecord"></BakeRecordAlertComp>
            </el-tab-pane>
            <el-tab-pane label="烘烤报告" name="report">
              <BakeReportComp v-if="activeName === 'report'" :record-msg="selectedRecord"></BakeReportComp>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import BakeryHistoryComp from './components/BakeryHistoryComp'
  import postcodeJSON from '/public/static/map/postcode.json'
  import IoTDataComp from './components/IoTDataComp'
  import ManualDataComp from './components/ManualDataComp'
  import BakeRecordAlertComp from './components/record'
  import FaultMaintenanceRecordComp from './components/FaultMaintenanceRecord'
  import BakeReportComp from './components/BakeReportComp'

  import {searchDevice} from '@/api/device'
  import {getWeather, getLocationId} from '@/api/weather'

  export default{
    name: 'BakeryDetailComp',
    components: {
      BakeryHistoryComp,
      IoTDataComp,
      ManualDataComp,
      BakeRecordAlertComp,
      FaultMaintenanceRecordComp,
      BakeReportComp
    },
    data() {
      return {
        postcodeJSON,
        activeName: '',
        showTabs: false,
        deviceData: null,
        selectedRecord: null,
        popVisible: false,
        descLabels: [
          {key: 'device_id', label: '烤房编号', span: 1},
          {key: 'parent_location', label: '州市', span: 1},
          {key: 'station_id', label: '烟站编号', span: 1},
          {key: 'group_id', label: '烤房群编号', span: 1},
          {key: 'head', label: '联系人', span: 1},
          {key: 'device_name', label: '烤房名称', span: 1},
          {key: 'location', label: '县市', span: 1},
          {key: 'station_name', label: '烟站名称', span: 1},
          {key: 'group_name', label: '烤房群名称', span: 1},
          {key: 'head_phone', label: '手机号', span: 1},
          {key: 'kind', label: '烤房类型', span: 1},
          {key: 'create_time', label: '创建时间', span: 1},
          {key: 'address', label: '详细地址', span: 3},
        ],
        newDescLabels: [
          {key: 'device_id', label: '烤房编号', span: 2},
          {key: 'fuel_type', label: '燃料类型', span: 2},
          {key: 'supplier_device', label: '设备供应商', span: 2},
          {key: 'GPS', label: 'GPS坐标', span: 3},
          {key: 'station_name', label: '归属烟站', span: 2},
          {key: 'airflow_mode', label: '气流方式', span: 2},
          {key: 'beneficiary_entity', label: '受益主体', span: 2},
          {key: 'specifications_room', label: '装烟室规格', span: 3},
          {key: 'create_time', label: '创建时间', span: 2},
          {key: 'structural_form', label: '结构形式', span: 2},
          {key: 'technician_name', label: '烘烤技师', span: 2},
          {key: 'address', label: '烤房地址', span: 3},
        ],
        weatherDescLabels: [
          { key: 'text', label: '天气' },
          { key: 'temp', label: '温度' },
          { key: 'precip', label: '降水量' },
          { key: 'windDir', label: '风向' },
          { key: 'windScale', label: '风力' },
          { key: 'windSpeed', label: '风速' },
        ],
        weatherData: {
          text: '',
          temp: '',
          precip: '',
          windDir: '',
          windScale: '',
          windSpeed: '',
        },
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
    },
    methods: {
      async fetchData() {
        this.deviceData = JSON.parse(sessionStorage.getItem("device"))
        this.activeName = 'iot'
        this.showTabs = true
        await this.requestWeather()
        // this.deviceData = JSON.parse(sessionStorage.getItem("device"))
      },
      goBack() {
        sessionStorage.removeItem("device")
        this.$router.go(-1)
      },
      handleClick(tab, event) {
        //tab.name

      },
      historyRecieve(option) {
        if(option !== undefined){
          console.log('historyRecieve', option)
          let temp = this.activeName
          this.showTabs = false
          this.selectedRecord = option.data
          setTimeout(() => {
            this.showTabs = true
            this.activeName = temp
          }, 100);
        }
      },
      async requestWeather() {
        if(this.deviceData.location == '' || this.deviceData.location == null || this.deviceData.parent_location == '' || this.deviceData.parent_location == null){
          console.log(this.deviceData)
          return false
        }
        let key = '9bd19529a8564d9a9e00bc29e8fada85'
        let location = this.postcodeJSON[this.deviceData.location]
        let adm = this.postcodeJSON[this.deviceData.parent_location]
        let rdata = {
          location: location,
          adm: adm,
          key: key
        }
        let lres = await getLocationId(rdata)
        console.log('lres', lres)
        rdata = {
          location: lres.location[0].id,
          key: key
        }
        let wres = await getWeather(rdata)
        this.weatherData = wres.now
      },
    }
  }
</script>

<style>
  .bakery-detail{
    height: 56.5625rem;
  }
  .bakery-detail-header{
    padding: 1.25rem;
    padding-bottom: 0rem;
  }
  .bakery-detail-body{
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    height: 90%;
  }
  .bakery-detail-tab-col, .bakery-detail-history-col{
    height: 100%;
  }
  .bakery-detail-history-col{
    border-right: 0.0625rem solid lightgray;
  }
  .bakery-detail-info{
    height: 20%;
    margin-top: 1.25rem;
    margin-bottom: 0.625rem;
  }
  .bakery-detail-tabs{
    height: 83%;
  }
  .bakery-detail .el-tabs__content{
    height: 94.5%
  }
  .bakery-detail .el-tab-pane{
    height: 100%;
  }
  .bakery-detail-weather{
    width: 30%;
    height: 100%;
  }
</style>
