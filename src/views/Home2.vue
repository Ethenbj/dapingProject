<script setup lang="ts">
import {onMounted, ref, reactive, watch, nextTick} from "vue";
import { useRouter } from "vue-router";
import * as echarts from 'echarts';
import { init } from 'echarts';
import { ElMessage  } from 'element-plus'
import type { TabsInstance } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import {no} from "vuetify/locale";

const router = new useRouter();
const store = new useStore();

// 获取当前时间
const currentDate = ref('');
const a = ["日", "一", "二", "三", "四", "五", "六"];
const week = ref(null);
const str = ref('');
const timeInterval = setInterval(() => {
  currentDate.value = new Date().toLocaleString()
  week.value = new Date().getDay();
  str.value = "今天是星期" + a[week.value]
}, 1000)

// const loading = ref(true);
// 获取自适应的盒子
const dataScreenRef = ref<HTMLElement | null>(null);

onMounted(() => {
  // 初始化时为外层盒子加上缩放属性，防止刷新界面时就已经缩放
  if (dataScreenRef.value) {
    // dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    // dataScreenRef.value.style.width = `1920px`;
    // dataScreenRef.value.style.height = `1080px`;

  }
  // 初始化echarts
  const chart_dom1 = initChart();
  // 切换
  // initChart3(); // 默认不执行
  // echarts2 、 3 的状态
  // if(store.state.home_left_top_state != ""){
  //   incomeTab.value = store.state.home_left_top_state;
  //   if(incomeTab.value === 'left-top-min'){
  //     initChart2();
  //   }
  // }else{
  //   initChart2();
  // }
  //
  // let dfs = [];
  // let dss = [];
  // for(let i in years){
  //   let y = years[i].year;
  //   let df = years[i].year_f_count;
  //   dfs.push(df)
  //   let ds = years[i].year_s_count;
  //   dss.push(ds)
  //   let fz = years[i].content.split('、')
  //   if (y%2 !== 0){
  //     document.getElementById("time-line-right-"+y).style.height = '50px'
  //     document.getElementById("time-line-right-"+y).style.width = '360px'
  //     document.getElementById("time-line-right-"+y).style.marginLeft = '-38px'
  //     if (fz.length > 0) {
  //       let dom = document.getElementById("time-line-right-" + y);
  //       let success_dom = dom.parentNode.parentNode.querySelector('.content');
  //       for (let t in fz) {
  //         let html_dom = document.createElement('p');
  //         html_dom.setAttribute('class', 'text-su')
  //         html_dom.setAttribute('style', 'text-align:center; font-size: 12px;')
  //         html_dom.innerText = fz[t];
  //         success_dom.appendChild(html_dom)
  //       }
  //     }
  //
  //     initChart4(y,dfs,dss);
  //   }else{
  //     document.getElementById("time-line-right-"+y).style.height = '50px'
  //     document.getElementById("time-line-right-"+y).style.width = '360px'
  //     document.getElementById("time-line-right-"+y).style.marginRight = '-38px'
  //
  //     if (fz.length > 0) {
  //       let dom = document.getElementById("time-line-right-" + y);
  //       let success_dom = dom.parentNode.parentNode.querySelector('.content');
  //       for (let t in fz) {
  //         let html_dom = document.createElement('p');
  //         html_dom.setAttribute('class', 'text-su')
  //         html_dom.setAttribute('style', 'text-align:center; font-size: 12px;')
  //         html_dom.innerText = fz[t];
  //         success_dom.appendChild(html_dom)
  //       }
  //     }
  //     initChart5(y,dfs,dss);
  //   }
  //   dfs = [];
  //   dss = [];
  // }
  //
  // // 为浏览器绑定事件
  // // window.addEventListener("resize", resize);
  //
  // //添加事件监听器
  // chart_dom1.on('click', function(params){
  //   if(params.componentType === 'series'){
  //     //获取节点id
  //     var nodeId = params.data.id;
  //     var nodeName = params.data.name;
  //     nodeName = nodeName.split(' ')[0];
  //     // this.$ElMessage(`click on item ${nodeId}`)
  //     //根据节点id进行相应的操作
  //     //例如跳转到对应的页面或弹出对应的提示信息
  //     store.commit('set_incomeItem', {id:nodeId, title:nodeName})
  //     router.push({path: '/incomeItem'})
  //   }
  // });
  //
  // category_tab(change_card_data,categoryTab.value,riskTab.value)
  // // 设置事件
  // categoryTab_event();
});

