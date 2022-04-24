<template>
  <div class="bind-comp">
    <el-row class="bind-info-row">
      <el-form :model="bindForm" size="mini" label-position="left" label-width="100px">
        <el-form-item label="烟站ID">
          <el-input v-model="stationForm.station_id"></el-input>
        </el-form-item>
        <el-form-item label="烟站名称">
          <el-input v-model="stationForm.station_name"></el-input>
        </el-form-item>
        <el-form-item label="烟站地址">
          <el-input v-model="stationForm.address"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <LocationComp @watchLocation="setLocation" :locations-msg="locations"></LocationComp>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmClick">修改</el-button>
        </el-form-item>
      </el-form>
    </el-row>

  </div>
</template>

<script>
  import LocationComp from '../../../components/LocationComp'
  import { alterStation } from '@/api/station'

  export default{
    name: 'EditStation',
    components: {
      LocationComp
    },
    props: ['rowMsg'],
    data() {
      return {
        locations: [],
        stationForm: {}
      }
    },
    created() {
      // 获取父组件传递值
      console.log('rowMsg', this.rowMsg)
      this.stationForm = {...this.rowMsg}
      let user = JSON.parse(localStorage.getItem('user'))
      switch(user.category) {
        case '0':
          this.locations = [this.stationForm.parent_location, this.stationForm.location]
          break
        case '1':
          this.locations = [this.stationForm.location]
          break
      }
    },
    methods: {
      setLocation(data) {
        this.stationForm.location = data.location
        if(data.parent_location !== ''){
          this.stationForm.parent_location = data.parent_location
        }
      },
      confirmClick() {
        let rdata = this.stationForm
        alterStation(rdata).then(res => {
          console.log('alterStation', res)
          if(res.code === 200){
            this.$message({type: 'success', message: "修改成功"})
            this.$emit('watchChild', true)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },
  }
</script>

<style>
</style>
