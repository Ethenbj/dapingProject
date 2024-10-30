<script setup lang="ts">
import {onMounted, ref, reactive, watch, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
import * as echarts from 'echarts';
import { init } from 'echarts';
import { ElMessage  } from 'element-plus'
import type { TabsInstance } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

const router = new useRouter();
const store = useStore()


// 加载
onMounted(()=>{
  // 初始化 echarts
  initChart();
  // initChart2();
  initChart3();

  htongjitu1();
  htongjitu2();
  htongjitu3();


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
// 历年数据选择下拉框
const year_select = ref('');
const year_select_options = [
  { value: '2023', label: '2023年数据' },
  { value: '2022', label: '2022年数据' },
  { value: '2021', label: '2021年数据' },
  { value: '2020', label: '2020年数据' },
  { value: '2019', label: '2019年数据' },
  { value: '2018', label: '2018年数据' },
]
function handlerYearDataRadio(value){
  radio1.value = value
  year_select.value = ""
  document.querySelector('.select-year .el-select__wrapper').style.border = '1px solid #fff'
  document.querySelector('.select-year .el-select__placeholder').style.color = '#a8abb2'

  ElMessage(`选择 ${value} 年度数据`)
}

function handlerYearDataSelect(value){
  radio1.value = ''
  document.querySelector('.select-year .el-select__wrapper').style.border = '1px solid #409eff'
  document.querySelector('.select-year .el-select__placeholder').style.color = '#3C7EF9'

  ElMessage(`选择 ${value} 年度数据`)
}


// 饼图
function initChart() {

  const myChart = init(document.getElementById('pie') as HTMLDivElement);

  let title = '总量';
  let colorList = [
    '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
    // '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b'
  ]
  let echartData = [
    {"name": "教育费附加", "value": 2289},
    {"name": "地方教育附加", "value": 671},
    {"name": "残疾人保障金", "value": 2518},
    {"name": "文化事业建设费", "value": 200},
    {"name": "水利建设基金", "value": 1952},
    {"name": "工会经费", "value": 926},
    {"name": "电力能源类", "value": 4536},
    {"name": "水土保持补偿费", "value": 750},
    {"name": "排污权出让收入", "value": 2373},
    {"name": "防空地下室易地建设费", "value": 493},
    {"name": "城镇垃圾处理费", "value": 385},
    {"name": "土地闲置费", "value": 5449},
    {"name": "土地出让金", "value": 869},
    {"name": "矿产资源专项收入", "value": 4960},
    {"name": "森林植被恢复费", "value": 270},
    {"name": "河道砂石收入", "value": 566},
    {"name": "土地及土地面建筑", "value": 1077},
    {"name": "停车泊位费", "value": 339},
    {"name": "其他省级非税收入", "value": 4730},
  ]

  // let result: Array<object> = echartData.sort((n1, n2) =>{
  //   return n1.value - n2.value;
  // }

  let formatNumber = function (num) {
    let reg = /(?=(\B)(\d{3})+$)/g;
    return num.toString().replace(reg, ',');
  }
  let total = echartData.reduce((a, b) => {
    return a + b.value * 1
  }, 0);

  let option = {
    // backgroundColor: "#000c31",
    color: colorList,
    // tooltip: {
    //   trigger: 'item',
    //   formatter: '{a} <br/>{b}: {c} ({d}%)'
    // },
    title: [{
      text: '{name|' + title + '：}{val|' + formatNumber(total) + '}',
      // top: 10,
      right: 20,
      textStyle: {
        rich: {
          name: {
            fontSize: 16,
            fontWeight: 'normal',
            color: '#ff8800',
            padding: [10, 0]
          },
          val: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ff8800',
          }
        }
      }
    },
      {
        text:'',
        top: "38%",
        right: "center",
        textStyle: {}
      }
    ],
    series: [{
      type: 'pie',
      radius: ['55%', '70%'],
      center: ['50%', '48%'],
      data: echartData,
      hoverAnimation: true,
      itemStyle: {
        normal: {
          borderColor: colorList,
          borderWidth: 2
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: '#e6e6e6'
          }
        }
      },
      label: {
        normal: {
          formatter: '{icon|●}{name|{b}}{value|({d}%)}',
          color: 'inherit', // 同步颜色
          rich: {
            icon: {
              fontSize: 24
            },
            name: {
              fontSize: 12,
              padding: [0, 10, 0, 4],
            },
            value: {
              fontSize: 12,
              fontWeight: 'bold',
            }
          }
        }
      },
    }]
  };
  myChart.on("mouseover", (event) => {
    let name = echartData[event.dataIndex].name;
    let value = echartData[event.dataIndex].value;
    option.title[1].text = '{name|' + name + '}\n{val|' + value + '}';
    option.title[1].textStyle = {
      rich: {
        name: {
          fontSize: 16,
          align: "center",
          fontWeight: 'normal',
          padding: [10, 0],
          color: colorList[event.dataIndex],
        },
        val: {
          fontSize: 32,
          align: "center",
          fontWeight: 'bold',
          color: colorList[event.dataIndex],
        }
      }
    }
    myChart.setOption(option);
  })
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    let dom = document.getElementById('pie');
    dom.querySelector('div').style.width = '0';
    dom.querySelector('div').style.height = '0';

    // 饼图轮播
    autoHover(myChart, option, echartData.length, 4000, echartData);
}

/**
 *  echarts tooltip 自动轮播
 *  @author liuwei
 *  @param myChart    //初始化echarts的实例
 *  @param option     //指定图表的配置项和数据
 *  @param num        //类目数量(原因：循环时达到最大值后，使其从头开始循环)
 *  @param time       //轮播间隔时长
 *  @param echartData //数据
 */
function autoHover(myChart, option, num, time, echartData) {
  var defaultData = {   //设置默认值
    time: time,
    num: num
  };
  if(!time){
    time = defaultData.time;
  }
  if(!num){
    num = defaultData.num;
  }
  var count = 0;
  var timeTicket = null;

  timeTicket && clearInterval(timeTicket);
  timeTicket = setInterval(function () {
    myChart.dispatchAction({
      type: "downplay",
      seriesIndex: 0 //serieIndex的索引值   可以触发多个
    });
    myChart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: count
    });
    myChart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: count
    });

    let name = echartData[count].name;
    let value = echartData[count].value;
    option.title[1].text = '{name|' + name + '}\n{val|' + value + '}';
    option.title[1].textStyle = {
      rich: {
        name: {
          fontSize: 16,
          align: "center",
          fontWeight: 'normal',
          padding: [10, 0],
          color: option['color'][count],
        },
        val: {
          fontSize: 32,
          align: "center",
          fontWeight: 'bold',
          color: option['color'][count],
        }
      }
    }
    myChart.setOption(option);


    count++;
    if (count >= num) {
      count = 0
    }
  }, time);

  myChart.on("mouseover", function (params) {
    clearInterval(timeTicket);
    myChart.dispatchAction({
      type: "downplay",
      seriesIndex: 0
    });
    myChart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: params.dataIndex
    });
    myChart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: params.dataIndex
    });
  });

  myChart.on("mouseout", function () {
    timeTicket && clearInterval(timeTicket);
    timeTicket = setInterval(function () {
      myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0 //serieIndex的索引值   可以触发多个
      });
      myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: count
      });
      myChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: count
      });

      let name = echartData[count].name;
      let value = echartData[count].value;
      option.title[1].text = '{name|' + name + '}\n{val|' + value + '}';
      option.title[1].textStyle = {
        rich: {
          name: {
            fontSize: 16,
            align: "center",
            fontWeight: 'normal',
            padding: [10, 0],
            color: option['color'][count],
          },
          val: {
            fontSize: 32,
            align: "center",
            fontWeight: 'bold',
            color: option['color'][count],
          }
        }
      }
      myChart.setOption(option);

      count++;
      if (count >= defaultData.num) {
        count = 0
      }
    }, defaultData.time);
  });
}