// 监听浏览器 resize 事件
const resize = () => {
  // if (dataScreenRef.value) {
  //   dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
  // }
  // // 使用了 scale 的echarts其实不需要需要重新计算缩放比例
  // Object.values(dataScreen).forEach(chart => {
  //   chart && chart.resize();
  // });
};

// 根据浏览器大小推断缩放比例
const getScale = (width = 1920, height = 1080) => {
  let ww = window.innerWidth / width;
  let wh = window.innerHeight / height;
  return ww < wh ? ww : wh;
};
// line-height
// 树状图
function initChart(){
  const myChart = init(document.getElementById('left-top-left') as HTMLDivElement)

  let data = [{
    "value": 100,
    "name": "土地出让金",
    'id': 1
  }, {
    "value": 79,
    "name": "矿产资源专项收入"
  }, {
    "value": 59,
    "name": "教育费附加"
  }, {
    "value": 39,
    "name": "地方教育附加"
  }, {
    "value": 19,
    "name": "文化事业建设费"
  }, {
    "value": -19,
    "name": "化工"
  }, {
    "value": -39,
    "name": "土地及地面建筑"
  }, {
    "value": -59,
    "name": "残疾人保障金"
  }, {
    "value": -79,
    "name": "水利建设基金"
  }, {
    "value": -100,
    "name": "防空地下室易地建设费"
  }, {
    "value": 10,
    "name": "其他省级非税收入",
  }]

  // 颜色配置
  let color = {
    'up': ["#88aeff", "#709eff", "#598eff", "#417eff", "#296eff"],
    'down': ["#ce8cb0", "#c475a0", "#bb5e90", "#b14780", "#a73070"],
    'up_pd': [0, 20, 40, 60, 80, 100],
    'down_pd': [0, -20, -40, -60, -80, -100]
  }

  // 判断比例选择对应颜色
  for (let n in data) {
    let bili = data[n]['value'];
    data[n]['name'] = data[n]['name'] + ' ' + bili + '%'
    if (bili < 0) {
      for(let x in color['down_pd']) {
        if(bili <= color['down_pd'][x] && bili > color['down_pd'][parseInt(x)+1]) {
          data[n]['itemStyle'] = {
            'color': color['down'][x]
          }
          break;
        }
        if(bili <= color['down_pd'][color['down_pd'].length - 1]) {
          data[n]['itemStyle'] = {
            'color': color['down'][color['down_pd'].length - 2]
          }
          break;
        }
      }
      data[n]['value'] = Math.abs(bili);
    }else{
      for(let x in color['up_pd']){
        if(bili >= color['up_pd'][x] && bili < color['up_pd'][parseInt(x)+1]) {
          data[n]['itemStyle'] = {
            'color': color['up'][x]
          }
          break;
        }
        if(bili >= color['up_pd'][color['up_pd'].length - 1]) {
          data[n]['itemStyle'] = {
            'color': color['up'][color['up_pd'].length - 2]
          }
          break;
        }
      }
    }
  }

  let option = {
    // backgroundColor: "#000",
    title: {
      // text: '“一带一路”沿线各省区市分析——上海',
      subtext: '',
      // left: '45%',
      // top: '15',
      textAlign: 'center',
      textStyle: {
        color: "#000",
        fontWeight: 'normal',
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b}"
    },
    series: [{
      type: 'treemap',
      width: '100%',
      height: '100%',
      // top: '10%',
      roam: false, //是否开启拖拽漫游（移动和缩放）
      nodeClick: false, //点击节点后的行为,false无反应
      breadcrumb: {
        show: false
      },
      label: { //描述了每个矩形中，文本标签的样式。
        normal: {
          show: true,
          position: ['10%', '40%']
        }
      },
      itemStyle: {
        normal: {
          show: true,
          textStyle: {
            // color: '#fff',
            fontSize: 14,
          },
          borderWidth: 1,
          borderColor: 'rgba(8, 16, 35, 1)',
        },

        emphasis: {
          label: {
            show: true
          }
        }
      },
      data: data,

      layout: 'horizontal', // 这里设置为水平布局
    }]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  return myChart;
}

function initChart2(){
  const myChart = init(document.getElementById('left-top-min') as HTMLDivElement)


  var xdata = ["教育费附加","地方教育附加","残疾人保障金","文化事业建设费","水利建设基金","工会经费","电力能源类","水土保持补偿费","排污权出让收入",
    "防空地下室易地建设费","城镇垃圾处理费","土地闲置费","土地出让金","矿产资源专项收入","森林植被恢复费","河道砂石收入","土地及土地面建筑","停车泊位费","其他省级非税收入"];
  var ydata  = [10,20,15,10,9,16,13,21,14,17,5,9,11,14,17,5,9,11,11];
  let option = {
    backgroundColor: 'rgba(8, 16, 35, 1)',
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
        rotate: 60,
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
      left:'10%'
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
  return myChart;
}

function initChart3(){
  const myChart = init(document.getElementById('left-top-right') as HTMLDivElement)
  var xData = ['长沙市', '岳阳市', '常德市', '衡阳市', '株洲市', '郴州市', '湘潭市','邵阳市','永州市','益阳市', '娄底市', '怀化市', '湘西州', '张家界市', '湘江新区']
  var lineData = [100, 100, 100, 100, 100, 100, 100,100,100,100,100, 100,100,100,100]
  var lastYearData = [1, 2, 6.2, 3.4, 5.5, 6.5, 3.2,2.3,'', '', '', '', '', '', ''];
  var thisYearData = ['', '', '', '', '', '', '', '', 1.4,2.1, 6.6, 7.9,3.4,3.4,2.1];
  var timeLineData = [1];
  let legend=['减少', '增长'];
  var background = "rgba(8, 16, 35, 1)"; //背景
  let textColor = "#fff";
  let lineColor="rgba(255,255,255,0.2)";
  let colors = [{
    borderColor: "rgba(227,161,96,1)",
    start: "rgba(227,161,96,0.8)",
    end: "rgba(227,161,96,0.3)"
  },
    {
      borderColor: "rgba(0,222,255,1)",
      start: "rgba(0,222,255,0.3)",
      end: "rgba(0,222,255,0.8)"
    },
  ];
  let borderData = [];
  let scale = 2;
  borderData = xData.map(item => {
    return scale;
  });
  let option = {
    baseOption: {
      backgroundColor: background,
      tooltip: {
        show: false
      },
      timeline: {
        show: false,
        top: 0,
        data: []
      },
      legend: {
        top: '5%',
        right: '5%',
        itemWidth: 20,
        itemHeight: 5,
        // itemGap: 343,
        icon: 'horizontal',
        textStyle: {
          color: '#ffffff',
          fontSize: 20,
        },
        data: legend
      },
      grid: [{
        show: false,
        left: '8%',
        top: '10%',
        bottom: '8%',
        containLabel: true,
        width: '37%'
      }, {
        show: false,
        left: '51%',
        top: '10%',
        bottom: '8%',
        width: '0%'
      }, {
        show: false,
        right: '8%',
        top: '10%',
        bottom: '8%',
        containLabel: true,
        width: '37%'
      }],
      xAxis: [{
        type: 'value',
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        position: 'top',
        axisLabel: {
          show: false,
          color: textColor
        },
        splitLine:{
          show: false,
          lineStyle:{
            color:lineColor
          }
        },
      }, {
        gridIndex: 1,
        show: false
      }, {
        gridIndex: 2,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        position: 'top',
        axisLabel: {
          show: false,
          color: textColor
        },
        splitLine:{
          show: false,
          lineStyle:{
            color:lineColor
          }
        },
      }],
      yAxis: [{
        type: 'category',
        inverse: true,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle:{
            color:lineColor
          }
        },

        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        data: xData
      }, {
        gridIndex: 1,
        type: 'category',
        inverse: true,
        position: 'left',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          padding:[0,0,0,0],
          textStyle: {
            color: '#ffffff',
            fontSize: 14
          },
          align: "center"

        },
        data: xData.map(function(value) {
          return {
            value: value,
            textStyle: {
              align: 'center'
            }
          }
        })
      }, {
        gridIndex: 2,
        type: 'category',
        inverse: true,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle:{
            color:lineColor
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false

        },
        data: xData
      }],
      series: []

    },
    options: []
  }

  option.baseOption.timeline.data.push(timeLineData[0])
  option.options.push({
    series: [{
      name: '减少',
      type: "bar",
      barWidth: 18,
      stack: "1",
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            offset: 0,
            color: colors[0].start
          },
            {
              offset: 1,
              color: colors[0].end
            }
          ]),
        }
      },
      label: {
        normal: {
          formatter: "-{c}%",
          show: true,
        }
      },
      data: lastYearData,
      animationEasing: "elasticOut",
      animationDelay: function (idx) {
        return Math.random() * 200;
      }
    },
      {
        name: '增长',
        type: "bar",
        stack: "2",
        barWidth: 18,
        xAxisIndex: 2,
        yAxisIndex: 2,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: colors[1].start
            },
              {
                offset: 1,
                color: colors[1].end
              }
            ]),
          }
        },
        label: {
          normal: {
            formatter: "{c}%",
            show: true,
          }
        },
        data: thisYearData,
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  });

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  return myChart;
}

