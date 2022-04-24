<template>
  <div class="user-device" v-loading="dataLoading">
    <el-row class="user-device-tool-row" :gutter="20">
      <el-col class="user-device-tool-row-item" :span="6">
        <LocationComp @watchLocation='setLocation'></LocationComp>
      </el-col>
      <el-col class="user-device-tool-row-item" :span="3">
        <el-input v-model="searchDeviceId" placeholder="输入设备ID"></el-input>
      </el-col>
      <el-col class="user-device-tool-row-item" :span="3">
        <el-input v-model="searchStationId" placeholder="输入烟站ID"></el-input>
      </el-col>
      <el-col class="user-device-tool-row-item" :span="3">
        <el-input v-model="searchDeviceName" placeholder="输入设备名"></el-input>
      </el-col>
      <el-col class="user-device-tool-row-item" :span="3">
        <el-input v-model="searchHead" placeholder="输入用户姓名"></el-input>
      </el-col>
      <el-col class="user-device-tool-row-item" :span="3">
        <el-input v-model="searchHeadPhone" placeholder="输入手机"></el-input>
      </el-col>
      <!-- <el-col class="user-device-tool-row-item" :span="7">
        <el-input v-model="searchDeviceName" placeholder="输入设备名称"></el-input>
      </el-col>
      <el-col class="user-device-tool-row-item" :span="7">
        <el-input v-model="searchDeviceId" placeholder="输入设备ID"></el-input>
      </el-col>
      <el-col class="user-device-tool-row-item" :span="7">
        <el-input v-model="searchUserId" placeholder="输入用户ID"></el-input>
      </el-col> -->
      <el-col class="user-device-tool-row-item" :span="3">
        <el-button style="width: 100%;" type="primary" @click="searchClick">搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="user-device-addbtn-row">
      <el-button type="success" icon="el-icon-plus" @click="addClick" size="mini">新增设备</el-button>
    </el-row>
    <el-row class="user-device-table-row">
      <el-table
      :data="device_tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <template v-for="(item, index) in columns">
          <el-table-column
          :prop="item.key"
          :label="item.label"
          :key="index"
          :width="item.width"
          :fixed="item.key === 'operate' ? 'right' : ''"
          :show-overflow-tooltip="true">
            <template v-if="item.key === 'operate' || item.key === 'location'" v-slot="scope">
              <div v-if="item.key === 'location'">{{ postcodeJSON[scope.row.location] }}</div>
              <el-button v-if="item.key === 'operate'" type="warning" size="mini" @click="editClick(scope.row)">修改</el-button>
              <el-popconfirm v-if="item.key === 'operate'" title="是否确定删除该设备" @confirm="deleteClick(scope.row)">
                <el-button v-if="item.key === 'operate'" type="danger" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row>
    <el-row class="user-device-pagination-row" type="flex" justify="center">
      <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </el-row>

    <el-dialog
    :title="修改设备信息"
    :visible.sync="bindCompVisible"
    :destroy-on-close='true'
    v-if="bindCompVisible">
      <EditDevice :row-msg="selectRow" @watchChild="parentReceive"></EditDevice>
    </el-dialog>

    <el-dialog
    :title="新增设备信息"
    :visible.sync="addCompVisible"
    :destroy-on-close='true'
    v-if="addCompVisible">
      <AddDevice @watchChild="parentReceive"></AddDevice>
    </el-dialog>

  </div>
</template>

<script>
  import EditDevice from './components/EditDevice'
  import AddDevice from './components/AddDevice'
  import LocationComp from '../../components/LocationComp'
  import { searchDevice, deleteDevice } from '@/api/device'
  import postcodeJSON from '../../../public/static/map/postcode.json'

  export default{
    name: 'UserDevice',
    components: {
      EditDevice,
      AddDevice,
      LocationComp
    },
    data() {
      return{
        postcodeJSON,
        allBtnDisable: true,
        dataLoading: false,
        searchLocation: '',
        searchParentLocation: '',
        searchHead: '',
        searchDeviceId: '',
        searchHeadPhone: '',
        searchDeviceName: '',
        searchStationId: '',
        selectRow: {},
        bindCompVisible: false,
        addCompVisible: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        columns: [
          { key: 'device_id', label: '设备ID', width: '' },
          { key: 'location', label: '区域', width: '' },
          { key: 'station_id', label: '所属烟站号', width: ''},
          { key: 'station_name', label: '所属烟站名', width: ''},
          { key: 'device_name', label: '设备名称', width: '' },
          { key: 'address', label: '设备地址', width: '' },
          { key: 'head', label: '用户姓名', width: '' },
          { key: 'head_phone', label: '手机', width: '' },
          { key: 'kind', label: '设备类型', width: '' },
          { key: 'operate', label: '操作', width: '200px' },
        ],
        device_tableData: [
          // {
          //   location: '650000',
          //   device_name: '上海烤房123',
          //   device_id: '102938487',
          //   device_addr: '上海市普陀区中山北路3663号华东师范大学理科大楼B903',
          //   phone: '10293847562',
          //   user_id: 'admin123',
          //   kind: '',
          // }
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
        }
        this.dataLoading = true
        this.search(rdata)
      },
      editClick(row) {
        console.log('row', row)
        this.selectRow = row
        this.bindCompVisible = true
      },
      addClick() {
        this.addCompVisible = true
      },
      searchClick() {
        let rdata = {}
        let flag = true
        if(this.searchDeviceId !== ''){
          rdata.device_id = this.searchDeviceId
          flag = false
        }
        if(this.searchHead !== ''){
          rdata.head = this.searchHead
          flag = false
        }
        if(this.searchHeadPhone !== ''){
          rdata.head_phone = this.searchHeadPhone
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
        if(this.searchDeviceName !== ''){
          rdata.device_name = this.searchDeviceName
          flag = false
        }
        if(this.searchStationId !== ''){
          rdata.station_id = this.searchStationId
          flag = false
        }
        if(flag){
          this.fetchData()
        }
        else{
          this.dataLoading = true
          this.search(rdata)
        }
      },
      deleteClick(row) {
        console.log(row)
        let rdata = {
          device_id: row.device_id
        }
        deleteDevice(rdata).then(res => {
          console.log('deleteDevice', res)
          if(res.code === 200){
            this.$message({ message: '删除成功', type: 'success'})
          }
        }).catch(err => {
            this.$message.error('删除失败')
        })
      },
      parentReceive(data) {
        this.addCompVisible = false
        this.bindCompVisible = false
        this.searchClick()
      },
      setLocation(data) {
        this.searchLocation = data.location
        this.searchParentLocation = data.parent_location
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      search(rdata) {
        this.allBtnDisable = Object.getOwnPropertyNames(rdata).length === 0 ? true : false
        searchDevice(rdata).then(res => {
          console.log('searchDevice', res)
          if(res.code === 200){
            this.device_tableData = res.data
            this.dataLoading = false
            this.total = this.device_tableData.length
            this.currentPage = 1
          }
        }).catch(err => {
          this.$message.error('查询失败')
        })
      }
    },
  }
</script>

<style>
  .user-device-tool-row, .user-device-table-row, .user-device-addbtn-row{
    padding: 20px;
    padding-bottom: 10px;
  }
</style>
