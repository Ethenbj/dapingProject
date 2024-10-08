<script setup lang="ts">
  import {onMounted, ref, reactive} from "vue";
  import {useRouter} from "vue-router";
  import * as echarts from 'echarts';
  import {init }from 'echarts';

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
    initChart();
    // initChart2();
    // initChart3();
    // initChart4();
    // initChart5();
    // 为浏览器绑定事件
    // window.addEventListener("resize", resize);
  });

  // 监听浏览器 resize 事件
  const resize = () => {
    // if (dataScreenRef.value) {
    //   dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    // }
    // 使用了 scale 的echarts其实不需要需要重新计算缩放比例
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
      "name": "保险"
    }, {
      "value": 79,
      "name": "知识产权"
    }, {
      "value": 59,
      "name": "出版"
    }, {
      "value": 39,
      "name": "轻工业"
    }, {
      "value": 19,
      "name": "金融"
    }, {
      "value": -19,
      "name": "化工"
    }, {
      "value": -39,
      "name": "科技"
    }, {
      "value": -59,
      "name": "保险"
    }, {
      "value": -79,
      "name": "知识产权"
    }, {
      "value": -100,
      "name": "出版"
    }, {
      "value": 10,
      "name": "其他",
    }]

    // 颜色配置
    let color = {
      'up': ["#ff9999", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333"],
      'down': ["#99cc99", "#80c080", "#66b366", "#4da64d", "#339933"],
      'up_pd': [0, 20, 40, 60, 80, 100],
      'down_pd': [0, -20, -40, -60, -80, -100]
    }

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
        text: '“一带一路”沿线各省区市分析——上海',
        subtext: '',
        left: '45%',
        top: '15',
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
        height: '85%',
        top: '13%',
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
            borderColor: '#fff',
          },

          emphasis: {
            label: {
              show: true
            }
          }
        },
        data: data,

        // layout: 'horizontal', // 这里设置为水平布局
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

</script>

<template>
  <div class="screen-bg" v-loading="loading">
    <!--     <iframe frameborder="0" src="src/assets/js/index.html" style="width: 100%; height: 100%;z-index: -10"></iframe>-->
    <div class="container" ref="dataScreenRef">
      <el-row class="header">
        <el-col >
          <div class="date">{{ currentDate + '&nbsp; &nbsp; &nbsp; ' + str }}</div>
          <div class="title">BOOL数据可视化大屏</div>
          <div class="light" @click="backIndex">X</div>
        </el-col>
      </el-row>
      <el-row class="body">
        <el-col :span="9">
          <el-row align="middle" class="left" :gutter="20">
            <el-col class="left-top">
              <span class="title">左上</span>
              <el-row justify="space-between" class="left-top-l" :gutter="2">
                <el-col :span="12" id="left-top-left"></el-col>
                <el-col :span="12">left-top-right</el-col>
              </el-row>
            </el-col>
            <el-col class="left-button">
              <span class="title">左下</span>
              left-button
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="15">
          <el-row align="middle" justify="center" class="right">
            <el-col class="right-main">right-main</el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="less" scoped>
@base-height: 1080px;
@body-height: (@base-height - 80px);
@left-top-height: (@body-height / 2) - 29px;

.screen-bg{
  width: 1920px;
  height: 1080px;
  .container{
    /*统一设置高度为100%*/
    width: 1920px;
    height: 1080px;
    display: flex;
    flex-direction: column;
    .header{
      height: 80px;
      background-color: red;
    }
    .body{
      height: @body-height;
      width: 100%;
      overflow-y:auto;
      background-color: bisque;
      .left{
        flex: 2;
        height:@body-height;
        width: 100%;
        .left-top{
          height: (@body-height / 2) - 5px;
          background-color:rebeccapurple;
          margin-bottom: 5px;
          .title{
             color: white;
             font-weight: bold;
             text-align: left;
             display: block;
             height: 24px;
          }
          .left-top-l{
            height:@left-top-height;
            #left-top-left{
              height: 100%;
              background-color: #ff6496;
              text-align: center;
            }
          }
        }
        .left-button{
          height: (@body-height / 2) - 5px;
          margin-top: 5px;
          background-color:#747bff;
        }
      }
      .right{
        background-color: aqua;
        flex: 1;
        height: @body-height;
        width: 100%
      }
    }
  }
}

</style>