function initChart4(y,dfs,dss){
  const myChart = init(document.getElementById('time-line-right-'+y) as HTMLDivElement)
  let option = {
    backgroundColor: "#081023",
    legend: {
      // data: ["采样人数", "检测人数"],
      top: "5%",
      // right: '10',
      textStyle: {
        color: "rgba(250,250,250,0.6)",
        fontSize: 16
      }
    },
    barWidth: 15,
    grid: {
      left: '3%',
    },
    xAxis: {
      type: 'value',
      show: false,
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.2)"
        },
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变x轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: { //  改变x轴字体颜色和大小
        textStyle: {
          color: "rgba(250,250,250,0.6)",
          fontSize: 16
        },
        show: false
      }
    },
    yAxis: {
      type: 'category',
      show: false,
      // data: ['天山路街道', '胜利路街道', '昆仑路街道', '银河路街道','金龙镇街道'],
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变y轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: { //  改变y轴字体颜色和大小
        //formatter: '{value} m³ ', //  给y轴添加单位
        textStyle: {
          color: "rgba(250,250,250,0.6)",
          fontSize: 16
        }
      }
    },
    series: [{
      type: 'bar',
      // name: "采样人数",
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'right', //在上方显示
            textStyle: { //数值样式
              color: "rgba(250,250,250,0.6)",
              fontSize: 16,
              fontWeight: 600
            }
          },
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: 'rgba(61,126,235,1)'
          }, {
            offset: 1,
            color: 'rgba(61,126,235,0)'
          }]),
          borderWidth: 2,
          barBorderRadius:15
        }
      },
      data: dfs
    },
      {
        type: 'bar',
        // name: "检测人数",
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'right', //在上方显示
              textStyle: { //数值样式
                color: "rgba(250,250,250,0.6)",
                fontSize: 16,
                fontWeight: 600
              }
            },
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgba(15,197,243,1)'
            }, {
              offset: 1,
              color: 'rgba(15,197,243,0)'
            }]),
            borderWidth: 2,
            barBorderRadius:15
          }
        },
        data: dss
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

