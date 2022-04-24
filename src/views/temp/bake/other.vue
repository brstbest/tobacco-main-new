<template>
  <div class="app-container">
    <el-row class="other-search-row" :gutter="20">
      <el-col :span="11">
        <LocationComp @watchLocation="setLocation"></LocationComp>
      </el-col>
      <el-col :span="11">
        <DateTimeComp @watchDateTime="setDateTime"></DateTimeComp>
      </el-col>
      <el-col :span="2">
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
        @click="exportExcel"
      >
        导出Excel
      </el-button>
    </div>

    <el-tabs
    tab-position="left">
      <template v-for="(item, index) in tabList">
        <el-tab-pane
        :label="item.name">
          <el-table
          :data="tableData[item.id]"
          id="table">
            <template v-for="(col, idx) in tabColumnsList[item.id]">
              <el-table-column
              :prop="col.key"
              :label="col.label"
              :key="idx">
              <template v-if="col.key === 'location' || col.key.includes('Rate')" v-slot="scope">
                <div v-if="col.key === 'location' && scope.row.location !== null">{{ postcodeJSON[scope.row.location] }}</div>
                <div v-if="col.key === 'location' && scope.row.location === null">{{ postcodeJSON[scope.row.parent_location] }}</div>
                <div v-if="col.key.includes('Rate')">{{ scope.row[col.key] }}%</div>
              </template>
              </el-table-column>
            </template>

          </el-table>
        </el-tab-pane>
      </template>

    </el-tabs>


    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-table
        ref="multipleTable"
        :data="tabList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="表格名称"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportExcel">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FilenameOption from '@/components/ExportExcel/FilenameOption'
import AutoWidthOption from '@/components/ExportExcel/AutoWidthOption'
import BookTypeOption from '@/components/ExportExcel/BookTypeOption'
import { getOtherData, getAlertData } from '@/api/bake'

import LocationComp from '../../components/LocationComp'
import DateTimeComp from '../../components/DateTimeComp'
import postcodeJSON from '../../../public/static/map/postcode.json'

export default {
  name: 'Other',
  components: { FilenameOption, AutoWidthOption, BookTypeOption, LocationComp, DateTimeComp },
  data() {
    return {
      postcodeJSON,
      searchStartTime: '',
      searchEndTime: '',
      searchParentLocation: '671000',
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      selectTab: '1',
      selectionTabs: [],
      dialogVisible: false,
      columnList: [],
      tabList: [
        { 'name': '掉温率统计', 'id': 0 },
        { 'name': '报警次数统计', 'id': 1 },
        { 'name': '温度报警幅度统计', 'id': 2 },
        // { 'name': '设备安装统计', 'id': 1 },
        // { 'name': '产区排序', 'id': 2 },
        // { 'name': '烘烤工艺执行率评价', 'id': 3 },
        // { 'name': '掉温率统计', 'id': 4 },
        // { 'name': '报警次数统计', 'id': 5 },
        // { 'name': '温度报警幅度统计', 'id': 6 },
      ],
      tableData: [],
      wholeData: [],
      tabColumnsList: [
        [
          {key: 'location', label: '产区'},
          {key: 'totalStove', label: '总坑数'},
          {key: 'alertStove', label: '预警坑数'},
          {key: 'alertRate', label: '预警率'},
          {key: 'dropStove', label: '掉温坑数'},
          {key: 'dropRate', label: '掉温率'},
        ],
        [
          {key: 'location', label: '产区'},
          {key: 'dropAlert', label: '掉温预警'},
          {key: 'increaseAlert', label: '升温预警'},
        ],
        [
          {key: 'location', label: '产区'},
          {key: 'dropAlertTemp', label: '掉温预警（℃）'},
          {key: 'increaseAlertTemp', label: '升温预警（℃）'},
        ],
      ]
    }
  },
  created() {
    this.fetchData()
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
    setDataTable_1() {
      let res = []
      this.wholeData.forEach(data => {
        let obj = {
          location: data.location,
          parent_location: data.parent_location,
          totalStove: Math.floor(Math.random()*51) + 50
        }
        obj.alertStove = data.warning_1 + data.warning_2 + data.warning_3 + data.warning_4 + data.warning_5 + data.warning_6 + data.warning_7
        obj.alertRate = ((obj.alertStove / obj.totalStove) * 100.0).toFixed(1)
        obj.dropStove = data.warning_6 + data.warning_7
        obj.dropRate = ((obj.dropStove / obj.totalStove) * 100.0).toFixed(1)
        res.push(obj)
      })
      this.tableData.push(res)
    },
    setDataTable_2() {
      let res = []
      this.wholeData.forEach(data => {
        let obj = {
          location: data.location,
          parent_location: data.parent_location,
        }
        obj.dropAlert = data.warning_6 + data.warning_7
        obj.increaseAlert = data.warning_3 + data.warning_4 + data.warning_5
        res.push(obj)
      })
      this.tableData.push(res)
    },
    setDataTable_3() {
      let res = []
      this.wholeData.forEach(data => {
        let obj = {
          location: data.location,
          parent_location: data.parent_location,
        }
        obj.dropAlertTemp = Math.floor(Math.random()*5)
        obj.increaseAlertTemp = Math.floor(Math.random()*5)
        res.push(obj)
      })
      this.tableData.push(res)
    },
    handleSelectionChange(p) {
      this.selectionTabs = p
    },
    handleDownload() {
      this.dialogVisible = true
    },
    setLocation(data){
      this.searchLocation = data.location
      this.searchParentLocation = data.parent_location
      console.log(this.searchParentLocation)
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
          this.tableData = []
          this.wholeData = res.data
          this.setDataTable_1()
          this.setDataTable_2()
          this.setDataTable_3()
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>
  .other-search-row{
    padding-bottom: 20px;
  }
</style>
