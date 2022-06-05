<template>
  <div class="record">
    <!--<el-row class="record-search-row-top" :gutter="20">
      <el-col :span="4" ><center>从机</center></el-col>
      <el-col :span="4"><center>变量</center></el-col>
      <el-col :span="8"><center>报警时间</center></el-col>
    </el-row>-->
    <el-empty v-if="empty" description="暂无数据"></el-empty>
    <el-row v-if="!empty">
<!--      <el-row class="record-search-row-bottom" :gutter="20">
        <el-col :span="4">
          <el-select v-model="machineType" placeholder="请选择从机" id="machineType">
            <el-option
              v-for="item in machineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="variableType" placeholder="请选择变量" id="variableType">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" >
          <el-date-picker
            style="width: 100%;"
            v-model="value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleChange()"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="searchClick" style="width: 100%;">查询</el-button>
        </el-col>
      </el-row> -->
      <el-row class="record-search-row-bottom" :gutter="20"></el-row>

      <el-row class="record-table-row">
        <el-table id="table" :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe style="width: 100%" :size="size">
          <el-table-column prop="machine" label="从机名称"> </el-table-column>
          <el-table-column prop="variable" label="变量"> </el-table-column>
          <el-table-column prop="current_value" label="当前值"></el-table-column>
          <el-table-column prop="trigger_condition" label="触发条件"></el-table-column>
          <el-table-column prop="warning_time" label="报警时间"></el-table-column>
          <el-table-column prop="warning_situation" label="报警状态">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.warning_situation === '恢复正常' ? 'success' : 'danger'">{{scope.row.warning_situation}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column   prop="process_situation"  label="处理状态"></el-table-column>
          <el-table-column   prop="operate"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handle">{{scope.row.operate}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row class="record-pagination-row" type="flex" justify="center">
        <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total">
        </el-pagination>
      </el-row>
    </el-row>
  </div>
