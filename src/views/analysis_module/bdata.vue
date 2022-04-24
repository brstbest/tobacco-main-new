<template>
  <div class="app-container">
    <el-row class="bdata-search-row" :gutter="20">
      <el-col :span="7">
        <LocationComp @watchLocation="setLocation"></LocationComp>
      </el-col>
      <el-col :span="7">
        <DateTimeComp @watchDateTime="setDateTime"></DateTimeComp>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="searchClick()">查询</el-button>
      </el-col>
    </el-row>
    <div>
      <FilenameOption v-model="filename" />
      <BookTypeOption v-model="bookType" />
      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="exportExcel()"
      >
        导出Excel
      </el-button>
    </div>
    <el-row class="bdata-table-row">
      <el-table
      :data="this.tableData"
      id="table"
      show-summary>
        <el-table-column align="center" label="报警次数">
          <template v-for="(item, index) in dataColums">
            <el-table-column
            align="center"
            :prop="item.key"
            :label="item.label"
            :key="index"
            :width="item.width"
            :show-overflow-tooltip="item.key === location"
            >
            <template v-if="item.key === 'location'" v-slot="scope">
              <div v-show="scope.row.location !== null">{{ postcodeJSON[scope.row.location] }}</div>
              <div v-show="scope.row.location === null">{{ postcodeJSON[scope.row.parent_location] }}</div>
            </template>
            </el-table-column>
          </template>
        </el-table-column>
      </el-table>

    </el-row>

  </div>
</template>

<script>
import { getBakeData, getAlertData } from '@/api/bake'
// options components
import FilenameOption from '../../components/ExportExcel/FilenameOption'
import AutoWidthOption from '../../components/ExportExcel/AutoWidthOption'
import BookTypeOption from '../../components/ExportExcel/BookTypeOption'
import postcodeJSON from '../../../public/static/map/postcode.json'

import DateTimeComp from '../../components/DateTimeComp'
import LocationComp from '../../components/LocationComp'

export default {
  name: 'Bdata',
  components: { FilenameOption, AutoWidthOption, BookTypeOption, DateTimeComp, LocationComp },
  data() {
    return {
      postcodeJSON,
      searchStartTime: '',
      searchEndTime: '',
      searchLocation: '',
      searchParentLocation: '',
      list: null,
      tableData: [],
      listLoading: false,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      wholeData: [],
      dataColums: [
        {key: 'location', label: '地区', width: '125'},
        {key: 'warning_1', label: '点火后至38℃时间大于26小时', width: ''},
        {key: 'warning_2', label: '干球温度38℃时，湿球温度>36.5℃', width: ''},
        {key: 'warning_3', label: '38℃~42℃升温时间<8小时', width: ''},
        {key: 'warning_4', label: '38℃~42℃升温时间<12小时', width: ''},
        {key: 'warning_5', label: '38℃~42℃升温时间<9小时', width: ''},
        {key: 'warning_6', label: '掉温(≥2℃)次数=1次', width: ''},
        {key: 'warning_7', label: '掉温(≥2℃)次数=2次', width: ''},
        {key: 'sum', label: '合计', width: '100'},
      ]
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {

  },
  methods: {
    exportExcel() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        excel.exportExcel({
          documentId: '#table',
          filename: this.filename,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    countSum() {
      this.tableData.forEach(data => {
        let sum = 0
        sum = data.warning_1 + data.warning_2 + data.warning_3 + data.warning_4 + data.warning_5 + data.warning_6 + data.warning_7
        data.sum = sum
      })
    },
    fetchData() {
      var rdata = {}
      let user = JSON.parse(localStorage.getItem('user'))
      switch(user.category){
        case '1':
          rdata.parent_location = user.permission_range
          break
        case '2':
          rdata.location = user.permission_range
          break
        case '3':
          rdata.station_id = user.permission_range
      }
      this.requestAlertData(rdata)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        excel.exportExcel({ documentId: '#data-table', filename: this.filename, autoWidth: this.autoWidth, bookType: this.bookType })
        this.downloadLoading = false
      })
    },
    setLocation(data){
      this.searchLocation = data.location
      this.searchParentLocation = data.parent_location
      console.log('setLocation', data)
    },
    setDateTime(data){
      this.searchStartTime = data.start_time
      this.searchEndTime = data.end_time
    },
    searchClick(){
      let rdata = {}
      let flag = true
      if(this.searchStartTime !== ''){
        rdata.start_time = this.searchStartTime
        flag = false
      }
      if(this.searchEndTime !== ''){
        rdata.end_time = this.searchEndTime
        flag = false
      }
      if(this.searchLocation !== ''){
        rdata.location = this.searchLocation
        flag = false
      }
      if(this.searchParentLocation !== ''){
        rdata.parent_location = this.searchParentLocation
        flag = false
      }
      if(flag){
        this.fetchData()
      }
      else{
        this.requestAlertData(rdata)
      }
    },
    requestAlertData(rdata){
      console.log('rdata', rdata)
      getAlertData(rdata).then(res => {
        console.log('getAlertData', res)
        if(res.code === 200){
          this.tableData = res.data
          this.countSum()
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style>
  .bdata-search-row{
    padding-bottom: 20px;
  }
</style>
