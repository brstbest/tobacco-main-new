<template>
  <div class="mdata" v-loading="tableLoading">
    <el-row class="mdata-search-row" :gutter="20">
      <el-col :span="12">
        <el-input v-model="search_text" placeholder="请输入" @change="searchChange"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-row class="mdata-export-row">
      <div>
        <FilenameOption v-model="filename" />
        <BookTypeOption v-model="bookType" />
        <el-button
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="el-icon-document"
          @click="exportExcel"
        >
          导出Excel
        </el-button>
      </div>
    </el-row>
    <el-row class="mdata-table-row">
      <el-table
      :data="mdata_tableData"
      v-show="false"
      id="table">
        <template v-for="(item, index) in mdata_columns">
          <el-table-column
          :prop="item.key"
          :label="item.label"
          :key="index"
          :width="item.width"
          :fixed="item.key === '' ? 'right' : ''"
          :sortable="item.key === 'areacode' || item.key === 'areascore'">
          </el-table-column>
        </template>
      </el-table>
      <el-table
      :data="mdata_tableData_page">
        <template v-for="(item, index) in mdata_columns">
          <el-table-column
          :prop="item.key"
          :label="item.label"
          :key="index"
          :width="item.width"
          :fixed="item.key === '' ? 'right' : ''"
          :sortable="item.key === 'areacode' || item.key === 'areascore'">
            <template v-if="item.key === 'province' || item.key === 'city' || item.key === 'county' " v-slot="scope">
              <div v-if="item.key === 'province'">{{ postcodeJSON[scope.row.province] }}</div>
              <div v-if="item.key === 'city'">{{ postcodeJSON[scope.row.city] }}</div>
              <div v-if="item.key === 'county'">{{ postcodeJSON[scope.row.county] }}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row>
    <el-row class="mdata_pagination_row" type="flex" justify="center">
      <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import FilenameOption from '@/components/ExportExcel/FilenameOption'
  import BookTypeOption from '@/components/ExportExcel/BookTypeOption'
  import { getMapData } from '@/api/home'
  import { dataMRequest } from '@/api/account'
  import postcodeJSON from '../../../public/static/map/postcode.json'

  export default{
    name: 'MData',
    components: {
      FilenameOption,
      BookTypeOption
    },
    data() {
      return {
        postcodeJSON,
        tableLoading: false,
        search_text: "",
        pageSize: 12,
        currentPage: 1,
        total: 0,
        mdata_tableData: [],
        mdata_tableData_filter: [],
        mdata_tableData_page: [],
        mdata_columns: [
          {key: 'areacode', label: '区域编码', width: '100'},
          {key: 'province', label: '省级', width: ''},
          {key: 'city', label: '市级', width: ''},
          {key: 'county', label: '县级', width: ''},
          {key: 'device_num', label: '设备数量', width: '100'},
          {key: 'areascore', label: '区域评分', width: ''},
        ]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(p) {
        this.tableLoading = true
        let params = {
          "startTime": '1321312',
          "endTime": '12311312'
        }
        let user = JSON.parse(localStorage.getItem('user'))
        getMapData(params).then(response => {
          console.log('getMapData', response)
          let data = [response.data]
          // let data = [JSON.parse(response.data)]
          // data.forEach(province => {
          //   province.children.forEach(city => {
          //     city.children.forEach(county => {
          //       this.mdata_tableData.push({
          //         areacode: county.location,
          //         province: province.name,
          //         city: city.name,
          //         county: county.name,
          //         principle: '----',
          //         contact: '----',
          //         device_num: county.total,
          //         areascore: Math.floor(Math.random() * 51 + 50)
          //       })
          //     })
          //   })
          // })
          for(const province of data){
            if(user.category === '0'){
              if(user.permission_range !== province.location){
                // continue
              }
            }
            for(const city of province.children){
              if(user.category === '1'){
                if(user.permission_range !== city.location){
                  continue
                }
              }
              for(const county of city.children){
                if(user.category === '2'){
                  if(user.permission_range !== county.location){
                    continue
                  }
                }
                this.mdata_tableData.push({
                  areacode: county.location,
                  province: province.location,
                  city: city.location,
                  county: county.location,
                  principle: '----',
                  contact: '----',
                  device_num: county.total,
                  areascore: Math.floor(Math.random() * 51 + 50)
                })
              }
            }
          }
          this.total = this.mdata_tableData.length
          this.tableLoading = false
          this.mdata_tableData_filter = this.mdata_tableData
          this.mdata_tableData_page = this.mdata_tableData.slice(0, this.pageSize)
        })
      },
      exportExcel() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          excel.exportExcel({
            documentId: '#table',
            filename: this.filename,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      searchChange(){
        console.log('search')
        this.currentPage = 1
        let search_text = this.search_text
        this.mdata_tableData_filter = this.mdata_tableData.filter(data => !search_text || data.areacode.includes(search_text) || data.province.includes(search_text) || data.city.includes(search_text)|| data.county.includes(search_text)|| data.principle.includes(search_text))
        this.mdata_tableData_page = this.mdata_tableData_filter.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
        this.total = this.mdata_tableData_filter.length
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.mdata_tableData_page = this.mdata_tableData_filter.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
      }
    }
  }
</script>

<style>
  .mdata-search-row, .mdata-table-row, .mdata_pagination_row, .mdata-export-row{
    padding: 20px;
    padding-bottom: 0px;
  }
</style>
