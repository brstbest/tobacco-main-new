<template>
  <div class="manual-data-comp">
    <el-empty v-if="empty" description="暂无数据"></el-empty>
    <el-row v-if="!empty" class="manual-data-body" :gutter="20">
      <el-col :span="12" class="manual-data-before-col">
        <el-descriptions title="烤前信息" :column="2" border>
          <template slot="extra">
            <el-button v-if="!beforeEditable" type="primary" size="small" @click="beforeEditClick">编辑</el-button>
            <el-button v-else type="success" size="small" @click="beforeSaveClick">保存</el-button>
          </template>
          <template v-for="(item, index) in beforeLabels">
            <el-descriptions-item
              :label="item.label"
              :span="item.span">
              <div v-if="beforeEditable">
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
          <el-col :span="12">
            <el-image
              style="height: 100%;"
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"></el-image>
          </el-col>
          <el-col :span="12">
            <el-image
              style="height: 100%;"
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"></el-image>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12" class="manual-data-after-col">
        <el-descriptions title="烤后信息" :column="2" border>
          <template slot="extra">
            <el-button v-if="!afterEditable" type="primary" size="small" @click="afterEditClick">编辑</el-button>
            <el-button v-else type="success" size="small" @click="afterSaveClick">保存</el-button>
          </template>
          <template v-for="(item, index) in afterLabels">
            <el-descriptions-item
              :label="item.label"
              :span="item.span">
              <div v-if="afterEditable">
                <el-input v-model="recordData[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
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
          <el-col :span="12">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-image
              style="height: 100%;"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
            </el-image>
          </el-col>
          <el-col :span="12">
            <el-image
              style="height: 100%;"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-image>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import { alterBakeRecord } from '@/api/bake'

  export default{
    name: 'ManualDataComp',
    components: {

    },
    props: ['recordMsg'],
    data() {
      return {
        empty: true,
        size: 'mini',
        recordData: null,
        beforeEditable: false,
        afterEditable: false,
        beforeLabels: [
          { key: 'leaf_kind', label: '烟叶品种', span: 1 },
          { key: 'leaf_area', label: '烟叶部位', span: 1 },
          { key: 'leaf_maturity', label: '烟叶成熟度', span: 1 },
          { key: 'leaf_quality', label: '烟叶素质', span: 1 },
          { key: 'water_rate', label: '含水率', span: 1 },
          { key: 'single_leaf_before', label: '单叶重', span: 1 },
          { key: 'baking_weight_before', label: '装烟量', span: 1 },
          { key: 'install_way', label: '装烟方式', span: 1 },
        ],
        afterLabels: [
          { key: 'yellow_rate', label: '黄烟率', span: 1 },
          { key: 'loss_rate', label: '损失率', span: 1 },
          { key: 'cyanosis_rate', label: '青烟率', span: 1 },
          { key: 'single_leaf_after', label: '单叶重', span: 1 },
          { key: 'noise_rate', label: '杂烟率', span: 1 },
          { key: 'baking_weight_after', label: '干烟量', span: 1 },
          { key: 'score', label: '评分', span: 1 },
        ]
      }
    },
    created() {
      if(this.recordMsg !== null) {
        this.empty = false
        this.fetchData()
      }
    },
    methods: {
      fetchData() {
        this.recordData = this.recordMsg
        console.log('fetch', this.recordData)
      },
      beforeEditClick() {
        this.beforeEditable = true
      },
      afterEditClick() {
        this.afterEditable = true
      },
      beforeSaveClick() {
        let rdata = Object.assign({}, this.recordData)
        this.requestAlterBakeRecord(rdata, 'before')
      },
      afterSaveClick() {
        let rdata = Object.assign({}, this.recordData)
        this.requestAlterBakeRecord(rdata, 'after')
      },
      requestAlterBakeRecord(rdata, when) {
        alterBakeRecord(rdata).then(res => {
          console.log('alterBakeRecord', res)
          if(res.code === 200){
            this.$message({message: '保存成功', type: 'success'})
            if(when === 'before'){
              this.beforeEditable = false
            }
            else{
              this.afterEditable = false
            }
          }
        }).catch(err => {
          this.$message.error(err)
        })
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
