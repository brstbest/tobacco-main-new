<template>
  <div class="device" v-loading="dataLoading">
    <el-row class="device-overview-row">
      <el-col :span="4" class="device-overview-row-item">
        <el-row class="device-overview-row-item-title">所有</el-row>
        <el-row class="device-overview-row-item-data">{{deviceData.length}}台</el-row>
      </el-col>
      <el-col :span="4" class="device-overview-row-item">
        <el-row class="device-overview-row-item-title">运行</el-row>
        <el-row class="device-overview-row-item-data">{{work_device_num}}台</el-row>
      </el-col>
      <el-col :span="4" class="device-overview-row-item">
        <el-row class="device-overview-row-item-title">停止</el-row>
        <el-row class="device-overview-row-item-data">{{stop_device_num}}台</el-row>
      </el-col>
      <el-col :span="4" class="device-overview-row-item">
        <el-row class="device-overview-row-item-title">设备未连接</el-row>
        <el-row class="device-overview-row-item-data">{{disconect_device_num}}台</el-row>
      </el-col>
      <el-col :span="4" class="device-overview-row-item">
        <el-row class="device-overview-row-item-title">网络未连接</el-row>
        <el-row class="device-overview-row-item-data">{{offline_device_num}}台</el-row>
      </el-col>
      <el-col :span="4" class="device-overview-row-item" style="border: 0px;">
        <el-row class="device-overview-row-item-title">异常保护</el-row>
        <el-row class="device-overview-row-item-data">{{protect_device_num}}台</el-row>
      </el-col>
    </el-row>
    <el-row class="device-list-row">
      <el-col :span="4" v-for="(item) in deviceDataInPage" :key="item.id" :offset="0" style="padding: 20px;">
        <el-card :body-style="{ padding: '0px' }" @click.native="cardClick(item)" class="device-list-item">
          <img src="../../assets/404_images/testimg.jpg" class="image">
          <div style="padding: 14px;">
            <el-row class="device-list-item-title">{{postcodeJSON[item.location]}}:{{item.device_name}}</el-row>
            <el-row class="device-list-item-info">
              <el-col :span="12">
                <el-row class="device-list-item-info-title">干球温度</el-row>
                <el-row class="device-list-item-info-data">{{item.dryBallTemp}}℃</el-row>
              </el-col>
              <el-col :span="12">
                <el-row class="device-list-item-info-title">湿球温度</el-row>
                <el-row class="device-list-item-info-data">{{item.wetBallTemp}}℃</el-row>
              </el-col>
            </el-row>
            <el-row class="device-list-item-info">
              <el-col :span="12">
                <el-row class="device-list-item-info-title">干球目标</el-row>
                <el-row class="device-list-item-info-data">{{item.dryBallTarget}}℃</el-row>
              </el-col>
              <el-col :span="12">
                <el-row class="device-list-item-info-title">湿球目标</el-row>
                <el-row class="device-list-item-info-data">{{item.wetBallTarget}}℃</el-row>
              </el-col>
            </el-row>
<!--            <el-row>
              <el-button type="primary" style="width: 100%;">动作触发</el-button>
            </el-row> -->
          </div class="device-list-item-button">
        </el-card>
      </el-col>
    </el-row>
    <el-row class="device_pagination_row" type="flex" justify="center">
      <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="deviceData.length">
      </el-pagination>
    </el-row>

    <el-drawer
    title="设备详细信息"
    v-if="deviceDetailVisible"
    :visible.sync="deviceDetailVisible"
    :destroy-on-close='true'
    size="90%">
      <DeviceDetail :device-msg="selectDevice"></DeviceDetail>
    </el-drawer>

  </div>
</template>

<script>

  import CreateAccount from '../account/components/createAccount.vue'
  import DeviceDetail from './components/detail'
  import postcodeJSON from '../../../public/static/map/postcode.json'
  import { dataAccountRequest } from '@/api/account'
  import { dataMonitoringRequest } from '@/api/home'
  import { searchDevice } from '@/api/device'

  export default{
    name: 'Device',
    components: {
      DeviceDetail,
    },
    data() {
      return {
        postcodeJSON,
        dataLoading: false,
        pageSize: 12,
        currentPage: 1,
        device_num: 2,
        work_device_num: 0,
        stop_device_num: 0,
        disconect_device_num: 0,
        offline_device_num: 0,
        protect_device_num: 0,
        deviceDetailVisible: false,
        selectDevice: {},
        deviceData: [],
        deviceDataInPage: [],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      initDeviceData(index, hdata){
        if(hdata.length === 0){
          return
        }
        hdata.sort(function (x, y) {
          let date_x = new Date(x.produce_date)
          let date_y = new Date(y.produce_date)
          return date_y - date_x
        })
        this.deviceDataInPage[index].dryBallTemp = hdata[0].dryBallTemp
        this.deviceDataInPage[index].wetBallTemp = hdata[0].wetBallTemp
        this.deviceDataInPage[index].dryBallTarget = hdata[0].dryBallTarget
        this.deviceDataInPage[index].wetBallTarget = hdata[0].wetBallTarget
        this.deviceDataInPage[index].produce_date = hdata[0].produce_date
        this.deviceDataInPage[index].history = hdata
      },
      fetchData(p) {
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
        searchDevice(rdata).then(res => {
          console.log('searchDevice', res)
          if(res.code === 200){
            this.deviceData = res.data
            this.deviceDataInPage = this.deviceData.slice(0, this.pageSize)
            this.searchDetailInPage()
          }
        }).catch(err => {
          this.$message.error(err)
        })

        // dataMonitoringRequest(params).then(response => {
        //   this.deviceData = response.data
        //   this.initDeviceData()
        //   this.deviceDataInPage = this.deviceData.slice(0, this.pageSize)
        //   this.dataLoading = false
        // })
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.deviceDataInPage = this.deviceData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
        this.dataLoading = true
        this.searchDetailInPage()
      },
      cardClick(item){
        this.selectDevice = item
        this.deviceDetailVisible = true
      },
      searchDetailInPage(){
        for(let i=0; i<this.deviceDataInPage.length; i++){
          let cdata = { device_id: this.deviceDataInPage[i].device_id }
          dataMonitoringRequest(cdata).then(cres => {
            if(cres.code === 200){
              this.initDeviceData(i, cres.data)
            }
            if(i === this.deviceDataInPage.length - 1){
              this.dataLoading = false
            }
          }).catch(err => {
            this.$message.error(err)
          })
        }
      }
    }
  }
</script>

<style>
  .device-overview-row{
    padding: 10px;
    background-color: #fafafa;
    border-bottom: 2px solid #eeeeee;
    border-radius: 5px;
  }
  .device-list-row{
    padding: 20px;
    padding-bottom: 10px;
  }
  .device-overview-row-item{
    text-align: center;
    border-right: 2px solid #eeeeee;
  }
  .device-list-item:hover{
    cursor: pointer;
  }
  .device-overview-row-item-title, .device-overview-row-item-data{
    padding: 5px;
  }
  .device-overview-row-item-title{
    color: #828282;
  }
  .device-list-item-title{
    font-weight: bold;
  }
  .device-list-item-title, .device-list-item-info, .device-list-item-button{
    padding: 5px;
  }
  .device-list-item-info{
    text-align: center;
  }
  .device-list-item-info-title{
    padding: 2px;
    color: #828282;
  }
  .device-list-item-info-data{
    font-weight: bold;
  }



  .image {
    width: 100%;
    display: block;
  }

</style>
