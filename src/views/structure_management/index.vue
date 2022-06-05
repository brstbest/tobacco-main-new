<template>
  <div class="structure-management">
    <el-row class="structure-management-body" :gutter="20">
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="structure-management-tree-col">
        <LocationTreeComp @watchLocation="recieveLocation"></LocationTreeComp>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="20" :xl="20" class="structure-management-table-col" v-loading="loading">
        <StationManagementComp v-if="locationData.level === 'county'" :location-msg="locationData.id"></StationManagementComp>
        <GroupManagementComp v-if="locationData.level === 'station'" :station-msg="locationData.id"></GroupManagementComp>
        <DeviceManagementComp v-if="locationData.level === 'group'" :group-msg="locationData.id"></DeviceManagementComp>
        <el-row v-else-if="locationData.level === 'province' || locationData.level === 'city'" class="structure-management-table-empty" type="flex" justify="center" align="middle">
          请选择县级单位进行组织架构管理
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import LocationTreeComp from '/src/components/LocationTreeComp'
  import StationManagementComp from './components/StationManagementComp'
  import GroupManagementComp from './components/GroupManagementComp'
  import DeviceManagementComp from './components/DeviceManagementComp'

  import { getRequestDataOnPermission } from '/src/utils/auth.js'
  import { searchDevice, searchBakingDevice } from '@/api/device'
  import postcodeJSON from '/public/static/map/postcode.json'

  export default{
    name: 'StructureManagement',
    components: {
      LocationTreeComp,
      StationManagementComp,
      GroupManagementComp,
      DeviceManagementComp,
    },
    data() {
      return {
        postcodeJSON,
        fetchFlag: true,
        selectedLocation: {},
        loading: false,
        locationData: {},
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        if(sessionStorage.getItem('defaultSelected')){
          this.fetchFlag = false
          return
        }
        let rdata = getRequestDataOnPermission()
        switch(rdata.category) {
          case '0':
            this.locationData = { level: 'province', id: rdata.province }
            break
          case '1':
            this.locationData = { level: 'city', id: rdata.parent_location }
            break
          case '2':
            this.locationData = { level: 'county', id: rdata.location }
            break
          case '3':
            this.locationData = { level: 'station', id: rdata.station_id }
            break
          case '4':
            this.locationData = { level: 'group', id: rdata.group_id }
            break
          case '5':
            this.locationData = { level: 'device', id: rdata.device_id }
            break
        }
        this.fetchFlag = false
      },
      recieveLocation(data) {
        if(this.selectedLocation === data.id || this.fetchFlag){
          return
        }
        this.selectedLocation = data.id
        this.loading = true
        console.log('location', data)
        this.locationData = {}
        setTimeout(() =>{
          this.locationData = data
          this.loading = false
        }, 500)
      }
    }
  }
</script>

<style>
  .structure-management{
    height: 56.5625rem;
  }
  .structure-management-body, .structure-management-tree-col{
    height: 100%
  }
  .structure-management-tree-col{
    border-right: 1px solid lightgray;
  }
  .structure-management-table-col{
    height: 100%;
  }
  .structure-management-table-empty{
    height: 100%;
    font-size: 3.125rem;
    font-weight: bold;
    color: #DCDFE6;
  }
</style>
