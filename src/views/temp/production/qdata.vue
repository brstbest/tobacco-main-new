<template>
  <div class="app-container" v-loading='tableLoading'>
    <el-row class="qdata-datetime-row" :gutter="20">
      <el-col :span="20">
        <DateTimeComp @watchDateTime='setDateTime'></DateTimeComp>
      </el-col>
    </el-row>
    <el-row class="qdata-search-row" :gutter="20">
      <el-col :span="4">
        <el-input v-model="searchDeviceId" placeholder="请输入设备ID"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="searchDryTemp" placeholder="请输入干球温度"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="searchWetTemp" placeholder="请输入湿球温度"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="searchDryTarget" placeholder="请输入干球目标"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="searchWetTarget" placeholder="请输入湿球目标"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="searchClick" style="width: 100%;">查询</el-button>
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
      <el-button
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-s-marketing"
        @click="dialogTableVisible=true"
      >
        显示曲线
      </el-button>
    </div>
    <el-table
    :data="tableData"
    v-show="false"
    id="table">
      <template v-for="(item, index) in columns">
        <el-table-column
        :prop="item.key"
        :label="item.title"
        :key="index"
        :sortable="item.sortBy">
        </el-table-column>
      </template>
    </el-table>
    <el-table
    :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <template v-for="(item, index) in columns">
        <el-table-column
        :prop="item.key"
        :label="item.title"
        :key="index"
        :sortable="item.sortBy">
        </el-table-column>
      </template>
    </el-table>
    <el-row class="qdata-pagination-row"  type="flex" justify="center">
      <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="tableData.length">
      </el-pagination>
    </el-row>
<!--    <ve-table
      id="table"
      max-height="620px"
      :columns="columns"
      :table-data="tableData"
      :footer-data="footerData"
      :sort-option="sortOption"
      :paging-index="(pageIndex-1)*pageSize"
    />
    <v-pagination
        @page-change="pageChange"
        :total="total" :page-size="pageSize"
        :layout="['total', 'prev', 'pager', 'next', 'jumper']">
    </v-pagination> -->
      <el-dialog width="55%" top="0" title="曲线展示" :visible.sync="dialogTableVisible">
      <DataLine :table-data="tableData" />
    </el-dialog>
  </div>
</template>

<script>
import FilenameOption from '@/components/ExportExcel/FilenameOption'
import BookTypeOption from '@/components/ExportExcel/BookTypeOption'
import DateTimeComp from '../../components/DateTimeComp'
import DataLine from './components/DataLine'
import { dataMonitoringRequest } from '@/api/home'

