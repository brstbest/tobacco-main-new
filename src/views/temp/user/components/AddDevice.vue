<template>
  <div class="add-device-comp">
    <el-row class="add-device-form-row">
      <el-form :model="deviceForm" size="mini" label-position="left" label-width="80px">
        <el-form-item label="设备ID">
          <el-input v-model="deviceForm.device_id"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="deviceForm.device_name"></el-input>
        </el-form-item>
        <el-form-item label="设备地址">
          <el-input v-model="deviceForm.address"></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-input v-model="deviceForm.kind"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="deviceForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="用户手机">
          <el-input v-model="deviceForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addComfirm">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-row>
<!--    <el-divider content-position="left">修改绑定用户</el-divider>
    <el-row class="bind-table-row">
      <el-input v-model="search_text" placeholder="请输入 用户ID/用户名/手机 搜索用户" size="mini"></el-input>
      <el-table :data="userData.filter(data => !search_text || data.user_id.includes(search_text) || data.phone.includes(search_text) || data.nname.includes(search_text))"
      height="300px">
        <template v-for="(item, index) in columns">
          <el-table-column
          :prop="item.key"
          :label="item.label"
          :key="index"
          :width="item.width">
            <template v-if="item.key === 'operate'" v-slot="scope">
              <el-button v-if="scope.row.user_id !== deviceForm.user_id" type="success" size="mini" @click="selectClick(scope.row)">选择</el-button>
              <el-button v-if="scope.row.user_id === deviceForm.user_id" type="info" size="mini" disabled>已选</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row> -->

  </div>
</template>

<script>
  import LocationComp from '../../../components/LocationComp'
  import { addDevice } from '@/api/device'

  export default{
    name: 'BindComp',
    components: {
      LocationComp,
    },
    data() {
      return {
        search_text: '',
        selectedUser: {},
        userData: [
          {
            user_id: 'admin123',
            phone: '19821145632',
            nname: '张三',
          }
        ],
        columns: [
          {key: 'user_id', label: '用户ID', width: ''},
          {key: 'nname', label: '用户姓名', width: ''},
          {key: 'phone', label: '手机', width: ''},
          {key: 'operate', label: '操作', width: '100'},
        ],
        deviceForm: {
          user_id: '',
          device_id: '',
          device_name: '',
          phone: '',
          address: '',
          kind: '',
          location: '',
          parent_location: '',
        },
      }
    },
    created() {
      // 请求后端获取userdata
    },
    methods: {
      toRData() {
        let rdata = {
          head: this.deviceForm.user_id,
          device_id: this.deviceForm.device_id,
          device_name: this.deviceForm.device_name,
          head_phone: this.deviceForm.phone,
          address: this.deviceForm.address,
          kind: this.deviceForm.kind
        }
        return rdata
      },
      selectClick(row) {
        this.deviceForm.user_id = row.user_id
        this.deviceForm.phone = row.phone
      },
      addComfirm() {
        let rdata = this.toRData()
        addDevice(rdata).then(res => {
          console.log('addDevice', res)
          if(res.code === 200) {
            this.$message({ message: '新增成功', type: 'success'})
            this.$emit('watchChild', true)
          }
        }).catch(err => {
            this.$message.error('新增失败')
        })
      },
      setLocation(data) {
        this.deviceForm.location = data.location
        this.deviceForm.parent_location = data.parent_location
      }
    },
  }
</script>

<style>
</style>
