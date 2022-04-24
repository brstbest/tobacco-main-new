<template>
  <div class="index">
    <el-row class="index-tool-row">
      <el-col class="index-tool-row-input" :span="8">
        <el-input v-model="lineData.lineName" placeholder="请输入曲线名"></el-input>
      </el-col>
      <el-col class="index-tool-row-button" :span="2">
        <el-button type="primary">保存曲线</el-button>
      </el-col>
      <el-col class="index-tool-row-select" :span="14">
        <el-select v-model="value" placeholder="请选择已有曲线" @change="selectLine">
            <el-option
              v-for="item in lineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
      </el-col>
    </el-row>
    <el-row class="index-title-row">
      <el-col :span="2">阶段号</el-col>
      <el-col :span="2" v-for="item in columns">{{ item.label }}</el-col>
    </el-row>
    <el-row class="index-temp-row">
      <el-col :span="2">目标温度</el-col>
      <el-col :span="2" v-for="(val, key) in lineData.targetTemp">
        <el-input-number v-model="lineData.targetTemp[key]" controls-position="right" :min="0" :max="999" size="mini"></el-input-number>
      </el-col>
    </el-row>
    <el-row class="index-humid-row">
      <el-col :span="2">目标湿度</el-col>
      <el-col :span="2" v-for="(val, key) in lineData.targetTemp">
        <el-input-number v-model="lineData.targetHumid[key]" controls-position="right" :min="0" :max="999" size="mini"></el-input-number>
      </el-col>
    </el-row>
    <el-row class="index-increase-row">
      <el-col :span="2">升温时间</el-col>
      <el-col :span="2" v-for="(val, key) in lineData.targetTemp">
        <el-input-number v-model="lineData.increaseTime[key]" controls-position="right" :min="0" :max="999" size="mini"></el-input-number>
      </el-col>
    </el-row>
    <el-row class="index-stay-row">
      <el-col :span="2">稳温时间</el-col>
      <el-col :span="2" v-for="(val, key) in lineData.targetTemp">
        <el-input-number v-model="lineData.stayTime[key]" controls-position="right" :min="0" :max="999" size="mini"></el-input-number>
      </el-col>
    </el-row>


    <LocationComp @watchLocation='getLocation'></LocationComp>
    <DateTimeComp @watchDateTime='setDateTime'></DateTimeComp>
    <CategoryComp></CategoryComp>
  </div>
</template>

<script>
  import LocationComp from '../../components/LocationComp'
  import DateTimeComp from '../../components/DateTimeComp'
  import CategoryComp from '../../components/CategoryComp'

  export default{
    name: 'Index',
    components: {
      LocationComp,
      DateTimeComp,
      CategoryComp
    },
    data() {
      return{
        props: { label:'name', value: 'location' },
        locations: [],
        location: '',
        parent_location: '',
        lineOptions: [
          { value: '选项1', label: '曲线1' },
        ],
        value: '',
        columns: [
          { key: 'stage1', label: '阶段一' },
          { key: 'stage2', label: '阶段二' },
          { key: 'stage3', label: '阶段三' },
          { key: 'stage4', label: '阶段四' },
          { key: 'stage5', label: '阶段五' },
          { key: 'stage6', label: '阶段六' },
          { key: 'stage7', label: '阶段七' },
          { key: 'stage8', label: '阶段八' },
          { key: 'stage9', label: '阶段九' },
          { key: 'stage10', label: '阶段十' },
        ],
        asdad: '',
        lineData: {
          lineName: '',
          targetTemp: { stage1: 0, stage2: 0, stage3: 0, stage4: 0, stage5: 0, stage6: 0, stage7: 0, stage8: 0, stage9: 0, stage10: 0 },
          targetHumid: { stage1: 0, stage2: 0, stage3: 0, stage4: 0, stage5: 0, stage6: 0, stage7: 0, stage8: 0, stage9: 0, stage10: 0 },
          increaseTime: { stage1: 0, stage2: 0, stage3: 0, stage4: 0, stage5: 0, stage6: 0, stage7: 0, stage8: 0, stage9: 0, stage10: 0 },
          stayTime: { stage1: 0, stage2: 0, stage3: 0, stage4: 0, stage5: 0, stage6: 0, stage7: 0, stage8: 0, stage9: 0, stage10: 0 },
        }
      }
    },
    methods: {
      selectLine(){
        this.lineData.lineName = this.value
      },
      handleCascaderChange(value) {
        console.log('value', value)
        console.log('locations', this.locations)
      },
      getLocation(data) {
        this.location = data.location
        this.parent_location = data.parent_location
        console.log(this.location)
        console.log(this.parent_location)
      },
      setDateTime(data) {
        console.log(data)
      }
    },
  }
</script>

<style>
  .index-tool-row{
    padding: 20px;
  }
  .index-tool-row-button{
    text-align: center;
  }
  .index-tool-row-select{
    text-align: center;
  }
  .index-title-row, .index-temp-row, .index-humid-row, .index-increase-row, .index-stay-row{
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
  }

</style>