function initChart5(y,dfs,dss){
  const myChart = init(document.getElementById('time-line-right-'+y) as HTMLDivElement)
  let option = {
    backgroundColor: "#081023",
    legend: {
      // data: ["采样人数", "检测人数"],
      top: "5%",
      // right: '10',
      textStyle: {
        color: "rgba(250,250,250,0.6)",
        fontSize: 16
      }
    },
    barWidth: 15,
    grid: {
      right: '3%',
    },
    xAxis: {
      type: 'value',
      position: 'right',
      inverse: true,
      show: false,
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.2)"
        },
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变x轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: { //  改变x轴字体颜色和大小
        textStyle: {
          color: "rgba(250,250,250,0.6)",
          fontSize: 16
        },
        show: false
      }
    },
    yAxis: {
      type: 'category',
      show: false,
      // data: ['天山路街道', '胜利路街道', '昆仑路街道', '银河路街道','金龙镇街道'],
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: { //  改变y轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: { //  改变y轴字体颜色和大小
        //formatter: '{value} m³ ', //  给y轴添加单位
        textStyle: {
          color: "rgba(250,250,250,0.6)",
          fontSize: 16
        }
      }
    },
    series: [{
      type: 'bar',
      // name: "采样人数",
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'left', //在上方显示
            textStyle: { //数值样式
              color: "rgba(250,250,250,0.6)",
              fontSize: 16,
              fontWeight: 600
            }
          },
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: 'rgba(61,126,235,0)'
          }, {
            offset: 1,
            color: 'rgba(61,126,235,1)'
          }]),
          borderWidth: 2,
          barBorderRadius:15
        }
      },
      data: dfs
    },
      {
        type: 'bar',
        // name: "检测人数",
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'left', //在上方显示
              textStyle: { //数值样式
                color: "rgba(250,250,250,0.6)",
                fontSize: 16,
                fontWeight: 600
              },
              // formatter:function(data){
              //   return data.value+'w'
              // }
            },
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgba(15,197,243,0)'
            }, {
              offset: 1,
              color: 'rgba(15,197,243,1)'
            }]),
            borderWidth: 2,
            barBorderRadius:15
          }
        },
        data: dss
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

