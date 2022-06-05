<template>
  <div class="record">
    <el-empty v-if="empty" description="暂无数据"></el-empty>
    <el-row v-if="!empty">
      <el-row class="record-search-row-bottom" :gutter="20">
        筛选：
        <el-date-picker
          :size="size"
          v-model="filterTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="margin-right: 0.625rem;">
        </el-date-picker>
        <el-select :size="size" v-model="filterOvercome" clearable placeholder="请选择处理状态">
          <el-option :key="0" label="未处理" :value="0"></el-option>
          <el-option :key="1" label="已处理" :value="1"></el-option>
        </el-select>
      </el-row>
      <el-row class="record-table-row">
        <el-table id="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe style="width: 100%" :size="size">
          <template v-for="(item, index) in columns">
            <el-table-column
              :prop="item.key"
              :label="item.label">
              <template v-if="item.key === 'overcome' || item.key === 'operate'" v-slot="scope">
                <el-tag v-if="item.key === 'overcome'" :type="scope.row[item.key] === 1 ? 'success' : 'danger'" size="mini">
                  {{ scope.row[item.key] === 1 ? '已处理' : '未处理' }}
                </el-tag>
                <el-popover
                  v-if="item.key === 'operate' && scope.row.overcome === 0"
                  placement="top"
                  width="150"
                  trigger="click">
                  <el-row style="padding-bottom: 0.625rem;">
                    <el-button type="primary" style="width: 100%" plain @click="solveClick(scope.row, 1)">电话处理</el-button>
                  </el-row>
                  <el-row>
                    <el-button type="primary" style="width: 100%" plain @click="solveClick(scope.row, 1)">远程处理</el-button>
                  </el-row>
                  <el-button slot="reference" type="text" size="mini">处理</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-row>

      <el-row class="record-pagination-row" type="flex" justify="center">
        <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total">
        </el-pagination>
      </el-row>
    </el-row>
  </div>
</template>
<script>
  import { timeFormat } from '/src/utils/index.js'

  import { searchWarning, alterWarning } from '@/api/warning'

  export default{
    name: 'BakeRecordAlertComp',
    components: {
    },
    props: ['recordMsg'],
    data(){
      return{
        size: 'small',
        empty: true,
        total: 0,
        pageSize: 5,
        currentPage: 1,
        filterTime: '',
        filterOvercome: '',
        solveVisible: false,
        solveWarning: {},
        // datePicker: this.pickDate(),
        deviceData: {},
        recordData: {},
        columns: [
          { key: 'warning_time', label: '预警时间' },
          { key: 'warning_1', label: '异常1' },
          { key: 'warning_2', label: '异常2' },
          { key: 'warning_3', label: '异常3' },
          { key: 'warning_4', label: '异常4' },
          { key: 'warning_5', label: '异常5' },
          { key: 'warning_6', label: '异常6' },
          { key: 'warning_7', label: '异常7' },
          { key: 'overcome', label: '处理状态' },
          { key: 'operate', label: '操作' },
        ],
        warningData: [],
        tableData: [],
      }
    },
    created() {
      if(this.recordMsg !== null) {
        this.empty = false
        this.fetchData()
      }
    },
    watch: {
      filterTime(val) {
        this.filterTable()
      },
      filterOvercome(val) {
        this.filterTable()
      }
    },
    methods:{
      async fetchData() {
        this.recordData = this.recordMsg
        console.log('recordData', this.recordData)
        let rdata = {
          device_id: this.recordData.device_id,
          start_time: timeFormat(new Date(this.recordData.start_time), 0, 5),
          end_time: timeFormat(new Date(this.recordData.end_time), 0, 5)
        }
        this.warningData = await this.requestWarning(rdata)
        this.warningData.forEach(data => {
          data.warning_time = timeFormat(new Date(data.warning_time), 0, 5)
        })
        this.tableData = [].concat(this.warningData)
        this.filterTable()
        this.total = this.tableData.length
        this.handleCurrentChange(1)
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      filterTable() {
        let self = this
        let time1 = null
        let time2 = null
        if(this.filterTime !== null) {
          time1 = new Date(this.filterTime[0])
          time2 = new Date(this.filterTime[1])
        }
        this.tableData = this.warningData.filter(function (data) {
          let dtime = new Date(data.warning_time)
          if(time1 !== null && time2 !== null) {
            if(dtime < time1 || dtime > time2) {
              return false
            }
          }
          if(self.filterOvercome === 0 || self.filterOvercome === 1) {
            if(data.overcome !== self.filterOvercome) {
              return false
            }
          }
          return true
        })
        this.total = this.tableData.length
        this.handleCurrentChange(1)
      },
      async solveClick(row, data) {
        console.log(row, data)
        let rdata = {
          id: row.id,
          overcome: data
        }
        console.log('rdata', rdata)
        let res = await this.requestSolveWarning(rdata)
        if(res.code === 200) {
          this.$message({message: '预警处理成功', type: 'success'})
          this.fetchData()
        }
      },
      pickDate() {
        return {
          disabledDate(time) {
            if(time.getTime() < stime || time.getTime() > etime){
              return true
            }
          }
        }
      },
      async requestWarning(rdata) {
        let res = await searchWarning(rdata)
        console.log('searchWarning', res)
        return res.data
      },
      async requestSolveWarning(rdata) {
        let res = await alterWarning(rdata)
        console.log('alterWarning', res)
        return res
      },
    }
  }
</script>
<style>
  .recode-export-row, .record-search-row-bottom, .record-search-row-top, .record-tool-row, .record-table-row, .record-pagination-row {
    padding: 1.25rem;
    padding-bottom: 0rem;
  }

</style>
