<template>
  <div class="edit-account-comp">
    <el-form ref="accountForm" :model="accountForm" :rules="rules" :size="size">
      <el-descriptions :column="1" :size="size" border>
        <template v-for="(item, index) in descLabels">
          <el-descriptions-item :label="item.label" :span="item.span">
            <el-form-item :prop="item.key">
              <el-select v-if="item.key === 'category'" v-model="accountForm.category" style="width: 100%;" placeholder="在单位选择器中选择后自动生成" disabled :size="size">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <!-- <el-input v-else v-model="accountForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input> -->
              <el-input v-else-if="item.key === 'permission_range'" v-model="accountForm[item.key]" placeholder="在单位选择器中选择后自动生成" :size="size" disabled></el-input>
              <CateoryPermissionRangeComp v-else-if="item.key === 'unit'" @watchUnit="recieveUnit"></CateoryPermissionRangeComp>
              <el-input v-else v-model="accountForm[item.key]" :placeholder="'请输入'+item.label" :size="size"></el-input>
            </el-form-item>
          </el-descriptions-item>
        </template>
      </el-descriptions>
      <el-button type="primary" style="margin-top: 1.25rem; width: 100%;" @click="submitForm('accountForm')">提交</el-button>
    </el-form>
  </div>
</template>

<script>
  import CateoryPermissionRangeComp from '/src/components/CateoryPermissionRangeComp'
  import CategoryComp from '../../../components/CategoryComp'

  import { changeUserInfo } from '@/api/user'
  import { getRequestDataOnPermission } from '/src/utils/auth.js'

  export default{
    name: "EditUser",
    components: {
      CategoryComp,
      CateoryPermissionRangeComp
    },
    data() {
      return {
        size: 'small',
        categoryOptions: [
          { value: '0', label: '省', disabled: false },
          { value: '1', label: '州', disabled: false },
          { value: '2', label: '县', disabled: false },
          { value: '3', label: '烟站', disabled: false },
          { value: '4', label: '烤房群', disabled: false },
          { value: '5', label: '烤房', disabled: false }
        ],
        descLabels: [
          { key: 'user_id', label: '用户名' },
          { key: 'nname', label: '昵称' },
          { key: 'phone', label: '手机号' },
          { key: 'category', label: '权限类型' },
          { key: 'permission_range', label: '单位编号' },
          { key: 'unit', label: '单位选择器' },
        ],
        accountForm: {
          user_id: '',
          nname: '',
          phone: '',
          category: '',
          permission_range: '',
        },
        rules: {
          user_id: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          nname: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '请在单位选择器中选择单位', trigger: 'blur'}
          ],
          permission_range: [
            {required: true, message: '请在单位选择器中选择单位', trigger: 'blur'}
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
            console.log(this.accountForm)
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
      },
      recieveUnit(data) {
        if(data.ids.length === 0) {
          this.accountForm.category = this.rowMsg.category
          this.accountForm.permission_range = this.rowMsg.permission_range
        }
        else {
          let user = getRequestDataOnPermission()
          let category = Number(user.category)
          category += data.ids.length
          category += ''
          this.accountForm.category = category
          this.accountForm.permission_range = data.ids[data.ids.length - 1]
        }
      }
    }
  }
</script>

<style>
  .edit-account-comp{
    padding: 40px;
  }
</style>
