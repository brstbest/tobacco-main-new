<template>
  <div class="create-account-comp">
    <el-form :label-position="left" label-width="100" :model="accountForm" :rules="rules" ref="accountForm">
      <el-form-item label="用户名">
        <el-input v-model="accountForm.user_id"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="accountForm.password" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="accountForm.nname"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="accountForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="人员类型">
        <CategoryComp @watchCategory="setCategory"></CategoryComp>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('accountForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import CategoryComp from '../../../components/CategoryComp'
  import { userRegister } from '@/api/user'

  export default {
    name: 'CreateAccount',
    components: {
      CategoryComp
    },
    data() {
      return {
        accountForm: {
          'user_id': '',
          'password': '123456',
          'nname': '',
          'phone': '',
          'category': ''
        },
        rules: {
          user_id: [
            {require: true, message: '请输入用户名'}
          ],
          password: [
            {require: true, message: '请输入密码'}
          ],
          nname: [
            {require: true, message: '请输入昵称'}
          ],
          phone: [
            {require: true, message: '请输入手机号'}
          ]
        }
      }
    },
    methods: {
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if(valid) {
            userRegister(this.accountForm).then(res => {
              console.log('userRegister', res)
              if(res.code === 200) {
                this.$message({ message: '新增成功', type: 'success'})
                this.$emit('watchChild', true)
              }
            }).catch(err => {
                this.$message.error('新增失败')
            })
          }
        })
      },
      setCategory(data){
        this.accountForm.category = data.category
      }
    }
  }
</script>

<style>
  .create-account-comp{
    padding: 40px;
  }
</style>
