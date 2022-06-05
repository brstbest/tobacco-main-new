<template>
  <div class="line-model">
    <el-row class="line-model-search-row" :gutter="20">
      曲线类型：
      <el-select v-model="kindValue" placeholder="请选择曲线类型" :size="size" style="padding-right: 0.625rem;">
        <el-option
          v-for="item in kindOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      干/湿球：
      <el-select v-model="dwValue" placeholder="请选择干/湿球" :size="size" style="padding-right: 0.625rem;">
        <el-option
          v-for="item in dwOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" :size="size" @click="searchLineClick">查看</el-button>
      <el-button type="success" :size="size" @click="createLineClick">新增曲线</el-button>
    </el-row>
    <el-row style="padding-bottom: 1.25rem;" v-if="showType !== ''">
      保存曲线类型名：
      <el-input v-model="newKindName" placeholder="请输入类型名" style="width: 9.375rem;padding-right: 0.625rem;" :size="size"></el-input>
      <el-button type="warning" @click="showChangeClick" :size="size">查看曲线{{ showChange === true ? '数据' : '图' }}</el-button>
    </el-row>
    <el-row class="line-model-data-row" :gutter="10">
      <LineChartComp v-if="showChange === true" :line-msg="curveData"></LineChartComp>
      <el-col :span="12" v-for="(data, index) in curveData" v-if="index === showType || showType === 2" v-show="showChange === false">
        <el-row class="line-model-button-row">
          <el-button type="success" :size="size" @click="addStageClick(data)">添加阶段</el-button>
          <el-popover
            placement="right-start"
            width="28.125rem"
            v-model="savePpvVisible[index]"
            style="padding-left: 0.625rem; padding-right: 0.625rem;">
            <el-row>
              保存为曲线类型 {{ newKindName }} 的{{ index === 0 ? '干球' : '湿球' }}曲线 ?
              <el-button type="primary" size="mini" @click="saveLineClick(data, index)" style="margin-left: 1.25rem;">确定</el-button>
            </el-row>
            <el-button slot="reference" type="primary" :size="size">保存{{ index === 0 ? '干球' : '湿球' }}曲线<i class="el-icon-caret-right"></i></el-button>
          </el-popover>
          <el-popconfirm :title="'是否删除'+(index === 0 ? '干球' : '湿球')+'曲线?'" @confirm="deleteLineClick(index)">
            <el-button slot="reference" v-if="dwId[index] !== -1" type="danger" :size="size">删除{{ index === 0 ? '干球' : '湿球' }}曲线</el-button>
          </el-popconfirm>
        </el-row>
        <el-table
          :data="data"
          stripe
          style="width: 100%;"
          :size="size">
          <el-table-column :label="index === 0 ? '干球' : '湿球'" align="center">
            <template v-for="(item, index) in columns">
              <el-table-column
                :prop="item.key"
                :label="item.label"
                :key="index"
                :width="item.width"
                align="center">
                <template v-slot="scope">
                  <el-input-number
                    v-model="scope.row[item.key]"
                    @change="handleChange"
                    size="mini"
                    style="width: 6.25rem;"
                    v-if="scope.row.editable">
                  </el-input-number>
                  <div v-if="!scope.row.editable">{{ scope.row[item.key] }}</div>
                 </template>
              </el-table-column>
            </template>
            <el-table-column
              prop="operate"
              label="操作"
              key="9"
              width="100"
              align="center">
              <template v-slot="scope">
                <el-button v-if="!scope.row.editable" type="primary" icon="el-icon-edit" circle size="mini" plain @click="scope.row.editable = true"></el-button>
                <el-button v-if="scope.row.editable" type="success" icon="el-icon-check" circle size="mini" plain @click="checkStage(scope.$index, data)"></el-button>
                <el-button type="danger" icon="el-icon-close" circle size="mini" plain @click="deleteClick(scope.$index, data)"></el-button>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import { searchLine, addLine, alterLine, deleteLine } from '@/api/line'
  import LocationComp from '/src/components/LocationComp'
  import LineChartComp from './components/lineChartComp'

  export default {
    name: 'LineModel',
    components: {
      LocationComp,
      LineChartComp
    },
    data() {
      return {
        dialogVisible: false,
        size: 'small',
        stageNo: 0,
        kindValue: '',
        newKindName: '',
        dwValue: '',
        hasSearch: false,
        savePpvVisible: [false, false],
        kindOptions: [],
        wholeData: [],
        showType: '',
        dwId: [-1, -1],
        showChange: null,
        dwOptions: [
          {value: 0, label: '干球'},
          {value: 1, label: '湿球'},
          {value: 2, label: '干球和湿球'},
        ],
        columns: [
          {key: 'stime', label: '开始时间', width: ''},
          {key: 'etime', label: '结束时间', width: ''},
          {key: 'stemp', label: '开始温度', width: ''},
          {key: 'etemp', label: '结束温度', width: ''},
        ],
        lineData: [],
        curveData: [[], []],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.kindOptions = []
        let rdata = {}
        this.requestLineData(rdata)
      },
      showLineClick() {
        this.dialogVisible = true
      },
      showChangeClick() {
        let flag = true
        if(this.showChange === false){
          this.curveData.forEach(curve => {
            curve.forEach(data => {
              if(data.editable === true){
                this.$message.error('请完成编辑后查看曲线图')
                flag = false
              }
            })
          })
        }
        if(flag) {
          this.showChange = !this.showChange
          console.log(this.curveData)
        }
      },
      createLineClick() {
        this.curveData = [[], []]
        this.hasSearch = false
        this.showType = 2
        this.kindValue = ''
        this.dwValue = ''
        this.dwId = [-1, -1]
        this.newKindName = null
        this.showChange = false
      },
      addStageClick(data) {
        let newStage = {
          stime: 0, etime: 0, stemp: 0, etemp: 0,
          editable: true
        }
        data.push(newStage)
      },
      deleteClick(index, rows) {
        rows.splice(index, 1)
      },
      saveLineClick(data, index) {
        let flag = true
        data.forEach(d => {
          if(d.editable === true) {
            this.$message.error('请完成曲线编辑后保存')
            flag = false
          }
        })
        if(flag){
          let rdata = {
            id: this.dwId[index],
            kind: this.newKindName,
            dry_or_wet: index === 0 ? 'dry' : 'wet',
            curve: ''
          }
          data.forEach(d => {
            rdata.curve = rdata.curve + d.stime + '-' + d.etime + ':' + d.stemp + '-' + d.etemp + ','
          })
          rdata.curve = rdata.curve.substr(0, rdata.curve.length - 1)
          if(rdata.id === -1){
            addLine(rdata).then(res => {
              console.log('addLine', res)
              if(res.code === 200){
                this.$message({message: '保存成功', type: 'success'})
                this.fetchData()
                this.savePpvVisible = [false, false]
              }
            }).catch(err => {
              this.$message.error(err)
            })
          }
          else{
            alterLine(rdata).then(res => {
              console.log('alterLine', res)
              if(res.code === 200){
                this.$message({message: '修改成功', type: 'success'})
                this.fetchData()
                this.savePpvVisible = [false, false]
              }
            }).catch(err => {
              this.$message.error(err)
            })
          }
        }
      },
      deleteLineClick(index) {
        let rdata = {
          id: this.dwId[index]
        }
        deleteLine(rdata).then(res => {
          console.log('deleteLine', res)
          if(res.code === 200){
            this.$message({message: '删除成功', type: 'success'})
            this.fetchData()
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      searchLineClick() {
        this.showType = this.dwValue
        this.curveData = [[], []]
        this.kindNames = ['', '']
        let dryCurve = ''
        let wetCurve = ''
        let dryId = -1
        let wetId = -1
        this.wholeData[this.kindValue].forEach(h => {
          if(h.dry_or_wet === 'dry'){
            dryCurve = '\"'+h.curve+'\"'
            dryCurve = dryCurve.replace(/\./g,',')
            dryCurve = dryCurve.replace(/:/g,'\":\"')
            dryCurve = dryCurve.replace(/,/g,'\",\"')
            dryId = h.id
          }
          else{
            wetCurve = '\"'+h.curve+'\"'
            wetCurve = wetCurve.replace(/\./g,',')
            wetCurve = wetCurve.replace(/:/g,'\":\"')
            wetCurve = wetCurve.replace(/,/g,'\",\"')
            wetId = h.id
          }
        })
        dryCurve = '{'+ dryCurve +'}'
        wetCurve = '{'+ wetCurve +'}'
        dryCurve = JSON.parse(dryCurve)
        wetCurve = JSON.parse(wetCurve)
        console.log('dry', dryCurve)
        console.log('wet', wetCurve)
        for(let item in dryCurve){
          let time = item.split('-')
          let temp = dryCurve[item].split('-')
          let newStage = {
            stime: time[0], etime: time[1], stemp: temp[0], etemp: temp[1],
            editable: false
          }
          this.curveData[0].push(newStage)
        }
        for(let item in wetCurve){
          let time = item.split('-')
          let temp = wetCurve[item].split('-')
          let newStage = {
            stime: time[0], etime: time[1], stemp: temp[0], etemp: temp[1],
            editable: false
          }
          this.curveData[1].push(newStage)
        }
        this.dwId = [dryId, wetId]
        this.newKindName = this.kindValue
        this.hasSearch = true
        this.showChange = null
        setTimeout(() => {
          this.showChange = true
        }, 50);
      },
      requestLineData(rdata) {
        searchLine(rdata).then(res => {
          console.log('searchLine', res)
          if(res.code === 200){
            this.wholeData = this.solveResponse(res.data)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      solveResponse(data) {
        let arr = [].concat(data)
        arr = this.groupLine(arr)
        console.log(arr)
        for(let line in arr){
          let temp = { value: '', label: '' }
          temp.label = line
          temp.value = line
          this.kindOptions.push(temp)
        }
        return arr
      },
      groupLine(arr) {
        return arr.reduce((pre, current, index) => {
          pre[current.kind] = pre[current.kind] || [];
          pre[current.kind].push(current)
          return pre
        }, {})
      },
      checkStage(index, rows) {
        let result = true
        let text = []
        if(rows[index].etime < rows[index].stime){
          result = false
          text.push('当前阶段的结束时间不能小于开始时间;')
        }
        if(rows[index].etemp < rows[index].stemp){
          result = false
          text.push('当前阶段的结束温度不能小于开始温度;')
        }
        if(index > 0){
          if(rows[index].stime < rows[index-1].etime){
            result = false
            text.push('当前阶段的开始时间不能小于前一阶段的结束时间;')
          }
          if(rows[index].stemp < rows[index-1].etemp){
            result = false
            text.push('当前阶段的开始温度不能小于前一阶段的结束温度;')
          }
        }
        if(index !== rows.length - 1){
          if(rows[index].etime > rows[index+1].stime){
            result = false
            text.push('当前阶段的结束时间不能大于后一阶段的开始时间;')
          }
          if(rows[index].etemp > rows[index+1].stemp){
            result = false
            text.push('当前阶段的结束温度不能大于后一阶段的开始温度;')
          }
        }
        if(result){
          rows[index].editable = false
        }
        else{
          text = text.join('<br/>')
          this.$message({
            dangerouslyUseHTMLString: true,
            message: text,
            type: 'error'
          })
        }
      },
    }
  }
</script>

<style>
  .line-model{
    padding: 1.25rem;
  }
  .line-model-search-row{
    padding-bottom: 1.25rem;
    padding-left: 0.625rem;
  }
  .line-model-button-row{
    padding-bottom: 1.25rem;
  }
</style>
