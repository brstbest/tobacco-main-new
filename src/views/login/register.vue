<template>
  <div class="register">
    <el-form class="register-form">
      <el-form-item label="用户名">
        <el-input v-model="form.user_id"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nname"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.gender"></el-input>
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
      return {
        form: {
          user: 'admin123',
          pwd: '123456',
          name: 'asdadsasdsa',
          nname: 'asdadsasdsa',
          phone: '12345678910',
          gender: 'F',
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
