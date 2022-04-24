<template>
  <el-select v-if="visible" v-model="value" placeholder="请选择" @change='handleChange'>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import categoryJSON from '../../public/static/map/category.json'

  export default{
    name: 'CategoryComp',
    props: ['cMsg'],
    data() {
      return {
        visible: true,
        categoryJSON,
        value: '',
        options: [],
      }
    },
    created() {
      this.value = this.cMsg
      let user = JSON.parse(localStorage.getItem('user'))
      this.options = this.categoryJSON.data.slice(parseInt(user.category))
      let see = ["0", "1", "2", "3"]
      if(see.indexOf(user.category) === -1){
        this.visible = false
      }
    },
    methods: {
      handleChange(value) {
        this.$emit('watchCategory', { category: this.value })
      }
    },
  }
</script>

<style>
</style>
