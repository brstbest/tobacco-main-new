<template>
  <div class="add-record-comp">
    <el-row class="add-record-form">
      <el-form ref="recordForm" :model="recordForm" label-position="left" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备ID">
              <el-input v-model="recordForm.device_id"></el-input>
            </el-form-item>
            <el-form-item label="烟农ID">
              <el-input v-model="recordForm.farmer_id" :disabled="farmer_disabled"></el-input>
            </el-form-item>
            <el-form-item label="技师ID">
              <el-input v-model="recordForm.technician_id" :disabled="technician_disabled"></el-input>
            </el-form-item>
            <el-form-item label="烟草评分">
              <el-input v-model="recordForm.score"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="recordForm.start_time"
                type="datetime"
                placeholder="选择开始日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="recordForm.end_time"
                type="datetime"
                placeholder="选择结束日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="烤前重量">
              <el-input v-model="recordForm.baking_weight_before"></el-input>
            </el-form-item>
            <el-form-item label="烤后重量">
              <el-input v-model="recordForm.baking_weight_after"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="烤烟信息">
            <el-input type="textarea" v-model="recordForm.tobacco_info"></el-input>
          </el-form-item>
        </el-row>
        <el-button type="primary" @click="confirmClick">提交</el-button>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import { addBakeRecord } from '@/api/bake'

  export default{
    name: 'AddRecordComp',
    components: {},
    data() {
      return {
        farmer_disabled: false,
        technician_disabled: false,
        recordForm: {
          device_id: '',
          start_time: '',
          farmer_id: '',
          end_time: '',
          technician_id: '',
          baking_weight_before: '',
          baking_weight_after: '',
          score: '',
          tobacco_info: ''
        }
      }
    },
    created() {
      let user = JSON.parse(localStorage.getItem('user'))
      switch(user.category){
        case '4':
          this.recordForm.farmer_id = user.user_id
          this.farmer_disabled = true
          break
        case '5':
          this.recordForm.technician_id = user.technician_id
          this.technician_disabled = true
          break
      }
    },
    methods: {
      formatDateTime(date) {
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        var minute = date.getMinutes()
        minute = minute < 10 ? ('0' + minute) : minute
        var second = date.getSeconds()
        second = second < 10 ? ('0' + second) : second
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
      },
      confirmClick() {
        let rdata = this.recordForm
        rdata.start_time = this.formatDateTime(rdata.start_time)
        rdata.end_time = this.formatDateTime(rdata.end_time)
        console.log(rdata)
        addBakeRecord(rdata).then(res => {
          console.log('addBakeRecord', res)
          if(res.code === 200){
            this.$message({message: '添加成功', type: 'success'})
            this.$emit('watchChild', true)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },
  }
</script>

<style>
</style>
