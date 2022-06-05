<template>
<div>
<el-row class="record-search-row-top" :gutter="20">
<el-col :span="10">
<div>
<LocationComp @watchLocation="setLocation"></LocationComp>
</div>
</el-col>
<el-col :span="5">
<el-button type="primary" @click="searchClick">查询</el-button>
</el-col>
</el-row>
<br><br>
<el-row class="echartdiv" :gutter="20">
<el-col :span="10">
  <div class="echart" id="mychart1" :style="{ float: 'left', width: '100%', height: '300px' }">
  </div>
</el-col>
<el-col :span="10">
  <div class="echart" id="mychart2" :style="{ float: 'left', width: '100%', height: '300px' }">
  </div>
</el-col>
<el-col :span="10">
  <div class="echart" id="mychart3" :style="{ float: 'left', width: '100%', height: '300px' }">
  </div>
</el-col>
<el-col :span="10">
  <div class="echart" id="mychart4" :style="{ float: 'left', width: '100%', height: '300px' }">
  </div>
</el-col>
</el-row>  
  
</div>
</template>

<script>
import * as echarts from "echarts";
import LocationComp from '../../components/LocationComp';

export default {
	name:"Equipment",
	components: {
      LocationComp,
    },
  data() {
    return {
		location: '',
		userate:
		[
			{ value: 1048, name: '使用中' },
			{ value: 735, name: '可用' },
			{ value: 80, name: '故障' },
			{ value: 500, name: '不可用' }
		],
		
    };
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
	setLocation(data) {
        this.location = data.location
        this.parent_location = data.parent_location
      },
    initEcharts() {
      const option1 = {
	  title: {
		text: '烤房使用率',
		subtext: '',
		left: 'center'
	  },
	  tooltip: {
		trigger: 'item'
	  },
	  legend: {
		orient: 'vertical',
		left: 'left'
	  },
	  series: [
		{
		  name: '详细数据',
		  type: 'pie',
		  radius: '60%',
		  data: this.userate,
		
		  emphasis: {
			itemStyle: {
			  shadowBlur: 10,
			  shadowOffsetX: 0,
			  shadowColor: 'rgba(0, 0, 0, 0.5)'
			}
		  }
		}
	  ]
	};
      const myChart1 = echarts.init(document.getElementById("mychart1"));// 图标初始化
      myChart1.setOption(option1);// 渲染页面
      //随着屏幕大小调节图表
      //window.addEventListener("resize", () => {myChart1.resize();});
	  const option2 = {
		  darkMode: "auto",
		  color:"#1F4083",
		  tooltip: {
			formatter: '{a} <br/>{b} : {c}个'
		  },
		  series: [
			{
			  min:0,
			  max:5000,
			  name: '烤房数量',
			  type: 'gauge',
			  progress: {
				show: true
			  },
			  detail: {
				valueAnimation: true,
				formatter: '{value}'
			  },
			  data: [
				{
				  value: 2363,
				  name: '烤房数量'
				}
			  ],
			}
		  ]
		};
		const myChart2 = echarts.init(document.getElementById("mychart2"));// 图标初始化
      myChart2.setOption(option2);// 渲染页面
      //随着屏幕大小调节图表
      //window.addEventListener("resize", () => {myChart2.resize();});
	  const option3 = {
	  darkMode: "auto",
	  color:"#FF0000",
	  tooltip: {
		formatter: '{a} <br/>{b} : {c}个'
	  },
	  series: [
		{
		  min:0,
				max:5000,
		  name: '烤房故障数量',
		  type: 'gauge',
		  progress: {
			show: true
		  },
		  detail: {
			valueAnimation: true,
			formatter: '{value}'
		  },
		  data: [
			{
			  value: 80,
			  name: '烤房故障数量'
			}
		  ],
		}
	  ]
	};
	const myChart3 = echarts.init(document.getElementById("mychart3"));// 图标初始化
      myChart3.setOption(option3);// 渲染页面
	const option4 = {
	  darkMode: "auto",
	  color:"#FF0000",
	  tooltip: {
		formatter: '{a} <br/>{b} : {c}个'
	  },
	  series: [
		{
		  min:0,
				max:5000,
		  name: '目前使用烤房',
		  type: 'gauge',
		  progress: {
			show: true
		  },
		  detail: {
			valueAnimation: true,
			formatter: '{value}'
		  },
		  data: [
			{
			  value: 1048,
			  name: '目前使用烤房'
			}
		  ],
		}
	  ]
	};
	const myChart4 = echarts.init(document.getElementById("mychart4"));// 图标初始化
      myChart4.setOption(option4);// 渲染页面
	
	
	
    }
  }
};
</script>


