<template>
  <div class="group-management">
    <el-row class="group-management-body">
      <el-row class="group-management-filter-row">
        <span class="group-management-filter-label">筛选:</span>
        <el-input v-model="filterText" class="group-management-filter-input" :size="size" placeholder="请输入烤房群编号/烤房群名称/所属烟站/负责人/联系方式"></el-input>
        <el-button class="group-management-add-button" type="success" :size="size" @click="addVisible = true">新增烤房群</el-button>
      </el-row>
      <el-row class="group-management-table-row">
        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe :size="size">
          <template v-for="(item, index) in columns">
            <el-table-column
              :prop="item.key"
              :label="item.label"
              :key="index"
              :width="item.width"
              :fixed="item.key === 'operate' ? 'right' : ''"
              show-overflow-tooltip>
              <template v-if="item.key === 'operate' || item.key === 'location' || item.key === 'parent_location'" v-slot="scope">
                <div v-if="item.key === 'location'">{{ postcodeJSON[scope.row.location] }}</div>
                <div v-if="item.key === 'parent_location'">{{ postcodeJSON[scope.row.parent_location] }}</div>
                <el-button v-if="item.key === 'operate'" type="warning" size="mini" @click="editForm = scope.row; editVisible = true" style="margin-right: 0.625rem;">修改</el-button>
                <el-popconfirm v-if="item.key === 'operate'" title="是否确定删除该烤房群" @confirm="deleteGroupClick(scope.row)">
                  <el-button v-if="item.key === 'operate'" type="danger" size="mini" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-row>

      <el-row class="group-management-pagination-row" type="flex" justify="center">
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
      title="新增烤房群"
      :visible.sync="addVisible"
      v-if="addVisible"
      width="50%">
      <el-form ref="addForm" :model="addForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabel">
            <el-descriptions-item :label="item.label" :span="item.span">
              <el-form-item :prop="item.key">
                  <el-input v-model="addForm[item.key]" :type="item.key === 'info' ? 'textarea' : ''" :placeholder="'请输入'+item.label" :size="size"></el-input>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addGroupClick('addForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改烤房群"
      :visible.sync="editVisible"
      v-if="editVisible"
      width="50%">
      <el-form ref="editForm" :model="editForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabel">
            <el-descriptions-item :label="item.label" :span="item.span">
              <el-form-item :prop="item.key">
                  <el-input v-model="editForm[item.key]" :type="item.key === 'info' ? 'textarea' : ''" :placeholder="'请输入'+item.label" :size="size"></el-input>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editGroupClick('editForm')">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  import { searchGroup, addGroup, alterGroup, deleteGroup } from '@/api/group'
  import postcodeJSON from '/public/static/map/postcode.json'
  import postcodeOption from '/public/static/map/postcodeOption.json'

  export default{
    name: 'GroupManagementComp',
    components: {
    },
    props: ['stationMsg'],
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
        groupData: [],
        tableData: [],
        addForm: {
          group_id: '',
          group_name: '',
          head: '',
          phone: '',
          address: '',
          info: '',
          station_id: ''
        },
        editForm: {
          group_id: '',
          group_name: '',
          head: '',
          phone: '',
          address: '',
          info: '',
          station_id: ''
        },
        columns: [
          { key: 'group_id', label: '烤房群编号', width: '' },
          { key: 'group_name', label: '烤房群名称', width: '' },
          { key: 'parent_location', label: '州', width: '' },
          { key: 'location', label: '县', width: '' },
          { key: 'station_id', label: '所属烟站', width: '' },
          { key: 'head', label: '负责人', width: '' },
          { key: 'phone', label: '联系方式', width: '' },
          { key: 'address', label: '烤房群地址', width: '' },
          { key: 'info', label: '备注', width: '' },
          { key: 'operate', label: '操作', width: '150' },
        ],
        descLabel: [
          { key: 'group_id', label: '烤房群编号', span: 1 },
          { key: 'group_name', label: '烤房群名称', span: 1 },
          { key: 'head', label: '负责人', span: 1 },
          { key: 'phone', label: '手机', span: 1 },
          { key: 'address', label: '烤房群地址', span: 2 },
          { key: 'info', label: '备注', span: 2 },
        ],
        rules: {
          group_id : [
            {required: true, message: '请输入烤房群编号', trigger: 'blur'},
          ],
          group_name : [
            {required: true, message: '请输入烤房群名称', trigger: 'blur'},
          ],
          head : [
            {required: true, message: '请输入负责人', trigger: 'blur'},
          ],
          phone : [
            {required: true, message: '请输入手机', trigger: 'blur'},
            {pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}
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
          station_id: this.stationMsg,
        }
        this.groupData = await this.requestGroup(rdata)
        this.tableData = [].concat(this.groupData)
        this.total = this.tableData.length
        // 找省和州
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      filterTable(){
        this.tableData = this.groupData.filter(data =>
        data.group_id.includes(this.filterText) ||
        data.group_name.includes(this.filterText) ||
        data.station_id.includes(this.filterText) ||
        data.head.includes(this.filterText) ||
        data.phone.includes(this.filterText))
        this.total = this.tableData.length
        this.currentPage = 1
      },
      async addGroupClick(formName) {
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
        if(validFlag){
          this.addForm.station_id = this.stationMsg

          let rdata = this.addForm
          console.log('rdata', rdata)
          let res = await this.requestAddGroup(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '新增烤房群成功'})
            this.addVisible = false
            this.fetchData()
          }
        }
      },
      async editGroupClick(formName) {
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
          let res = await this.requestAlterGroup(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '修改烤房群成功'})
            this.editVisible = false
            this.fetchData()
          }
        }
      },
      async deleteGroupClick(row) {
        let rdata = row
        let res = await this.requestDeleteGroup(rdata)
        if(res.code === 200) {
          this.$message({type: 'success', message: '删除烤房群成功'})
          this.editVisible = false
          this.fetchData()
        }
      },
      async requestGroup(rdata) {
        let res = await searchGroup(rdata)
        console.log('searchGroup', res)
        return res.data
      },
      async requestAddGroup(rdata) {
        let res = await addGroup(rdata)
        console.log('addGroup', res)
        return res
      },
      async requestAlterGroup(rdata) {
        let res = await alterGroup(rdata)
        console.log('alterGroup', res)
        return res
      },
      async requestDeleteGroup(rdata) {
        let res = await deleteGroup(rdata)
        console.log('deleteGroup', res)
        return res
      },
    },
  }
</script>

<style>
  .group-management, .group-management-body{
    height: 100%;
  }
  .group-management{
    padding-top: 0.625rem;
    padding-right: 0.625rem;
  }
  .group-management-filter-label{
    padding-right: 1.25rem;
  }
  .group-management-filter-input{
    width: 25rem;
    padding-right: 1.25rem;
  }
  .group-management-add-button{
    float: right;
    margin-right: 0.625rem;
  }
  .group-management-pagination-row{
    padding-top: 0.625rem;
  }
</style>
