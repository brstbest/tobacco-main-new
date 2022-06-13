<template>
  <div class="add-user-batch">
    <el-row :gutter="5">
      <el-col :span="10">
        <el-card v-loading="loading">
          <el-upload
            drag
            :auto-upload="false"
            accept=".xlsx, .xls"
            :on-remove="handleRemove"
            :on-change="handleChange"
            style="height: 15.625rem;">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <el-button size="small" type="primary" style="margin-bottom: 0.3125rem;">点击上传</el-button> -->
            <div slot="tip" style="font-size: 0.75rem;margin-top: 0.3125rem;text-align: center;">只能上传XLSX文件，单个文件内最多100个用户数据</div>
          </el-upload>
          <el-button type="primary" size="" plain :disabled="file === null" @click="readFile" style="width: 100%;">
            读取文件数据<i class="el-icon-arrow-right"></i>
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card v-loading="loading">
          <el-descriptions title="用户数据" :column="2" style="height: 15.625rem;" :colon="false">
            <template slot="extra">
              <el-tooltip placement="right" effect="light">
                <div slot="content">
                  数据无效的可能原因如下：<br/>
                  1. 用户名缺失/重复（重复时仅第一个用户数据有效）<br/>
                  2. 姓名缺失<br/>
                  3. 手机号缺失/格式错误/重复（重复时仅第一个用户数据有效）<br/>
                  4. 权限类型缺失/错误（0-5分别表示省、州、县、烟站、烤房群以及烤房）<br/>
                  5. 权限越界（新增用户的权限高于当前正在操作的用户）<br/>
                  6. 单位编号缺失<br/>
                  7. 密码缺失<br/><br/>

                  用户注册失败的可能原因如下：<br/>
                  1. 用户名已在数据库中存在<br/>
                  2. 手机号已在数据库中存在<br/>
                  3. 其他原因<br/>
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template v-for="(item, index) in descLabels">
              <el-descriptions-item
                :label="item.label"
                :span="item.span"
                :labelStyle="{'width': '100px'}"
                :contentStyle="{'font-weight': 'bold'}">
                {{ userNum[item.key] }}
              </el-descriptions-item>
            </template>
          </el-descriptions>
          <el-button type="success" size="" plain :disabled="userNum.true === 0" style="width: 100%;" @click="addUserBatchClick">
            确认并新增
          </el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="padding-top: 0.3125rem">
      <el-card v-loading="loading">
        <el-table
          :data="tableData"
          height="300"
          :size="size">
          <template v-for="(item, index) in tableColumns">
            <el-table-column
              v-if="item.key == 'status'"
              :prop="item.key"
              :label="item.label"
              :filters="[{ text: '有效', value: '有效' }, { text: '无效', value: '无效' }, { text: '成功', value: '成功' }, { text: '失败', value: '失败' }]"
              :filter-method="filterStatus">
              <template v-slot="scope">
                <el-tag size="mini" :type="statusMap[scope.row.status]">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :prop="item.key"
              :label="item.label">
              <template v-if="item.key == 'category'" v-slot="scope">
                <div v-if="item.key == 'category'">
                  {{ categoryJSON.label_mapping[scope.row['category']] }}
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import { addUserBatch } from '@/api/user'
  import { getRequestDataOnPermission } from '/src/utils/auth.js'
  import categoryJSON from '/public/static/map/category.json'

  let XLSX = require('xlsx')

  export default {
    name: 'AddUserBatch',
    components: {
    },
    data() {
      return {
        categoryJSON,
        size: 'small',
        file: null,
        user: {},
        loading: false,
        loadingText: 0,
        users: [],
        userNum: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          total: 0,
          true: 0,
          false: 0,
          blank: '',
        },
        descLabels: [
          {key: 'total', label: '总计', span: 2},
          {key: 'true', label: '有效', span: 1},
          {key: 'false', label: '无效', span: 1},
          {key: 'blank', label: '', span: 2},
          {key: '0', label: '省级', span: 1},
          {key: '1', label: '州级', span: 1},
          {key: '2', label: '县级', span: 1},
          {key: '3', label: '烟站级', span: 1},
          {key: '4', label: '烤房群级', span: 1},
          {key: '5', label: '烤房级', span: 1},
        ],
        tableColumns: [
          {key: 'user_id', label: '用户名'},
          {key: 'password', label: '密码'},
          {key: 'nname', label: '姓名'},
          {key: 'phone', label: '手机'},
          {key: 'category', label: '权限类型'},
          {key: 'permission_range', label: '单位编号'},
          {key: 'status', label: '数据状态'},
        ],
        tableData: [],
        statusMap: {
          '有效': 'primary',
          '无效': 'info',
          '成功': 'success',
          '失败': 'danger'
        }
      }
    },
    created() {
      this.user = getRequestDataOnPermission()
    },
    methods: {
      handleRemove(file, fileList) {
        this.file = null
      },
      handleChange(file, fileList) {
        // 判断选择的文件是否是表格文件
        let acceptType = ['xlsx', 'xls']
        let fileName = file.name.split('.')
        if(!acceptType.includes(fileName[fileName.length-1])) {
          fileList.pop()
          alert('只能上传.xlsx以及.xls文件！')
          return false
        }
        if(fileList.length > 1) {
          fileList.shift()
        }
        this.file = file
      },
      async readFile() {
        this.loading = true
        this.reset()

        let data = await this.readXLSX(this.file.raw)
        let inc = 1 / data.length
        this.userNum.total = data.length
        for(let i=0; i<data.length; i++) {
          if(this.checkData(data[i])) {
            console.log(this.checkData(data[i]))
            this.users.push(data[i])
            this.userNum[data[i].category] += 1
            this.userNum.true += 1
            data[i].status = '有效'
          }
          else{
            this.userNum.false += 1
            data[i].status = '无效'
          }
          this.loadingText += inc
        }
        this.tableData = data

        this.loading = false
        this.loadingText = 0
      },
      checkData(data) {
        // 属性缺失
        if(Object.keys(data).length !== 6) {
          console.log('false1')
          return false
        }
        // 手机号格式错误
        let pattern = new RegExp("^1[34578][0-9]{9}$", 'i')
        if(!pattern.test(data.phone.toString())){
          console.log('false2')
          return false
        }
        // 权限错误
        let category = data.category.toString()
        if(category < '0' || category > '5'){
          console.log('false3')
          return false
        }
        // 权限越界
        if(this.user.category.toString() >= category){
          console.log(this.user.category, category)
          console.log('false4')
          return false
        }
        // 用户名/密码重复
        let isDup = this.users.some(user => {
          if(user.user_id === data.user_id) {
            return true
          }
          if(user.phone === data.phone) {
            return true
          }
        })
        if(isDup) {
          console.log('false5')
          return false
        }
        return true
      },
      reset() {
        this.loadingText = 0
        this.users = []
        this.tableData = []
        this.userNum = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          total: 0,
          true: 0,
          false: 0,
          blank: '',
        }
      },
      readXLSX(file) {
        let nameSplit = file.name.split(".");
        let format = nameSplit[nameSplit.length - 1];
        if (!["xlsx", "csv"].includes(format)) {
          return false;
        }
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = evt => {
            let data = evt.target.result; // 读到的数据
            let workbook = XLSX.read(data, { type: "binary" });
            let sheet = workbook.Sheets[workbook.SheetNames[0]]
            let result = XLSX.utils.sheet_to_json(sheet); // 存储获取到的数据
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            resolve(result);
          };
        });
      },
      filterStatus(value, row) {
        return row.status === value;
      },
      async addUserBatchClick() {
        let rdata = [].concat(this.users)

        let res = await this.requesAddUserBatch(rdata)

        if(res.code == 200) {
          let temp = []
          for(let data of res.data){
            temp.push(data.user_id)
          }
          for(let data of this.tableData){
            if(data.status == '无效'){
              continue
            }
            if(temp.includes(data.user_id)){
              data.status = '失败'
            }
            else{
              data.status = '成功'
            }
          }
          this.tableData.splice(1,0)
          this.$message({ message: '批量新增完成，请在下方表格中查看各个用户的新增结果', type: 'success' })
        }
      },
      async requesAddUserBatch(rdata) {
        this.loading = true
        let res = await addUserBatch(rdata)
        this.loading = false
        console.log('addUserBatch', res)
        return res
      }
    }
  }
</script>

<style>
  .add-user-batch .el-upload{
    width: 100%;
  }
  .add-user-batch .el-upload-dragger{
    width: 100%;
  }
</style>
