<template>
  <div class="line-chart-comp">
    <div id="line-chart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default{
    name: 'LineChartComp',
    components: {

    },
    props: ['lineMsg'],
    data() {
      return {
        chart: null,
        dryLineData: [],
        wetLineData: [],
        xData: [],
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      this.initChart()
    },
    methods: {
      fetchData() {
        console.log(this.lineMsg)
        let dryCurve = this.lineMsg[0]
        let wetCurve = this.lineMsg[1]
        let xmax = 0
        if(dryCurve.length !== 0 && wetCurve.length !== 0){
          xmax = dryCurve[dryCurve.length - 1].etime > wetCurve[wetCurve.length - 1].etime ? dryCurve[dryCurve.length - 1].etime : wetCurve[wetCurve.length - 1].etime
        }
        else if(dryCurve.length === 0 && wetCurve.length !== 0){
          xmax = wetCurve[wetCurve.length - 1].etime
        }
        else if(dryCurve.length !== 0 && wetCurve.length === 0){
          xmax = dryCurve[dryCurve.length - 1].etime
        }

        for(let i=0; i<=xmax; i++){
          this.xData.push(i)
        }
        dryCurve.forEach((stage, index) => {
          if(index > 0){
            if(stage.stime === dryCurve[index-1].etime && stage.stemp !== dryCurve[index-1].etemp){
              this.dryLineData.push([stage.stime, stage.stemp])
            }
            else if(stage.stime !== dryCurve[index-1].etime){
              this.dryLineData.push([stage.stime, stage.stemp])
            }
          }
          else{
            this.dryLineData.push([stage.stime, stage.stemp])
          }
          this.dryLineData.push([stage.etime, stage.etemp])
        })
        wetCurve.forEach((stage, index) => {
          if(index > 0){
            if(stage.stime === wetCurve[index-1].etime && stage.stemp !== wetCurve[index-1].etemp){
              this.wetLineData.push([stage.stime, stage.stemp])
            }
            else if(stage.stime !== wetCurve[index-1].etime){
              this.wetLineData.push([stage.stime, stage.stemp])
            }
          }
          else{
            this.wetLineData.push([stage.stime, stage.stemp])
          }
          this.wetLineData.push([stage.etime, stage.etemp])
        })
      },
      initChart(){
        this.chart = echarts.init(document.getElementById('line-chart'))
        console.log(this.chart)
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.setChartOptions()
      },
      setChartOptions() {
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: false },
              magicType: { type: ['line', 'bar'] },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            name: '时间（小时）',
            type: 'category',
            boundaryGap: false,
            data: this.xData
          },
          yAxis: {
            name: '温度（℃）',
            type: 'value',
            axisLabel: {
              formatter: '{value} ℃'
            }
          },
          series: [
            {
              name: '干球温度',
              type: 'line',
              data: this.dryLineData,
              connectNulls: true
            },
            {
              name: '湿球温度',
              type: 'line',
              data: this.wetLineData,
              connectNulls: true
            }
          ]
        };
        this.chart.setOption(option)
      }
    }
  }
</script>

<style>
  .line-chart-comp{
    height: 37.5rem;
  }
  #line-chart{
    height: 100%;
  }
</style>
