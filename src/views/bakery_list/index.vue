<template>
  <div class="bakery-list">
    <el-row class="bakery-list-body" :gutter="20">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="bakery-list-tree-col">
        <LocationTreeComp @watchLocation="recieveLocation"></LocationTreeComp>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="bakery-list-table-col">
        <el-row class="bakery-list-filter-row">
          <span class="bakery-list-filter-row-label">筛选:</span>
          <el-input v-model="filterText" class="bakery-list-filter-row-input" :size="size" placeholder="输入烤房编号/烤房名称"></el-input>
          <el-select v-model="filterValue"  clearable placeholder="请选择烤房状态" :size="size">
            <el-option :key="0" label="运行" :value="0"></el-option>
            <el-option :key="1" label="待机" :value="1"></el-option>
          </el-select>
        </el-row>
        <el-row class="bakery-list-table-row" v-loading="loading">
          <el-table
            :data="filterTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            :size="size"
            stripe>
            <template v-for="(item, index) in columns">
              <el-table-column
              :prop="item.key"
              :label="item.label"
              :key="index"
              align="center">
                <template v-if="item.key !== 'device_name' && item.key !== 'device_id'" v-slot="scope">
                  <div v-if="item.key === 'parent_location'">{{ postcodeJSON[scope.row.parent_location] }}</div>
                  <div v-if="item.key === 'location'">{{ postcodeJSON[scope.row.location] }}</div>
                  <el-tag v-if="item.key === 'state'" :type="tagTypeMapping[scope.row[item.key]]">{{ tagMapping[scope.row[item.key]] }}</el-tag>
                  <el-button v-if="item.key === 'operate'" type="primary" plain size="mini" @click="switchClick(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-row>

        <el-row class="bakery-list-pagination-row" type="flex" justify="center">
          <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="total">
          </el-pagination>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>

  import LocationComp from '/src/components/LocationComp'
  import LocationTreeComp from '/src/components/LocationTreeComp'
  import BakeryDetail from './components/detail'

  import { searchDevice, searchBakingDevice } from '@/api/device'
  import postcodeJSON from '/public/static/map/postcode.json'

  export default{
    name: 'BakeryList',
    components: {
      LocationComp,
      BakeryDetail,
      LocationTreeComp
    },
    data() {
      return {
        postcodeJSON,
        loading: false,
        filterText: '',
        filterValue: '',
        size: 'small',
        dataLoading: true,
        pageSize: 15,
        currentPage: 1,
        total: 0,
        detailVisble: false,
        selectRow: {},
        locationData: {id: '', level: -1},
        columns: [
          { key: 'device_id', label: '烤房编号' },
          { key: 'device_name', label: '烤房名称' },
          { key: 'parent_location', label: '所在州市' },
          { key: 'location', label: '所在县市' },
          { key: 'state', label: '烤房状态' },
          { key: 'operate', label: '操作' },
        ],
        tableData: [],
        filterTableData: [],
        tagMapping: ["运行", "待机"],
        tagTypeMapping: ["success", "info"],
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      filterText(val) {
        this.filterTable()
      },
      filterValue(val) {
        this.filterTable()
      }
    },
    methods: {
      async fetchData() {
        let rdata = {}
        await this.requestBakery(rdata)
      },
      async requestBakery(rdata) {
        let res = await searchDevice(rdata)
        if(res.code === 200 ){
          this.handleCurrentChange(1)
          this.tableData = res.data
          for(let i=0; i<this.tableData.length; i++){
            this.tableData[i].state = 1
          }
        }
        let tres = await searchBakingDevice(rdata)
        if(tres.code === 200){
          tres.data.forEach(data => {
            for(let i=0; i<this.tableData.length; i++){
              if(this.tableData[i].device_id === data.device_id){
                this.tableData[i].state = 0
              }
            }
          })
          this.filterTableData = [].concat(this.tableData)
          this.total = this.filterTableData.length
          this.loading = false
        }
      },
      switchClick(row) {
        sessionStorage.setItem("device", JSON.stringify(row))
        this.$router.push({name:'BakeryDetail'})
        // this.$store.dispatch('device/setDevice', row).then(() => {
        //   this.$router.push({name:'BakeryDetail'})
        // })
        // this.$router.push({name:'BakeryDetail', params: null})
      },
      detailClick(row) {
        this.selectRow = row
        console.log(this.selectRow)
        this.detailVisble = true
      },
      parentRecieve(data) {
        console.log('parentRecieve')
        this.detailVisble = false
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      filterTable(){
        this.filterTableData = this.tableData.filter(data => data.device_id.includes(this.filterText) || data.device_name.includes(this.filterText))
        if(this.filterValue !== ''){
          this.filterTableData = this.filterTableData.filter(data => data.state === this.filterValue)
        }
        this.total = this.filterTableData.length
        this.currentPage = 1
      },
      recieveLocation(data){
        if(this.locationData.id !== data.id || this.locationData.level !== data.level){
          this.locationData = data
          let rdata = {}
          switch(data.level) {
            case 'province':
              rdata = {}
              break
            case 'city':
              rdata = {parent_location: data.id}
              break
            case 'county':
              rdata = {location: data.id}
              break
            case 'station':
              rdata = {station_id: data.id}
              break
            case 'group':
              rdata = {group_id: data.id}
              break
          }
          this.loading = true
          setTimeout(() => {
            this.requestBakery(rdata)
          }, 100)
        }
      }
    }
  }
</script>

<style>
  .bakery-list{
    height: 56.5625rem;
  }
  .bakery-list-body, .bakery-list-tree-col{
    height: 100%
  }
  .bakery-list-tree-col{
    border-right: 1px solid lightgray;
  }
  .bakery-list-table-row{
    padding: 1.25rem;
  }
  .bakery-list-filter-row{
    padding: 0.625rem;
    padding-bottom: 0rem;
  }
  .bakery-list-filter-row-label{
    padding-right: 1.25rem;
  }
  .bakery-list-filter-row-input{
    width: 18.75rem;
    padding-right: 1.25rem;
  }
</style>