</template>
<script>
  import FilenameOption from '@/components/ExportExcel/FilenameOption'
  import BookTypeOption from '@/components/ExportExcel/BookTypeOption'
  export default{
    name: 'BakeRecordAlertComp',
    components: {
      FilenameOption,
      BookTypeOption
    },
    props: ['recordMsg'],
    data(){
      return{
        size: 'small',
        empty: true,
        ifclick: true,
        value: '',
        machineType: '',
        variableType: '',
        total: 100,
        pageSize: 5,
        currentPage: 1,
        tableData:[{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":25.4,"process_situation":"已处理","warning_time":"2021-04-03 06:32:40"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":34.6,"process_situation":"未处理","warning_time":"2021-09-16 01:31:24"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":26.3,"process_situation":"未处理","warning_time":"2021-10-20 09:36:08"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":30,"process_situation":"未处理","warning_time":"2021-07-03 02:49:14"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":39,"process_situation":"未处理","warning_time":"2021-11-08 22:39:24"},{"machine":"宏华控制器","variable":"当前上棚干球温度","current_value":70.6,"process_situation":"已处理","warning_time":"2021-04-12 19:54:43"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":25.7,"process_situation":"未处理","warning_time":"2021-12-24 01:34:10"},{"machine":"宏华控制器","variable":"当前上棚湿球温度","current_value":68,"process_situation":"未处理","warning_time":"2021-10-11 17:53:56"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":21.4,"process_situation":"未处理","warning_time":"2021-12-27 22:06:21"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":70.8,"process_situation":"未处理","warning_time":"2021-10-21 02:59:43"},{"machine":"圣华控制器","variable":"当前上棚干球温度","current_value":33.3,"process_situation":"已处理","warning_time":"2021-06-19 15:09:57"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":64.7,"process_situation":"未处理","warning_time":"2021-01-27 05:30:43"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":67,"process_situation":"已处理","warning_time":"2021-05-30 04:02:10"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":23.4,"process_situation":"未处理","warning_time":"2021-07-29 04:53:57"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":28.3,"process_situation":"未处理","warning_time":"2021-11-12 22:08:57"},{"machine":"圣华控制器","variable":"当前上棚湿球温度","current_value":39.3,"process_situation":"已处理","warning_time":"2021-04-22 09:07:49"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":70.4,"process_situation":"已处理","warning_time":"2021-07-21 14:58:59"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":26.7,"process_situation":"已处理","warning_time":"2021-02-12 05:56:45"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":64.4,"process_situation":"未处理","warning_time":"2021-06-14 15:00:39"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":58.2,"process_situation":"未处理","warning_time":"2021-07-02 15:25:00"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":69,"process_situation":"未处理","warning_time":"2021-05-23 22:54:14"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":22.1,"process_situation":"未处理","warning_time":"2021-01-11 08:28:33"},{"machine":"文华控制器","variable":"当前上棚干球温度","current_value":48,"process_situation":"未处理","warning_time":"2021-12-20 20:20:41"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":44.3,"process_situation":"未处理","warning_time":"2021-06-29 05:43:43"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":40.6,"process_situation":"未处理","warning_time":"2021-10-25 01:12:53"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":67,"process_situation":"未处理","warning_time":"2021-03-01 04:03:32"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":34.8,"process_situation":"已处理","warning_time":"2021-08-09 04:39:13"},{"machine":"圣华控制器","variable":"当前上棚干球温度","current_value":26,"process_situation":"已处理","warning_time":"2021-03-17 11:46:21"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":24.2,"process_situation":"已处理","warning_time":"2021-01-12 08:20:23"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":67.8,"process_situation":"未处理","warning_time":"2021-03-21 04:52:20"},{"machine":"永华控制器","variable":"当前上棚湿球温度","current_value":60,"process_situation":"已处理","warning_time":"2021-12-16 14:10:47"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":67,"process_situation":"未处理","warning_time":"2021-10-06 23:23:18"},{"machine":"圣华控制器","variable":"当前下棚干球温度","current_value":53,"process_situation":"未处理","warning_time":"2021-12-06 11:15:38"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":59.4,"process_situation":"未处理","warning_time":"2021-08-14 03:13:33"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":59.4,"process_situation":"已处理","warning_time":"2021-11-12 15:15:43"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":39,"process_situation":"已处理","warning_time":"2021-06-29 20:45:50"},{"machine":"文华控制器","variable":"当前上棚干球温度","current_value":36,"process_situation":"未处理","warning_time":"2021-05-22 10:08:06"},{"machine":"永华控制器","variable":"当前上棚湿球温度","current_value":69,"process_situation":"未处理","warning_time":"2021-01-20 12:31:50"},{"machine":"文华控制器","variable":"当前上棚干球温度","current_value":30.1,"process_situation":"未处理","warning_time":"2021-12-20 17:58:08"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":23.8,"process_situation":"已处理","warning_time":"2021-08-28 23:55:08"},{"machine":"宏华控制器","variable":"当前下棚湿球温度","current_value":35,"process_situation":"已处理","warning_time":"2021-01-06 10:54:18"},{"machine":"宏华控制器","variable":"当前上棚湿球温度","current_value":65,"process_situation":"已处理","warning_time":"2021-09-03 17:56:41"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":42.1,"process_situation":"已处理","warning_time":"2021-01-25 04:11:10"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":27.1,"process_situation":"已处理","warning_time":"2021-12-21 14:19:53"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":46,"process_situation":"已处理","warning_time":"2021-02-03 14:16:16"},{"machine":"文华控制器","variable":"当前上棚干球温度","current_value":48.4,"process_situation":"已处理","warning_time":"2021-06-23 01:57:45"},{"machine":"宏华控制器","variable":"当前上棚干球温度","current_value":47,"process_situation":"未处理","warning_time":"2021-07-27 20:39:30"},{"machine":"圣华控制器","variable":"当前下棚干球温度","current_value":69.4,"process_situation":"未处理","warning_time":"2021-03-01 18:57:41"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":56,"process_situation":"已处理","warning_time":"2021-09-09 12:52:04"},{"machine":"宏华控制器","variable":"当前上棚干球温度","current_value":35.8,"process_situation":"未处理","warning_time":"2021-09-08 06:03:30"},{"machine":"圣华控制器","variable":"当前下棚湿球温度","current_value":64,"process_situation":"已处理","warning_time":"2021-03-11 16:44:57"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":48.2,"process_situation":"已处理","warning_time":"2021-06-15 14:13:15"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":62.2,"process_situation":"未处理","warning_time":"2021-04-15 07:47:15"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":40,"process_situation":"已处理","warning_time":"2021-11-10 03:56:21"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":70,"process_situation":"未处理","warning_time":"2021-08-15 04:55:47"},{"machine":"宏华控制器","variable":"当前下棚湿球温度","current_value":48,"process_situation":"已处理","warning_time":"2021-01-26 09:36:16"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":53,"process_situation":"未处理","warning_time":"2021-07-30 06:18:39"},{"machine":"永华控制器","variable":"当前下棚湿球温度","current_value":54,"process_situation":"已处理","warning_time":"2021-03-10 20:40:48"},{"machine":"宏华控制器","variable":"当前上棚干球温度","current_value":28.1,"process_situation":"未处理","warning_time":"2021-07-06 17:15:40"},{"machine":"圣华控制器","variable":"当前下棚干球温度","current_value":36.5,"process_situation":"未处理","warning_time":"2021-06-09 07:51:58"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":64.8,"process_situation":"未处理","warning_time":"2021-05-10 21:27:25"},{"machine":"宏华控制器","variable":"当前上棚湿球温度","current_value":28.9,"process_situation":"已处理","warning_time":"2021-01-27 17:29:11"},{"machine":"永华控制器","variable":"当前上棚湿球温度","current_value":21,"process_situation":"已处理","warning_time":"2021-03-26 20:05:39"},{"machine":"宏华控制器","variable":"当前下棚干球温度","current_value":65.4,"process_situation":"未处理","warning_time":"2021-01-16 11:12:03"},{"machine":"永华控制器","variable":"当前上棚湿球温度","current_value":59,"process_situation":"未处理","warning_time":"2021-04-18 10:13:06"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":22,"process_situation":"未处理","warning_time":"2021-09-04 08:40:43"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":24.8,"process_situation":"未处理","warning_time":"2021-02-12 11:15:18"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":26,"process_situation":"未处理","warning_time":"2021-05-21 08:55:25"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":62.3,"process_situation":"已处理","warning_time":"2021-09-17 15:31:10"},{"machine":"宏华控制器","variable":"当前上棚湿球温度","current_value":38,"process_situation":"已处理","warning_time":"2021-09-12 04:44:22"},{"machine":"宏华控制器","variable":"当前上棚湿球温度","current_value":24,"process_situation":"已处理","warning_time":"2021-07-22 12:04:47"},{"machine":"永华控制器","variable":"当前上棚湿球温度","current_value":41,"process_situation":"已处理","warning_time":"2021-10-22 06:14:47"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":23.4,"process_situation":"未处理","warning_time":"2021-12-21 03:32:36"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":70,"process_situation":"未处理","warning_time":"2021-01-03 17:39:10"},{"machine":"圣华控制器","variable":"当前上棚干球温度","current_value":65,"process_situation":"已处理","warning_time":"2021-01-11 12:48:59"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":52.3,"process_situation":"未处理","warning_time":"2021-05-31 10:24:44"},{"machine":"永华控制器","variable":"当前上棚湿球温度","current_value":27.9,"process_situation":"未处理","warning_time":"2021-04-18 12:39:12"},{"machine":"宏华控制器","variable":"当前上棚湿球温度","current_value":32.4,"process_situation":"未处理","warning_time":"2021-12-19 17:09:32"},{"machine":"圣华控制器","variable":"当前下棚湿球温度","current_value":58.8,"process_situation":"未处理","warning_time":"2021-09-29 04:11:59"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":68.8,"process_situation":"未处理","warning_time":"2021-07-27 23:25:30"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":24.5,"process_situation":"未处理","warning_time":"2021-02-21 05:07:14"},{"machine":"宏华控制器","variable":"当前上棚干球温度","current_value":26.9,"process_situation":"已处理","warning_time":"2021-01-24 21:55:38"},{"machine":"文华控制器","variable":"当前上棚湿球温度","current_value":66,"process_situation":"未处理","warning_time":"2021-06-09 01:29:05"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":34.6,"process_situation":"未处理","warning_time":"2021-04-09 22:43:26"},{"machine":"宏华控制器","variable":"当前上棚湿球温度","current_value":60.4,"process_situation":"已处理","warning_time":"2021-01-20 08:30:30"},{"machine":"永华控制器","variable":"当前下棚干球温度","current_value":29.6,"process_situation":"未处理","warning_time":"2021-08-04 00:13:44"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":32,"process_situation":"已处理","warning_time":"2021-03-10 02:20:50"},{"machine":"圣华控制器","variable":"当前下棚干球温度","current_value":62,"process_situation":"未处理","warning_time":"2021-03-05 03:48:48"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":51.3,"process_situation":"未处理","warning_time":"2021-09-14 20:52:00"},{"machine":"宏华控制器","variable":"当前下棚湿球温度","current_value":66,"process_situation":"未处理","warning_time":"2021-05-16 04:03:50"},{"machine":"圣华控制器","variable":"当前上棚湿球温度","current_value":67,"process_situation":"未处理","warning_time":"2021-02-11 14:02:04"},{"machine":"宏华控制器","variable":"当前下棚湿球温度","current_value":70,"process_situation":"已处理","warning_time":"2021-12-25 19:59:29"},{"machine":"圣华控制器","variable":"当前下棚干球温度","current_value":23,"process_situation":"未处理","warning_time":"2021-10-10 10:26:28"},{"machine":"圣华控制器","variable":"当前下棚湿球温度","current_value":44.6,"process_situation":"已处理","warning_time":"2021-04-16 17:04:12"},{"machine":"宏华控制器","variable":"当前上棚干球温度","current_value":59.8,"process_situation":"未处理","warning_time":"2021-09-27 20:14:08"},{"machine":"宏华控制器","variable":"当前上棚干球温度","current_value":30.6,"process_situation":"已处理","warning_time":"2021-12-15 06:53:11"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":28.2,"process_situation":"已处理","warning_time":"2021-06-20 03:22:19"},{"machine":"文华控制器","variable":"当前下棚干球温度","current_value":57,"process_situation":"未处理","warning_time":"2021-11-17 21:20:23"},{"machine":"宏华控制器","variable":"当前下棚湿球温度","current_value":54.2,"process_situation":"未处理","warning_time":"2021-01-26 12:29:21"},{"machine":"文华控制器","variable":"当前下棚湿球温度","current_value":21,"process_situation":"未处理","warning_time":"2021-11-15 15:47:13"}],
      }
    },
    created() {
      if(this.recordMsg !== null) {
        this.empty = false
        this.fetchData()
      }
    },
    computed:{
      tables:function(){
        this.getTriggerCondition()
        this.getWarningSituation()
        this.getOperate()
        if(this.ifclick==true){
          this.ifclick=false
          this.total=0
          return  this.tableData.filter(item=>{
            var flag = true
            flag = flag&&(this.machineType=="1"&&item.machine=="圣华控制器"
            ||this.machineType=="2"&&item.machine=="宏华控制器"
            ||this.machineType=="3"&&item.machine=="文华控制器"
            ||this.machineType=="4"&&item.machine=="永华控制器"
            ||this.machineType=="")

            flag = flag&&(this.variableType=="1"&&item.variable=="当前上棚干球温度"
            ||this.variableType=="2"&&item.variable=="当前上棚湿球温度"
            ||this.variableType=="3"&&item.variable=="当前下棚干球温度"
            ||this.variableType=="4"&&item.variable=="当前下棚湿球温度"
            ||this.variableType=="")
            flag = flag&&(this.value[0]==undefined||this.value[1]==undefined||item.warning_time>this.value[0]&&item.warning_time<this.value[1])
            if(flag==true)
              this.total++
            return flag
          })
        }
        return this.tableData
      }
    },
    methods:{
      handle(){
        this.$message('已处理')
      },
      getTriggerCondition() {
        this.tableData.forEach(data => {
          if(data.process_situation == "已处理")
            data.trigger_condition = "已恢复正常状态"
          else
            data.trigger_condition = "报警值:" + data.current_value + "，已高于或低于您设置的阈值"
        })
      },
      getWarningSituation() {
        this.tableData.forEach(data => {
          if(data.process_situation == "已处理")
            data.warning_situation = "恢复正常"
          else
            data.warning_situation = "报警"
        })
      },
      getOperate() {
        this.tableData.forEach(data => {
          if(data.process_situation == "已处理")
            data.operate = ""
          else
            data.operate = "处理"
        })
      },
      searchClick() {
        this.ifclick=true
      },
      handleChange(value) {
        this.value[0] = this.formatDateTime(this.value[0])
        this.value[1] = this.formatDateTime(this.value[1])
        searchClick()
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
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      exportExcel() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          excel.exportExcel({
            documentId: '#table',
            filename: this.filename,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
    }
  }
</script>
<style>
  .recode-export-row, .record-search-row-bottom, .record-search-row-top, .record-tool-row, .record-table-row, .record-pagination-row {
    padding: 1.25rem;
    padding-bottom: 0rem;
  }

</style>
