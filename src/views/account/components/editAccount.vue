<template>
  <div class="edit-account-comp">
    <el-form :label-position="left" label-width="100" :model="accountForm" :rules="rules" ref="accountForm">
      <el-form-item label="用户名">
        <el-input v-model="accountForm.user_id"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="accountForm.nname"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="accountForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <CategoryComp @watchCategory="setCategory" :c-msg="accountForm.category"></CategoryComp>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('accountForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import CategoryComp from '../../../components/CategoryComp'
  import { changeUserInfo } from '@/api/user'

  export default{
    name: "EditAccount",
    components: {
      CategoryComp
    },
    data() {
      return {
        accountForm: {
          'user_id': '',
          'nname': '',
          'phone': '',
          'category': ''
        },
        rules: {
          user_id: [
            {require: true, message: '请输入用户名'}
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
    props: ['rowMsg'],
    created() {
      this.accountForm = {...this.rowMsg};
      console.log(this.accountForm)
    },
    methods: {
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if(valid) {
            changeUserInfo(this.accountForm).then(res => {
              console.log('changeUserInfo', res)
              if(res.code === 200) {
                this.$message({ message: '修改成功', type: 'success'})
                this.$emit('watchChild', true)
              }
            }).catch(err => {
                this.$message.error('修改失败')
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
  .edit-account-comp{
    padding: 40px;
  }
</style>
