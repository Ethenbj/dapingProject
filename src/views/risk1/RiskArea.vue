<script setup lang="ts">
import {onMounted, ref, reactive, watch, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
import * as echarts from 'echarts';
import { init } from 'echarts';
import { ElMessage  } from 'element-plus'
import type { TabsInstance } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import hunanMapData from '@/assets/json/hunan-map.json'

const router = new useRouter();
const store = useStore()


// 加载
onMounted(()=>{
  // 初始化 echarts
  // initChart();
  // initChart2();
  initChart3();
})

// 返回
function goBack(){
  router.back()
}

const radio1 = ref<TabsInstance['radio1']>('1');

// 左侧按钮点击事件
function handlerYearDataBtn(value){
  ElMessage(`选择 ${value} 指标`)
}

// 地图
function initChart() {
  echarts.registerMap('hunan',hunanMapData);
  const myChart = init(document.getElementById('map') as HTMLDivElement);

  let data = [
    // {name: '', selected: true}, // 选中某市
    {name: "长沙市", value: 2333},
    {name: "岳阳市", value: 4057},
    {name: "常德市", value: 6007},
    {name: "衡阳市", value: 5007},
    {name: "郴州市", value: 3007},
    {name: "湘潭市", value: 2007},
    {name: "邵阳市", value: 1007},
    {name: "永州市", value: 5007},
    {name: "益阳市", value: 3007},
    {name: "娄底市", value: 5007},
    {name: "怀化市", value: 4007},
    {name: "湘西州", value: 2007},
    {name: "张家界市", value: 3007},
    // {name: "湘江新区", value: 5007},
    {name: "株洲市", value: 2007},
  ];

  var geoCoordMap = {};
  hunanMapData.features.forEach(function(v) {
    // 地区名称
    var name = v.properties.name;
    // 地区经纬度
    geoCoordMap[name] = v.properties.center;

  });

  const max = 100000,
      min = 900; // todo
  const maxSize4Pin = 100,
      minSize4Pin = 20;

  var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
        });
      }
    }

    // console.log(res);
    return res;
  };
  convertData(data);

  let option = {
    visualMap: {
      // 是否展示左下角，即是是false，也仅是不显示，不影响数据的映射
      show: true,
      // 上下端文字
      text: ["高", "低"],
      // 最小值和最大值，必须指定
      min: 0,
      max: 6000,
      // 位置
      left: "10%",
      bottom: "10%",
      // 是否展示滑块
      calculable: true,
      // 指定映射的数据，对应的是option.series，这里根据自己的实际需要进行配置
      seriesIndex: [0],
      // 从下到上的颜色
      inRange: {
        color: ['#00467F', '#A5CC82'],
      },
      //字体颜色
      textStyle: {
        color: "#fff",
        map: "china",
      },
    },
    // 提示浮窗样式
    tooltip: {
      show: true,
      trigger: "item",
      formatter: '{b}：{c}',
      alwaysShowContent: false,
      backgroundColor: "rgb(0,186,203)",
      borderColor: "rgba(0, 0, 0, 0.16);",
      hideDelay: 100,
      triggerOn: "mousemove",
      enterable: true,
      textStyle: {
        color: "#000000",
        fontSize: "12",
        width: 20,
        height: 30,
        overflow: "break",
      },
      showDelay: 100
    },
    series: [
      {
        type: 'map',
        mapType: 'hunan',
        // legendHoverLink: true,
        label: {
          // 通常状态下的样式
          normal: {
            // show: true,
            // textStyle: {
            //   color: "#fff",
            // },
            show: true,
            formatter(value) {
              return value.data.value[2];
            },
            color: "#fff",
          },
          // 鼠标放上去的样式
          emphasis: {
            textStyle: {
              color: "#fff",
            },
          },
        },
        itemStyle: {
          normal: {
            borderColor: "rgba(147, 235, 248, 1)",
            borderWidth: 1,
            areaColor: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
            shadowColor: "rgba(128, 217, 248, 1)",
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10,
          },
          // 鼠标放上去高亮的样式
          emphasis: {
            areaColor: "#389BB7",
            borderWidth: 0,
          },
        },
        data: data
      },
      // {
      //   type: "scatter",
      //   coordinateSystem: "geo",
      //   symbol: "pin",
      //   legendHoverLink: true,
      //   symbolSize: [60, 60],
      //   // 这里渲染标志里的内容以及样式
      //   label: {
      //     show: true,
      //     formatter(value) {
      //       return value.data.value[2];
      //     },
      //     color: "#fff",
      //   },
      //   // 标志的样式
      //   itemStyle: {
      //     normal: {
      //       color: "rgba(255,0,0,.7)",
      //       shadowBlur: 2,
      //       shadowColor: "D8BC37",
      //     },
      //   },
      //   // 数据格式，其中name,value是必要的，value的前两个值是数据点的经纬度，其他的数据格式可以自定义
      //   // 至于如何展示，完全是靠上面的formatter来自己定义的
      //   data: [
      //     { name: "长沙市", value: [112.982279, 28.19409, 2333] },
      //   ],
      //   showEffectOn: "render",
      //   rippleEffect: {
      //     brushType: "stroke",
      //   },
      //   hoverAnimation: true,
      //   zlevel: 1,
      // },
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

  let dom = document.getElementById('map');
  dom.querySelector('div').style.width = '0';
  dom.querySelector('div').style.height = '0';
}

// 缴费人数情况
function initChart2(){
  const myChart = init(document.getElementById('bar') as HTMLDivElement)

  let option = {
    // backgroundColor: "#0f375f",
    tooltip: {
      show: true,
      trigger: "item",
      formatter: '{b}：{c}个',
    },
    xAxis: {
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(255,255,255,0.2)",
          type: 'dashed'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变x轴颜色
        show:false,
        lineStyle: {
          color: "rgba(255,255,255,0.8)"
        }
      },

      axisLabel: { //  改变x轴字体颜色和大小
        show:false,
        textStyle: {
          color: "rgba(250,250,250,0.6)",
          fontSize: 16
        }
      }
    },
    yAxis: {
      type: 'category',
      // 数据反向
      data: ['已入库', '已反馈', '已下发', '扫描金额', '扫描数量'],
      splitLine: {
        show:false,
        lineStyle: {
          color: "rgba(255,255,255,0.2)",
          type: 'dashed'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变y轴颜色
        show:false
      },
      axisLabel: { //  改变y轴字体颜色和大小
        show: false,
        formatter: '{value} m³ ', //  给y轴添加单位
        textStyle: {
          color: "rgba(250,250,250,0.6)",
          fontSize: 16
        }
      }
    },
    grid: {
      left: '',
      right: '4%',
      bottom: '2.5%',
      top: '2.5%',
      containLabel: true
    },
    series: [{
      type: 'bar',
      name: "产出",
      barWidth : 60,
      itemStyle: {
        normal: {
          label: {
            show: false, //开启显示
            position:"insideRight", //在上方显示
            textStyle: { //数值样式
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 600
            }
          },
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: 'rgba(47,248,255,.8)'
          }, {
            offset: 1,
            color: 'rgba(47,248,255,0)'
          }]),
          // barBorderRadius:15

        }
      },
      // 内容反向
      data: [19, 29, 39, 81, 29]
    }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

  let dom = document.getElementById('bar');
  dom.querySelector('div').style.width = '0';
  dom.querySelector('div').style.height = '0';
  return myChart;
}

