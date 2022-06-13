<template>
  <div class="bakery-history-comp">
    <el-row :gutter="5">
      <el-col :span="12">
        <el-button style="width: 100%;" type="success" :size="size" @click="addRecordClick">新增烘烤记录</el-button>
      </el-col>
      <el-col :span="12">
        <el-popconfirm
          title="确定删除选中的烘烤记录吗？"
          @confirm="deleteRecordClick">
          <el-button slot="reference" style="width: 100%;" type="danger" :size="size">删除烘烤记录</el-button>
        </el-popconfirm>
      </el-col>
    </el-row>
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      format="yyyy/MM/dd"
      value-format="yyyy-MM-dd"
      style="width: 100%;margin-top: 0.625rem;"
      @change="dateChange"
      :size="size">
    </el-date-picker>
    <div class="bakery-history-comp-text">{{ defaultText }}</div>
    <el-tree
      class="filter-tree"
      :filter-node-method="filterNode"
      ref="tree"
      :data="options"
      :props="props"
      :load="loadNode"
      :highlight-current="true"
      lazy
      @node-click="nodeClick"
      node-key="id"
      :size="size">
      <span slot-scope="{ node, data }">
        <el-row>
          <i v-if="!data.done" class="el-icon-loading" style="margin-right: 0.625rem; color: #67C23A;"></i>
          <i v-if="data.done" class="el-icon-circle-check" style="margin-right: 0.625rem; color: #909399;"></i>
          <span style="font-size: 14px;">{{ node.label }}</span>
        </el-row>
      </span>
    </el-tree>

    <el-dialog
      title="新增烘烤记录"
      :visible.sync="addRecordVisible"
      width="60%"
      :show-close="false"
      @close="resetForm()">
      <el-form ref="recordForm" :model="recordForm" :rules="rules" :size="size">
        <el-descriptions :column="3" border>
          <template v-for="(item, index) in beforeLabels">
            <el-descriptions-item
              :label="item.label"
              :span="item.span">
              <el-form-item :prop="item.key">
                <div>
                  <el-select v-if="item.key === 'leaf_area'" v-model="recordForm[item.key]" placeholder="请选择烟叶部位" :size="size" style="width: 100%;">
                    <el-option key="上部" label="上部" value="上部"></el-option>
                    <el-option key="中部" label="中部" value="中部"></el-option>
                    <el-option key="下部" label="下部" value="下部"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'leaf_maturity'" v-model="recordForm[item.key]" placeholder="请选择烟叶成熟度" :size="size" style="width: 100%;">
                    <el-option key="未熟" label="未熟" value="未熟"></el-option>
                    <el-option key="适熟" label="适熟" value="适熟"></el-option>
                    <el-option key="过熟" label="过熟" value="过熟"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'leaf_quality'" v-model="recordForm[item.key]" placeholder="请选择烟叶素质" :size="size" style="width: 100%;">
                    <el-option key="正常成熟" label="正常成熟" value="正常成熟"></el-option>
                    <el-option key="非正常成熟" label="非正常成熟" value="非正常成熟"></el-option>
                  </el-select>
                  <el-select v-else-if="item.key === 'install_way'" v-model="recordForm[item.key]" placeholder="请选择装烟方式" :size="size" style="width: 100%;">
                    <el-option key="杆装" label="杆装" value="杆装"></el-option>
                    <el-option key="夹装" label="夹装" value="夹装"></el-option>
                  </el-select>
                  <el-date-picker
                    v-else-if="item.key.includes('time')"
                    v-model="recordForm[item.key]"
                    type="datetime"
                    placeholder="选择时间"
                    :size="size"
                    style="width: 100%;"
                    :picker-options="item.key.includes('start') ? startDatePicker : endDatePicker">
                  </el-date-picker>
                  <el-upload
                    v-else-if="item.key === 'pics'"
                    ref="picUpload"
                    :auto-upload="false"
                    :on-remove="handleRemove"
                    :on-change="handleChange"
                    :file-list="fileList"
                    list-type="picture-card">
                    <el-button type="text">{{ pics.length < 2 ? '点击上传' : '已上传2张照片'}}</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，单张图片&lt;1MB</div>
                  </el-upload>
                  <el-input v-else v-model="recordForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
                </div>
              </el-form-item>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRecordVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirmClick('recordForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getBakeRecord, addBakeRecord, deleteBakeRecord } from '@/api/bake'
  import { timeFormat } from '/src/utils/index.js'
  import OSS from 'ali-oss'

  let t = '2021-12-30 00:00:00'
  export default{
    name: 'BakeryHistoryComp',
    components: {

    },
    props: ['bakeryMsg'],
    data() {
      return {
        client: new OSS({
          region: 'oss-cn-shanghai',
          bucket: 'tobacco-main-zjw',
          accessKeyId: 'LTAI5tMVafrugE5RMm9bEy32',
          accessKeySecret: '6X5NvE6fpXOhU23LUN4Dcg3cura9Bd'
        }),
        addRecordVisible: false,
        dateRange: null,
        deviceData: null,
        size: 'small',
        options: [],
        startDatePicker: this.beginDate(),
        endDatePicker: this.endDate(),
        props: {
          id: 'id',
          label: 'label',
          children: 'children',
          isLeaf: 'leaf'
        },
        defaultText: '',
        selectedRecord: [],
        pics: [],
        beforeLabels: [
          { key: 'leaf_kind', label: '烟叶品种', span: 1 },
          { key: 'water_rate', label: '含水率（%）', span: 1 },
          { key: 'farmer_id', label: '烟农编号', span: 1 },
          { key: 'leaf_area', label: '烟叶部位', span: 1 },
          { key: 'single_leaf_before', label: '单叶重（克）', span: 1 },
          { key: 'technician_id', label: '技师编号', span: 1 },
          { key: 'leaf_maturity', label: '烟叶成熟度', span: 1 },
          { key: 'baking_weight_before', label: '装烟量（千克）', span: 1 },
          { key: 'start_time', label: '开始时间', span: 1 },
          { key: 'leaf_quality', label: '烟叶素质', span: 1 },
          { key: 'install_way', label: '装烟方式', span: 1 },
          { key: 'end_time', label: '结束时间', span: 1 },
          { key: 'pics', label: '烤前照片', span: 1 },
        ],
        recordForm: {
          device_id: null,
          leaf_kind: null,
          leaf_area: null,
          leaf_maturity: null,
          leaf_quality: null,
          water_rate: null,
          single_leaf_before: null,
          baking_weight_before: null,
          install_way: null,
          start_time: null,
          end_time: null,
          bake_pic_before: null,
        },
        rules: {
          leaf_kind : [
            {required: true, message: '请输入烟叶品种', trigger: 'blur'},
          ],
          leaf_area : [
            {required: true, message: '请选择烟叶部位', trigger: 'blur'},
          ],
          leaf_maturity : [
            {required: true, message: '请选择烟叶成熟度', trigger: 'blur'},
          ],
          leaf_quality : [
            {required: true, message: '请选择烟叶素质', trigger: 'blur'},
          ],
          water_rate : [
            {required: true, message: '请输入烟叶含水率', trigger: 'blur'},
            {type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          single_leaf_before : [
            {required: true, message: '请输入单叶重', trigger: 'blur'},
          ],
          baking_weight_before : [
            {required: true, message: '请输入装烟量', trigger: 'blur'},
          ],
          install_way : [
            {required: true, message: '请选择装烟方式', trigger: 'blur'},
          ],
          start_time : [
            {required: true, message: '请选择开始时间', trigger: 'blur'},
          ],
          end_time : [
            {required: true, message: '请选择结束时间', trigger: 'blur'},
          ],
          farmer_id : [
            {required: true, message: '请输入烟农编号', trigger: 'blur'},
          ],
          technician_id : [
            {required: true, message: '请输入技师编号', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 初始化
      fetchData() {
        // 获取会话中的烤房信息
        this.deviceData = JSON.parse(sessionStorage.getItem("device"))
        // 将烤房编号绑定到烘烤记录表单中（后续不需要反复设置）
        this.recordForm.device_id = this.deviceData.device_id

        // 获取当前时间和开始时间 （默认查询当前时间前三个月内的烘烤记录）
        let cur_date = new Date(t)
        let start_date = new Date(t)
        start_date.setMonth(start_date.getMonth() - 11)
        // 设置时间选择器的默认值
        this.dateRange = [start_date, cur_date]

        // 生成请求数据
        let find_start_time = ''
        let find_end_time = ''
        find_end_time = timeFormat(cur_date, 0, 5)
        find_start_time = timeFormat(start_date, 0, 2) + ' 00:00:00'
        let rdata = {
          device_id: this.deviceData.device_id,
          find_start_time: find_start_time,
          find_end_time: find_end_time
        }

        // 请求烘烤记录
        this.requestBakeryRecord(rdata)
        this.defaultText = '烘烤历史：近三个月'
      },
      // 时间选择器变化事件触发
      dateChange(data) {
        // 非清空事件
        if(data !== null){
          this.defaultText = '烘烤历史： ' + data[0] + ' - ' +data[1]
          // 生成请求数据
          let find_start_time = data[0] + ' 00:00:00'
          let find_end_time = data[1] + ' 23:59:59'
          let rdata = {
            device_id: this.deviceData.device_id,
            find_start_time: find_start_time,
            find_end_time: find_end_time
          }
          // 请求烘烤记录
          this.requestBakeryRecord(rdata)
        }
        // 清空事件
        else{
          this.fetchData()
        }
      },
      // 图片Change事件
      handleChange(file, fileList) {
        console.log(file, fileList)
        let fileSize = file.raw.size / 1024 / 1024
        if(fileSize > 1) {
          fileList.pop()
          alert('单张图片不得超过1M')
        }
        if(fileList.length > 2) {
          fileList.shift()
        }
        this.pics = fileList
      },
      // 烘烤记录点击事件
      nodeClick(data, node, comp){
        this.selectedRecord = data.id
        this.$emit('watchHistory', data)
      },
      resetForm(){
        console.log(this.$refs)
        this.$refs['picUpload'][0].clearFiles()
        this.$refs['recordForm'].resetFields()
        this.pics = []
      },
      // 请求烘烤记录
      requestBakeryRecord(rdata) {
        getBakeRecord(rdata).then(res => {
          console.log('getBakeRecord', res)
          if(res.code === 200){
            // 将数据绑定到树中
            this.options = this.solveResponse(res.data)
            // 默认选中第一个（最近）的烘烤记录
            this.$nextTick(function(){
                this.$refs.tree.setCurrentKey(this.options[0].id);
                this.selectedRecord = this.options[0].id
            })
            // 送出默认选择的烘烤记录
            if(res.data.length !== 0){
              this.$emit('watchHistory', this.options[0])
            }
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      // 数据处理
      solveResponse(data) {
        let result = []
        // 后端返回的烘烤记录按时间顺序排序，这里将其倒序
        data = data.reverse()
        // 将数据处理成el-tree接受的格式
        data.forEach(d => {
          let temp = {
            id: d.id,
            label: '',
            done: null,
            leaf: true,
            data: d
          }
          let d_stime = new Date(d.start_time)
          let d_etime = new Date(d.end_time)
          let cur_time = new Date(t)
          if(cur_time.getTime() >= d_etime.getTime()){
            temp.done = true
          }
          else {
            temp.done = false
          }
          temp.label = timeFormat(d_stime, 0, 5)
          result.push(temp)
        })
        return result
      },
      addRecordClick() {
        this.addRecordVisible = true
      },
      deleteRecordClick() {
        let rdata = {
          id: this.selectedRecord
        }
        this.requestDeleteRecord(rdata)
      },
      async addConfirmClick(formName) {
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
          // 先上传图片到OSS，获取图片URL
          let imgUrls = ''
          for(let pic of this.pics){
            let res = await this.client.put(`${Math.random()}-${pic.raw.name}`, pic.raw)
            if(res.res.status !== 200){
              this.$message.error('上传图片发生错误，请稍后重试！')
              return false
            }
            imgUrls += res.url + ';'
          }

          // 后保存到数据库
          let rdata = Object.assign({}, this.recordForm)
          rdata.start_time = timeFormat(rdata.start_time, 0, 5)
          rdata.end_time = timeFormat(rdata.end_time, 0, 5)
          rdata.bake_pic_before = imgUrls
          console.log('recordForm', rdata)
          this.requestAddRecord(rdata)
        }
      },
      async requestAddRecord(rdata) {
        let res = await addBakeRecord(rdata)
        if(res.code === 200) {
          this.$message({message: '新增烘烤记录成功', type: 'success'})
          this.addRecordVisible = false
          this.fetchData()
        }
      },
      requestDeleteRecord(rdata) {
        deleteBakeRecord(rdata).then(res => {
          console.log('deleteBakeRecord', res)
          if(res.code === 200) {
            this.$message({message: '删除烘烤记录成功', type: 'success'})
            this.fetchData()
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            if(self.recordForm.end_time === null || self.recordForm.end_time === ''){
              return false
            }
            else{
              let end = new Date(self.recordForm.end_time)
              return time.getTime() > end
            }
          }
        }
      },
      endDate() {
        let self = this
        return {
          disabledDate(time) {
            if(self.recordForm.start_time === null || self.recordForm.start_time === ''){
              return false
            }
            else{
              let start = new Date(self.recordForm.start_time)
              return time.getTime() < start
            }
          }
        }
      }
    }
  }
</script>

<style>
  .bakery-history-comp{
    height: 100%;
  }
  .bakery-history-comp .filter-tree{
    padding-top: 0.625rem;
    height: 85%;
    overflow-y: auto;
  }
  .bakery-history-comp-text{
    font-size: 14px;
    font-weight: bold;
    color: #606266;
    padding-top: 0.625rem;
  }
</style>
