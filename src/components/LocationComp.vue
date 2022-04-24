<template>
  <el-cascader
  v-if="visible"
  style="width: 100%;"
  v-model="locations"
  :options="options"
  :props="props"
  filterable
  @change="handleCascaderChange"
  placeholder="请选择地区"
  clearable
  :disabled="disable">
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
        user: {},
        disable: false,
        visible: true,
        options: [],
        props: { label:'name', value: 'location', checkStrictly: true },
        locations: [],
      }
    },
    props: ["locationsMsg"],
    created() {
      this.user = JSON.parse(localStorage.getItem('user'))
      if(this.user.category === '0'){
        this.options = this.optionJSON.province["6500001"].children
      }
      else if(this.user.category === '1'){
        this.options = this.optionJSON.city[this.user.permission_range].children
      }
      else if(this.user.category === '2'){
        this.disable = true
      }
      else if(this.user.category === '3'){
        this.disable = true
      }
      else if(this.user.category === '4'){
        this.disable = true
      }
      else if(this.user.category === '5'){
        this.disable = true
      }
      this.locations = this.locationsMsg
    },
    methods: {
      handleCascaderChange(value) {
        console.log('cascader', value)
        if(value.length === 0){
          this.$emit('watchLocation', { parent_location: '', location: '' })
        }
        else{
          if(this.user.category === "0"){
            this.$emit('watchLocation', { parent_location: value[0], location: value[1] })
          }
          else if(this.user.category === "1"){
            this.$emit('watchLocation', { parent_location: '', location: value[0] })
          }
        }
      }
    },
  }
</script>

<style>
</style>
