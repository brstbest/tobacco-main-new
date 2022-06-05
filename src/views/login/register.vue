<template>
  <div class="register">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="用户名" prop="user_id">
        <el-input v-model="form.user_id" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="cpassword">
        <el-input v-model="form.cpassword" show-password placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="nname">
        <el-input v-model="form.nname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%;" @click="register">注册</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import { userRegister } from '@/api/user'

  export default{
    name: 'Register',
    components: {

    },
    data() {
      var isPwdMatch = (rule, value, callback) => {
        if(value != this.form.password) {
          callback(new Error('两次输入的密码不同'))
        }
        else {
          callback()
        }
      }
      return {
        form: {
          user_id: '',
          password: '',
          cpassword: '',
          nname: '',
          phone: '',
        },
        rules: {
          user_id: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          cpassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: isPwdMatch, trigger: 'blur' }
          ],
          nname: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      register() {
        userRegister(this.form).then(res => {
          console.log(res)
        })
      }
    },
  }
</script>

<style>
  .register{
    padding: 20px;
  }
</style>
