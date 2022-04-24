<template>
  <div class="record">
    <el-row class="record-search-row-top" :gutter="20">
      <el-col :span="12">
        <LocationComp @watchLocation="setLocation"></LocationComp>
      </el-col>
      <el-col :span="12" >
        <DateTimeComp @watchDataTime="setDateTime"></DateTimeComp>
      </el-col>
    </el-row>

    <el-row class="record-search-row-bottom" :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="searchIdText" clearable>
          <el-select v-model="selectIdType" slot="prepend" placeholder="请选择" style="width: 100px;">
            <template v-for="(item, index) in selectOptions">
              <el-option :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
            </template>
          </el-select>
        </el-input>
      </el-col>
      <el-col :span="7">
        <el-input v-model="searchScoreLowerBound" placeholder="请输入评分下界" clearable></el-input>
      </el-col>
      <el-col :span="7">
        <el-input v-model="searchScoreUpperBound" placeholder="请输入评分上界" clearable></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="searchClick" style="width: 100%;">查询</el-button>
      </el-col>
    </el-row>

    <el-row class="record-tool-row">
      <el-button type="success" size="mini" icon="el-icon-plus" @click="addClick">添加记录</el-button>
    </el-row>

    <el-row class="record-table-row">
      <el-table
      :data="recordData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%;">
        <el-table-column type="expand">
          <template v-slot="props" style="padding: 10px;">
            <el-row style="padding: 1.25rem">
              <el-descriptions title="详细信息" :column="2" border>
                <template v-for="(d_item, d_index) in recordColumns.slice(9)">
                  <el-descriptions-item :label="d_item.label">
                    <div v-if="!d_item.key.includes('location')">{{ props.row[d_item.key] }}</div>
                    <div v-if="d_item.key.includes('location')">{{ postcodeJSON[props.row[d_item.key]] }}</div>
                  </el-descriptions-item>
                </template>
              </el-descriptions>
            </el-row>
          </template>
        </el-table-column>
        <template v-for="(item, index) in recordColumns.slice(0, 9)">
          <el-table-column
          :prop="item.key"
          :label="item.label"
          :fixed="item.key === 'operate' ? 'right' : ''"
          :key="index"
          :width="item.width">
            <template v-if="item.key === 'operate'" v-slot="scope">
              <el-button type="warning" size="mini" @click="editClick(scope.row)">修改</el-button>
              <el-popconfirm v-if="item.key === 'operate'" title="是否确定删除该记录" @confirm="deleteClick(scope.row)">
                <el-button v-if="item.key === 'operate'" type="danger" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
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

    <el-dialog
    :title="添加记录"
    :visible.sync="addCompVisible"
    v-if="addCompVisible"
    destroy-on-close>
      <AddRecordComp @watchChild="parentReceive"></AddRecordComp>
    </el-dialog>

    <el-dialog
    :title="修改记录"
    :visible.sync="editCompVisible"
    v-if="editCompVisible"
    destroy-on-close>
      <EditRecordComp @watchChild="parentReceive" :row-msg="editRow"></EditRecordComp>
    </el-dialog>

  </div>
</template>

