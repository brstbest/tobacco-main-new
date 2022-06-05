<template>
  <div class="fault-maintenance-record-comp">
    <el-row class="fault-maintenance-record-tool">
      <el-button type="success" :size="size" @click="addVisible = true">新增故障记录</el-button>
    </el-row>
    <el-row class="fault-maintenance-record-table">
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%"
        :size="size"
        stripe>
        <template v-for="(item, index) in tableColumns">
          <el-table-column
            :prop="item.key"
            :label="item.label">
            <template v-if="item.key === 'operate'" v-slot="scope">
              <el-button type="warning" size="mini" style="margin-right: 0.3125rem;" @click="editForm = scope.row; editVisible = true">修改</el-button>
              <el-popconfirm title="是否确定删除该记录" @confirm="deleteMalfunctionClick(scope.row)">
                <el-button type="danger" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row>
    <el-row class="fault-maintenance-record-pagination" type="flex" justify="center">
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :size="size">
      </el-pagination>
    </el-row>

    <el-dialog
      title="新增故障记录"
      :visible.sync="addVisible"
      v-if="addVisible"
      append-to-body
      width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabels">
            <el-descriptions-item :label="item.label">
              <el-form-item :prop="item.key">
                <el-select v-if="item.key === 'troubleshooting'" v-model="addForm[item.key]" placeholder="请选择故障排除方式" :size="size" style="width: 100%;">
                  <el-option key="维修" label="维修" value="维修"></el-option>
                  <el-option key="更换" label="更换" value="更换"></el-option>
                </el-select>
                <el-select v-else-if="item.key === 'repair_merchant'" v-model="addForm[item.key]" placeholder="请选择维修/更换方" :size="size" style="width: 100%;">
                  <el-option key="自行" label="自行" value="自行"></el-option>
                  <el-option key="合作社" label="合作社" value="合作社"></el-option>
                  <el-option key="供应商" label="供应商" value="供应商"></el-option>
                </el-select>
                <el-select v-else-if="item.key === 'maintain_after_baking'" v-model="addForm[item.key]" placeholder="请选择" :size="size" style="width: 100%;">
                  <el-option key="已保养维护" label="已保养维护" value="已保养维护"></el-option>
                  <el-option key="未保养维护" label="未保养维护" value="未保养维护"></el-option>
                </el-select>
                <el-select v-else-if="item.key === 'supervision'" v-model="addForm[item.key]" placeholder="请选择" :size="size" style="width: 100%;">
                  <el-option key="已监督" label="已监督" value="已监督"></el-option>
                  <el-option key="未监督" label="未监督" value="未监督"></el-option>
                </el-select>
                <el-input v-else v-model="addForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addMalfunctionClick('addForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改故障记录"
      :visible.sync="editVisible"
      v-if="editVisible"
      append-to-body
      width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabels">
            <el-descriptions-item :label="item.label">
              <el-form-item :prop="item.key">
                <el-select v-if="item.key === 'troubleshooting'" v-model="editForm[item.key]" placeholder="请选择故障排除方式" :size="size" style="width: 100%;">
                  <el-option key="维修" label="维修" value="维修"></el-option>
                  <el-option key="更换" label="更换" value="更换"></el-option>
                </el-select>
                <el-select v-else-if="item.key === 'repair_merchant'" v-model="editForm[item.key]" placeholder="请选择维修/更换方" :size="size" style="width: 100%;">
                  <el-option key="自行" label="自行" value="自行"></el-option>
                  <el-option key="合作社" label="合作社" value="合作社"></el-option>
                  <el-option key="供应商" label="供应商" value="供应商"></el-option>
                </el-select>
                <el-select v-else-if="item.key === 'maintain_after_baking'" v-model="editForm[item.key]" placeholder="请选择" :size="size" style="width: 100%;">
                  <el-option key="已保养维护" label="已保养维护" value="已保养维护"></el-option>
                  <el-option key="未保养维护" label="未保养维护" value="未保养维护"></el-option>
                </el-select>
                <el-select v-else-if="item.key === 'supervision'" v-model="editForm[item.key]" placeholder="请选择" :size="size" style="width: 100%;">
                  <el-option key="已监督" label="已监督" value="已监督"></el-option>
                  <el-option key="未监督" label="未监督" value="未监督"></el-option>
                </el-select>
                <el-input v-else v-model="editForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editMalfunctionClick('editForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { timeFormat } from '/src/utils/index.js'

  import { searchMalfunction, addMalfunction, alterMalfunction, deleteMalfunction } from '@/api/malfunction'

  export default{
    name: 'FaultMaintenanceRecordComp',
    components: {},
    data() {
      return {
        size: 'small',
        pageSize: 5,
        currentPage: 1,
        total: 0,
        addVisible: false,
        editVisible: false,
        deviceData: {},
        tableColumns: [
          { key: 'trouble_unit', label: '故障部件' },
          { key: 'troubleshooting', label: '故障排除方式' },
          { key: 'repair_price', label: '维修/更换价格（元）' },
          { key: 'repair_merchant', label: '维修/更换方' },
          { key: 'maintain_after_baking', label: '烤后保养维护' },
          { key: 'maintainer', label: '保养维护人员' },
          { key: 'supervision', label: '烤房使用管护监督' },
          { key: 'monitors', label: '监督人员' },
          { key: 'operate', label: '操作' },
        ],
        tableData: [],
        addForm: {
          device_id: '',
          trouble_unit: '',
          troubleshooting: '',
          repair_price: '',
          repair_merchant: '',
          maintain_after_baking: '',
          maintainer: '',
          supervision: '',
          monitors: '',
          create_time: ''
        },
        editForm: {
          device_id: '',
          trouble_unit: '',
          troubleshooting: '',
          repair_price: '',
          repair_merchant: '',
          maintain_after_baking: '',
          maintainer: '',
          supervision: '',
          monitors: '',
          create_time: ''
        },
        descLabels: [
          { key: 'trouble_unit', label: '故障部件' },
          { key: 'troubleshooting', label: '故障排除方式' },
          { key: 'repair_price', label: '维修/更换价格（元）' },
          { key: 'repair_merchant', label: '维修/更换方' },
          { key: 'maintain_after_baking', label: '烤后保养维护' },
          { key: 'maintainer', label: '保养维护人员' },
          { key: 'supervision', label: '烤房使用管护监督' },
          { key: 'monitors', label: '监督人员' },
        ],
        rules: {
          trouble_unit : [
            {required: true, message: '请输入故障部件', trigger: 'blur'},
          ],
          troubleshooting : [
            {required: true, message: '请选择故障排除方式', trigger: 'blur'},
          ],
          repair_price : [
            {required: true, message: '请输入维修/更换价格', trigger: 'blur'},
            {type: 'number', min: 0, message: '请输入正确的价格', trigger: 'blur', transform: (value) => Number(value)},
          ],
          repair_merchant : [
            {required: true, message: '请选择维修/更换方', trigger: 'blur'},
          ],
          maintain_after_baking : [
            {required: true, message: '请选择是否有烤后保养维护', trigger: 'blur'},
          ],
          maintainer : [
            {required: true, message: '请输入保养维护人员', trigger: 'blur'},
          ],
          supervision : [
            {required: true, message: '请选择是否有烤房使用管护监督', trigger: 'blur'},
          ],
          monitors : [
            {required: true, message: '请输入监督人员', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        this.deviceData = JSON.parse(sessionStorage.getItem('device'))
        let rdata = {
          device_id: this.deviceData.device_id
        }
        this.tableData = await this.requestMalfunction(rdata)
        this.total = this.tableData.length
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      async addMalfunctionClick(formName) {
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
          this.addForm.create_time = timeFormat(new Date(), 0, 5)
          this.addForm.device_id = this.deviceData.device_id

          let rdata = Object.assign({}, this.addForm)
          console.log('rdata', rdata)
          let res = await this.requestAddMalfunction(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '新增故障记录成功'})
            this.addVisible = false
            this.fetchData()
          }
        }
      },
      async editMalfunctionClick(formName) {
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
          let res = await this.requestAlterMalfunction(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '修改记录成功'})
            this.editVisible = false
            this.fetchData()
          }
        }
      },
      async deleteMalfunctionClick(row) {
        let rdata = row
        let res = await this.requestDeleteMalfunction(rdata)
        if(res.code === 200) {
          this.$message({type: 'success', message: '修改记录成功'})
          this.fetchData()
        }
      },
      async requestMalfunction(rdata) {
        let res = await searchMalfunction(rdata)
        console.log('searchMalfunction', res)
        return res.data
      },
      async requestAddMalfunction(rdata) {
        let res = await addMalfunction(rdata)
        console.log('addMalfunction', res)
        return res
      },
      async requestAlterMalfunction(rdata) {
        let res = await alterMalfunction(rdata)
        console.log('alterMalfunction', res)
        return res
      },
      async requestDeleteMalfunction(rdata) {
        let res = await deleteMalfunction(rdata)
        console.log('deleteMalfunction', res)
        return res
      }
    }
  }
</script>

<style>
  .fault-maintenance-record-pagination{
    padding-top: 0.625rem;
  }
</style>
