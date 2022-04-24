<template>
  <div class="home">
    <el-row>
      <el-col :span="12">
        <HomeMap/>
      </el-col>
      <el-col :span="6">
        <DataMonitoring/>
      </el-col>
      <el-col :span="6">
        <DataMonitoring2/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DataMonitoring from './components/DataMonitoring'
import HomeMap from './components/HomeMap'
import DataMonitoring2 from './components/DataMonitor2'
export default {
  name: 'Index',
  components: {
    // DeviceMonitoring,
    DataMonitoring, HomeMap, DataMonitoring2
    // ,DeviceControl
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  },
  destroyed() {
    document.body.style.overflow = 'visible'
  }
}
</script>

<style scoped>
.home{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50rem;
}
.el-row{
  width: 100%;
  height: auto;
  margin: 1rem;
}
.el-col{
  height: auto;
}
.map{
  width: 100%;
  height: auto;
}
/* .home-left{
  display: flex;
  flex-direction: column;
  margin: 1.5rem 0 0 2rem;
}
.home-left-top{
  display: flex;
  flex-direction: row;
  margin: 0 0 1.5rem 0;
}
.home-left-top-map{
  margin: 0 1.5rem 0 0;
  background: white;
  width: 60rem;
  height: 50rem;
  border-radius: 1rem;
}
.home-right-data-monitoring{
  margin: 1.5rem 0 0 2.2rem;
}
.data-monitoring{
  background: white;
  height: 51rem;
  width: 28.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
} */
</style>
