<template>
  <div class="test">
    <el-upload
      class="upload-demo"
      :auto-upload="false"
      :on-remove="handleRemove"
      :on-change="handleChange">
      <el-button size="small" type="text">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
    </el-upload>
    <!-- <CateoryPermissionRangeComp></CateoryPermissionRangeComp> -->
    <input type="file" name="" id="upload" accept="image/*" multiple :disabled="isUploading" @change="onChange" ref="file">
    <p class="tips">一次可以选择多张图片，每次最多选择9张图片（单张图片大小 &lt; 1M）</p>
    <ul class="img-list">
      <li v-for="(item, index) in imgList" :key="index" :style="{background: `url(${item}) no-repeat center/cover`}"></li>
    </ul>
    <el-button @click="deleteTest">删除测试</el-button>

<!--    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
     <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form> -->
    <el-button type="primary" >导入</el-button>
  </div>
</template>

<script>

  import { readXLSX } from '/src/vendor/ReadExcel.js'
  import CateoryPermissionRangeComp from '/src/components/CateoryPermissionRangeComp'
  import OSS from 'ali-oss'

  let XLSX = require('xlsx')

  export default{
    components: {
      CateoryPermissionRangeComp,
    },
    data() {
      return {
        client: new OSS({
          region: 'oss-cn-shanghai',
          bucket: 'tobacco-main-zjw',
          accessKeyId: 'LTAI5tMVafrugE5RMm9bEy32',
          accessKeySecret: '6X5NvE6fpXOhU23LUN4Dcg3cura9Bd'
        }),
        imgList: [],
        isUploading: false,
        fileListLength: 0,
        fileList: [
          {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
          {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
        ],

        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      console.log('client', this.client)
    },
    methods: {
      handlePreview(file) {
        console.log('handlePreview', file)
      },
      handleRemove(file, fileList) {
        console.log('handleRemove', file, fileList)
      },
      async handleChange(file, fileList) {
        // console.log('handleChange', fileList)
        // if(fileList.length > 2) {
        //   fileList.shift()
        // }
        console.log(file)
        let result = await this.readXLSX(file.raw)
        console.log('result', result)
      },
      onChange() {
        const picFiles = this.$refs.file.files
        if(picFiles.length > 2) {
          alert('每次最多选择2张图片')
          return false
        }
        const files = []
        for(const file of picFiles) {
          const picSize = file.size / 1024 / 1024
          if(picSize > 1) {
            alert('单张图片不得超过1M')
            return false
          }
          files.push(file)
        }
        console.log('oss', files)
        this.ossUploadPic(files)
      },
      async ossUploadPic (files) {
        this.isUploading = true
        const imgUrls = []
        for (const file of files) {
          const res = await this.client.put(`${Math.random()}-${file.name}`, file)
          console.log('oss-res', res)
          imgUrls.push(res.url)
        }
        this.imgList = imgUrls
        this.isUploading = false
      },
      async deleteTest() {
        let res = await this.client.delete('test.png')
        console.log('oss-delete-res')
      },
      async submitForm(formName) {
        let fields = ['name', 'region', 'date1']

        fields.map((field) => {
          this.$refs[formName].validateField(field, (error) => {
            return error == ''
          })
        })

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
      }
    }
  }
</script>

<style>
.img-choose {
  display: block;
  width: 100px;
  height: 50px;
  margin-left: 60px;
  line-height: 50px;
  color: #fff;
  background-color: #42B983;
  border-radius: 5px;
}
.tips {
  color: #999;
}
.upLoading {
  background-color: #ccc;
}
.img-list {
  margin-left: 60px;
}
.img-list > li{
  float: left;
  list-style: none;
  width: 150px;
  height: 100px;
  margin: 0 30px 30px 0;
  border: 1px solid #ccc;
}
</style>
