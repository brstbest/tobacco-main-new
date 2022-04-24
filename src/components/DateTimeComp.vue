<template>
  <el-date-picker
  style="width: 100%;"
  v-model="value"
  type="datetimerange"
  range-separator="至"
  start-placeholder="开始时间"
  end-placeholder="结束时间"
  @change="handleChange()">
  </el-date-picker>
</template>

<script>
  export default{
    name: 'DateTimeComp',
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value: ''
      }
    },
    methods: {
      handleChange(value) {
        this.value[0] = this.formatDateTime(this.value[0])
        this.value[1] = this.formatDateTime(this.value[1])
        this.$emit('watchDateTime', { start_time: this.value[0], end_time: this.value[1] })
      },
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
      }
    },
  }
</script>

<style>
</style>