export default {
  name: 'Qdata',
  components: { DataLine, FilenameOption, BookTypeOption, DateTimeComp },
  data() {
    return {
      start_time: '',
      end_time: '',
      tableLoading: false,
      pageSize: 12,
      currentPage: 1,
      total: 0,
      dialogTableVisible: false,
      searchDeviceId: '',
      searchDryTemp: '',
      searchWetTemp: '',
      searchDryTarget: '',
      searchWetTarget: '',
      downloadLoading: false,
      filename: '',
      bookType: 'xlsx',
      selectTab: '1',
      selectionTabs: [],
      columns: [
        { field: 'device_id', key: 'device_id', title: '设备ID', sortBy: false },
        { field: 'produce_date', key: 'produce_date', title: '时间', sortBy: false },
        { field: 'dryBallTemp', key: 'dryBallTemp', title: '干球温度', sortBy: false },
        { field: 'wetBallTemp', key: 'wetBallTemp', title: '湿球温度', sortBy: false },
        { field: 'dryBallTarget', key: 'dryBallTarget', title: '干球目标', sortBy: false },
        { field: 'wetBallTarget', key: 'wetBallTarget', title: '湿球目标', sortBy: false }
      ],
      tableData: [],
      // sortOption: {
      //   sortChange: (params) => {
      //     this.sortChange(params)
      //   }
      // }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    setDateTime(data) {
      this.start_time = data.star_time
      this.end_time = data.end_time
    },
    handleCurrentChange(val){
      this.currentPage = val;
    },
    initFooterData() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.footerData[i] = [{
          rowkey: 0,
          location: '合计'
        }]
        this.tableData[i].forEach(dd => {
          for (const key in dd) {
            if (key === 'location') continue
            if (this.footerData[i][0][key] !== undefined) {
              this.footerData[i][0][key] += parseFloat(dd[key])
            } else {
              this.footerData[i][0][key] = 0
            }
          }
        })
      }
    },
    fetchData(p) {
      this.tableLoading = true
      console.log("p", p)
      this.listLoading = true
      let rdata = {}
      this.requestMonitoring(rdata)
    },
    handleSelectionChange(p) {
      this.selectionTabs = p
    },
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
    requestMonitoring(rdata) {
      dataMonitoringRequest(rdata).then(res => {
        console.log(res)
        if(res.code === 200){
          this.tableData = res.data
          this.total = this.tableData.length
          this.tableLoading = false
          this.currentPage = 1
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    searchClick(){
      let rdata = {}
      if(this.start_time !== ''){
        rdata.start_time = this.start_time
      }
      if(this.end_time !== ''){
        rdata.end_time = this.end_time
      }
      if(this.searchDeviceId !== ''){
        rdata.device_id = this.searchDeviceId
      }
      if(this.searchDryTarget !== ''){
        rdata.dryBallTarget = this.searchDryTarget
      }
      if(this.searchDryTemp !== ''){
        rdata.dryBallTemp = this.searchDryTemp
      }
      if(this.searchWetTarget !== ''){
        rdata.wetBallTarget = this.searchWetTarget
      }
      if(this.searchWetTemp !== ''){
        rdata.wetBallTemp = this.searchWetTemp
      }
      this.requestMonitoring(rdata)
    },
    // getData() {
    //   let dryBallTempList = []
    //   if (this.dryBallTemp.indexOf('-') !== -1) {
    //     dryBallTempList = this.dryBallTemp.split('-')
    //   } else {
    //     dryBallTempList = [this.dryBallTemp, this.dryBallTemp]
    //   }
    //   let dryBallTargetList = []
    //   if (this.dryBallTarget.indexOf('-') !== -1) {
    //     dryBallTargetList = this.dryBallTarget.split('-')
    //   } else {
    //     dryBallTargetList = [this.dryBallTarget, this.dryBallTarget]
    //   }
    //   let wetBallTempList = []
    //   if (this.dryBallTemp.indexOf('-') !== -1) {
    //     wetBallTempList = this.wetBallTemp.split('-')
    //   } else {
    //     wetBallTempList = [this.wetBallTemp, this.wetBallTemp]
    //   }
    //   let wetBallTargetList = []
    //   if (this.dryBallTarget.indexOf('-') !== -1) {
    //     wetBallTargetList = this.wetBallTarget.split('-')
    //   } else {
    //     wetBallTargetList = [this.wetBallTarget, this.wetBallTarget]
    //   }
    //   const searchData = {
    //     'location': this.location,
    //     'device_id': this.deviceId,
    //     'dryBallTemp': dryBallTempList,
    //     'dryBallTarget': dryBallTargetList,
    //     'wetBallTemp': wetBallTempList,
    //     'wetBallTarget': wetBallTargetList
    //   }
    //   this.fetchData(searchData)
    // },
    // sortChange(params) {
    //   this.tableData.sort((a, b) => {
    //     if (params.produce_date) {
    //       if (params.produce_date === 'asc') {
    //         return new Date(a.produce_date) - new Date(b.produce_date)
    //       } else if (params.produce_date === 'desc') {
    //         return new Date(b.produce_date) - new Date(a.produce_date)
    //       } else {
    //         return 0
    //       }
    //     } else if (params.dryBallTemp) {
    //       if (params.dryBallTemp === 'asc') {
    //         return a.dryBallTemp - b.dryBallTemp
    //       } else if (params.dryBallTemp === 'desc') {
    //         return b.dryBallTemp - a.dryBallTemp
    //       } else {
    //         return 0
    //       }
    //     } else if (params.dryBallTemp) {
    //       if (params.dryBallTemp === 'asc') {
    //         return a.dryBallTemp - b.dryBallTemp
    //       } else if (params.dryBallTemp === 'desc') {
    //         return b.dryBallTemp - a.dryBallTemp
    //       } else {
    //         return 0
    //       }
    //     } else if (params.dryBallTarget) {
    //       if (params.dryBallTarget === 'asc') {
    //         return a.dryBallTarget - b.dryBallTarget
    //       } else if (params.dryBallTarget === 'desc') {
    //         return b.dryBallTarget - a.dryBallTarget
    //       } else {
    //         return 0
    //       }
    //     } else if (params.wetBallTarget) {
    //       if (params.wetBallTarget === 'asc') {
    //         return a.wetBallTarget - b.wetBallTarget
    //       } else if (params.wetBallTarget === 'desc') {
    //         return b.wetBallTarget - a.wetBallTarget
    //       } else {
    //         return 0
    //       }
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
.location-search {
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  background: white;
  border-radius: 1rem;
  width: 100%;
}
.item {
  margin-left: 1rem;
}
.query {
  height: 40px;
  width: 50rem;
  display: flex;
  border: none;
  background: #1890ff;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.1rem;
  border-radius: 0.5rem;
  /*margin: 2rem 1rem 0 0;*/
  margin-left: 3rem;
}
.qdata-pagination-row {
  padding: 20px;
  padding-bottom: 0px;
}
.qdata-datetime-row, .qdata-search-row{
  padding-bottom: 20px;
}
</style>
