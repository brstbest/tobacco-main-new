<template>
  <div class="manual-data-comp">
    <el-empty v-if="empty" description="暂无数据"></el-empty>
    <el-row v-if="!empty" class="manual-data-body" :gutter="20">
      <el-form
        style="height: 100%;"
        ref="recordData"
        :model="recordData"
        :rules="rules"
        :size="size">
        <el-col :span="12" class="manual-data-before-col">
          <el-descriptions title="烤前信息" :column="2" border>
            <template slot="extra">
              <el-button v-if="!beforeEditable" type="primary" size="small" @click="beforeEditable = true">编辑</el-button>
              <div v-else>
                <el-button size="small" @click="beforeEditable = false">取消</el-button>
                <el-button type="success" size="small" @click="beforeSaveClick">保存</el-button>
              </div>
            </template>
            <template v-for="(item, index) in beforeLabels">
              <el-descriptions-item
                :label="item.label"
                :span="item.span">
                <div v-if="beforeEditable">
                  <el-form-item :prop="item.key">
                    <el-select v-if="item.key === 'leaf_area'" v-model="recordData[item.key]" placeholder="请选择烟叶部位" :size="size" style="width: 100%;">
                      <el-option key="上部" label="上部" value="上部"></el-option>
                      <el-option key="中部" label="中部" value="中部"></el-option>
                      <el-option key="下部" label="下部" value="下部"></el-option>
                    </el-select>
                    <el-select v-else-if="item.key === 'leaf_maturity'" v-model="recordData[item.key]" placeholder="请选择烟叶成熟度" :size="size" style="width: 100%;">
                      <el-option key="未熟" label="未熟" value="未熟"></el-option>
                      <el-option key="适熟" label="适熟" value="适熟"></el-option>
                      <el-option key="过熟" label="过熟" value="过熟"></el-option>
                    </el-select>
                    <el-select v-else-if="item.key === 'leaf_quality'" v-model="recordData[item.key]" placeholder="请选择烟叶素质" :size="size" style="width: 100%;">
                      <el-option key="正常成熟" label="正常成熟" value="正常成熟"></el-option>
                      <el-option key="非正常成熟" label="非正常成熟" value="非正常成熟"></el-option>
                    </el-select>
                    <el-select v-else-if="item.key === 'install_way'" v-model="recordData[item.key]" placeholder="请选择装烟方式" :size="size" style="width: 100%;">
                      <el-option key="杆装" label="杆装" value="杆装"></el-option>
                      <el-option key="夹装" label="夹装" value="夹装"></el-option>
                    </el-select>
                    <el-input v-else v-model="recordData[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
                  </el-form-item>
                </div>
                <div v-else>
                  <div v-if="item.key.includes('rate')">{{ recordData[item.key] + '%' }}</div>
                  <div v-else-if="item.key.includes('weight')">{{ recordData[item.key] + 'kg' }}</div>
                  <div v-else-if="item.key.includes('single')">{{ recordData[item.key] + 'g' }}</div>
                  <div v-else>{{ recordData[item.key] }}</div>
                </div>
              </el-descriptions-item>
            </template>
          </el-descriptions>
          <el-row style="padding-top: 1.25rem; height: 50%;" :gutter="10">
            <el-upload
              v-if="beforeEditable"
              :auto-upload="false"
              :on-remove="picsBeforeRemove"
              :on-change="picsBeforeChange"
              :file-list="picsBefore"
              list-type="picture-card">
              <el-button size="small" type="text">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
            <div v-else>
              <template v-for="(pic, index) in picsBefore">
                <el-col :span="12">
                  <el-image
                    style="height: 100%;"
                    :src="pic.url"></el-image>
                </el-col>
              </template>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" class="manual-data-after-col">
          <el-descriptions title="烤后信息" :column="2" border>
            <template slot="extra">
              <el-button v-if="!afterEditable" type="primary" size="small" @click="afterEditable = true">编辑</el-button>
              <div v-else>
                <el-button size="small" @click="afterEditable = false">取消</el-button>
                <el-button type="success" size="small" @click="afterSaveClick">保存</el-button>
              </div>
            </template>
            <template v-for="(item, index) in afterLabels">
              <el-descriptions-item
                :label="item.label"
                :span="item.span">
                <div v-if="afterEditable">
                  <el-form-item :prop="item.key">
                    <el-input v-model="recordData[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
                  </el-form-item>
                </div>
                <div v-else>
                  <div v-if="item.key.includes('rate')">{{ recordData[item.key] + '%' }}</div>
                  <div v-else-if="item.key.includes('weight')">{{ recordData[item.key] + 'kg' }}</div>
                  <div v-else-if="item.key.includes('single')">{{ recordData[item.key] + 'g' }}</div>
                  <div v-else>{{ recordData[item.key] }}</div>
                </div>
              </el-descriptions-item>
            </template>
          </el-descriptions>
          <el-row style="padding-top: 1.25rem; height: 50%;" :gutter="10">
            <el-upload
              v-if="afterEditable"
              :auto-upload="false"
              :on-remove="picsAfterRemove"
              :on-change="picsAfterChange"
              :file-list="picsAfter"
              list-type="picture-card">
              <el-button size="small" type="text">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
            <div v-else>
              <template v-for="(pic, index) in picsAfter">
                <el-col :span="12">
                  <el-image
                    style="height: 100%;"
                    :src="pic.url"></el-image>
                </el-col>
              </template>
            </div>
          </el-row>
        </el-col>
      </el-form>
    </el-row>

  </div>