function htongjitu1(){
  var chartDom = document.getElementById('htongjitu1');
  var myChart = echarts.init(chartDom);

  //初始化数据
  var category = ["教育费附加","地方教育附加","残疾人保障金","文化事业建设费","水利建设基金","工会经费","电力能源类","水土保持补偿费","排污权出让收入",
    "防空地下室易地建设费","城镇垃圾处理费","土地闲置费","土地出让金","矿产资源专项收入","森林植被恢复费","河道砂石收入","非经营性国有资产收入","土地及土地面建筑","停车泊位费","其他省级非税收入","河道砂石收入","土地及土地面建筑","停车泊位费","其他省级非税收入"];
  var barData = [163, 212, 218, 581, 431, 383, 163,163, 212, 218, 581, 431, 383, 383,163,153,163, 212, 218, 581, 431, 383, 163,163];

  var option = {
    title: {
      subtext: '应申报',
      // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
      x: '150',
      // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
      y: '10',
      // itemGap设置主副标题纵向间隔，单位px，默认为10，
      itemGap: 30,
      // 副标题文本样式设置
      subtextStyle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '4%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 1000,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel:{
        show: false
      }, //显示x轴的数值
      splitLine: {
        show: false
      },
      boundaryGap: ['5%', '50%'],//留白大小，坐标轴两边留白
    },
    yAxis: {
      type: 'category',
      data: category,
      //升序
      inverse: true,
      axisLabel: {
        margin: 65,
        align: 'left',
        textStyle: {
          color: 'white',
          fontSize: 10
        }
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color:"#10306BA5",//线条颜色
          type:"dashed"//线条样式，默认是实现，dashed是虚线
        },
      },
      axisTick: {
        show: false
      },
      offset: 50,
      nameTextStyle: {
        fontSize: 15
      },
      // boundaryGap: ['5%', '20%'],//留白大小，坐标轴两边留白
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: barData,
        barWidth: 10,
        barGap: 10,
        smooth: true,
        label: {
          normal: {
            show: true,
            position: 'right',
            // offset: [1, -10],
            textStyle: {
              // color: '#F68300',
              color: 'white',
              fontSize: 13
            }
          }
        },
        itemStyle: {
          emphasis: {
            // barBorderRadius: 7
          },
          normal: {
            // barBorderRadius: 7,
            // color: new echarts.graphic.LinearGradient(
            //     0, 0, 1, 0,
            //     [
            //       {offset: 0, color: '#b0e7f0'},
            //       // {offset: 1, color: '#37BBF8'}
            //
            //     ]
            // )

            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgb(255,255,255)'
            }, {
              offset: 1,
              color: 'rgba(255,255,255,0)'
            }]),
            borderWidth: 2,
            barBorderRadius:15
          }
        }
      }
    ]
  };

  option && myChart.setOption(option);

  return myChart;
}
function htongjitu2(){
  var chartDom = document.getElementById('htongjitu2');
  var myChart = echarts.init(chartDom);

  //初始化数据
  var category = ["教育费附加","地方教育附加","残疾人保障金","文化事业建设费","水利建设基金","工会经费","电力能源类","水土保持补偿费","排污权出让收入",
    "防空地下室易地建设费","城镇垃圾处理费","土地闲置费","土地出让金","矿产资源专项收入","森林植被恢复费","河道砂石收入","非经营性国有资产收入","土地及土地面建筑","停车泊位费","其他省级非税收入","河道砂石收入","土地及土地面建筑","停车泊位费","其他省级非税收入"];
  var barData = [163, 212, 218, 581, 431, 383, 163,163, 212, 218, 581, 431, 383, 383,163,153,163, 212, 218, 581, 431, 383, 163,163];

  var option = {
    title: {
      subtext: '已申报',
      // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
      x: 'center',
      // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
      y: '10',
      // itemGap设置主副标题纵向间隔，单位px，默认为10，
      itemGap: 30,
      // 副标题文本样式设置
      subtextStyle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '4%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 1000,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel:{
        show: false
      }, //显示x轴的数值
      splitLine: {
        show: false
      },
      boundaryGap: ['5%', '50%'],//留白大小，坐标轴两边留白
    },
    yAxis: {
      type: 'category',
      data: category,
      //升序
      inverse: true,
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color:"#10306BA5",//线条颜色
          type:"dashed"//线条样式，默认是实现，dashed是虚线
        },
      },
      axisTick: {
        show: false
      },
      offset: 10,
      nameTextStyle: {
        fontSize: 15
      },
      // boundaryGap: ['5%', '20%'],//留白大小，坐标轴两边留白
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: barData,
        barWidth: 10,
        barGap: 10,
        smooth: true,
        label: {
          normal: {
            show: true,
            position: 'right',
            // offset: [1, -10],
            textStyle: {
              // color: '#F68300',
              color: 'white',
              fontSize: 13
            }
          }
        },
        itemStyle: {
          emphasis: {
            // barBorderRadius: 7
          },
          normal: {
            // barBorderRadius: 7,
            // color: new echarts.graphic.LinearGradient(
            //     0, 0, 1, 0,
            //     [
            //       {offset: 0, color: '#e2e7f0'},
            //       // {offset: 1, color: '#37BBF8'}
            //
            //     ]
            // )

            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgba(0,255,255,1)'
            }, {
              offset: 1,
              color: 'rgb(15,255,255,0)'
            }]),
            borderWidth: 2,
            barBorderRadius:15
          }
        }
      }
    ]
  };

  option && myChart.setOption(option);

  return myChart;
}
function htongjitu3(){
  var chartDom = document.getElementById('htongjitu3');
  var myChart = echarts.init(chartDom);

  //初始化数据
  var category = ["教育费附加","地方教育附加","残疾人保障金","文化事业建设费","水利建设基金","工会经费","电力能源类","水土保持补偿费","排污权出让收入",
    "防空地下室易地建设费","城镇垃圾处理费","土地闲置费","土地出让金","矿产资源专项收入","森林植被恢复费","河道砂石收入","非经营性国有资产收入","土地及土地面建筑","停车泊位费","其他省级非税收入","河道砂石收入","土地及土地面建筑","停车泊位费","其他省级非税收入"];
  var barData = [23, 22, 28, 58, 43, 33, 63,63, 12, 21, 51, 41, 83, 13,100,23, 22, 28, 58, 43, 33, 63,63, 12];

  var option = {
    title: {
      subtext: '申报比例',
      // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
      x: 'center',
      // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
      y: '10',
      // itemGap设置主副标题纵向间隔，单位px，默认为10，
      itemGap: 30,
      // 副标题文本样式设置
      subtextStyle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '0%',
      right: '25%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel:{
        show: false
      }, //显示x轴的数值
      splitLine: {
        show: false
      },
      boundaryGap: ['5%', '50%'],//留白大小，坐标轴两边留白
    },
    yAxis: {
      type: 'category',
      data: category,
      //升序
      inverse: true,
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color:"#10306BA5",//线条颜色
          type:"dashed"//线条样式，默认是实现，dashed是虚线
        },
      },
      axisTick: {
        show: false
      },
      offset: 10,
      nameTextStyle: {
        fontSize: 15
      },
      // boundaryGap: ['5%', '20%'],//留白大小，坐标轴两边留白
    },
    series: [
      {
        name: '百分比',
        type: 'bar',
        data: barData,
        barWidth: 10,
        barGap: 10,
        smooth: true,
        label: {
          normal: {
            show: true,
            position: 'right',
            // offset: [1, -10],
            textStyle: {
              // color: '#F68300',
              color: 'white',
              fontSize: 13
            },
            formatter: function (params){
              let p = params.data
              return `${p}%`;
            }
          }
        },
        itemStyle: {
          emphasis: {
            // barBorderRadius: 7
          },
          normal: {
            // barBorderRadius: 7,
            // color: new echarts.graphic.LinearGradient(
            //     0, 0, 1, 0,
            //     [
            //       {offset: 0, color: '#5994ff'},
            //       // {offset: 1, color: '#37BBF8'}
            //     ]
            // )

            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgb(15,45,243)'
            }, {
              offset: 1,
              color: 'rgba(15,87,243,0)'
            }]),
            borderWidth: 2,
            barBorderRadius:15
          }
        }
      }
    ]
  };

  option && myChart.setOption(option);

  return myChart;
}

