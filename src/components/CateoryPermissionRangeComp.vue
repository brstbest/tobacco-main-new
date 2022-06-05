<template>
  <div class="cpr-comp" style="width: 100%;">
    <el-cascader v-model="ids" :options="options" :props="props" @change="cascaderChange" style="width: 100%;" clearable placeholder="请选择单位"></el-cascader>
  </div>
</template>

<script>
  import optionJSON from '/public/static/map/postcodeOption.json'
  import { searchStation } from '@/api/station'
  import { searchGroup } from '@/api/group'
  import { searchDevice } from '@/api/device'

  import { getRequestDataOnPermission } from '/src/utils/auth.js'

  import emitter from 'element-ui/src/mixins/emitter';

  export default{
    name: 'CateoryPermissionRangeComp',
    components: {

    },
    data() {
      return {
        optionJSON,
        options: [],
        ids: [],
        props: {
          lazy: true,
          lazyLoad: this.lazyLoadFunc,
          checkStrictly: true,
          value: 'id',
          label: 'label',
          children: 'children',
          leaf: 'leaf',
          disabled: 'disabled',
        }
      }
    },
    created() {
    },
    mounted() {
      this.fetchData()

    },
    mixins:[emitter],
    model: {
      prop: 'value',
      event: 'custom',
    },
    watch: {
      ids(val) {
        // this.dispatch('ElFormItem', 'el.form.change', [val])
      }
    },
    methods: {
      fetchData() {
        this.getOptions(0)
      },
      cascaderChange(val) {
        this.$emit('watchUnit', {ids: val})
      },
      async getOptions(x) {
        let user = {}
        if(x === 0){
          user = getRequestDataOnPermission()
        }
        // switch(x){
        //   case 1:
        //     user.category = '1'
        //     user.parent_location = '650000'
        //     break
        //   case 2:
        //     user.category = '2'
        //     user.location = '650200'
        //     break
        //   case 3:
        //     user.category = '3'
        //     user.station_id = '650201'
        //     break
        //   case 4:
        //     user.category = '4'
        //     user.group_id = '65020101'
        //     break
        //   case 5:
        //     user.category = '5'
        //     user.device_id = '6502010101'
        //     break
        // }

        // 省-州
        if(user.category === '0' || user.category === '1' || user.category === '2'){
          this.optionJSON.forEach(province => {
            if(user.category === '0'){
              this.options = province.children
              return
            }
            province.children.forEach(city => {
              if(user.category === '1' && user.parent_location === city.id) {
                this.options = city.children
                return
              }
            })
          })
        }
        // 县-烟站-烤房群-烤房
        let rdata = {
          data: {
            id: null
          }
        }
        switch(user.category) {
          case '2':
            rdata.data.id = user.location
            this.options = await this.requestStation(rdata, 1)
            return
          case '3':
            rdata.data.id = user.station_id
            this.options = await this.requestGroup(rdata, 1)
            return
          case '4':
            rdata.data.id = user.group_id
            this.options = await this.requestBakery(rdata, 1)
            return
          case '5':
            this.options = []
            return
        }
      },
      async lazyLoadFunc(node, resolve) {
        console.log('loadNode', node)
        if('root' in node){
          return
        }
        // 点击省懒加载
        if(node.data.level === 'province'){
          return resolve(node.data.children)
        }
        // 点击州懒加载
        if(node.data.level === 'city'){
          return resolve(node.data.children)
        }
        // 点击县懒加载
        if(node.data.level === 'county'){
          let data = await this.requestStation(node, 1)
          console.log('node', data)
          return resolve(data)
        }
        // 点击烟站懒加载
        if(node.data.level === 'station'){
          let data = await this.requestGroup(node, 1)
          console.log('node', data)
          return resolve(data)
        }
        // 点击烤房群懒加载
        if(node.data.level === 'group'){
          let data = await this.requestBakery(node, 1)
          console.log('node', data)
          return resolve(data)
        }
        // 点击烤房懒加载
        if(node.data.level === 'device'){
          return resolve([])
        }
      },
      async requestStation(node, from) {
        let rdata = {}
        if(from === 0) {
          rdata.station_id = node.data.id
        }
        else{
          rdata.location = node.data.id
        }
        let res = await searchStation(rdata)
        let result = []
        if(res.code === 200) {
          res.data.forEach(data => {
            result.push({id: data.station_id, label: data.station_name, data: data, level: 'station'})
          })
        }
        else {
          console.log(res)
        }
        return result
      },
      async requestGroup(node, from) {
        let rdata = {}
        if(from === 0) {
          rdata.group_id = node.data.id
        }
        else{
          rdata.station_id = node.data.id
        }
        let res = await searchGroup(rdata)
        let result = []
        if(res.code === 200) {
          res.data.forEach(data => {
            result.push({id: data.group_id, label: data.group_name, data: data, level: 'group'})
          })
        }
        else {
          console.log(res)
        }
        return result
      },
      async requestBakery(node, from) {
        let rdata = {}
        if(from === 0) {
          rdata.device_id = node.data.id
        }
        else{
          rdata.group_id = node.data.id
        }
        let res = await searchDevice(rdata)
        let result = []
        if(res.code === 200) {
          res.data.forEach(data => {
            result.push({id: data.device_id, label: data.device_name, data: data, level: 'device', leaf: true})
          })
        }
        else {
          console.log(res)
        }
        return result
      }
    }
  }
</script>

<style>
</style>