</template>

<script>
  import { getBakeRecord, alterBakeRecord } from '@/api/bake'
  import OSS from 'ali-oss'

  export default{
    name: 'ManualDataComp',
    components: {

    },
    props: ['recordMsg'],
    data() {
      return {
        client: new OSS({
          region: 'oss-cn-shanghai',
          bucket: 'tobacco-main-zjw',
          accessKeyId: 'LTAI5tMVafrugE5RMm9bEy32',
          accessKeySecret: '6X5NvE6fpXOhU23LUN4Dcg3cura9Bd'
        }),
        empty: true,
        size: 'mini',
        recordData: null,
        picsBefore: [],
        picsAfter: [],
        beforeEditable: false,
        afterEditable: false,
        beforeLabels: [
          { key: 'leaf_kind', label: '烟叶品种', span: 1 },
          { key: 'leaf_area', label: '烟叶部位', span: 1 },
          { key: 'leaf_maturity', label: '烟叶成熟度', span: 1 },
          { key: 'leaf_quality', label: '烟叶素质', span: 1 },
          { key: 'water_rate', label: '含水率（%）', span: 1 },
          { key: 'single_leaf_before', label: '单叶重（g）', span: 1 },
          { key: 'baking_weight_before', label: '装烟量（kg）', span: 1 },
          { key: 'install_way', label: '装烟方式', span: 1 },
        ],
        afterLabels: [
          { key: 'yellow_rate', label: '黄烟率（%）', span: 1 },
          { key: 'loss_rate', label: '损失率（%）', span: 1 },
          { key: 'cyanosis_rate', label: '青烟率（%）', span: 1 },
          { key: 'single_leaf_after', label: '单叶重（g）', span: 1 },
          { key: 'noise_rate', label: '杂烟率（%）', span: 1 },
          { key: 'baking_weight_after', label: '干烟量（kg）', span: 1 },
          { key: 'score', label: '评分', span: 1 },
        ],
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
            {required: true, message: '请输入烟叶含水率（%）', trigger: 'blur'},
            {type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          single_leaf_before : [
            {required: true, message: '请输入单叶重（g）', trigger: 'blur'},
            {type: 'number', min: 0, message: '请输入正确的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          baking_weight_before : [
            {required: true, message: '请输入装烟量（kg）', trigger: 'blur'},
            {type: 'number', min: 0, message: '请输入正确的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          install_way : [
            {required: true, message: '请选择装烟方式', trigger: 'blur'},
          ],
          yellow_rate : [
            {required: true, message: '请输入黄烟率（%）', trigger: 'blur'},
            {type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          loss_rate : [
            {required: true, message: '请输入损失率（%）', trigger: 'blur'},
            {type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          cyanosis_rate : [
            {required: true, message: '请输入青烟率（%）', trigger: 'blur'},
            {type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          single_leaf_after : [
            {required: true, message: '请输入单叶重（g）', trigger: 'blur'},
            {type: 'number', min: 0, message: '请输入正确的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          noise_rate : [
            {required: true, message: '请输入杂烟率（%）', trigger: 'blur'},
            {type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          baking_weight_after : [
            {required: true, message: '请输入干烟量（kg）', trigger: 'blur'},
            {type: 'number', min: 0, message: '请输入正确的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
          score : [
            {required: true, message: '请输入评分', trigger: 'blur'},
            {type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur', transform: (value) => Number(value)},
          ],
        }
      }
    },
    created() {
      if(this.recordMsg !== null) {
        this.empty = false
        this.fetchData()
      }
    },
    methods: {
      async fetchData() {
        let rdata = {
          device_id: this.recordMsg.device_id,
          find_start_time: this.recordMsg.start_time,
          find_end_time: this.recordMsg.start_time
        }
        let res = await this.requestBakeRecord(rdata)
        this.recordData = res.data[0]
        // "http://...;http://...;" ==> [{url:"http://..."}, {url:"http://..."}]
        if(this.recordData.bake_pic_before !== null) {
          let urls = this.recordData.bake_pic_before.split(';')
          urls.pop()
          urls.forEach(url => {
            this.picsBefore.push({ url: url })
          })
        }
        if(this.recordData.bake_pic_after !== null) {
          let urls = this.recordData.bake_pic_after.split(';')
          urls.pop()
          urls.forEach(url => {
            this.picsAfter.push({ url: url })
          })
        }
        console.log('fetch', this.recordData)
      },
      picsBeforeRemove(file, fileList) {
        this.picsBefore = fileList
      },
      picsBeforeChange(file, fileList) {
        console.log(file, fileList)
        let fileSize = file.raw.size / 1024 / 1024
        if(fileSize > 1) {
          fileList.pop()
          alert('单张图片不得超过1M')
        }
        if(fileList.length > 2) {
          fileList.shift()
        }
        this.picsBefore = fileList
      },
      picsAfterRemove(file, fileList) {
        this.picsAfter = fileList
      },
      picsAfterChange(file, fileList) {
        console.log(file, fileList)
        let fileSize = file.raw.size / 1024 / 1024
        if(fileSize > 1) {
          fileList.pop()
          alert('单张图片不得超过1M')
        }
        if(fileList.length > 2) {
          fileList.shift()
        }
        this.picsAfter = fileList
      },
      async beforeSaveClick() {
        let validFlag = true
        this.beforeLabels.map((item) => {
          this.$refs['recordData'].validateField(item.key, (error) => {
            if(error !== ''){
              validFlag = false
            }
            return error == ''
          })
        })
        if(validFlag) {
          console.log('before', validFlag)
          let picUrls = ''
          let oldPics = []
          // 上传图片到OSS
          for(let pic of this.picsBefore){
            if(pic.status === "success") {
              oldPics.push(pic)
              picUrls += pic.url + ';'
            }
            else if(pic.status === "ready") {
              let res = await this.client.put(`${Math.random()}-${pic.raw.name}`, pic.raw)
              if(res.res.status !== 200){
                this.$message.error('上传图片发生错误，请稍后重试！')
                return false
              }
              picUrls += res.url + ';'
            }
          }

          // 删除OSS上的旧图片
          let deleteUrls = this.recordData.bake_pic_before
          for(let opic of oldPics){
            deleteUrls = deleteUrls.replace(opic.url+';', '')
          }
          deleteUrls = deleteUrls.split(';')
          deleteUrls.pop()
          for(let url of deleteUrls) {
            let filename = url.split('/')
            filename = filename[filename.length - 1]
            let res = await this.client.delete(filename);
          }

          // 保存到数据库
          let rdata = Object.assign({}, this.recordData)
          rdata.bake_pic_before = picUrls
          delete rdata.group_id   // 带着group_id请求会出错，暂时不知道为什么
          let res = await this.requestAlterBakeRecord(rdata)
          if(res.code === 200){
            this.$message({message: '保存成功', type: 'success'})
            this.picsBefore = []
            this.picsAfter = []
            this.beforeEditable = false
            this.fetchData()
          }
        }
      },
      async afterSaveClick() {
        let validFlag = true
        this.afterLabels.map((item) => {
          this.$refs['recordData'].validateField(item.key, (error) => {
            if(error !== ''){
              validFlag = false
            }
            return error == ''
          })
        })
        if(validFlag) {
          console.log('after', validFlag)
          let picUrls = ''
          let oldPics = []
          // 上传图片到OSS
          for(let pic of this.picsAfter){
            if(pic.status === "success") {
              oldPics.push(pic)
              picUrls += pic.url + ';'
            }
            else if(pic.status === "ready") {
              let res = await this.client.put(`${Math.random()}-${pic.raw.name}`, pic.raw)
              if(res.res.status !== 200){
                this.$message.error('上传图片发生错误，请稍后重试！')
                return false
              }
              picUrls += res.url + ';'
            }
          }

          // 删除OSS上的旧图片
          let deleteUrls = this.recordData.bake_pic_after
          if(deleteUrls === null) deleteUrls = ''
          for(let opic of oldPics){
            deleteUrls = deleteUrls.replace(opic.url+';', '')
          }
          deleteUrls = deleteUrls.split(';')
          deleteUrls.pop()
          for(let url of deleteUrls) {
            let filename = url.split('/')
            filename = filename[filename.length - 1]
            let res = await this.client.delete(filename);
          }

          // 保存到数据库
          let rdata = Object.assign({}, this.recordData)
          rdata.bake_pic_after = picUrls
          delete rdata.group_id   // 带着group_id请求会出错，暂时不知道为什么
          let res = await this.requestAlterBakeRecord(rdata)
          if(res.code === 200){
            this.$message({message: '保存成功', type: 'success'})
            this.picsBefore = []
            this.picsAfter = []
            this.afterEditable = false
            this.fetchData()
          }
        }
      },
      async requestBakeRecord(rdata) {
        let res = await getBakeRecord(rdata)
        console.log('getBakeRecord', res)
        return res
      },
      async requestAlterBakeRecord(rdata) {
        let res = await alterBakeRecord(rdata)
        console.log('alterBakeRecord', res)
        return res
      }
    }
  }
</script>

<style>
  .manual-data-comp, .manual-data-body, .manual-data-before-col, .manual-data-after-col{
    height: 100%;
  }
  .manual-data-before-col{
    border-right: 1px solid lightgray;
  }
  .manual-data-after-col{
  }


  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