// 申报情况
function initChart2(){
  const myChart = init(document.getElementById('bar') as HTMLDivElement)


  var xdata = ["教育费附加","地方教育附加","残疾人保障金","文化事业建设费","水利建设基金","工会经费","电力能源类","水土保持补偿费","排污权出让收入",
    "防空地下室易地建设费","城镇垃圾处理费","土地闲置费","土地出让金","矿产资源专项收入","森林植被恢复费","河道砂石收入","土地及土地面建筑","停车泊位费","其他省级非税收入"];
  var ydata  = [10,20,15,10,9,16,13,21,14,17,5,9,11,14,17,5,9,11,11];
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
      padding: [5, 10],
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
      top:'5%',
      right:'5%',
      bottom:'29%',
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
    // for(let i in enterpriseData) {
    //   let index = parseInt(i)+1;
    //   let dom = document.querySelector('.card-all-'+index)
    //
    //   for(let j in enterpriseData[i]){
    //     dom.querySelector('.card-1 .card-div-item-title').textContent = j;
    //   }
    // }
  }
})


</script>


<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3">收入情况： {{store.state.title}} </span>
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
                <el-radio-group v-model="radio1" size="large" class="radio-year" @change="handlerYearDataRadio">
                  <el-radio-button label="2024年数据" value="2024" />
                </el-radio-group>
                <el-select v-model="year_select" placeholder="请选择历年数据" class="select-year" @change="handlerYearDataSelect">
                  <el-option
                      v-for="item in year_select_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                  <!--                        :disabled="item.disabled"-->
                </el-select>
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
                    各费种收入情况
                  </div>
                </div>
                <div id="pie"></div>
              </div>
              <div class="main-left-bottom">
                <div class="title-box">
                  <div class="title">
                  申报情况
                  </div>
                </div>
                <el-row id="bar">
                  <el-col :span="10">
                    <div class="col-xxl-6 htongjitu" id="htongjitu1"></div>
                  </el-col>
                  <el-col :span="7">
                    <div class="col-xxl-3 htongjitu" id="htongjitu2"></div>
                  </el-col>
                  <el-col :span="7">
                    <div class="col-xxl-3 htongjitu" id="htongjitu3"></div>
                  </el-col>
                </el-row>
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
                  <el-carousel :interval="100000" arrow="hover">
                    <el-carousel-item v-for="item in enterpriseCount" :key="item">
                      <el-card :class="`card-all card-all-${item}`">
                        <div class="card-div-box">
                          <el-row>
                            <el-col :span="10">
                              <el-row class="card-left">
                                <el-col>
                                  <div class="card-left-top">
                                    <el-row>
                                      <el-col :span="24">
                                        <el-card class="card-div-item card-1">
                                          <div class="qymc">
                                            <div class="card-div-item-title">
                                              企业名称
                                            </div>
                                            <div class="card-div-item-content">
                                              企业内容企业内容企业内容企业内容企业内容
                                            </div>
                                          </div>
                                          <div class="sbh">
                                            <div class="card-div-item-title">
                                              识别号
                                            </div>
                                            <div class="card-div-item-content sbh-c">
                                              1234567893216487
                                            </div>
                                          </div>
                                          <div class="zgswfj">
                                            <div class="card-div-item-title">
                                              主管税务分局
                                            </div>
                                            <div class="card-div-item-content">
                                              主管税务分局内容主管税务分局内容
                                            </div>
                                          </div>
                                          <div>
                                            <div class="card-div-item-title">
                                              本年纳税金额
                                            </div>
                                            <div class="card-div-item-content money">
                                              56 <span>万元</span>
                                            </div>
                                          </div>
                                          <div>
                                            <div class="card-div-item-title">
                                              上年纳税金额
                                            </div>
                                            <div class="card-div-item-content money">
                                              12 <span>万元</span>
                                            </div>
                                          </div>
                                        </el-card>
                                      </el-col>
                                    </el-row>
                                  </div>
                                </el-col>
                              </el-row>
                            </el-col>
                            <el-col :span="14">
                              <el-row class="right">
                                <el-col :span="24">
                                  <el-card class="card-div-item card-2">
                                    <div class="right-main">
                                      <div class="right-main-top">
                                        <div class="zzsxssr">
                                          <div class="card-div-item-title">
                                            本年增值税销售收入
                                          </div>
                                          <div class="card-div-item-content money">
                                            123321 <span>万元</span>
                                          </div>
                                          &nbsp;&nbsp;
                                          排名：<div :class="`mc mc-${item}`"> <img :src="`src/assets/img/排名${item}.png`" v-if="item<4" alt=""/> <b v-if="item>3 & item<10">0{{item}}</b> <b v-if="item>9">{{item}}</b> </div>
                                        </div>
                                      </div>
                                      <div class="right-main-bottom">
                                        <div class="right-main-bottom-left">
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              本年开票金额
                                            </div>
                                            <div class="card-div-item-content money">
                                              123321 <span>万元</span>
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              税务登记时间
                                            </div>
                                            <div class="card-div-item-content time">
                                              2022-03-01 15:16:17
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              疑点数量
                                            </div>
                                            <div class="card-div-item-content yidian">
                                              124
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              本年应对疑点
                                            </div>
                                            <div class="card-div-item-content yidian">
                                              15
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              历史应对疑点
                                            </div>
                                            <div class="card-div-item-content yidian">
                                              36
                                            </div>
                                          </div>
                                        </div>
                                        <div class="right-main-bottom-right">
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              本年受票金额
                                            </div>
                                            <div class="card-div-item-content money">
                                              123321 <span>万元</span>
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              行业
                                            </div>
                                            <div class="card-div-item-content">
                                              行业内容
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              疑点得分
                                            </div>
                                            <div class="card-div-item-content score">
                                              123321
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              本年应对入库金额
                                            </div>
                                            <div class="card-div-item-content money">
                                              123321 <span>万元</span>
                                            </div>
                                          </div>
                                          <div class="zzsxssr">
                                            <div class="card-div-item-title">
                                              历史应对入库金额
                                            </div>
                                            <div class="card-div-item-content money">
                                              123321 <span>万元</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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
    color: white;
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

        .el-divider--vertical {
          height: 1.5rem;
        }

        .el-page-header__content span {
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
              height: 300px;
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

            :deep(.el-select) {
              width: 100% !important;


              .el-select__wrapper {
                width: 100%;
                background: none;
                box-shadow: none;
                //border: 1px solid #409eff;
                border: 1px solid white;


                .el-select__selected-item  {
                  background: none;
                  width: 100%;
                }
              }

              //下拉框
              .el-input__inner{
                border: none;
                color: white;
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

            #pie {
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
              display: flex;
              flex-direction: row;
              .el-col{
                flex: 1;
                .htongjitu{
                  height: 100%;
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
            display: flex;
            flex-direction: column;

            #line {
              flex: 1;
              background-image: url("@/assets/img/box框.png");
              background-size: 100% 100%;
              white-space: nowrap; // 指定元素内部的文本内容是否可以换行,它的作用是阻止元素中的文本换行
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

                .card-div-box{
                  background-image: url("@/assets/img/企业框2.png");
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                }

                .el-card{
                  //border: 1px solid #10306b4a;
                  border: 0;
                  border-radius: 0;
                  //background-color: #10306b4a;
                  background-color: transparent;
                  color: white;
                  box-shadow: none;
                }

                .card-left-top .el-row .el-col:first-child .el-card{
                  border-top-left-radius: 4px;
                }

                .card-div-item-title{
                  text-align: left;
                  font-size: 1.1rem;
                  font-weight: bold;
                  padding: 2px 3px 2px 5px;
                  background-color: #10306b4a;
                  //background-color: #133979;
                  margin-top: 5px;
                }

                .card-div-item-content{
                  padding-left: 5px;
                  font-size: 0.95rem;
                  .number{
                    display: flex;
                  }
                }

                .money{
                  color: gold;
                }

                .score{
                  color: #00ff00;
                }

                .yidian{
                  color: #ff0000;
                }

                .time{
                  color: #00d9ff;
                }

                .sbh-c{
                  color: #008cff;
                }

                .card-left-top{
                  .card-1{
                    .card-div-item-content{
                      text-align: left;
                      white-space: normal;
                    }
                  }
                }

                .card-left-bottom .el-row .el-col:first-child .el-card{
                  border-bottom-left-radius: 4px;
                }

                .right{
                  .card-2{
                    //background-color: #6FB1FC;
                    .right-main{
                      .right-main-top{
                        margin-bottom: 5px;

                        img{
                          position: absolute;
                          margin-top: -58px;
                          height: 60px;
                        }

                        .zzsxssr,.zgswfj{
                          display: flex;
                          justify-content: start;
                          align-items: flex-end;
                          .card-div-item-title{

                          }
                          .card-div-item-content{
                            margin-left: 10px;
                          }
                        }
                      }

                      .right-main-bottom{
                        display: flex;
                        .card-div-item-content{
                          text-align: left;
                        }
                        .right-main-bottom-left{
                          flex: 1;
                          margin-right: 20px;
                        }

                        .right-main-bottom-right{
                          flex: 1;
                        }
                      }
                    }
                  }
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