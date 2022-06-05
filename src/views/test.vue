<template>
  <div class="test">
    <el-upload
      class="upload-demo"
      :auto-upload="false"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
    </el-upload>
    <CateoryPermissionRangeComp></CateoryPermissionRangeComp>
  </div>
</template>

<script>
  import CateoryPermissionRangeComp from '/src/components/CateoryPermissionRangeComp'

  export default{
    components: {
      CateoryPermissionRangeComp,
    },
    data() {
      return {
      }
    },
    created() {
      console.log('store', this.$store.state.user)
    },
    methods: {
      handlePreview(file) {
        console.log('handlePreview', file)
      },
      handleRemove(file, fileList) {
        console.log('handleRemove', file, fileList)
      },
      handleChange(file, fileList) {
        console.log('handleChange', file, fileList)
        let formData = new FormData()
        formData.append('a', 123)
        formData.append('img', file.raw)
        formData.forEach((value, key) => {
          console.log(key, value)
        })
      }
    }
  }
</script>

<style>
</style>
