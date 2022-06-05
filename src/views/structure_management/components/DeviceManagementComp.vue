<template>
  <div class="device-management">
    <el-row class="device-management-body">
      <el-row class="device-management-filter-row">
        <span class="device-management-filter-label">筛选:</span>
        <el-input v-model="filterText" class="device-management-filter-input" :size="size" placeholder="请输入烤房编号/烤房名称/负责人/联系方式"></el-input>
        <el-button class="device-management-add-button" type="success" :size="size" @click="addVisible = true">新增烤房</el-button>
      </el-row>
      <el-row class="device-management-table-row">
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
                <el-popconfirm v-if="item.key === 'operate'" title="是否确定删除该烤房" @confirm="deleteDeviceClick(scope.row)">
                  <el-button v-if="item.key === 'operate'" type="danger" size="mini" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-row>

      <el-row class="device-management-pagination-row" type="flex" justify="center">
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
      title="新增烤房"
      :visible.sync="addVisible"
      v-if="addVisible"
      width="50%"
      class="device-management-form">
      <el-form ref="addForm" :model="addForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabels">
            <el-descriptions-item :label="item.label" :span="item.span">
              <el-form-item :prop="item.key">
                <div>
                  <el-select v-if="item.key === 'kind'" v-model="addForm[item.key]" placeholder="请选择烤房类型" :size="size" style="width: 100%;">
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'airflow_mode'" v-model="addForm[item.key]" placeholder="请选择气流方式" :size="size" style="width: 100%;">
                    <el-option key="上升式" label="上升式" value="上升式"></el-option>
                    <el-option key="下降式" label="下降式" value="下降式"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'structural_form'" v-model="addForm[item.key]" placeholder="请选择结构形式" :size="size" style="width: 100%;">
                    <el-option key="固定式" label="固定式" value="固定式"></el-option>
                    <el-option key="移动式" label="移动式" value="移动式"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'fuel_type'" v-model="addForm[item.key]" placeholder="请选择结构形式" :size="size" style="width: 100%;">
                    <el-option key="燃煤" label="燃煤" value="燃煤"></el-option>
                    <el-option key="生物质颗粒" label="生物质颗粒" value="生物质颗粒"></el-option>
                    <el-option key="电能" label="电能" value="电能"></el-option>
                    <el-option key="空气能热泵" label="空气能热泵" value="空气能热泵"></el-option>
                  </el-select>
                  <el-input v-else v-model="addForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
                </div>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addDeviceClick('addForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改烤房"
      :visible.sync="editVisible"
      v-if="editVisible"
      width="50%"
      class="device-management-form">
      <el-form ref="editForm" :model="editForm" :rules="rules" :size="size">
        <el-descriptions :column="2" :size="size" border>
          <template v-for="(item, index) in descLabels">
            <el-descriptions-item :label="item.label" :span="item.span">
              <el-form-item :prop="item.key">
                <div>
                  <el-select v-if="item.key === 'kind'" v-model="editForm[item.key]" placeholder="请选择烤房类型" :size="size" style="width: 100%;">
                    <el-option key="1" label="1" value="1"></el-option>
                    <el-option key="2" label="2" value="2"></el-option>
                    <el-option key="3" label="3" value="3"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'airflow_mode'" v-model="editForm[item.key]" placeholder="请选择气流方式" :size="size" style="width: 100%;">
                    <el-option key="上升式" label="上升式" value="上升式"></el-option>
                    <el-option key="下降式" label="下降式" value="下降式"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'structural_form'" v-model="editForm[item.key]" placeholder="请选择结构形式" :size="size" style="width: 100%;">
                    <el-option key="固定式" label="固定式" value="固定式"></el-option>
                    <el-option key="移动式" label="移动式" value="移动式"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'fuel_type'" v-model="editForm[item.key]" placeholder="请选择结构形式" :size="size" style="width: 100%;">
                    <el-option key="燃煤" label="燃煤" value="燃煤"></el-option>
                    <el-option key="生物质颗粒" label="生物质颗粒" value="生物质颗粒"></el-option>
                    <el-option key="电能" label="电能" value="电能"></el-option>
                    <el-option key="空气能热泵" label="空气能热泵" value="空气能热泵"></el-option>
                  </el-select>
                  <el-input v-else v-model="editForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
                </div>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editDeviceClick('editForm')">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  import { searchStation } from '@/api/station'
  import { searchGroup } from '@/api/group'
  import { searchDevice, addDevice, alterDevice, deleteDevice } from '@/api/device'
  import postcodeJSON from '/public/static/map/postcode.json'
  import postcodeOption from '/public/static/map/postcodeOption.json'

  export default{
    name: 'DeviceManagementComp',
    components: {
    },
    props: ['groupMsg'],
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
        groupData: null,
        stationData: null,
        deviceData: [],
        tableData: [],
        addForm: {
          device_id: '',
          device_name: '',
          head: '',
          head_phone: '',
          address: '',
          airflow_mode: '',
          beneficiary_entity: '',
          elevation: '',
          fuel_type: '',
          kind: '',
          specifications_room: '',
          structural_form: '',
          supplier_device: '',
          technician_id: '',
          technician_name: '',
          technician_phone: '',
          GPS: '',
          station_id: '',
          group_id: ''
        },
        editForm: {
          device_id: '',
          device_name: '',
          head: '',
          head_phone: '',
          address: '',
          airflow_mode: '',
          beneficiary_entity: '',
          elevation: '',
          fuel_type: '',
          kind: '',
          specifications_room: '',
          structural_form: '',
          supplier_device: '',
          technician_id: '',
          technician_name: '',
          technician_phone: '',
          GPS: '',
          station_id: '',
          group_id: ''
        },
        columns: [
          { key: 'device_id', label: '烤房编号', width: '' },
          { key: 'device_name', label: '烤房名称', width: '' },
          { key: 'station_id', label: '所属烟站', width: '' },
          { key: 'group_id', label: '所属烤房群', width: '' },
          { key: 'address', label: '烤房地址', width: '' },
          { key: 'head', label: '负责人', width: '' },
          { key: 'head_phone', label: '联系方式', width: '' },
          { key: 'operate', label: '操作', width: '150' },
        ],
        descLabels: [
          { key: 'device_id', label: '烤房编号', span: 1 },
          { key: 'device_name', label: '烤房名称', span: 1 },
          { key: 'kind', label: '烤房类型', span: 1 },
          { key: 'beneficiary_entity', label: '受益主体', span: 1 },
          { key: 'address', label: '烤房地址', span: 2 },
          { key: 'GPS', label: 'GPS坐标', span: 1 },
          { key: 'elevation', label: '海拔', span: 1 },
          { key: 'head', label: '负责人', span: 1 },
          { key: 'head_phone', label: '手机', span: 1 },
          { key: 'airflow_mode', label: '气流方式', span: 1 },
          { key: 'fuel_type', label: '燃料类型', span: 1 },
          { key: 'specifications_room', label: '装烟室规格', span: 1 },
          { key: 'structural_form', label: '结构形式', span: 1 },
          { key: 'technician_id', label: '技师编号', span: 1 },
          { key: 'technician_phone', label: '技师手机号', span: 1 },
        ],
        rules: {
          device_id : [
            {required: true, message: '请输入烤房群编号', trigger: 'blur'},
          ],
          device_name : [
            {required: true, message: '请输入烤房群名称', trigger: 'blur'},
          ],
          kind : [
            {required: true, message: '请选择烤房类型', trigger: 'blur'},
          ],
          beneficiary_entity : [
            {required: true, message: '请输入受益主体', trigger: 'blur'},
          ],
          address : [
            {required: true, message: '请输入烤房地址', trigger: 'blur'},
          ],
          GPS : [
            {required: true, message: '请输入GPS坐标', trigger: 'blur'},
          ],
          elevation : [
            {required: true, message: '请输入海拔', trigger: 'blur'},
            {type: 'number', min: 0, message: '请输入正确的海拔数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          head : [
            {required: true, message: '请输入负责人', trigger: 'blur'},
          ],
          head_phone : [
            {required: true, message: '请输入负责人手机号', trigger: 'blur'},
            {pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}
          ],
          airflow_mode : [
            {required: true, message: '请选择气流方式', trigger: 'blur'},
          ],
          fuel_type : [
            {required: true, message: '请选择燃料类型', trigger: 'blur'},
          ],
          specifications_room : [
            {required: true, message: '请输入装烟室规格', trigger: 'blur'},
          ],
          structural_form : [
            {required: true, message: '请选择结构形式', trigger: 'blur'},
          ],
          technician_id : [
            {required: true, message: '请输入技师编号', trigger: 'blur'},
          ],
          technician_phone : [
            {required: true, message: '请输入技师手机号', trigger: 'blur'},
            {pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}
          ],
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
          group_id: this.groupMsg,
        }
        this.deviceData = await this.requestDevice(rdata)
        this.tableData = [].concat(this.deviceData)
        this.total = this.tableData.length
        this.groupData = await this.requestGroup(rdata)
        rdata = {
          station_id: this.groupData.station_id
        }
        this.stationData = await this.requestStation(rdata)
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      filterTable(){
        this.tableData = this.deviceData.filter(data =>
        data.device_id.includes(this.filterText) ||
        data.device_name.includes(this.filterText) ||
        data.head.includes(this.filterText) ||
        data.head_phone.includes(this.filterText))
        this.total = this.tableData.length
        this.currentPage = 1
      },
      async addDeviceClick(formName) {
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
          this.addForm.group_id = this.groupMsg
          this.addForm.station_id = this.groupData.station_id
          this.addForm.location = this.stationData.location
          this.addForm.parent_location = this.stationData.parent_location

          let rdata = this.addForm
          console.log('rdata', rdata)
          let res = await this.requestAddDevice(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '新增烤房成功'})
            this.addVisible = false
            this.fetchData()
          }
        }
      },
      async editDeviceClick(formName) {
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
          let res = await this.requestAlterDevice(rdata)
          if(res.code === 200) {
            this.$message({type: 'success', message: '修改烤房成功'})
            this.editVisible = false
            this.fetchData()
          }
        }
      },
      async deleteDeviceClick(row) {
        let rdata = row
        let res = await this.requestDeleteDevice(rdata)
        if(res.code === 200) {
          this.$message({type: 'success', message: '删除烤房成功'})
          this.editVisible = false
          this.fetchData()
        }
      },
      async requestStation(rdata) {
        let res = await searchStation(rdata)
        console.log('searchStation', res)
        return res.data[0]
      },
      async requestGroup(rdata) {
        let res = await searchGroup(rdata)
        console.log('searchGroup', res)
        return res.data[0]
      },
      async requestDevice(rdata) {
        let res = await searchDevice(rdata)
        console.log('searchDevice', res)
        return res.data
      },
      async requestAddDevice(rdata) {
        let res = await addDevice(rdata)
        console.log('addDevice', res)
        return res
      },
      async requestAlterDevice(rdata) {
        let res = await alterDevice(rdata)
        console.log('alterDevice', res)
        return res
      },
      async requestDeleteDevice(rdata) {
        let res = await deleteDevice(rdata)
        console.log('deleteDevice', res)
        return res
      },
    },
  }
</script>

<style>
  .device-management, .device-management-body{
    height: 100%;
  }
  .device-management{
    padding-top: 0.625rem;
    padding-right: 0.625rem;
  }
  .device-management-filter-label{
    padding-right: 1.25rem;
  }
  .device-management-filter-input{
    width: 25rem;
    padding-right: 1.25rem;
  }
  .device-management-add-button{
    float: right;
    margin-right: 0.625rem;
  }
  .device-management-pagination-row{
    padding-top: 0.625rem;
  }
</style>
