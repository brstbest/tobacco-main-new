<template>
  <div class="bake-report-comp">
    <el-empty v-if="empty" description="暂无数据"></el-empty>
    <el-row v-if="!empty" class="bake-report">
      <el-checkbox-group v-model="checkList">
        <template v-for="(item, index) in labels">
          <el-checkbox :label="item"></el-checkbox>
        </template>
      </el-checkbox-group>
      <el-button type="primary" style="margin-top: 1.25rem;" @click="exportWord">生成报告</el-button>
    </el-row>
  </div>
</template>

<script>
  import Docxtemplater from 'docxtemplater'
  import { saveAs } from 'file-saver'
  import JSZip from 'jszip'
  import JSZipUtils from 'jszip-utils'

  import { timeFormat } from '/src/utils/index.js'
  import { getSensor } from '@/api/sensor'

  export default{
    name: 'BakeReportComp',
    components: {},
    props: ['recordMsg'],
    data() {
      return {
        empty: true,
        labels: ['烤房基础信息', '烤房故障记录', '天气信息', '物联网采集数据', '人员采集数据', '预警记录'],
        checkList: ['烤房基础信息', '烤房故障记录', '天气信息', '物联网采集数据', '人员采集数据', '预警记录'],
        recordData: {},
        table: [
          {a: '123', b: '234'},
          {a: '234', b: '345'},
          {a: '345', b: '456'},
        ],
        bakeryData: {},
        faultData: [
          {
            component: 0,
            way: 0,
            price: 0,
            unit: 0,
            isMaintained: 0,
            m_person: 0,
            isSupervised: 0,
            s_person: 0
          },
          {
            component: 0,
            way: 0,
            price: 0,
            unit: 0,
            isMaintained: 0,
            m_person: 0,
            isSupervised: 0,
            s_person: 0
          },
        ],
        weatherData: {},
        iotData: [],
        manualData: {},
        alertData: []
      }
    },
    created() {
      if(this.recordMsg !== null) {
        this.empty = false
        this.fetchData()
      }
    },
    methods: {
      async fetchData() {
        this.manualData = this.recordMsg
        this.bakeryData = JSON.parse(sessionStorage.getItem("device"))
        await this.requestWeather()
        let rdata = {
          device_id: this.manualData.device_id,
          // start_time: this.descFirstData.start_time,
          // end_time: this.descFirstData.end_time
          start_time: timeFormat(new Date('2021-09-24 00:00:00'), 0, 5),
          end_time: timeFormat(new Date('2021-09-26 00:00:00'), 0, 5),
        }
        this.iotData = await this.requestSensor(rdata)
      },
      async requestSensor(rdata){
        let sres = await getSensor(rdata)
        return sres.data
      },
      async requestWeather() {
        return
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
      exportWord() {
        let tdata = this.dataPrepare()
        console.log('tdata', tdata)

        let _this = this
        JSZipUtils.getBinaryContent('/template.docx', function(error, content) {
          console.log('------', content)
          if(error) {
            throw error
          }
          let zip = new JSZip(content)
          console.log('++++++', zip)
          let doc = new Docxtemplater()
          console.log('//////', doc)
          doc.loadZip(zip)
          console.log('======', doc)

          doc.setData(tdata)
          try {
            doc.render()
          }catch(error) {
            let e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties
            }
            console.log(JSON.stringify({ error: e }))
            throw error
          }
          let out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
          saveAs(out, 'test.docx')
        })
      },
      dataPrepare() {
        let tdata = {}
        tdata.showBasicInfo = this.checkList.includes('烤房基础信息')
        tdata.showFault = this.checkList.includes('烤房故障记录')
        tdata.showWeather = this.checkList.includes('天气信息')
        tdata.showIoT = this.checkList.includes('物联网采集数据')
        tdata.showManual = this.checkList.includes('人员采集数据')
        tdata.showAlert = this.checkList.includes('预警记录')
        tdata.bakeryData = this.bakeryData
        tdata.faultData = this.faultData
        tdata.weatherData = this.weatherData
        tdata.iotData = this.iotData
        tdata.manualData = this.manualData
        tdata.alertData = this.alertData
        return tdata
      }
    }
  }
</script>

<style>
  .bake-report-comp, .bake-report{
    height: 100%;
  }
  .bake-report{
    padding: 1.25rem;
  }
</style>
