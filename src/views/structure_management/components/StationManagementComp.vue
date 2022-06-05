<template>
  <div class="station-management">
    <el-row class="station-management-body">
      <el-row class="station-management-filter-row">
        <span class="station-management-filter-label">筛选:</span>
        <el-input v-model="filterText" class="station-management-filter-input" :size="size" placeholder="请输入烟站编号/烟站名称"></el-input>
        <el-button class="station-management-add-button" type="success" :size="size" @click="addVisible = true">新增烟站</el-button>
      </el-row>
      <el-row class="station-management-table-row">
        <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          stripe>
          <template v-for="(item, index) in columns">
            <el-table-column
              :prop="item.key"
              :label="item.label"
              :key="index"
              :width="item.width"
              :fixed="item.key === 'operate' ? 'right' : ''"
              :size="size"
              show-overflow-tooltip>
              <template v-if="item.key === 'operate' || item.key === 'location' || item.key === 'parent_location'" v-slot="scope">
                <div v-if="item.key === 'location'">{{ postcodeJSON[scope.row.location] }}</div>
                <div v-if="item.key === 'parent_location'">{{ postcodeJSON[scope.row.parent_location] }}</div>
                <el-button v-if="item.key === 'operate'" type="warning" size="mini" @click="editForm = scope.row; editVisible = true" style="margin-right: 0.625rem;">修改</el-button>
                <el-popconfirm v-if="item.key === 'operate'" title="是否确定删除该烟站" @confirm="deleteStationClick(scope.row)">
                  <el-button v-if="item.key === 'operate'" type="danger" size="mini" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-row>

      <el-row class="station-management-pagination-row" type="flex" justify="center">
        <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </el-row>

    </el-row>

    <el-dialog
      title="新增烟站"
      :visible.sync="addVisible"
      v-if="addVisible"
      width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabel">
            <el-descriptions-item :label="item.label">
              <el-form-item :prop="item.key">
                <el-input v-model="addForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addStationClick('addForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改烟站"
      :visible.sync="editVisible"
      v-if="editVisible"
      width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabel">
            <el-descriptions-item :label="item.label">
              <el-form-item :prop="item.key">
                <el-input v-model="editForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editStationClick('editForm')">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  import { searchStation, addStation, alterStation, deleteStation } from '@/api/station'
  import postcodeJSON from '/public/static/map/postcode.json'
  import postcodeOption from '/public/static/map/postcodeOption.json'

  export default{
    name: 'StationManagementComp',
    components: {
    },
    props: ['locationMsg'],
    data() {
      return {
        postcodeJSON,
        postcodeOption,
        size: 'small',
        pageSize: 12,
        currentPage: 1,
        total: 0,
        addVisible: false,
        editVisible: false,
        filterText: '',
        stationData: [],
        tableData: [],
        addForm: {
          station_id: '',
          station_name: '',
          address: '',
          parent_location: '',
          location: ''
        },
        editForm: {
          station_id: '',
          station_name: '',
          address: '',
          parent_location: '',
          location: ''
        },
        columns: [
          { key: 'station_id', label: '烟站ID', width: '' },
          { key: 'station_name', label: '烟站名', width: '' },
          { key: 'parent_location', label: '市', width: '' },
          { key: 'location', label: '县', width: '' },
          { key: 'address', label: '地址', width: '' },
          { key: 'operate', label: '操作', width: '150' },
        ],
        descLabel: [
          { key: 'station_id', label: '烟站编号' },
          { key: 'station_name', label: '烟站名称' },
          { key: 'address', label: '烟站地址' }
        ],
        rules: {
          station_id : [
            {required: true, message: '请输入烟站编号', trigger: 'blur'},
          ],
          station_name : [
            {required: true, message: '请输入烟站名称', trigger: 'blur'},
          ],
          address : [
            {required: true, message: '请输入烟站地址', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      filterText(val) {
        this.filterTable()
      }
    },
    methods: {
      async fetchData() {
        let rdata = {
          location: this.locationMsg,
        }
        this.stationData = await this.requestStation(rdata)
        this.tableData = [].concat(this.stationData)
        this.total = this.tableData.length
        // 找省和州
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      filterTable(){
        this.tableData = this.stationData.filter(data => data.station_id.includes(this.filterText) || data.station_name.includes(this.filterText))
        this.total = this.tableData.length
        this.currentPage = 1
      },
      async addStationClick(formName) {
        let validFlag = false
        this.$refs[formName].validate((valid) => {
          if(valid) {
            validFlag = true
          }
          else {
            validFlag = false
            return false
          }
        })
        if(validFlag) {
          this.addForm.location = this.locationMsg
          this.postcodeOption.forEach(province => {
            province.children.forEach(city => {
              city.children.forEach(county => {
                if(county.id === this.locationMsg){
                  this.addForm.parent_location = city.id
                  return
                }
              })
              if(this.addForm.parent_location !== ''){
                return
              }
            })
            if(this.addForm.parent_location !== ''){
              return
            }
          })
          let rdata = this.addForm
          console.log('rdata', rdata)
          let res = await this.requestAddStation(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '新增烟站成功'})
            this.addVisible = false
            this.$refs[formName].resetFields()
            this.fetchData()
          }
        }
      },
      async editStationClick(formName) {
        let validFlag = false
        this.$refs[formName].validate((valid) => {
          if(valid) {
            validFlag = true
          }
          else {
            validFlag = false
            return false
          }
        })
        if(validFlag) {
          let rdata = this.editForm
          console.log(rdata)
          let res = await this.requestAlterStation(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '修改烟站成功'})
            this.editVisible = false
            this.fetchData()
          }
        }
      },
      async deleteStationClick(row) {
        let rdata = row
        let res = await this.requestDeleteStation(rdata)
        if(res.code === 200) {
          this.$message({type: 'success', message: '删除烟站成功'})
          this.editVisible = false
          this.fetchData()
        }
      },
      async requestStation(rdata) {
        let res = await searchStation(rdata)
        console.log('searchStation', res)
        return res.data
      },
      async requestAddStation(rdata) {
        let res = await addStation(rdata)
        console.log('addStation', res)
        return res
      },
      async requestAlterStation(rdata) {
        let res = await alterStation(rdata)
        console.log('alterStation', res)
        return res
      },
      async requestDeleteStation(rdata) {
        let res = await deleteStation(rdata)
        console.log('deleteStation', res)
        return res
      },
    },
  }
</script>

<style>
  .station-management, .station-management-body{
    height: 100%;
  }
  .station-management{
    padding-top: 0.625rem;
    padding-right: 0.625rem;
  }
  .station-management-filter-label{
    padding-right: 1.25rem;
  }
  .station-management-filter-input{
    width: 18.75rem;
    padding-right: 1.25rem;
  }
  .station-management-add-button{
    float: right;
    margin-right: 0.625rem;
  }
  .station-management-pagination-row{
    padding-top: 0.625rem;
  }
</style>