// 费种、市州 .title-right-end
const incomeTab = ref<TabsInstance['incomeTab']>('left-top-min');

let incomeTab_active_dom :unknown = '';
// 监听
let echarts3 = false;
watch(incomeTab, (newValue, oldValue) => {
  if (incomeTab_active_dom){
    incomeTab_active_dom.clear()
  }
  nextTick(() => {  // dom更新之后再进行回调
    if (newValue === 'left-top-min'){
      incomeTab_active_dom = initChart2();
      store.commit('set_home_left_top_state',{home_left_top_state: newValue})
    }else{
      incomeTab_active_dom = initChart3()
      store.commit('set_home_left_top_state',{home_left_top_state: newValue})
      if (!echarts3){
        incomeTab_active_dom.on("click", function (e) {
          store.commit('set_title',{title: e.name})
          router.push({path: '/incomeArea'})
        });
      }
      echarts3=true;
    }
  })
});

// 左下角下拉费种选项 和 市州选项
const handleCommandItem = (command: string | number | object) => {
  ElMessage(`click on item ${command}`)
}

const handleCommandArea = (command: string | number | object) => {
  ElMessage(`click on item ${command}`)
}

let change_card_data : {[key :string] : object} = {};

// 左下角显示的数据（按项目）
let item_data : {[key :string] : object} = {
  'one': {'d':[1, 2, 3, 4, 5, 6],'c':[1, 2, 3, 4,5]},
  'two': {'d':[11,22,33,44,55,66],'c':[11,22,33,44,55]},
  'three':{'d':[111,222,333,444,555,666],'c':[111,222,333,444,555]},
  'four':{'d':[1111,2222,3333,4444,5555,6666],'c':[1111,2222,3333,4444,5555]}
}

// 左下角显示的数据（按市州）
let area_data : {[key :string] : object} = {
  'one': {'d':[10, 20, 30, 40, 50, 60],'c':[10, 20, 30, 40,50]},
  'two': {'d':[110,220,330,440,550,660],'c':[110,220,330,440,550]},
  'three':{'d':[1110,2220,3330,4440,5550,6660],'c':[1110,2220,3330,4440,5550]},
  'four':{'d':[11110,22220,33330,44440,55550,66660],'c':[11110,22220,33330,44440,55550]},
  'five':{'d':[11111,22222,33333,44444,55555,66666],'c':[11111,22222,33333,44444,55555]},
  'six':{'d':[111111,222222,333333,444444,555555,666666],'c':[111111,222222,333333,444444,555555]},
  'seven':{'d':[111,222,333,444,555,666],'c':[110,220,330,440,550]},
  'eight':{'d':[1111111,2222222,3333333,4444444,5555555,6666666],'c':[1111111,2222222,3333333,4444444,5555555]},
  'nine':{'d':[11111111,22222222,33333333,44444444,55555555,66666666],'c':[11111111,22222222,33333333,4444444,555555]},
  'ten':{'d':[1111,2222,444,4443,4322,3244],'c':[234,324,235,65,234]},
  'eleven':{'d':[111111111,222222222,333333333,444444444,555555555,666666666],'c':[111111111,222222222,33333333,444,4445]},
  'twelve':{'d':[1111111111,2222222222,3333333333,4444444444,5555555555,6666666666],'c':[1111111111,2222222222,34,32,24]},
  'thirteen':{'d':[11111111111,22222222222,33333333333,44444444444,55555555555,66666666666],'c':[11111111111,222,342,234,43]},
  'fourteen':{'d':[111111111111,222222222222,333333333333,444444444444,555555555555,666666666666],'c':[1111111111,34,234,23,2]},
  'fifteen':{'d':[1111111111111111,234,325,252,234,24],'c':[32476,68,967,96,69]}
}


