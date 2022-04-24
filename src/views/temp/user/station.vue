<template>
  <div class="user-station" v-loading="dataLoading">
    <el-row class="user-station-search-row" :gutter="20">
      <el-col class="user-station-search-row-item" :span="5">
        <LocationComp @watchLocation="setLocation"></LocationComp>
      </el-col>
      <el-col class="user-station-search-row-item" :span="5">
        <el-input v-model="searchStationId" placeholder="输入烟站ID"></el-input>
      </el-col>
      <el-col class="user-station-search-row-item" :span="5">
        <el-input v-model="searchStationName" placeholder="输入烟站名"></el-input>
      </el-col>
      <el-col class="user-station-search-row-item" :span="5">
        <el-input v-model="searchAddress" placeholder="输入地址"></el-input>
      </el-col>
      <el-col class="user-station-search-row-item" :span="2">
        <el-button type="primary" @click="searchClick">查询</el-button>
      </el-col>
      <el-col class="user-station-search-row-item" :span="2">
        <el-button type="info" plain @click="fetchData">全部</el-button>
      </el-col>
    </el-row>
    <el-row class="user-station-tool-row">
      <el-button type="success" @click="addClick" icon="el-icon-plus">新增烟站</el-button>
    </el-row>
    <el-row class="user-station-table-row">
      <el-table :data="stationData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <template v-for="(item, index) in columns">
          <el-table-column
          :prop="item.key"
          :label="item.label"
          :key="index"
          :width="item.width"
          :fixed="item.key === 'operate' ? 'right' : ''">
            <template v-if="item.key === 'operate' || item.key === 'location' || item.key === 'parent_location'" v-slot="scope">
              <div v-if="item.key === 'location'">{{ postcodeJSON[scope.row.location] }}</div>
              <div v-if="item.key === 'parent_location'">{{ postcodeJSON[scope.row.parent_location] }}</div>
              <el-button v-if="item.key === 'operate'" type="warning" size="mini" @click="editClick(scope.row)">修改</el-button>
              <el-popconfirm v-if="item.key === 'operate'" title="是否确定删除该烟站" @confirm="deleteClick(scope.row)">
                <el-button v-if="item.key === 'operate'" type="danger" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row>
    <el-row class="user-station-pagination-row" type="flex" justify="center">
      <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </el-row>

    <el-dialog
    :visible.sync="editVisible"
    v-if="editVisible"
    :destroy-on-close='true'
    title="修改烟站">
      <EditStation @watchChild="parentReceive" :row-msg="editRow"></EditStation>
    </el-dialog>

  </div>
</template>

<script>
  import LocationComp from '../../components/LocationComp'
  import postcodeJSON from '../../../public/static/map/postcode.json'
  import EditStation from './components/EditStation'

  import { searchStation, deleteStation } from '@/api/station'

  export default{
    name: 'UserStation',
    components: {
      LocationComp,
      EditStation,
      deleteStation
    },
    data() {
      return {
        postcodeJSON,
        dataLoading: true,
        pageSize: 12,
        currentPage: 1,
        total: 0,
        editVisible: false,
        searchStationId: '',
        searchStationName: '',
        searchAddress: '',
        searchLocation: '',
        searchParentLocation: '',
        editRow: {},
        stationData: [],
        columns: [
          { key: 'station_id', label: '烟站ID', width: '' },
          { key: 'station_name', label: '烟站名', width: '' },
          { key: 'parent_location', label: '市', width: '' },
          { key: 'location', label: '县', width: '' },
          { key: 'address', label: '地址', width: '' },
          { key: 'operate', label: '操作', width: '150' },
        ],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let rdata = {}
        let user = JSON.parse(localStorage.getItem('user'))
        switch(user.category){
          case '1':
            rdata.parent_location = user.permission_range
            break
          case '2':
            rdata.location = user.permission_range
            break
          case '3':
            rdata.station_id = user.permission_range
        }
        this.dataLoading = true
        this.requestStation(rdata)
      },
      searchClick(){
        let rdata = {}
        let flag = true
        if(this.searchAddress !== ''){
          rdata.address = this.searchAddress
          flag = false
        }
        if(this.searchLocation !== ''){
          rdata.location = this.searchLocation
          flag = false
        }
        if(this.searchParentLocation !== ''){
          rdata.parent_location = this.searchParentLocation
          flag = false
        }
        if(this.searchStationId !== ''){
          rdata.station_id = this.searchStationId
          flag = false
        }
        if(this.searchStationName !== ''){
          rdata.station_name = this.searchStationName
          flag = false
        }
        if(flag){
          this.fetchData()
        }
        else{
          this.dataLoading = true
          this.requestStation(rdata)
        }
      },
      deleteClick(row) {
        let rdata = { station_id: row.station_id }
        deleteStation(rdata).then(res => {
          console.log('deleteStation', res)
          if(res.code === 200){
            this.$message({ message: '删除成功', type: 'success'})
          this.dataLoading = true
            this.searchClick()
          }
        }).catch(err => {
          this.$messge.error(err)
        })
      },
      editClick(row) {
        this.editRow = row
        this.editVisible = true
      },
      parentReceive(data) {
        this.editVisible = false
        this.addVisible = false
        this.dataLoading = true
        this.searchClick()
      },
      setLocation(data) {
        this.searchLocation = data.location
        this.searchParentLocation = data.parent_location
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      requestStation(rdata){
        searchStation(rdata).then(res => {
          console.log('searchStation', res)
          if(res.code === 200){
            this.stationData = res.data
            this.total = this.stationData.length
            this.currentPage = 1
          }
          this.dataLoading = false
        }).catch(err => {
          this.dataLoading = false
          this.$message.error(err)
        })
      }
    },
  }
</script>

<style>
  .user-station-search-row, .user-station-tool-row, .user-station-table-row, .user-station-pagination-row{
    padding: 20px;
    padding-bottom: 0rem;
  }
</style>
