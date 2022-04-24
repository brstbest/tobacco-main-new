<template>
  <div class="bind-comp">
    <el-row class="bind-info-row">
      <el-form :model="bindForm" size="mini" label-position="left" label-width="100px">
        <el-form-item label="设备ID">
          <el-input v-model="bindForm.device_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="bindForm.device_name"></el-input>
        </el-form-item>
        <el-form-item label="设备地址">
          <el-input v-model="bindForm.address"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="bindForm.head"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="bindForm.head_phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="unbindClick()">解绑</el-button>
          <el-button type="primary" @click="editClick()">修改</el-button>
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
              <el-button v-if="scope.row.user_id !== bindForm.user_id" type="success" size="mini" @click="bindClick(scope.row)">绑定</el-button>
              <el-button v-if="scope.row.user_id === bindForm.user_id" type="info" size="mini" disabled>已绑</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-row> -->

  </div>
</template>

<script>
  import { alterDevice } from '@/api/device'

  export default{
    name: 'EditDevice',
    components: {

    },
    props: ['rowMsg'],
    data() {
      return {
        search_text: '',
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
        bindForm: {}
      }
    },
    created() {
      // 获取父组件传递值
      this.bindForm = {...this.rowMsg}
      console.log(this.bindForm)
      // 请求后端获取userdata
    },
    methods: {
      toRData() {
        let rdata = {
          device_id: this.bindForm.device_id,
          head: this.bindForm.head,
          head_phone: this.bindForm.head_phone,
          address: this.bindForm.address
        }
        return rdata
      },
      bindClick(row) {
        this.bindForm.user_id = row.user_id
        this.bindForm.phone = row.phone
        let rdata = this.toRData()
        console.log(rdata)
        //请求
      },
      unbindClick() {
        this.bindForm.head = ''
        this.bindForm.head_phone = ''
        let rdata = this.toRData()
        console.log('rdata', rdata)
        //请求
        this.alterRequest('解绑', rdata)
      },
      editClick() {
        let rdata = this.toRData()
        console.log(rdata)
        //请求
        this.alterRequest('修改', rdata)
      },
      alterRequest(text, rdata){
        alterDevice(rdata).then(res => {
          console.log('alterDevice', res)
          if(res.code === 200){
            this.$message({ message: text+'成功', type: 'success'})
            this.$emit('watchChild', true)
          }
        }).catch(err => {
            this.$message.error(text+'失败')
        })
      }
    },
  }
</script>

<style>
</style>