change_card_data = item_data;
// 定时器
let category_tab_time = null;
let category_time_params = [];

const riskTab = ref<TabsInstance['riskTab']>('item-card');
let risk_change_id : unknown = '';
// 监听
watch(riskTab, (newValue, oldValue) => {
  if (risk_change_id !== ''){
    document.querySelector('#'+risk_change_id+' #'+risk_change_id+'-div').style.display = 'none';
    document.querySelector('.lblb-l #'+risk_change_id+'-category').setAttribute('style','display: none !important')
  }else{
    document.querySelector('#item-card #item-card-div').style.display = 'none';
    document.querySelector('.lblb-l #item-card-category').setAttribute('style','display: none !important')
  }
  risk_change_id = newValue;
  if (newValue === 'item-card'){
    change_card_data = item_data;
  }else{
    change_card_data = area_data;
  }
  store.commit('set_home_left_button_state', {home_left_button_state: newValue})
  nextTick(() => {  // dom更新之后再进行回调
    document.querySelector('#'+risk_change_id+' #'+risk_change_id+'-div').style.display = '';
    document.querySelector('.lblb-l #'+risk_change_id+'-category').setAttribute('style',"display: ''")

    clearInterval(category_tab_time)
    category_time_params = [];

    category_tab(change_card_data,categoryTab.value, risk_change_id)
    categoryTab.value = 'one'; // 每次切换都会回到原点

    category_tab_time = setInterval(() => {
      // 重置 tab
      if (Object.keys(change_card_data).length === 0){
        clearInterval(category_tab_time)
      }
      if (category_time_params.length === 0){
        category_time_params = Object.keys(change_card_data);
      }

      let index = category_time_params.indexOf(categoryTab.value);

      if (index !== category_time_params.length - 1) {
        index += 1;
      } else {
        index = 0
      }

      categoryTab.value = category_time_params[index];
    }, 1000);

    // 设置事件
    categoryTab_event();
  })
});

const categoryTab = ref<TabsInstance['categoryTab']>('one');

// 监听
watch(categoryTab, (newValue, oldValue) => {
  nextTick(() => {  // dom更新之后再进行回调
    category_tab(change_card_data, newValue, riskTab.value)
  })
});

// 回显卡片
function category_tab(data,categoryTab,divID){
  let lbrb_data = data[categoryTab]['d'];
  let lbrb_count = data[categoryTab]['c'];

  // 卡片信息
  for (let i = 0; i < lbrb_data.length; i++) {
    let card_dom = document.querySelector('#'+divID+'-div .'+categoryTab+' .card-'+(i+1)+' .el-card__body .count');
    card_dom.textContent = lbrb_data[i];
  }
  // 扫描统计
  for (let i = 0; i < lbrb_count.length; i++) {
    let count_dom = document.querySelector('.'+categoryTab+' .c'+(i+1));
    count_dom.textContent = lbrb_count[i];
  }
}

// 定时每 4 秒轮播
// category_tab_time = setInterval(() => {
//   // 重置 tab
//   if (Object.keys(change_card_data).length === 0){
//     clearInterval(category_tab_time)
//   }
//   if (category_time_params.length === 0){
//     category_time_params = Object.keys(change_card_data);
//   }
//
//   let index = category_time_params.indexOf(categoryTab.value);
//
//   if (index !== category_time_params.length - 1) {
//     index += 1;
//   } else {
//     index = 0
//   }
//
//   categoryTab.value = category_time_params[index];
// }, 1000);

// 事件
function categoryTab_event() {
  // 左下角按钮悬停  // 鼠标悬停 & 鼠标离开
  let lb_c_dom: unknown = null;
  if (risk_change_id !== '') {
    lb_c_dom = document.querySelector('.lblb-l #' + risk_change_id + '-category .el-radio-group');
  } else {
    lb_c_dom = document.querySelector('.lblb-l #item-card-category .el-radio-group');
  }

  for (let i = 0; i < lb_c_dom.children.length; i++) {
    lb_c_dom.children[i].addEventListener('mouseover', function (e) {

    })

    lb_c_dom.children[i].addEventListener('mouseout', function (e) {

    })

    lb_c_dom.children[i].addEventListener('click', function (e) {
      let title = lb_c_dom.children[i].querySelector('.el-radio-button__inner').textContent;
      store.commit('set_title', {title: title});

      if (risk_change_id == 'area-card') {
        router.push('/riskArea')
      } else {
        router.push('/riskItem')
      }
    })
  }
}

