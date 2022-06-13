<template>
  <div class="account">
    <el-row class="account-search-row" :gutter="20">
      <el-input v-model="search_text" placeholder="请输入用户名/手机号" style="width: 18.75rem; margin-right: 1.25rem;" :size="size"></el-input>
      <el-button type="primary" @click="searchClick" :size="size">查询</el-button>
      <el-button type="success" size="small" @click="createDialogVisible = true" icon="el-icon-plus" style="float: right;" :size="size">新增用户</el-button>
      <el-button type="warning" size="small" @click="createBatchDialogVisible = true" icon="el-icon-plus" style="float: right;" :size="size" plain>批量新增</el-button>
      <el-button type="primary" plain size="small" @click="search_text = 'DV_TEST1'" style="float: right;" :size="size">烤房</el-button>
      <el-button type="primary" plain size="small" @click="search_text = 'GR_TEST1'" style="float: right;" :size="size">烤房群</el-button>
      <el-button type="primary" plain size="small" @click="search_text = 'ST_TEST1'" style="float: right;" :size="size">烟站</el-button>
      <el-button type="primary" plain size="small" @click="search_text = 'CO_TEST1'" style="float: right;" :size="size">县</el-button>
      <el-button type="primary" plain size="small" @click="search_text = 'CI_TEST1'" style="float: right;" :size="size">州</el-button>
      <el-button type="primary" plain size="small" @click="search_text = 'ADMIN'" style="float: right;" :size="size">省</el-button>
    </el-row>

    <el-row class="account-table-row">
      <el-table
      :data="account_tableData"
      @selection-change="handleSelectionChange">
        <template v-for="(item, index) in account_columns">
          <el-table-column
          :prop="item.key"
          :label="item.label"
          :key="index"
          :width="item.width"
          :fixed="item.key === 'operate' ? 'right' : ''"
          :sortable="item.key === 'id' || item.key === 'createDate' || item.key === 'lastDate'">
            <template v-if="item.key === 'category' || item.key === 'operate'" v-slot="scope">
              <div v-if="item.key === 'category'">{{ categoryJSON.label_mapping[scope.row.category] }}</div>
              <div v-if="item.key === 'operate' && scope.row.category > userData.category && canAlterID.includes(scope.row.permission_range)">
                <el-button @click="editRow = scope.row ;editDialogVisible = true" size="mini" style="margin-right: 0.3125rem;">编辑</el-button>
                <el-popconfirm
                  confirm-button-text='确认'
                  cancel-button-text='取消'
                  title="确定删除选择本用户？"
                  @confirm="deleteSingleAccount(scope.row)">
                <el-button type="danger" size="mini" slot="reference">删除</el-button>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row>
<!--    <el-row class="account_pagination_row" type="flex" justify="center">
      <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </el-row> -->

    <el-dialog title="新增用户" :visible.sync="createDialogVisible" v-if="createDialogVisible" :destroy-on-close="true" width="30%">
      <AddUser @watchChild="closeDialog"></AddUser>
    </el-dialog>
    <el-dialog title="批量新增" :visible.sync="createBatchDialogVisible" v-if="createBatchDialogVisible" :destroy-on-close="true" width="50%">
      <AddUserBatch @watchChild="closeDialog"></AddUserBatch>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" v-if="editDialogVisible" :destroy-on-close="true" width="30%">
      <EditUser @watchChild="closeDialog" :row-msg="editRow"></EditUser>
    </el-dialog>

  </div>
</template>

