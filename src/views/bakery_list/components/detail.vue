<template>
  <div class="bakery-list-detail">
    <el-row class="bakery-list-detail-header">
      <el-page-header @back="goBack" content="详情页面">
      </el-page-header>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20" class="bakery-list-detail-tabs">
      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane label="设备监控">
          <SuperviseDeviceComp v-if="showTab === '0'" :row-msg="rowData"></SuperviseDeviceComp>
        </el-tab-pane>
        <el-tab-pane label="烤房监控">
          <SuperviseBakeryComp v-if="showTab === '1'" :row-msg="rowData"></SuperviseBakeryComp>
        </el-tab-pane>
        <el-tab-pane label="组态应用">组态应用</el-tab-pane>
        <el-tab-pane label="视频监控">视频监控</el-tab-pane>
        <el-tab-pane label="烘烤历史">烘烤历史</el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
  import SuperviseBakeryComp from './comps/SuperviseBakeryComp'
  import SuperviseDeviceComp from './comps/SuperviseDeviceComp'

  export default{
    name: 'BakeryDetailComp',
    components: {
      SuperviseBakeryComp,
      SuperviseDeviceComp,
    },
    props: ['rowMsg'],
    data() {
      return {
        showTab: '0',
        rowData: null,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        console.log(this.rowMsg)
        this.rowData = this.rowMsg
      },
      goBack() {
        console.log('goback')
        this.$emit('watchChild', true)
      },
      handleClick(tab, event) {
        this.showTab = tab.index
      }
    }
  }
</script>

<style>
  .bakery-list-detail-header{
    padding: 1.25rem;
    padding-bottom: 0rem;
  }
  .bakery-list-detail-tabs{
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
</style>
