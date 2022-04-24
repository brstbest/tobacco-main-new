<template>
  <div class="harvest">
    <el-row class="harvest-whole-row">
      <el-row class="harvest-title">
        设备：
      </el-row>
      <el-row class="harvest-select">
        <el-select v-model="selectDevice" placeholder="请选择设备" style="width: 100%" filterable="true">
          <el-option
            v-for="item in deviceData"
            :key="item.device_id"
            :label="item.device_name"
            :value="item.device_id">
          </el-option>
        </el-select>
      </el-row>

      <el-row class="harvest-title">
        部位：
      </el-row>
      <el-row class="harvest-select">
        <el-select v-model="selectPart" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in partData"
            :key="item.part_id"
            :label="item.part_name"
            :value="item.part_id">
          </el-option>
        </el-select>
      </el-row>

      <el-row class="harvest-title">
        设备ID：
      </el-row>
      <el-row class="harvest-show">
        <el-input v-model="selectDevice" disabled></el-input>
      </el-row>

      <el-row class="harvest-title">
        上传图片：
      </el-row>
      <el-row class="harvest-upload">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          ref="pictureUpload">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-row>

      <el-row class="harvest-button">
        <el-button type="primary" @click="sendCommandClick">发送指令</el-button>
      </el-row>

    </el-row>
  </div>
</template>

<script>
  import { searchDevice } from '@/api/device'

  export default{
    name: 'Harvest',
    components: {

    },
    data() {
      return{
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        selectDevice: '',
        selectPart: '',
        deviceData: [],
        partData: [
          {
            part_id: '0',
            part_name: '上部'
          },
          {
            part_id: '1',
            part_name: '中部'
          },
          {
            part_id: '2',
            part_name: '下部'
          },
        ]
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
            break
        }
        searchDevice(rdata).then(res => {
          console.log('searchDevice', res)
          if(res.code === 200){
            this.deviceData = res.data
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      handleRemove(file) {
        console.log(file)
        this.$refs.pictureUpload.handleRemove(file)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },
      sendCommandClick() {
        //this.$message({message: '指令已发送', type: 'success'})
        this.$message.error('指令发送失败')
      }
    },
  }
</script>

<style>
  .harvest-whole-row{
    padding: 3.125rem;
  }
  .harvest-title, .harvest-select, .harvest-show{
    width: 31.25rem;
  }
  .harvest-title{
    padding: 1.25rem;
    padding-left: 0rem;
    font-weight: bold;
  }
  .harvest-button{
    padding: 2.5rem;
    padding-left: 0rem;
    padding-bottom: 0rem;
  }
</style>