<script>
  import LocationComp from '../../components/LocationComp'
  import DateTimeComp from '../../components/DateTimeComp'
  import AddRecordComp from './components/AddRecord'
  import EditRecordComp from './components/EditRecord'

  import postcodeJSON from '../../../public/static/map/postcode.json'

  import { getBakeRecord, deleteBakeRecord } from '@/api/bake'

  export default{
    name: 'Record',
    components: {
      LocationComp,
      DateTimeComp,
      AddRecordComp,
      EditRecordComp,
    },
    data() {
      return {
        postcodeJSON,
        searchIdText: '',
        searchScoreLowerBound: '',
        searchScoreUpperBound: '',
        location: '',
        parent_location: '',
        start_time: '',
        end_time: '',
        total: 0,
        pageSize: 10,
        currentPage: 1,
        addCompVisible: false,
        editCompVisible: false,
        editRow: {},
        selectIdType: '',
        selectOptions: [
          { label: '烟农ID', value: '1', disabled: false },
          { label: '技师ID', value: '2', disabled: false },
          { label: '设备ID', value: '3', disabled: false },
          { label: '烟站ID', value: '4', disabled: false },
        ],
        recordData: [],
        recordColumns: [
          { key: 'id', label: 'ID', width: '' },
          { key: 'station_id', label: '烟站ID', width: '' },
          { key: 'device_id', label: '设备ID', width: '' },
          { key: 'technician_id', label: '技师ID', width: '' },
          { key: 'farmer_id', label: '烟农ID', width: '' },
          { key: 'baking_weight_before', label: '烤前重量', width: '' },
          { key: 'baking_weight_after', label: '烤后重量', width: '' },
          { key: 'score', label: '评分', width: '' },
          { key: 'operate', label: '操作', width: '150' },
          { key: 'start_time', label: '开始时间', width: '' },
          { key: 'end_time', label: '结束时间', width: '' },
          { key: 'location', label: '县', width: '' },
          { key: 'parent_location', label: '市', width: '' },
          { key: 'phone', label: '手机', width: '' },
          { key: 'nname', label: '姓名', width: '' },
          { key: 'tobacco_info', label: '烤烟信息', width: '' },
        ]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let rdata = {}
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
            break
          case '4':
            rdata.farmer_id = user.user_id
            this.selectOptions[0].disabled = true
            this.selectOptions[1].disabled = true
            break
          case '5':
            rdata.technician_id = user.user_id
            this.selectOptions[0].disabled = true
            this.selectOptions[1].disabled = true
            break
        }
        this.requestBakeRecord(rdata)
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      setLocation(data) {
        this.location = data.location
        this.parent_location = data.parent_location
      },
      setDateTime(data) {
        this.start_time = data.start_time
        this.end_time = data.end_time
      },
      searchClick() {
        let rdata = {}
        let flag = true
        if(this.searchIdText !== ''){
          switch(this.selectIdType){
            case '1':
             rdata.farmer_id = this.searchIdText
             break
            case '2':
             rdata.technician_id = this.searchIdText
             break
            case '3':
             rdata.device_id = this.searchIdText
             break
            case '4':
             rdata.station_id = this.searchIdText
             break
          }
          flag = false
        }
        if(this.searchScoreLowerBound !== ''){
          rdata.score_lower_bound = this.searchScoreLowerBound
          flag = false
        }
        if(this.searchScoreUpperBound !== ''){
          rdata.score_upper_bound = this.searchScoreUpperBound
          flag = false
        }
        if(this.location !== ''){
          rdata.location = this.location
          flag = false
        }
        if(this.parent_location !== ''){
          rdata.parent_location = this.parent_location
          flag = false
        }
        if(this.start_time !== ''){
          rdata.start_time = this.start_time
          flag = false
        }
        if(this.end_time !== ''){
          rdata.end_time = this.end_time
          flag = false
        }
        if(flag){
          this.fetchData()
        }
        else{
          this.requestBakeRecord(rdata)
        }
      },
      parentReceive(data) {
        this.addCompVisible = false
        this.editCompVisible = false
        this.searchClick()
      },
      addClick(){
        this.addCompVisible = true
      },
      editClick(row){
        this.editRow = row
        this.editCompVisible = true
      },
      deleteClick(row){
        let rdata = { id: row.id }
        deleteBakeRecord(rdata).then(res => {
          console.log('deleteBakeRecord', res)
          if(res.code === 200){
            this.$message({message: '删除成功', type: 'success'})
            this.searchClick()
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      requestBakeRecord(rdata) {
        getBakeRecord(rdata).then(res => {
          console.log('getBakeRecord', res)
          if(res.code === 200){
            this.recordData = res.data
            this.total = this.recordData.length
            this.currentPage = 1
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },

  }

</script>

<style>
  .record-search-row-bottom, .record-search-row-top, .record-tool-row, .record-table-row, .record-pagination-row {
    padding: 1.25rem;
    padding-bottom: 0rem;
  }
</style>