<script>
  import AddUser from './components/AddUser'
  import EditUser from './components/EditUser'
  import AddUserBatch from './components/AddUserBatch'
  import categoryJSON from '/public/static/map/category.json'
  import postcodeOption from '/public/static/map/postcodeOption.json'

  import { getUsersData } from '@/api/user'
  import { searchStation } from '@/api/station'
  import { searchGroup } from '@/api/group'
  import { searchDevice } from '@/api/device'

  import { getRequestDataOnPermission } from '/src/utils/auth.js'

  export default{
    name: "User",
    components: {
      AddUser,
      EditUser,
      AddUserBatch
    },
    data() {
      return {
        postcodeOption,
        categoryJSON,
        size: 'small',
        search_text: "",
        pageSize: 12,
        currentPage: 1,
        total: 0,
        createDialogVisible: false,
        createBatchDialogVisible: false,
        editDialogVisible: false,
        deleteDialogVisible: false,
        editRow: {},
        deleteRow: {},
        canAlterID: [],
        userData: {},
        accountSelection: [],
        account_columns: [
          {key: 'user_id', label: '用户名', width: ""},
          {key: 'nname', label: '姓名', width: ""},
          {key: 'phone', label: '手机', width: ""},
          {key: 'category', label: '权限类型', width: ""},
          {key: 'permission_range', label: '单位编号', width: ""},
          {key: 'operate', label: '操作', width: "200"},
        ],
        account_tableData: [],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData(p) {
        let self = this
        this.userData = getRequestDataOnPermission()
        console.log(this.userData)
        switch(this.userData.category){
          case '0':
            self.postcodeOption.forEach(province => {
              if(province.id === self.userData.province){
                console.log(123)
                province.children.forEach(city => {
                  self.canAlterID.push(city.id)
                  city.children.forEach(county => {
                    self.canAlterID.push(county.id)
                  })
                })
              }
            })
            break
          case '1':
           self.postcodeOption.forEach(province => {
             province.children.forEach(city => {
               if(city.id === self.userData.city){
                 city.children.forEach(county => {
                   self.canAlterID.push(county.id)
                 })
               }
             })
           })
           break
        }
        if(this.userData.category <= '2') {
          let res = await this.requestStation(this.userData)
          res.data.forEach(station => {
            this.canAlterID.push(station.station_id)
          })
          // this.canAlterID = this.canAlterID.concat(res.data)
        }
        if(this.userData.category <= '3') {
          let res = await this.requestGroup(this.userData)
          res.data.forEach(group => {
            this.canAlterID.push(group.group_id)
          })
          // this.canAlterID = this.canAlterID.concat(res.data)
        }
        if(this.userData.category <= '4') {
          let res = await this.requestDevice(this.userData)
          res.data.forEach(device => {
            this.canAlterID.push(device.device_id)
          })
          // this.canAlterID = this.canAlterID.concat(res.data)
        }
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      handleSelectionChange(val){
        this.accountSelection = val;
        console.log(val);
      },
      closeDialog(data) {
        this.createDialogVisible = false
        this.createBatchDialogVisible = false
        this.editDialogVisible = false
        this.deleteDialogVisible = false
      },
      alterAble(row){
        let user = JSON.parse(localStorage.getItem('user'))
        return user.category >= row.category && user.user_id !== row.user_id
      },
      searchClick() {
        let rdata = {}
        let flag = true
        if(this.search_text !== ''){
          rdata.query_info = this.search_text
          flag = false
        }
        if(flag){
          this.fetchData()
        }
        else{
          this.requestUsersData(rdata)
        }
      },
      requestUsersData(rdata) {
        getUsersData(rdata).then(res => {
          console.log('getUsersData', res)
          if(res.code === 200){
            this.account_tableData = [res.data]
            this.total = this.account_tableData.length
            this.currentPage = 1
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      async requestStation(rdata) {
        let res = await searchStation(rdata)
        console.log('searchStation', res)
        return res
      },
      async requestGroup(rdata) {
        let res = await searchGroup(rdata)
        console.log('searchGroup', res)
        return res
      },
      async requestDevice(rdata) {
        let res = await searchDevice(rdata)
        console.log('searchDevice', res)
        return res
      }
    }
  }
</script>

<style>
  .account-search-row, .account-tool-row, .account-table-row, .account_pagination_row {
    padding: 20px;
    padding-bottom: 10px;
  }
</style>
