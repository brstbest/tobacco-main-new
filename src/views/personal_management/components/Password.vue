<template>
  <el-form
    ref="pwd"
    :rules="rules"
    :model="pwd"
    label-position="right"
    label-width="100px"
    style="margin:0 auto;max-width: 460px"
  >
    <el-form-item label="原始密码" prop="oripwd">
      <el-input v-model="pwd.oripwd" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newpwd">
      <el-input v-model="pwd.password" show-password />
    </el-form-item>
    <el-form-item label="重复密码" prop="conpwd">
      <el-input v-model="pwd.conpwd" show-password />
    </el-form-item>
    <div style="display: flex">
      <el-button style="width: 100%; margin-left: 22%" type="primary" @click="changePwd">修改</el-button>
    </div>
  </el-form>
</template>

<script>
import { changeUserPwd } from '@/api/user'
import { changeUserInfo } from '@/api/user'

export default {
  name: 'Password',
  data() {
    var checkPwd = (rule, value, callback) => {
      if (this.pwd.password !== value) {
        callback(new Error('请确保与新密码一致'))
      } else {
        callback()
      }
    }
    return {
      pwd: {
        oripwd: '',
        password: '',
        conpwd: '',
        user_id: '',
      },
      rules: {
        oripwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ],
        conpwd: [
          { validator: checkPwd, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.pwd.user_id = JSON.parse(localStorage.getItem('user')).userId
  },
  methods: {
    clear() {
      this.pwd = {}
    },
    changePwd() {
      this.$refs['pwd'].validate((v) => {
        changeUserInfo(this.pwd).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message({ message: '修改成功', type: 'success' })
          }
        }).catch(error => {
          this.$message.error('修改失败')
          console.log(error)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