// 时间线
const years = [
  {
    color: 'cyan',
    year: '2018',
    title: '2018年度情况',
    content: '教育费附加、地方教育附加、残疾人就业保障金、水利建设基金、文化事业建设费、废弃电器电子产品处理基金、工会经费',
    year_f_count: 1,
    year_s_count: 1,
  },
  {
    color: 'green',
    year: '2019',
    title: '2019年度情况',
    content: '农网还贷基金、可再生能源发展基金、国家重大水利工程建设基金、大中型水库移民后期扶持基金、跨省际大中型水库库区基金、括广告收入、河道砂石资源开采权出让收入',
    year_f_count: 1,
    year_s_count: 1,
  },
  {
    color: 'pink',
    year: '2020',
    title: '2020年度情况',
    content: '',
    year_f_count: 1,
    year_s_count: 1,
  },
  {
    color: 'amber',
    year: '2021',
    title: '2021年度情况',
    content: '水土保持补偿费、排污权出让收入、地方水库移民扶持基金、防空地下室易地建设费、土地闲置费、成真垃圾处理费、河道砂石经营收益、生态环境损害赔偿金',
    year_f_count: 1,
    year_s_count: 1,
  },
  {
    color: 'orange',
    year: '2022',
    title: '2022年度情况',
    content: '国有土地使用权出让收入、矿产资源专项收入、国有资产占用费、土地及地面建筑资产处置、非土地及地面建筑资产处置、破损公路及设施赔(补)偿费和占用费、停车泊位和公共停车场有偿使用收入',
    year_f_count: 1,
    year_s_count: 1,
  },
  {
    color: 'blue',
    year: '2023',
    title: '2023年度情况',
    content: '森林植被恢复费',
    year_f_count: 1,
    year_s_count: 1,
  },
  {
    color: 'yellow',
    year: '2024',
    title: '2024年度情况',
    content: '',
    year_f_count: 1,
    year_s_count: 1,
  },
]

</script>


<template>
  <div class="screen-bg">
    <div class="container" ref="dataScreenRef">
      <div class="header">
        <div class="title">
          数据可视化大屏
        </div>
        <div class="time">
          2024/10/11 15:06:23 星期五
        </div>
      </div>
      <div class="body">
        <div class="left">
          <div class="left-top">
            <div class="left-top-left">
              <div class="title-box">
                <div class="title">
                  收入
                </div>
              </div>
              <div class="content-box">
                <div class="content">
                  <div id="left-top-left"></div>
                </div>
              </div>
            </div>
            <div class="left-top-right">
              <div class="title-box">
                <div class="title">
                  本年缴费人数：<span class="count">8848</span>
                </div>
                <div class="change-btn">
                  <el-radio-group v-model="incomeTab">
                    <el-radio-button value="left-top-min">费种</el-radio-button>
                    <el-radio-button value="left-top-right">市州</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="content-box">
                <div class="content">

                </div>
              </div>
            </div>
          </div>
          <div class="left-bottom">
            <div class="title-box">
              <div class="title">
                风控监管
              </div>
              <div class="change-btn">
                <el-radio-group v-model="incomeTab">
                  <el-radio-button value="left-top-min">项目</el-radio-button>
                  <el-radio-button value="left-top-right">市州</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="content-box">
              <div class="left-bottom-left">
                <div id="area-card-category" class="category" style="">
                  <el-radio-group v-model="categoryTab">
                    <el-radio-button value="one">长沙市</el-radio-button>
                    <el-radio-button value="two">岳阳市</el-radio-button>
                    <el-radio-button value="three">常德市</el-radio-button>
                    <el-radio-button value="four">衡阳市</el-radio-button>
                    <el-radio-button value="five">株洲市</el-radio-button>
                    <el-radio-button value="six">郴州市</el-radio-button>
                    <el-radio-button value="seven">湘潭市</el-radio-button>
                    <el-radio-button value="eight">邵阳市</el-radio-button>
                    <el-radio-button value="nine">永州市</el-radio-button>
                    <el-radio-button value="ten">益阳市</el-radio-button>
                    <el-radio-button value="eleven">娄底市</el-radio-button>
                    <el-radio-button value="twelve">怀化市</el-radio-button>
                    <el-radio-button value="thirteen">湘西州</el-radio-button>
                    <el-radio-button value="fourteen">张家界市</el-radio-button>
                    <el-radio-button value="fifteen">湘江新区</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="left-bottom-min">

              </div>
              <div class="left-bottom-right">

              </div>
            </div>
          </div>
        </div>
        <div class="right">

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


