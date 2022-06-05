<template>
  <div class="account">
    <el-row class="account-search-row" :gutter="20">
      <el-col :span="12">
        <el-tooltip placement="top">
          <div slot="content">输入账号/姓名</div>
          <el-input v-model="search_text" placeholder="请输入用户名/手机号"></el-input>
        </el-tooltip>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="searchClick">查询</el-button>
      </el-col>
    </el-row>

    <el-row class="account-tool-row">
      <el-button type="success" size="small" @click="createDialogVisible = true" icon="el-icon-plus">新增用户</el-button>
      <!-- <el-button type="success" size="small" @click="enableAccounts()">批量启用</el-button>
      <el-button type="info" size="small" @click="unableAccounts()">批量禁用</el-button>
      <el-button type="danger" size="small" @click="deleteAccounts()">批量删除</el-button> -->
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
              <el-button v-if="item.key === 'operate'" @click="editRow = scope.row ;editDialogVisible = true" type="" size="small" :disabled="alterAble(scope.row)">编辑</el-button>
              <el-popconfirm
                confirm-button-text='确认'
                cancel-button-text='取消'
                title="确定删除选择本用户？"
                @confirm="deleteSingleAccount(scope.row)"
              >
              <el-button v-if="item.key === 'operate'" type="danger" size="small" slot="reference" :disabled="alterAble(scope.row)">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row>
    <el-row class="account_pagination_row" type="flex" justify="center">
      <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </el-row>

    <el-drawer title="新增用户" :visible.sync="createDialogVisible" v-if="createDialogVisible" :destroy-on-close="true">
      <AddUser @watchChild="closeDialog"></AddUser>
    </el-drawer>
    <el-drawer title="编辑用户" :visible.sync="editDialogVisible" :destroy-on-close="true">
      <EditUser :row-msg="editRow"></EditUser>
    </el-drawer>

  </div>
</template>

<script>
  import AddUser from './components/AddUser'
  import EditUser from './components/EditUser'
  import categoryJSON from '/public/static/map/category.json'
  import { getUsersData } from '@/api/user'

  export default{
    name: "User",
    components: {
      AddUser,
      EditUser,
    },
    data() {
      return {
        categoryJSON,
        search_text: "",
        pageSize: 12,
        currentPage: 1,
        total: 0,
        createDialogVisible: false,
        editDialogVisible: false,
        deleteDialogVisible: false,
        editRow: {},
        deleteRow: {},
        accountSelection: [],
        account_columns: [
          {key: 'user_id', label: '用户名', width: ""},
          {key: 'nname', label: '姓名', width: ""},
          {key: 'phone', label: '手机', width: ""},
          {key: 'category', label: '用户类型', width: ""},
          {key: 'operate', label: '操作', width: "200"},
        ],
        account_tableData: [],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(p) {
        let rdata = {}
        let user = JSON.parse(localStorage.getItem('user'))
        rdata.query_info = user.user_id
        this.requestUsersData(rdata)
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
