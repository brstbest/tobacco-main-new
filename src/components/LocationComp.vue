<template>
  <el-cascader
  v-if="visible"
  style="width: 100%;"
  v-model="locations"
  :options="options"
  :props="props"
  filterable
  @change="handleCascaderChange"
  placeholder="请选择单位"
  clearable
  :disabled="disable">
  </el-cascader>
</template>

<script>
  import cityJSON from '../../public/static/map/city.json'
  import optionJSON from '../../public/static/map/postcodeOption.json'

  import { searchStation } from '@/api/station'

  export default{
    name: 'LocationComp',
    data() {
      return {
        cityJSON,
        optionJSON,
        user: {},
        disable: false,
        visible: true,
        options: [],
        props: { label:'label', value: 'id', checkStrictly: true },
        locations: [],
      }
    },
    props: ["locationsMsg"],
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.user = JSON.parse(localStorage.getItem('user'))
        // this.options = this.optionJSON

        let rdata = {}

        switch(this.user.category){
          case '1':
            rdata.parent_location = this.user.permission_range
            break
          case '2':
            rdata.location = this.user.permission_range
            break
          case '3':
            rdata.station_id = this.user.permission_range
        }
        this.requestStation(rdata)
      },
      handleCascaderChange(value) {
        // console.log('cascader', value)
        // if(value.length === 0){
        //   this.$emit('watchLocation', { parent_location: '', location: '' })
        // }
        // else{
        //   if(this.user.category === "0"){
        //     this.$emit('watchLocation', { parent_location: value[0], location: value[1] })
        //   }
        //   else if(this.user.category === "1"){
        //     this.$emit('watchLocation', { parent_location: '', location: value[0] })
        //   }
        // }
        let returnData = { province_id: value[0], parent_location: value[1], location: value[2], station_id: value[3], group_id: value[4], bakery_id: value[5] }
        console.log(returnData)
        this.$emit('watchLocation', returnData)
      },
      requestStation(rdata) {
        searchStation(rdata).then(res => {
          console.log('searchStation', res)
          if(res.code === 200){
            let groups = [
              {station_id: '657106', id: '65710601', label: '烤房群65710601'},
              {station_id: '657103', id: '65710301', label: '烤房群65710301'},
              {station_id: '657106', id: '65710602', label: '烤房群65710602'},
              {station_id: '657106', id: '65710604', label: '烤房群65710604'},
              {station_id: '657102', id: '65710201', label: '烤房群65710201'},
              {station_id: '657102', id: '65710202', label: '烤房群65710202'},
              {station_id: '657106', id: '65710603', label: '烤房群65710603'},
              {station_id: '657105', id: '65710501', label: '烤房群65710501'},
              {station_id: '657105', id: '65710502', label: '烤房群65710502'},
              {station_id: '657101', id: '65710101', label: '烤房群65710101'},
              {station_id: '657104', id: '65710401', label: '烤房群65710401'},
            ]
            let bakeries = [
              {group_id: '65710601', id: '6571060101', label: '烤房6571060101'},
              {group_id: '65710601', id: '6571060102', label: '烤房6571060102'},
              {group_id: '65710602', id: '6571060201', label: '烤房6571060201'},
              {group_id: '65710604', id: '6571060401', label: '烤房6571060401'},
              {group_id: '65710201', id: '6571020101', label: '烤房6571020101'},
              {group_id: '65710202', id: '6571020201', label: '烤房6571020201'},
              {group_id: '65710603', id: '6571060301', label: '烤房6571060301'},
              {group_id: '65710501', id: '6571050101', label: '烤房6571050101'},
              {group_id: '65710502', id: '6571050201', label: '烤房6571050201'},
              {group_id: '65710101', id: '6571010101', label: '烤房6571010101'},
              {group_id: '65710401', id: '6571040101', label: '烤房6571040101'},
            ]
            this.options = this.solveResponse(res.data, groups, bakeries)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      solveResponse(stations, groups, bakeries) {
        let temp_options = this.optionJSON
        // 分别按父级分组
        stations = this.groupStations(stations)
        groups = this.groupGroups(groups)
        bakeries = this.groupBakeries(bakeries)
        // 绑定烤房和烤房群
        for(let b_parent in bakeries){
          for(let g_parent in groups){
            for(let p=0; p<groups[g_parent].length; p++){
              if(groups[g_parent][p].id !== b_parent){
                continue
              }
              groups[g_parent][p].children = bakeries[b_parent]
            }
          }
        }
        // 绑定烤房群和烟站
        for(let g_parent in groups){
          for(let s_parent in stations){
            for(let q=0; q<stations[s_parent].length; q++){
              if(stations[s_parent][q].id !== g_parent){
                continue
              }
              stations[s_parent][q].children = groups[g_parent]
            }
          }
        }
        // 绑定烟站和省州县
        for(let s_location in stations){
          for(let i=0; i<temp_options.length; i++){
            for(let j=0; j<temp_options[i].children.length; j++){
              for(let k=0; k<temp_options[i].children[j].children.length; k++){
                if(temp_options[i].children[j].children[k].id !== s_location){
                  continue
                }
                temp_options[i].children[j].children[k].children = stations[s_location]
              }
            }
          }
        }
        // if(this.user.category === '0'){
        //   this.options = this.options["6500001"].children
        // }
        // else if(this.user.category === '1'){
        //   this.options = this.optionJSON.province["6500001"].children[this.user.permission_range].children
        //   //this.options = this.optionJSON.city[this.user.permission_range].children
        // }
        // else if(this.user.category === '2'){
        //   this.disable = true
        // }
        // else if(this.user.category === '3'){
        //   this.disable = true
        // }
        // else if(this.user.category === '4'){
        //   this.disable = true
        // }
        // else if(this.user.category === '5'){
        //   this.disable = true
        // }
        // this.locations = this.locationsMsg
        return temp_options
      },
      groupStations(arr) {
        return arr.reduce((pre, current, index) => {
          pre[current.location] = pre[current.location] || [];
          pre[current.location].push({ id: current.station_id, label: current.station_name, children: [] })
          return pre
        }, {})
      },
      groupGroups(arr) {
        return arr.reduce((pre, current, index) => {
          pre[current.station_id] = pre[current.station_id] || [];
          pre[current.station_id].push({ id: current.id, label: current.label, children: [] })
          return pre
        }, {})
      },
      groupBakeries(arr) {
        return arr.reduce((pre, current, index) => {
          pre[current.group_id] = pre[current.group_id] || [];
          pre[current.group_id].push({ id: current.id, label: current.label })
          return pre
        }, {})
      }
    },
  }
</script>

<style>
</style>