/* 背景 */
.screen-bg{
  width: 1920px;
  height: 1080px;
  background-image: url("@/assets/img/背景.png");
  background-size: cover;

  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .header{
      background-image: url("@/assets/img/头.png");
      background-size: cover;
      height: 400px;
      background-color: #333;
      display: flex;
      flex-direction: column;
      position: absolute;
      box-sizing: border-box;
      width: 100%;

      .title{
        margin-top: 5px;
        font-size: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        letter-spacing: 10px;  /* 文字间距 */

        /* 渐变颜色 */
        background: linear-gradient(to bottom, #ffffff, #34a6ee);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        @font-face;
      }
      .time{
        margin-top: 24px;
        margin-left: 12px;
        font-size: 20px;
        font-weight: bold;
      }
    }

    .body{
      flex: 1;
      background: none;
      z-index: 1;
      margin-top: 135px;
      display: flex;
      flex-direction: row;
      padding: 0 30px;
      @font-face;

      .left{
        height: 100%;
        width: 68%;
        background-color: #747bff;
        margin-right: 20px;
        display: flex;
        flex-direction: column;

        .left-top{
          height: 56%;
          background-color: #7dff74;
          margin-bottom: 10px;
          display: flex;
          flex-direction: row;

          .left-top-left{
            width: 40%;
            margin-right: 20px;
            background-color: #363ad2;
            display: flex;
            flex-direction: column;

            .title-box{
              height: 60px;
              margin-bottom: 10px;
              background-color: #912bff;
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

            .content-box{
              flex: 1;
              background-image: url("@/assets/img/box框.png");
              background-repeat: no-repeat;
              background-size: cover;
              padding: 20px;
              .content{
                width: 100%;
                height: 100%;
                background-color: #646cff;
                #left-top-left{
                  width: 100%;
                  height: 100%;
                }
              }
            }

          }

          .left-top-right{
            flex: 1;
            background-color: #363ad2;
            display: flex;
            flex-direction: column;

            .title-box {
              height: 60px;
              margin-bottom: 10px;
              background-color: #912bff;
              background-image: url("@/assets/img/文本框.png");
              background-repeat: no-repeat;
              margin-left: -35px;
              z-index: 2;

              display: flex;
              flex-direction: row;
              justify-content: space-between;

              .title {
                height: 100%;
                font-size: 24px;
                padding-left: 60px;
                display: flex;
                justify-content: left;
                align-items: center;
              }

              .change-btn {
                display: flex;
                align-self: end;
                padding: 5px;
              }
            }

            .content-box {
              flex: 1;
              background-image: url("@/assets/img/box框.png");
              background-repeat: no-repeat;
              background-size: cover;
              padding: 20px;

              .content {
                width: 100%;
                height: 100%;
                background-color: #646cff;
              }
            }
          }
        }

        .left-bottom {
          flex: 1;
          background-color: #7dff74;
          display: flex;
          flex-direction: column;

          .title-box {
            height: 60px;
            margin-bottom: 10px;
            background-color: #912bff;
            background-image: url("@/assets/img/文本框.png");
            background-repeat: no-repeat;
            margin-left: -35px;
            z-index: 1;

            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .title {
              height: 100%;
              font-size: 24px;
              padding-left: 60px;
              display: flex;
              justify-content: left;
              align-items: center;
            }

            .change-btn {
              display: flex;
              align-self: end;
              padding: 5px;
            }
          }

          .content-box {
            flex: 1;
            display: flex;
            flex-direction: row;

            .left-bottom-left {
              height: 100%;
              width: 20%;
              margin-right: 20px;
              background-color: #363ad2;
              .category{
                padding: 20px;
                width: 100%;
                height: 100%;
                display: flex;
                :deep(.el-radio-group){
                  width: 100%;
                  height: 100%;
                }
              }
            }

            .left-bottom-min {
              width: 25%;
              margin-right: 20px;
              background-color: #363ad2;
            }

            .left-bottom-right {
              flex: 1;
              background-color: #363ad2;
            }

          }


        }

      }

      .right{
        flex: 1;
        background-color: #747bff;

      }
    }
  }
}
</style>