// 本年与上年比对
function initChart3() {

  const myChart = init(document.getElementById('line') as HTMLDivElement);

  let option = {
    tooltip: {
      type: "cross",
      trigger: "axis",
      formatter: function(params) {
        let res = "";
        for(let k in params) {
          res += params[k].marker + params[k].seriesName + "风险点 - " + params[k].name + ": " + params[k].data + " 个<br/>";
        }
        return res;
      },
    },
    legend: {
      top: 10,
      itemWidth: 15,
      itemHeight: 8,
      itemGap: 20,
      right: "10%",
      textStyle: {
        color: " #333333",
        fontSize: 16,
      },
      // data: ["实际", "计划", "对比"],
      data: ["本年", "上年", "其他"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLine: {
        symbol:['none','arrow'],
        symbolOffset:[0, 10],//箭头距离两端的距离,可为负数
        lineStyle: {
          color: "#EDEDED"
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "white",
          fontSize: 10
        },
      },
      data: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
    },
    yAxis: {
      type: "value",
      name: "（数）",
      nameTextStyle: {
        color: "white",
        fontSize: 16,
        padding: [0, 0, 0, -30],
      },
      axisLine: {
        show: true,
        symbol:['none','arrow'],
        symbolOffset:[0, 10],//箭头距离两端的距离,可为负数
        lineStyle: {
          color: "#EDEDED"
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#C0C0C0",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: "{value}",
        color: "white",
        fontSize: 16,
      },
      boundaryGap: ["20%", "20%"],
    },
    series: [{
      name: "本年",
      type: "line",
      symbol: "none",
      itemStyle: {
        normal: {
          color: "#ffd4c7", //图例的颜色
          lineStyle: {
            color: "#ffd4c7", //线的颜色
          },
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [{
                offset: 0,
                color: "rgba(255,212,199,0.3)",
              },
                {
                  offset: 1,
                  color: "rgba(255,212,199,0)",
                },
              ],
              false
          ),
          shadowColor: "rgba(255,212,199, 0.9)",
          shadowBlur: 20,
        },
      },
      markLine: {
        symbol: "none",
        label: {
          show: true,
        },
        data: [{
          xAxis: "03/07",
          name: "今日",
        }, ],
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
      {
        name: "上年",
        type: "line",
        symbol: "none",
        itemStyle: {
          normal: {
            color: "#89d8fe", //图例的颜色
            lineStyle: {
              color: "#89d8fe", //线的颜色
            },
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [{
                  offset: 0,
                  color: "rgba(137,216,254,0.3)",
                },
                  {
                    offset: 1,
                    color: "rgba(137,216,254,0)",
                  },
                ],
                false
            ),
            shadowColor: "rgba(137,216,254, 0.9)",
            shadowBlur: 20,
          },
        },
        data: [128, 132, 109, 124, 120, 132, 123, 118, 132, 109, 104, 120],
      },
      {
        name: "其他",
        type: "line",
        symbol: "none",
        itemStyle: {
          normal: {
            color: "#feee89", //图例的颜色
            lineStyle: {
              color: "#feee89", //线的颜色
            },
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [{
                  offset: 0,
                  color: "rgba(112,111,59,0.3)",
                },
                  {
                    offset: 1,
                    color: "rgba(137,216,254,0)",
                  },
                ],
                false
            ),
            shadowColor: "#feee89",
            shadowBlur: 20,
          },
        },
        data: [180, 152, 129, 154, 190, 232, 133],
      },
      // {
      //   name: "对比",
      //   type: "line",
      //   symbol: "none",
      //   itemStyle: {
      //     normal: {
      //       color: "#77f0c4", //图例的颜色
      //       lineStyle: {
      //         type: "dotted", //'dotted'虚线 'solid'实线
      //         width: 2,
      //         color: "#77f0c4", //线的颜色
      //       },
      //     },
      //   },
      //   data: [180, 152, 161, 154, 190, 172, 121, 154, 160, 132, 181, 174],
      // },
    ],
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

  let dom = document.getElementById('line');
  dom.querySelector('div').style.width = '0';
  dom.querySelector('div').style.height = '0';
}

// 重点企业
let enterpriseData = [
  {
    "智慧产业园": {
      content1: "内容1",
      content2: "内容2",
      content3: "内容3",
      content4: "内容4",
      content5: "内容5",
      content6: "内容6",
    }
  },
  {
    "智慧城市": {
      content1: "内容1",
      content2: "内容2",
      content3: "内容3",
      content4: "内容4",
      content5: "内容5",
      content6: "内容6",
    }
  },
  {
    "智慧业": {
      content1: "内容1",
      content2: "内容2",
      content3: "内容3",
      content4: "内容4",
      content5: "内容5",
      content6: "内容6",
    }
  },
  {
    "智慧物流": {
      content1: "内容1",
      content2: "内容2",
      content3: "内容3",
      content4: "内容4",
      content5: "内容5",
      content6: "内容6",
    }
  },
  {
    "智慧教育": {
      content1: "内容1",
      content2: "内容2",
      content3: "内容3",
      content4: "内容4",
      content5: "内容5",
      content6: "内容6",
    }
  },
  {
    "智慧医学": {
      content1: "内容1",
      content2: "内容2",
      content3: "内容3",
      content4: "内容4",
      content5: "内容5",
      content6: "内容6",
    }
  }
]

let enterpriseCount = enterpriseData.length;
nextTick(()=>{
  if (enterpriseCount > 0) {
    for(let i in enterpriseData) {
      let index = parseInt(i)+1;
      let dom = document.querySelector('.card-all-'+index)

      for(let j in enterpriseData[i]){
        dom.querySelector('.card-1 .card-div-item-title').textContent = j;
      }
    }
  }
})


</script>


<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3"> {{store.state.title}} </span>
          </template>
        </el-page-header>
      </el-header>
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="24" class="main-left">
              <div class="main-left-top" >
                <div class="title">
                  （未知-待处理）
                </div>
<!--                <div id="map"></div>-->
              </div>
              <div class="main-left-bottom">
                <div class="title">
                  项目风险点前十情况
                </div>
                <div class="content">
                  <!-- 待做动态数据 -->
                  <el-carousel :interval="1000" arrow="hover">
                    <el-carousel-item v-for="item in 10" :key="item">
                      <el-row>
                        <el-col :span="12" class="main-left-bottom-left">
                          <div class="box">
                            <span class="t">土地</span>
                            <span class="c c1">29</span>
                          </div>
                          <div class="box">
                            <span class="t">矿产</span>
                            <span class="c c2">81</span>
                          </div>
                          <div class="box">
                            <span class="t">基础</span>
                            <span class="c c3">39</span>
                          </div>
                          <div class="box">
                            <span class="t">残保金</span>
                            <span class="c c4">29</span>
                          </div>
                        </el-col>
                        <el-col :span="12" class="main-left-bottom-right">
                          <div class="box">
                            <span class="t">企业名称</span>
                            <span class="c">企业内容</span>
                          </div>
                        </el-col>
                      </el-row>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </el-col>
            <el-col :span="24" class="main-right">
              <div class="main-right-top">
                <div class="title">
                  涉及本年申报风险
                </div>
                <div id="line"></div>
              </div>
              <div class="main-right-bottom">
                <div class="title">
                  重点企业
                </div>
                <div id="card">
                  <el-carousel :interval="4000" arrow="hover">
                    <el-carousel-item v-for="item in enterpriseCount" :key="item">
                      <el-card :class="`card-all card-all-${item}`">
                        <div class="card-div-box">
                          <el-row>
                            <el-col :span="12">
                              <el-row class="card-left">
                                <el-col>
                                  <div class="card-left-top">
                                    <el-row>
                                      <el-col :span="12">
                                        <el-card class="card-div-item card-1">
                                          <div class="card-div-item-title">
                                            重点企业1
                                          </div>
                                          <div class="card-div-item-content">
                                            内容
                                          </div>
                                        </el-card>
                                      </el-col>
                                      <el-col :span="12">
                                        <el-card class="card-div-item card-2">
                                          <div class="card-div-item-title">
                                            标题
                                          </div>
                                          <div class="card-div-item-content">
                                            内容
                                          </div>
                                        </el-card>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </el-col>
                                <el-col>
                                  <div class="card-left-bottom">
                                    <el-row>
                                      <el-col :span="24">
                                        <el-card class="card-div-item card-3">
                                          <div class="card-div-item-title">
                                            标题
                                          </div>
                                          <div class="card-div-item-content">
                                            内容
                                          </div>
                                        </el-card>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </el-col>
                              </el-row>
                            </el-col>
                            <el-col :span="6">
                              <el-row class="card-left">
                                <el-col :span="24">
                                  <el-card class="card-div-item card-4">
                                    <div class="card-div-item-title">
                                      标题
                                    </div>
                                    <div class="card-div-item-content">
                                      内容
                                    </div>
                                  </el-card>
                                </el-col>
                                <el-col :span="24">
                                  <el-card class="card-div-item card-5">
                                    <div class="card-div-item-title">
                                      标题
                                    </div>
                                    <div class="card-div-item-content">
                                      内容
                                    </div>
                                  </el-card>
                                </el-col>
                              </el-row>
                            </el-col>
                            <el-col :span="6">
                              <el-row class="card-right">
                                <el-col :span="24">
                                  <el-card class="card-div-item card-6">
                                    <div class="card-div-item-title">
                                      标题
                                    </div>
                                    <div class="card-div-item-content">
                                      内容
                                    </div>
                                  </el-card>
                                </el-col>
                              </el-row>
                            </el-col>
                          </el-row>
                        </div>
                      </el-card>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style lang="less" scoped>
@base-width: 1920px;
@base-height: 1080px;

@base-header-height: 60px;
@base-header-height-margin-bottom: 10px;

@base-aside-width: 400px;
@base-aside-width-margin-right: 10px;

@base-main-width: 1920px - @base-aside-width - @base-aside-width-margin-right;
@base-main-el-row: @base-main-width - 42;
@base-main-left: @base-main-el-row / 2;
@base-main-right: @base-main-el-row / 2;

.common-layout {
  width: @base-width;
  height: @base-height;
  background-color: rgba(8, 16, 35, 1);

  .el-container {
    height: 100%;

    .el-header {
      background-color: rgba(8, 16, 35, 1);
      height: 60px; // px
      display: flex;
      align-items: center;
      justify-content: left;
      color: #fff;
      border-bottom: 1px solid #536691; // px
      margin-bottom: 10px; // px
    }

    .el-aside {
      border: 1px solid #536691;
      height: 100%;
      width: @base-aside-width;
      margin-right: 10px; // px
      padding: 8px;

      .el-card {
        border: 0;
        height: 100%;
        color: #3386D4; // 搭配背景颜色的文字颜色
        background: none;

        :deep(.el-card__header) {
          border-bottom: 1px solid #536691;
        }

        .card-header {
          font-size: 20px;
          font-weight: bold;
        }

        .ec-info {
          height: 30%;
          //background-color: #6FB1FC;
          border: 1px solid #536691;

          p {
            font-size: 14px;
            text-indent: 2em;
            text-align: left;
          }
        }

        :deep(.el-radio-group) {
          margin-top: 10px;
          flex-direction: column;
          width: 100%;

          .el-radio-button {
            width: 100%;

            .el-radio-button__inner {
              background: none;
              width: 100%;
              border-radius: 4px;
              margin-bottom: 8px;
              border: 1px solid #536691;
            }
          }

          .is-active {
            .el-radio-button__inner {
              color: #3C7EF9; // 高亮————搭配背景颜色的文字颜色
              border-color: #409eff;
              box-shadow: none;
            }
          }
        }
      }
    }

    .el-main {
      height: 100%;
      border: 1px solid #536691; // px
      width: @base-main-width;

      .el-row { // 默认padding  20px
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-items: center;
        justify-content: space-between;

        .title {
          display: flex;
          align-items: center;
          justify-content: start;
          padding-left: 5px;
          height: 60px;
        }

        .main-left {
          height: 100%;
          margin-right: 10px; // px  与右边的div平分宽度
          flex: 1;
          display: flex;
          flex-direction: column;

          .main-left-top {
            margin-bottom: 10px;
            flex: 1;
            border: 1px solid #536691;
            display: flex;
            flex-direction: column;

            #map {
              width: 100%;
              flex: 1;
              white-space: nowrap; // 指定元素内部的文本内容是否可以换行,它的作用是阻止元素中的文本换行
            }
          }

          .main-left-bottom {
            flex: 1;
            border: 1px solid #536691;
            display: flex;
            flex-direction: column;

            :deep(.content) {
              flex: 1;

              .el-carousel{
                height: 100%;
                .el-carousel__container{
                  height: 100%;
                }
              }

              .el-row{
                height: 100%;
                .main-left-bottom-left{
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  padding: 20px;
                  .box{
                    flex:1;
                    display: flex;
                    justify-content: space-between;
                    background-color: #747bff;
                    .t{
                      display: flex;
                      align-items: center;
                      align-self: center;
                      padding-left: 16px;
                      text-align: left;
                    }
                    .c1, .c2, .c3, .c4, .c5{
                      display: flex;
                      align-items: center;
                      align-self: center;
                      padding-right: 16px;
                      text-align: left;
                    }
                  }
                  .box:not(:last-child){
                    margin-bottom: 20px;
                  }
                }
                .main-left-bottom-right{
                  height: 100%;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;

                  .box {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background-color: #747bff;

                    .t{
                      width: 100%;
                      height: 60px;
                      font-size: 24px;
                      display: flex;
                      align-items: center;
                      align-self: center;
                      justify-content: center;
                      border-bottom: 5px solid rgba(8, 16, 35, 1);
                    }

                    .c{
                      flex: 1;
                      white-space: nowrap;
                    }
                  }
                }
              }
            }
          }
        }

        .main-right {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;

          .main-right-top {
            margin-bottom: 10px;
            flex: 1;
            border: 1px solid #536691;
            display: flex;
            flex-direction: column;

            #line {
              flex: 1;
            }
          }

          .main-right-bottom {
            flex: 1;
            border: 1px solid #536691;
            display: flex;
            flex-direction: column;

            #card {
              flex: 1;

              .el-carousel__item:nth-child(2n) {
                background-color: #99a9bf;
              }

              .el-carousel__item:nth-child(2n + 1) {
                background-color: #d3dce6;
              }

              :deep(.el-carousel){
                height: 100%;
                .el-carousel__container{
                  height: 100%;
                  .el-carousel__item{
                    background: none;
                    height: 100%;
                  }
                  .is-active{
                    width: 100%;
                    transform: translateX(0) scale(1) !important;
                  }
                }
              }

              :deep(.card-all) {
                height: 100%;
                background: none;
                border: 0;

                .cl-card, .el-card__body, .card-div-box, .el-row,
                .card-left-bottom, .card-left-top, .card-div-item {
                  height: 100%;
                  box-shadow: none;
                  border-radius: 0;
                }
                .card-left-top .el-row .el-col:first-child .el-card{
                  border-top-left-radius: 4px;
                }

                .card-left-bottom .el-row .el-col:first-child .el-card{
                  border-bottom-left-radius: 4px;
                }

                .card-right .el-card{
                  border-top-right-radius: 4px;
                  border-bottom-right-radius: 4px;
                }
              }
            }
          }
        }
      }
    }
  }
}


</style>