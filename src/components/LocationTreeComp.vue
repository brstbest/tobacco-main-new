<template>
  <div class="location-tree-comp">
<!--    <el-input
      placeholder="输入单位所在地搜索"
      v-model="filterText"
      size="small"
      style="padding-bottom: 0.625rem;">
    </el-input> -->
<!--    各级用户模拟：
    <el-button type="primary" plain size="mini" @click="getOptions(0)">省</el-button>
    <el-button type="primary" plain size="mini" @click="getOptions(1)">州</el-button>
    <el-button type="primary" plain size="mini" @click="getOptions(2)">县</el-button>
    <el-button type="primary" plain size="mini" @click="getOptions(3)">烟站</el-button>
    <el-button type="primary" plain size="mini" @click="getOptions(4)">烤房群</el-button>
    <el-button type="primary" plain size="mini" @click="getOptions(5)">烤房</el-button> -->
    <el-tree
      class="filter-tree"
      :filter-node-method="filterNode"
      ref="locationTree"
      :highlight-current="true"
      :data="options"
      :props="props"
      :load="loadNode"
      lazy
      @node-click="nodeClick"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse">
    </el-tree>
  </div>
</template>

<script>
  import optionJSON from '/public/static/map/postcodeOption.json'
  import { searchStation } from '@/api/station'
  import { searchGroup } from '@/api/group'
  import { searchDevice } from '@/api/device'

  import { getRequestDataOnPermission } from '/src/utils/auth.js'

  export default {
    data() {
      return {
        optionJSON,
        filterText: '',
        options: [],
        defaultExpandedKeys: [],
        defaultSelectNode: null,
        clickTreeLog: [],
        props: {
          id: 'id',
          label: 'label',
          children: 'children',
          isLeaf: 'leaf'
        },
      };
    },
    created() {
    },
    mounted() {
      this.fetchData()
      // window.addEventListener("beforeunload", e => this.saveSession())
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      clickTreeLog(val) {
        // console.log(JSON.stringify(val))
        this.saveSession()
      }
    },
    methods: {
      fetchData() {
        this.getOptions(0)

        console.log(sessionStorage.getItem("defaultExpanded"))
        console.log(sessionStorage.getItem("defaultSelected"))
        if(sessionStorage.getItem("defaultExpanded") !== null && sessionStorage.getItem("defaultSelected") !== null){
          this.clickTreeLog = JSON.parse(sessionStorage.getItem("defaultExpanded"))
          this.clickTreeLog.forEach(node => {
            this.defaultExpandedKeys.push(node.key)
          })
          this.defaultSelectNode = JSON.parse(sessionStorage.getItem("defaultSelected"))
          this.$nextTick(function(){
              this.$refs.locationTree.setCurrentKey(this.defaultSelectNode.id);
          })
          this.$emit('watchLocation', {id: this.defaultSelectNode.id, level: this.defaultSelectNode.level})
        }
      },
      async getOptions(x) {
        let user = {}
        if(x === 0){
          user = getRequestDataOnPermission()
        }
        switch(x){
          case 1:
            user.category = '1'
            user.parent_location = '650000'
            break
          case 2:
            user.category = '2'
            user.location = '650200'
            break
          case 3:
            user.category = '3'
            user.station_id = '650201'
            break
          case 4:
            user.category = '4'
            user.group_id = '65020101'
            break
          case 5:
            user.category = '5'
            user.device_id = '6502010101'
            break
        }
        // let user = {
        //   category: '5',
        //   device_id: '6502010101'
        // }

        // 上三级
        if(user.category === '0' || user.category === '1' || user.category === '2'){
          this.optionJSON.forEach(province => {
            if(user.category === '0'){
              this.options = [province]
              return
            }
            province.children.forEach(city => {
              if(user.category === '1' && user.parent_location === city.id) {
                this.options = [city]
                return
              }
              city.children.forEach(county => {
                if(user.category === '2' && user.location === county.id) {
                  this.options = [county]
                  return
                }
              })
            })
          })
        }
        // 下三级
        let rdata = {
          data: {
            id: null
          }
        }
        switch(user.category) {
          case '3':
            rdata.data.id = user.station_id
            this.options = await this.requestStation(rdata, 0)
            return
          case '4':
            rdata.data.id = user.group_id
            this.options = await this.requestGroup(rdata, 0)
            return
          case '5':
            rdata.data.id = user.device_id
            this.options = await this.requestBakery(rdata, 0)
            return
        }
      },
      saveSession(){
        sessionStorage.setItem("defaultExpanded", JSON.stringify(this.clickTreeLog))
        sessionStorage.setItem("defaultSelected", JSON.stringify(this.defaultSelectNode))
      },
      nodeClick(data, node, comp){
        this.$emit('watchLocation', {id: data.id, level: node.data.level})
        if(node.data.level === 'device'){
          sessionStorage.setItem("device", JSON.stringify(node.data.data))
          this.$router.push({name:'BakeryDetail'})
        }
        console.log(data, node, comp)
      },
      handleNodeExpand(data, node, comp){
        this.defaultSelectNode = {id: node.key, level: node.data.level}
        let pushFlag = true
        this.clickTreeLog.forEach(item => {
          if(item.key === node.key) {
            pushFlag = false
            return true
          }
        })
        if(pushFlag) {
          this.clickTreeLog.push({parent_key: node.parent.key, key: node.key})
        }
      },
      handleNodeCollapse(data, node, comp){
        let temp = []
        this.defaultSelectNode = {id: node.key, level: node.data.level}
        for(let i=0; i<this.clickTreeLog.length; i++){
          if(this.clickTreeLog[i].key === node.key){
            this.clickTreeLog.splice(i, 1)
            i -= 1
          }
          else if(this.clickTreeLog[i].parent_key === node.key){
            temp.push(this.clickTreeLog[i].key)
            this.clickTreeLog.splice(i, 1)
            i -= 1
          }
          else if(temp.indexOf(this.clickTreeLog[i].parent_key) != -1){
            temp.push(this.clickTreeLog[i].key)
            this.clickTreeLog.splice(i, 1)
            i -=1
          }
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      async loadNode(node, resolve) {
        console.log('loadNode', node)
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
  };
</script>

<style>
  .location-tree-comp{
    padding: 0.625rem;
  }
  .filter-tree{
    height: 56.25rem;
    overflow-y: auto;
  }
</style>
