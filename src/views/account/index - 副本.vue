<template>
  <div class="account">
    <el-row class="account-search-row" :gutter="20">
      <el-col :span="12">
        <el-tooltip placement="top">
          <div slot="content">输入账号/姓名</div>
          <el-input v-model="search_text" placeholder="请输入用户名/姓名/手机号"></el-input>
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
      :data="account_tableData.filter(data => !search_text || data.account.includes(search_text) || data.name.includes(search_text)).slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
              <div v-if="item.key === 'category'">{{ categoryJSON.mapping[scope.row.category] }}</div>
              <el-button v-if="item.key === 'operate'" @click="editRow = scope.row ;editDialogVisible = true" type="" size="small">编辑</el-button>
              <el-popconfirm
                confirm-button-text='确认'
                cancel-button-text='取消'
                title="确定删除选择本用户？"
                @confirm="deleteSingleAccount(scope.row)"
              >
              <el-button v-if="item.key === 'operate'" type="danger" size="small" slot="reference">删除</el-button>
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
      :total="account_tableData.length">
      </el-pagination>
    </el-row>

    <el-drawer title="新增用户" :visible.sync="createDialogVisible" v-if="createDialogVisible" :destroy-on-close="true">
      <CreateAccount @watchChild="closeDialog"></CreateAccount>
    </el-drawer>
    <el-drawer title="编辑用户" :visible.sync="editDialogVisible" :destroy-on-close="true">
      <EditAccount :row-msg="editRow"></EditAccount>
    </el-drawer>

  </div>
</template>

<script>
  import CreateAccount from './components/createAccount'
  import EditAccount from './components/editAccount'
  import categoryJSON from '/public/static/map/category.json'
  import { dataAccountRequest } from '@/api/account'

  export default{
    name: "AccountData",
    components: {
      CreateAccount,
      EditAccount,
    },
    data() {
      return {
        categoryJSON,
        search_text: "",
        pageSize: 12,
        currentPage: 1,
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
        account_tableData: [
          {
            user_id: 'ADMIN',
            nname: '超管',
            password: '123456',
            phone: '15021118366',
            category: '0'
          }
        ],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(p) {
        dataAccountRequest(p).then(response => {
          this.account_tableData = response.data;
        })
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
