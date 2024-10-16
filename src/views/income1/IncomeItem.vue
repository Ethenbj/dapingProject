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
      initChart();
      initChart2();
      initChart3();

      // 替换返回符号
      document.querySelector('.el-page-header__title').remove()
      document.querySelector('.el-divider--vertical').remove()
      let header_page_dom = document.querySelector('.el-page-header__icon');
      header_page_dom.querySelector('i').remove();
      let header_page_dom2 = document.createElement('span');
      header_page_dom2.className = 'new-back-icon';
      header_page_dom2.setAttribute('style','width: 34px;height: 34px; background-size: 100% 100%;' +
          'margin-right:20px')
      header_page_dom2.style.backgroundImage = "url('src/assets/img/返回.png')"
      header_page_dom.appendChild(header_page_dom2);

  })

  // 返回
  function goBack(){
     router.back()
  }

  const radio1 = ref<TabsInstance['radio1']>('2024');

  // 左侧按钮点击事件
  function handlerYearDataBtn(value){
    ElMessage(`选择 ${value} 年度数据`)
  }

  // 地图
  function initChart() {
    echarts.registerMap('hunan',hunanMapData);
    const myChart = init(document.getElementById('map') as HTMLDivElement);

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
          // color: ['#00467F', '#A5CC82'],
          color: ['#3d83c6', '#f16ca0'],
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
          label: {
            // 通常状态下的样式
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
              },
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
          data: [
            {name: '', selected: true}, // 选中某市
            { name: "长沙市", value: 2333 },
            { name: "岳阳市", value: 4057 },
            { name: "常德市", value: 6007 },
            { name: "衡阳市", value: 5007 },
            { name: "郴州市", value: 3007 },
            { name: "湘潭市", value: 2007 },
            { name: "邵阳市", value: 1007 },
            { name: "永州市", value: 5007 },
            { name: "益阳市", value: 3007 },
            { name: "娄底市", value: 5007 },
            { name: "怀化市", value: 4007 },
            { name: "湘西州", value: 2007 },
            { name: "张家界市", value: 3007 },
            { name: "湘江新区", value: 5007 },
            { name: "株洲市", value: 2007 },
          ]
        }
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


    var xdata = ['长沙市', '岳阳市', '常德市', '衡阳市', '株洲市', '郴州市', '湘潭市','邵阳市','永州市','益阳市', '娄底市', '怀化市', '湘西州', '张家界市', '湘江新区'];
    var ydata  = [10,20,15,10,9,16,13,21,14,17,5,9,11,14,17];
    let option = {
      // backgroundColor: 'rgba(8, 16, 35, 1)',
      tooltip: {
        show: true,
        formatter: "{b}: {c}万元",
        trigger: "axis",
        axisPointer: {
          type:'shadow',
          shadowStyle :{
            color:'rgba(48,95,237,0.1)'
          }
        },
        backgroundColor: "rgba(255,255,255,1)",
        padding: [5, 5],
        textStyle: {
          color: "#7588E4"
        },
        extraCssText: "box-shadow: 0 0 5px rgba(0,0,0,0.3)"
      },
      // legend: {
      //   right: 20,
      //   orient: "vertical",
      //   data: ["在场人数"]
      // },
      xAxis: {
        data: xdata,
        axisLine: {
          symbol:['none','arrow'],
          symbolOffset:[0, 10],//箭头距离两端的距离,可为负数
          lineStyle: {
            color: "#EDEDED"
          },
        },
        axisLabel: {
          color: "#fff",
          fontSize: 12,
          // rotate: 60,
          formatter:function(value){
            return value.split("").join("\n");
          }
        }
      },
      yAxis: {
        nameTextStyle: {
          color: "#fff",
          fontSize: 14
        },
        axisLine: {
          show: true,
          symbol:['none','arrow'],
          symbolOffset:[0, 10],//箭头距离两端的距离,可为负数
          lineStyle: {
            color: "#EDEDED"
          }
        },
        axisLabel: {
          color: "#fff",
          fontSize: 14
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#EDEDED"
          }
        },
        minInterval : 1
      },
      grid:{
        show:false,
        top:'10%',
        right:'5%',
        bottom:'24%',
        left:'5%'
      },
      series: [
        {
          name : '在场人数',
          type: "bar",
          barWidth: 18,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    /* 4364F7*/
                    {
                      offset: 0,
                      color: "#6FB1FC"
                    },

                    {
                      offset: 0.8,
                      color: "#0052D4"
                    }
                  ],
                  false
              ),
            },
          },
          data: ydata,
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    }
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
              res += params[k].marker + params[k].seriesName + " - " + params[k].name + ": " + params[k].data + " 亿元<br/>";
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
          color: "white",
          fontSize: 16,
        },
        // data: ["实际", "计划", "对比"],
        data: ["本年", "上年"],
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
        name: "（亿）",
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
            color: "#dc7585", //图例的颜色
            lineStyle: {
              color: "#dc7585", //线的颜色
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
              color: "#379cf8", //图例的颜色
              lineStyle: {
                color: "#379cf8", //线的颜色
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
            <span class="text-large font-600 mr-3">收入情况：{{store.state.title}} </span>
          </template>
        </el-page-header>
      </el-header>
      <el-container>
        <el-aside>
          <div class="left">
            <div class="title-box">
              <div class="title">{{store.state.title}}</div>
            </div>
            <div class="content-box">
              <div class="content">
                <el-card class="ec-info">
                  <p>
                    简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介
                  </p>
                </el-card>
                <el-radio-group v-model="radio1" size="large" @change="handlerYearDataBtn">
                  <el-radio-button label="2024年数据" value="2024" />
                  <el-radio-button label="2023年数据" value="2023" />
                  <el-radio-button label="2022年数据" value="2022" />
                  <el-radio-button label="2021年数据" value="2021" />
                  <el-radio-button label="2020年数据" value="2020" />
                  <el-radio-button label="2019年数据" value="2019" />
                  <el-radio-button label="2018年数据" value="2018" />
                </el-radio-group>
              </div>
              <div class="footer">
                <div class="f-top">2018 - 2024</div>
                <div class="f-min">{{store.state.title}}</div>
                <div class="f-bottom"></div>
              </div>
            </div>
          </div>

        </el-aside>
        <el-main>
          <el-row>
            <el-col :span="24" class="main-left">
              <div class="main-left-top" >
                <div class="title-box">
                  <div class="title">
                    各市各州
                  </div>
                </div>
                <div id="map"></div>
              </div>
              <div class="main-left-bottom">
                <div class="title-box">
                  <div class="title">
                    缴费人数情况
                  </div>
                </div>
                <div id="bar"></div>
              </div>
            </el-col>
            <el-col :span="24" class="main-right">
              <div class="main-right-top">
                <div class="title-box">
                  <div class="title">
                    同比情况
                  </div>
                </div>
                <div id="line"></div>
              </div>
              <div class="main-right-bottom">
                <div class="title-box">
                  <div class="title">
                    重点企业
                  </div>
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
  background-image: url("@/assets/img/纯背景.png");
  background-size: cover;

  .el-container {
    height: 100%;

    .el-header {
      height: 60px; // px
      display: flex;
      align-items: center;
      justify-content: left;
      color: #fff;
      margin-bottom: 10px; // px

      background-image: url("@/assets/img/返回栏背景.png");
      background-size: contain;

      :deep(.el-page-header) {
        .el-page-header__title {
          margin-left: 10px;
          font-family: "黑体";
          font-size: 30px;
          font-weight: bold;
          font-synthesis: style;
          font-style: italic;
        }
        .el-divider--vertical{
          height: 1.5rem;
        }
        .el-page-header__content span{
          color: white;
          font-size: 24px;
        }
      }
    }

    .el-aside {
      height: 100%;
      width: @base-aside-width;
      padding: 0 30px 30px 30px;

      .left {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .title-box {
          display: flex;
          height: 60px;
          width: 100%;
          justify-content: center;
          align-items: center;

          background-image: url("@/assets/img/标题.png");
          background-size: 100%;
          margin-bottom: 10px;

          .title {
            font-weight: bold;

            font-size: 18px;
            width: 100%;
            text-align: center;
          }
        }

        .content-box{
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          background-image: url("@/assets/img/box框.png");
          background-size: 100% 100%;
          .content{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .ec-info {
              color: #3386D4; // 搭配背景颜色的文字颜色
              background: none;
              height: 30%;
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
                  border: 1px solid white;
                  color: white;
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
          .footer{
            display: flex;
            flex-direction: column;
            .f-top{
              font-size: 24px;
              font-family: '黑体';
              z-index: 1;
            }

            .f-min{
              color: aqua;
              font-size: 30px;
              font-family: '华文楷体';
              margin-bottom: -80px;
              z-index: 1;
            }

            .f-bottom{
              height: 250px;
              width: 100%;
              background-image: url("@/assets/img/左下大图标.png");
              background-size: 88%;
              margin-left: 10px;
            }
          }
        }
      }
    }

    .el-main {
      height: 100%;
      width: @base-main-width;

      padding: 0 30px 30px 0;

      .el-row { // 默认padding  20px
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-items: center;
        justify-content: space-between;

        .title-box{
          height: 60px;
          margin-bottom: 10px;

          background-image: url("@/assets/img/文本框.png");
          background-repeat: no-repeat;
          margin-left: -35px;
          z-index: 1;
          .title{
            height: 100%;
            font-size: 24px;
            padding-left: 60px;
            display: flex;
            justify-content: left;
            align-items: center;
          }
        }

        .main-left {
          height: 100%;
          margin-right: 30px; // px  与右边的div平分宽度
          flex: 1;
          display: flex;
          flex-direction: column;

          .main-left-top {
            margin-bottom: 10px;
            flex: 1;
            display: flex;
            flex-direction: column;

            #map {
              background-image: url("@/assets/img/box框.png");
              background-size: 100% 100%;
              flex: 1;
              white-space: nowrap; // 指定元素内部的文本内容是否可以换行,它的作用是阻止元素中的文本换行
            }
          }

          .main-left-bottom {
            flex: 1;
            display: flex;
            flex-direction: column;

            #bar {
              background-image: url("@/assets/img/box框.png");
              background-size: 100% 100%;
              flex: 1;
              white-space: nowrap; // 指定元素内部的文本内容是否可以换行,它的作用是阻止元素中的文本换行
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
            display: flex;
            flex-direction: column;

            #line {
              flex: 1;
              white-space: nowrap; // 指定元素内部的文本内容是否可以换行,它的作用是阻止元素中的文本换行
              background-image: url("@/assets/img/box框.png");
              background-size: 100% 100%;

            }
          }

          .main-right-bottom {
            flex: 1;
            display: flex;
            flex-direction: column;

            #card {
              flex: 1;
              white-space: nowrap; // 指定元素内部的文本内容是否可以换行,它的作用是阻止元素中的文本换行
              background-image: url("@/assets/img/box框.png");
              background-size: 100% 100%;

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

                .el-card{
                  border: 1px solid #83a9aa;
                  border-radius: 0;
                  background-color: #10306b4a;
                  color: white;
                }

                .card-left-top .el-row .el-col:first-child .el-card{
                  border-top-left-radius: 4px;
                }

                .card-left-top{
                  .card-1{
                    //background-color: rgba(227,161,96,1);
                  }
                  .card-2{
                    //background-color: rgba(0,222,255,1);
                  }
                }

                .card-left-bottom .el-row .el-col:first-child .el-card{
                  border-bottom-left-radius: 4px;
                }

                .card-left-bottom{
                  .card-3{
                    //background-color: #6FB1FC;
                  }
                }

                .card-left{
                  .card-4{
                    //background-color: #6FB1FC;
                  }

                  .card-5{
                    //background-color: #92FFDFFF;
                  }
                }

                .card-right .el-card{
                  border-top-right-radius: 4px;
                  border-bottom-right-radius: 4px;
                }

                .card-right{
                  .card-6{
                    //background-color: rgba(0,222,255,1);
                  }
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