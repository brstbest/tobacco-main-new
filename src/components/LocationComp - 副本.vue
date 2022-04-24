<template>
  <el-cascader
  style="width: 100%;"
  v-model="locations"
  :options="cityJSON.children"
  :props="props"
  filterable
  @change="handleCascaderChange"
  placeholder="请选择地区"
  clearable>
  </el-cascader>
</template>

<script>
  import cityJSON from '../../public/static/map/city.json'
  import optionJSON from '../../public/static/map/postcodeOption.json'
  export default{
    name: 'LocationComp',
    data() {
      return {
        cityJSON,
        optionJSON,
        options: [],
        props: { label:'name', value: 'location', checkStrictly: true },
        locations: [],
        category: '',
        permission_range: '',
      }
    },
    created() {
      let user = JSON.parse(localStorage.getItem('user'))
      this.category = user.category
    },
    methods: {
      handleCascaderChange(value) {
        this.$emit('watchLocation', { parent_location: value[0], location: value[1] })
      }
    },
  }
</script>

<style>
</style>
