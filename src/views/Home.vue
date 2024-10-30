<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import * as echarts from 'echarts';
import {init} from 'echarts';
import type {TabsInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {merge} from "jquery";
import danwei_zhuanhuan from "@/utils/money_change.ts";

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
  str.value = "星期" + a[week.value]
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
  if(store.state.home_left_top_state != ""){
    incomeTab.value = store.state.home_left_top_state;
    if(incomeTab.value === 'left-top-right'){
      incomeTab_active_dom = initChart3();
      incomeTab_active_dom.on("click", function (e) {
        store.commit('set_title',{title: e.name})
        router.push({path: '/incomeArea'})
      });
    }
  }else{
  incomeTab_active_dom = initChart3();
    incomeTab_active_dom.on("click", function (e) {
      store.commit('set_title',{title: e.name})
      router.push({path: '/incomeArea'})
    });
  }

  let shui_srs = [];
  let sbf_srs = [];
  let fs_srs = [];
  for(let i in years){
    let y = years[i].year;
    let shui_sr = years[i].shui_sr;
    shui_srs.push(shui_sr)
    let sbf_sr = years[i].sbf_sr;
    sbf_srs.push(sbf_sr)
    let fs_sr = years[i].fs_sr;
    fs_srs.push(fs_sr)
    let fz = years[i].content.split('、')
    if (y%2 !== 0){
      document.getElementById("time-line-right-"+y).style.height = '225px'
      document.getElementById("time-line-right-"+y).style.width = '250px'
      document.getElementById("time-line-right-"+y).style.marginLeft = '-38px'
      if (fz.length > 0) {
        let dom = document.getElementById("time-line-right-" + y);
        let success_dom = dom.parentNode.parentNode.querySelector('.content');
        fz.sort((a,b) => b.length - a.length)
        for (let t in fz) {
          let html_dom = document.createElement('p');
          html_dom.setAttribute('class', 'text-su')
          html_dom.setAttribute('style', 'text-align:center; font-size: 12px;text-align:center;')
          if (fz[t] !== '') {
            if (y === '2018'){
              html_dom.innerText = fz[t];
            }else{
              html_dom.innerText = fz[t];
            }
          }

          success_dom.appendChild(html_dom)
        }
      }

      initChart4(y,shui_srs,sbf_srs,fs_srs);
    }else{
      document.getElementById("time-line-right-"+y).style.height = '225px'
      document.getElementById("time-line-right-"+y).style.width = '250px'
      document.getElementById("time-line-right-"+y).style.marginRight = '-38px'

      if (fz.length > 0) {
        let dom = document.getElementById("time-line-right-" + y);
        let success_dom = dom.parentNode.parentNode.querySelector('.content');
        fz.sort((a,b) => b.length - a.length)
        for (let t in fz) {
          let html_dom = document.createElement('p');
          html_dom.setAttribute('class', 'text-su')
          html_dom.setAttribute('style', 'text-align:center; font-size: 12px;text-align:center;')

          if (fz[t] !== '') {
            if (y === '2018'){
              html_dom.innerText = fz[t];
            }else{
              html_dom.innerText = fz[t];
            }
          }

          success_dom.appendChild(html_dom)
        }
      }
      initChart5(y,shui_srs,sbf_srs,fs_srs);
    }
   shui_srs = [];
   sbf_srs = [];
   fs_srs = [];
  }

  // 为浏览器绑定事件
  // window.addEventListener("resize", resize);

  //添加事件监听器
  chart_dom1.on('click', function(params){
    if(params.componentType === 'series'){
      //获取节点id
      var nodeId = params.data.id;
      var nodeName = params.data.name;

      nodeName = nodeName.split(' ')[0];
      // ElMessage(`click on item ${nodeId}`)
      //根据节点id进行相应的操作
      //例如跳转到对应的页面或弹出对应的提示信息
      store.commit('set_incomeItem', {id:nodeId, title:nodeName})
      router.push({path: '/incomeItem'})
    }
  });

  category_tab(change_card_data,categoryTab.value,riskTab.value)
  // 设置事件
  categoryTab_event();
});

// 数据定义
// 今年各费种收入

// 残疾人就业保障金
// 大中型水库库区基金
// 大中型水库移民后期扶持基金
// 地方教育附加
// 非经营性国有资产收入
// 废弃电器电子产品处理基金收入
// 国家重大水利工程建设基金收入
// 国有土地使用权出让收入
// 建设行政事业性收费收入
// 教育费附加
// 可再生能源发展基金
// 矿产资源专项收入
// 农网还贷资金收入
// 排污权出让收入
// 其他国有资源（资产）有偿使用收入
// 其他收入
// 其他政府性基金收入
// 其他专项收入
// 人防办行政事业性收费收入
// 森林植被恢复费
// 生态环境损害赔偿资金
// 市政公共资源有偿使用收入
// 水利建设专项收入
// 水土保持补偿费收入
// 税务部门罚没收入
// 文化事业建设费
// 自然资源行政事业性收费收入

// 各费种名称
const feizhong_names = [
  {'cjrjybzj': '残疾人就业保障金'},
  {'dzxsjjqjj': '大中型水库库区基金'},
  {'dzxskymhqfcjj': '大中型水库移民后期扶持基金'},
  {'dfjyfj': '地方教育附加'},
  {'fjyxgyzcsr': '非经营性国有资产收入'},
  {'fqdqdzcpcljjsr': '废弃电器电子产品处理基金收入'},
  {'gjzdslgcjsjjsr': '国家重大水利工程建设基金收入'},
  {'gytdsyqcrsr': '国有土地使用权出让收入'},
  {'jshzsyxsfsr': '建设行政事业性收费收入'},
  {'jyffj': '教育费附加'},
  {'kzsnyfzjj': '可再生能源发展基金'},
  {'kczyzxsr': '矿产资源专项收入'},
  {'nwhdzjsr': '农网还贷资金收入'},
  {'pwqcrsr': '排污权出让收入'},
  {'qtgyzyzcycsysr': '其他国有资源（资产）有偿使用收入'},
  {'qtsr': '其他收入'},
  {'qtzfxjjsr': '其他政府性基金收入'},
  {'qtzxsr': '其他专项收入'},
  {'rfbxzsyxsfsr': '人防办行政事业性收费收入'},
  {'slzbhff': '森林植被恢复费'},
  {'sthjshpczj': '生态环境损害赔偿资金'},
  {'szggzyycsysr': '市政公共资源有偿使用收入'},
  {'sljszxsr': '水利建设专项收入'},
  {'stbcbcfsr': '水土保持补偿费收入'},
  {'swbmfmsr': '税务部门罚没收入'},
  {'whsyjsf': '文化事业建设费'},
  {'zrzyxzsyxsfsr': '自然资源行政事业性收费收入'}
];

// 去年各费种收入
const last_year_feizhong_sr = [
  {'cjrjybzj': 1090970469.48},
  {'dzxsjjqjj': 6683385.58},
  {'dzxskymhqfcjj': 767079701.43},
  {'dfjyfj': 3526433842.8},
  {'fjyxgyzcsr': 68876918.22},
  {'fqdqdzcpcljjsr': 12473016},
  {'gjzdslgcjsjjsr': 138274873.38},
  {'gytdsyqcrsr': 107201588216.45},
  {'jshzsyxsfsr': 691599234.59},
  {'jyffj': 5288805281.6},
  {'kzsnyfzjj': 1596614057},
  {'kczyzxsr': 4167537924.2},
  {'nwhdzjsr': 2449322216.5},
  {'pwqcrsr': 85204898.06},
  {'qtgyzyzcycsysr': 2813864042.6},
  {'qtsr': 1315151972.3},
  {'qtzfxjjsr': 90.47},
  {'qtzxsr': 0},
  {'rfbxzsyxsfsr': 891042648.84},
  {'slzbhff': 967385609},
  {'sthjshpczj': 8728311.47},
  {'szggzyycsysr': 1094019294.8},
  {'sljszxsr': 1739910873.6},
  {'stbcbcfsr': 245970804.66},
  {'swbmfmsr': 57836211.58},
  {'whsyjsf': 59288247},
  {'zrzyxzsyxsfsr': 30952682.4}
]

// 今年各费种收入
const first_year_feizhong_sr = [
  {'cjrjybzj': 600989299},
  {'dzxsjjqjj': 8802339.72},
  {'dzxskymhqfcjj': 780675606.2},
  {'dfjyfj': 3222934778},
  {'fjyxgyzcsr': 13794552.47},
  {'fqdqdzcpcljjsr': 3272316},
  {'gjzdslgcjsjjsr': 143979891.1},
  {'gytdsyqcrsr': 60375394359},
  {'jshzsyxsfsr': 627999780.1},
  {'jyffj': 4833167725},
  {'kzsnyfzjj': 1573723083},
  {'kczyzxsr': 2383006532},
  {'nwhdzjsr': 3665594669},
  {'pwqcrsr': 76162836.3},
  {'qtgyzyzcycsysr': 3927309651},
  {'qtsr': 1367465180},
  {'qtzfxjjsr': 87.38},
  {'qtzxsr': 144866318.2},
  {'rfbxzsyxsfsr': 549319185.1},
  {'slzbhff': 976575583.9},
  {'sthjshpczj': 34867780.69},
  {'szggzyycsysr': 142942772.3},
  {'sljszxsr': 1780753003},
  {'stbcbcfsr': 265331944.4},
  {'swbmfmsr': 45994896.27},
  {'whsyjsf': 49013436.69},
  {'zrzyxzsyxsfsr': 106262593.9}
]

// 去年市州收入
const last_city_sr = [
  {'14301':	55890854908},
  {'14302':	6555919738.2},
  {'14303':	3499240224.2},
  {'14304':	7788016414.9},
  {'14305':	5662907605.6},
  {'14306':	13407378082},
  {'14307':	7176501302.7},
  {'14308':	998050222.87},
  {'14309':	3007999492.2},
  {'14310':	4515153884.6},
  {'14311':	5919453683.6},
  {'14312':	6138935206.8},
  {'14313':	2609060738},
  {'14331':	1263520019.9},
  {'14392':	9808578298.8}
]

// 代码城市对照
const city_code_map = {
  '14301': '长沙市',
  '14302': '株洲市',
  '14303': '湘潭市',
  '14304': '衡阳市',
  '14305': '邵阳市',
  '14306': '岳阳市',
  '14307': '常德市',
  '14308': '张家界市',
  '14309': '益阳市',
  '14310': '郴州市',
  '14311': '永州市',
  '14312': '怀化市',
  '14313': '娄底市',
  '14331': '湘西州',
  '14392': '湘江新区'
}
// 14300000000	国家税务总局湖南省税务局
// 14301000000	国家税务总局长沙市税务局
// 14302000000	国家税务总局株洲市税务局
// 14303000000	国家税务总局湘潭市税务局
// 14304000000	国家税务总局衡阳市税务局
// 14305000000	国家税务总局邵阳市税务局
// 14306000000	国家税务总局岳阳市税务局
// 14307000000	国家税务总局常德市税务局
// 14308000000	国家税务总局张家界市税务局
// 14309000000	国家税务总局益阳市税务局
// 14310000000	国家税务总局郴州市税务局
// 14311000000	国家税务总局永州市税务局
// 14312000000	国家税务总局怀化市税务局
// 14313000000	国家税务总局娄底市税务局
// 14331000000	国家税务总局湘西土家族苗族自治州税务局
// 14391000000	国家税务总局湖南省税务局稽查局
// 14392000000	国家税务总局湖南湘江新区税务局

// 今年市州收入
const first_city_sr = [
  {'14301':	30789876584},
  {'14302':	5189238387.9},
  {'14303':	2056201127.1},
  {'14304':	4118628712},
  {'14305':	2802505528.5},
  {'14306':	9525836472.3},
  {'14307':	4997450709.4},
  {'14308':	519510971.54},
  {'14309':	1730832063},
  {'14310':	6761121811.2},
  {'14311':	3795204095.9},
  {'14312':	3389058645.8},
  {'14313':	2552573934.6},
  {'14331':	1132047067.7},
  {'14392':	8117441839.8},
]

// 历年三元收入
// 年度	税收收入	社保费收入	非税收入
const linian_sanyuan_sr = [
  {'year': '2018', 'shui_sr': 41760375, 'sbf_sr':	128298, 'fs_sr':	1417760},
  {'year': '2019', 'shui_sr': 42135206, 'sbf_sr':	6111892, 'fs_sr':	2042964},
  {'year': '2020', 'shui_sr': 42222702, 'sbf_sr':	8134402, 'fs_sr':	1953922},
  {'year': '2021', 'shui_sr': 45072877, 'sbf_sr':	19202803, 'fs_sr': 2754313},
  {'year': '2022', 'shui_sr': 39118268, 'sbf_sr':	21675309, 'fs_sr': 30636979},
  {'year': '2023', 'shui_sr': 43715324, 'sbf_sr':	23283013, 'fs_sr': 27155186},
]

// 四大指标
// 四大类监控指标 指标代码 指标名称 疑点数量
// 矿山企业
const kuangchan_zhibiao_data = [
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_01', 'zhibiao_name': '错误认定矿业权出让收益征收方式','yidian_num':	7},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_02', 'zhibiao_name': '矿产资源专项收入预算分配比例错误','yidian_num':	669},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_03', 'zhibiao_name': '应认定未认定教育两费、水利建设基金','yidian_num':	309},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_04', 'zhibiao_name': '应认定未认定残疾人就业保障金','yidian_num':172333},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_05', 'zhibiao_name': '应认定未认定工会经费','yidian_num':	122996},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_06', 'zhibiao_name': '提前征收矿产资源专项收入','yidian_num':	71},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_07', 'zhibiao_name': '矿业权出让收益逾期缴费','yidian_num': 0},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_08', 'zhibiao_name': '缴费人疑似汇缴入库矿产资源专项收入','yidian_num':	4},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_09', 'zhibiao_name': '未同步征收矿产资源专项收入利息、滞纳金','yidian_num':	223},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_10', 'zhibiao_name': '矿产资源专项收入合同编号不规范','yidian_num':	134},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_11', 'zhibiao_name': '错误征收矿业权占用费','yidian_num':	16},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_12', 'zhibiao_name': '使用费异常大额入库','yidian_num':	3},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_01_13', 'zhibiao_name': '虚收空转矿产资源专项收入','yidian_num':	1},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_02_01', 'zhibiao_name': '少征、漏征水土保持补偿费','yidian_num':	1684},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_02_02', 'zhibiao_name': '水土保持补偿费未根据矿产种类正确选择征收方式','yidian_num':	0},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_02_03', 'zhibiao_name': '森林植被恢复费未备注项目信息','yidian_num':	784},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_01', 'zhibiao_name': '资源税应认定未认定','yidian_num':	109},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_02', 'zhibiao_name': '占用林地缴纳耕地占用税未申报森林植被恢复费','yidian_num': 0},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_03', 'zhibiao_name': '工会经费零申报','yidian_num': 0},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_04', 'zhibiao_name': '工会经费计费依据与企业所得税工资薪金不匹配','yidian_num': 0},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_05', 'zhibiao_name': '缴纳矿业权出让收益的企业2年内未缴税或缴税金额过低','yidian_num':	203},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_06', 'zhibiao_name': '少缴残疾人就业保障金','yidian_num':	27421},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_07', 'zhibiao_name': '水利建设基金与增值税销售收入不匹配','yidian_num': 0},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_08', 'zhibiao_name': '教育两费减半征收政策违规享受','yidian_num':	2780},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_09', 'zhibiao_name': '教育两费减半征收政策应享未享','yidian_num':	54747},
  {'zhibiao': '矿山企业', 'zhibiao_code': 'fs_ks_03_10', 'zhibiao_name': '残疾人就业保障金免征政策违规享受','yidian_num':	1156},
]

// 残疾人企业
const chanjiren_zhibiao_data = [
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_01_01', 'zhibiao_name':'残保金申报残疾人数有误','yidian_num':	24394},
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_01_02', 'zhibiao_name':'残疾人就业保障金应认定未认定','yidian_num':	32512},
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_01_03', 'zhibiao_name':'应认定未认定工会经费','yidian_num':0},
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_03_01', 'zhibiao_name':'违规享受增值税即征即退优惠政策','yidian_num':	234},
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_03_02', 'zhibiao_name':'违规享受城镇土地使用税优惠政策','yidian_num':	695},
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_03_03', 'zhibiao_name':'违规享受残保金优惠政策','yidian_num':	153940},
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_03_04', 'zhibiao_name':'工会经费零申报','yidian_num':0},
  {'zhibiao': '安置残疾人企业', 'zhibiao_code': 'fs_cjr_03_05', 'zhibiao_name':'工会经费计费依据与企业所得税工资薪金不匹配','yidian_num':0},
]

// 基础类企业
const jichu_zhibiao_data = [
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_01_01','zhibiao_name':'应认定未认定教育两费、水利建设基金','yidian_num':0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_01_02','zhibiao_name':'应认定未认定文化事业建设费','yidian_num':	58422},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_01_03','zhibiao_name':'应认定未认定残疾人就业保障金','yidian_num':0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_01_04','zhibiao_name':'应认定未认定工会经费','yidian_num':0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_01_05','zhibiao_name':'矿产资源专项收入、生态环境损害赔偿资金、水土保持补偿费、排污权出让收入预算分配比例错误','yidian_num':	517},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_01','zhibiao_name':'水利建设基金与增值税销售收入不匹配','yidian_num':	65348},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_02','zhibiao_name':'文化事业建设费与增值税销售收入不匹配','yidian_num':	1810},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_03','zhibiao_name':'矿业权出让收益逾期缴费','yidian_num':	0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_04','zhibiao_name':'非税收入大额异动','yidian_num':	194},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_05','zhibiao_name':'非税收入欠费提醒','yidian_num':	18087},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_06','zhibiao_name':'森林植被恢复费未备注项目信息','yidian_num':0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_07','zhibiao_name':'占用林地缴纳耕地占用税未申报森林植被恢复费','yidian_num':	85},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_08','zhibiao_name':'工会经费计费依据与企业所得税工资薪金不匹配','yidian_num':	37745},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_09','zhibiao_name':'工会经费零申报','yidian_num':	11236},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_10','zhibiao_name':'国有土地使用权出让收入与印花税、契税计税依据不匹配','yidian_num':	365},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_11','zhibiao_name':'少缴残疾人就业保障金','yidian_num':0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_02_12','zhibiao_name':'占用林地缴纳森林植被恢复费未申报耕地占用税','yidian_num':	4625},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_03_01','zhibiao_name':'非税收入未及时完成退费','yidian_num':	3},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_04_01','zhibiao_name':'教育两费减半征收政策违规享受','yidian_num':0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_04_02','zhibiao_name':'教育两费减半征收政策应享未享','yidian_num':0},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_04_03','zhibiao_name':'文化事业建设费免征政策违规享受','yidian_num':	485},
  {'zhibiao': '基础类企业','zhibiao_code':'fs_jc_04_04','zhibiao_name':'残疾人就业保障金免征政策违规享受','yidian_num':0},
]

// 土地类企业
const tudi_zhibiao_data = [
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_01','zhibiao_name':'提前征收国有土地使用权出让收入','yidian_num':32},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_02','zhibiao_name':'未同步征收国有土地使用权出让收入利息、违约金','yidian_num':316},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_03','zhibiao_name':'国有土地使用权出让收入逾期缴费','yidian_num':	163},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_04','zhibiao_name':'缴费人疑似汇缴入库国有土地使用权出让收入','yidian_num':	139},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_05','zhibiao_name':'国有土地使用权出让收入宗地信息缺失','yidian_num':	3},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_06','zhibiao_name':'国有土地使用权出让收入合同编号缺失','yidian_num':	0},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_07','zhibiao_name':'国有土地使用权出让收入退费时间过长','yidian_num':	0},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_08','zhibiao_name':'超范围受理国有土地使用权出让收入退费','yidian_num':	69},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_09','zhibiao_name':'国有土地使用权出让收入电子监管号异常','yidian_num':	18},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_10','zhibiao_name':'国有土地使用权出让收入未走线上新流程申报1','yidian_num':	490},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_11','zhibiao_name':'国有土地使用权出让收入未走线上新流程申报2','yidian_num':	159},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_01_12','zhibiao_name':'平台公司频繁缴纳国有土地使用权出让收入','yidian_num':	191},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_02_01','zhibiao_name':'水土保持补偿费少征漏征','yidian_num':	4481},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_02_02','zhibiao_name':'水土保持补偿费逾期申报','yidian_num':	85707},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_03_01','zhibiao_name':'国有土地使用权出让收入与印花税、契税计税依据不匹配','yidian_num':0},
{'zhibiao': '土地类企业','zhibiao_code':'fs_td_03_02','zhibiao_name':'缴纳国有土地使用权出让收入的企业2年内未缴税或缴税金额过低','yidian_num':	399},

]

// 听浏览器事件
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

  // 用于固定比例显示数值
  const bili = [30,28,26,25,24,21,20,19,18,17,15,13,12,11,10,10,9,9,8,8,7,7,6,6,5,5,4];

  let d:object[] = [];
  first_year_feizhong_sr.forEach((item, index)=>{
    let d1 = {
      "value": 0,
      "name": "",
      "bfb": 0,
      "item": "",
      "total": 0,
      "total_zhuanhuan": "",
    };
    for (let itemKey in item) {
      if (item[itemKey] == 0){
        d1.bfb = -100;
      }else if(last_year_feizhong_sr[index][itemKey] == 0){
        d1.bfb = 100;
      }else{
        d1.bfb = parseFloat((((item[itemKey] / last_year_feizhong_sr[index][itemKey]) - 1) * 100).toFixed(2))
      }
      d1.name = feizhong_names[index][itemKey]
      d1.item = feizhong_names[index][itemKey]
      d1.total = item[itemKey]
    }
    d.push(d1)
  })
  // 降序排序
  d.sort((a,b)=> b.total - a.total )

  let data = [];
  // data = d.slice(0,20)
  data = d

  data.forEach((item, index) => {
    data[index]['value'] = bili[index]
    data[index]['total_zhuanhuan'] = (data[index]['total'] / 100000000).toFixed(2)
  })


  // let data = [{
  //   "value": 100,
  //   "name": "土地出让金",
  //   'id': 1
  // }, {
  //   "value": 79,
  //   "name": "矿产资源专项收入"
  // }, {
  //   "value": 59,
  //   "name": "教育费附加"
  // }, {
  //   "value": 39,
  //   "name": "地方教育附加"
  // }, {
  //   "value": 19,
  //   "name": "文化事业建设费"
  // }, {
  //   "value": -19,
  //   "name": "化工"
  // }, {
  //   "value": -39,
  //   "name": "土地及地面建筑"
  // }, {
  //   "value": -59,
  //   "name": "残疾人保障金"
  // }, {
  //   "value": -79,
  //   "name": "水利建设基金"
  // }, {
  //   "value": -100,
  //   "name": "防空地下室易地建设费"
  // }, {
  //   "value": 10,
  //   "name": "其他省级非税收入",
  // }]

  // 颜色配置
  let color = {
    'up': ["#88aeff", "#709eff", "#598eff", "#417eff", "#296eff"],
    'down': ["#ce8cb0", "#c475a0", "#bb5e90", "#b14780", "#a73070"],

    // 'up': ["#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6", "#039BE5"],
    // 'down': ["#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#E53935"],
    'up_pd': [0, 20, 40, 60, 80, 100],
    'down_pd': [0, -20, -40, -60, -80, -100]
  }

  // 判断比例选择对应颜色
  for (let n in data) {
    let bili = data[n]['bfb'];
    data[n]['name'] = data[n]['name']
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
      // data[n]['bfb'] = Math.abs(bili);
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
      formatter(params) {
        //params 主要在上面的代码中push进去 自己所需的数据 params的data就能拿到
        let p = params.data;
        // p.name+'\n'+p.total+'万元\n'+ p.bfb + '%'
        return '<div style="text-align: left">'+p.name+'<br>'+p.total_zhuanhuan+'亿元<br>'+p.bfb+'%</div>';
      }
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
          position: ['0%', '0%'],
          formatter(params) {
            //params 主要在上面的代码中push进去 自己所需的数据 params的data就能拿到
            let p = params.data;
            // // p.name+'\n'+p.total+'万元\n'+ p.bfb + '%'
            return p.name+'\n'+p.total_zhuanhuan+'亿元\n'+p.bfb+'%';
          },
          fontSize: 14,
        }
      },
      itemStyle: {
        normal: {
          show: true,
          textStyle: {
            // color: '#ff0000',
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

function initChart2(start?: number, end?: number){
  const myChart = init(document.getElementById('left-top-min') as HTMLDivElement)

  // 本年费种收入
  let xdata: string[] = [];
  let ydata: number[] = [];
  // 其他非税收入
  let qita: number = 0;
  first_year_feizhong_sr.forEach((item,index)=>{
    for (let itemKey in item) {
      if(feizhong_names[index][itemKey].indexOf('其他') != -1) {
        qita += item[itemKey];
      }else{
        xdata.push(feizhong_names[index][itemKey]);
        ydata.push(item[itemKey]);
      }
    }
  })
  // 其他非税收入插入
  xdata.push('其他非税收入')
  ydata.push(qita);

  ydata.forEach((item,index)=>{
    ydata[index] = Number((item / 100000000).toFixed(2));
  })

  // var xdata = ["教育费附加","地方教育附加","残疾人保障金","文化事业建设费","水利建设基金","工会经费","电力能源类","水土保持补偿费","排污权出让收入",
  //   "防空地下室易地建设费","城镇垃圾处理费","土地闲置费","土地出让金","矿产资源专项收入","森林植被恢复费","河道砂石收入","土地及土地面建筑","停车泊位费","国家重大水利工程建设基金收入"];
  // var ydata  = [10,20,15,10,9,16,13,21,14,17,5,9,11,14,17,5,9,11,11];
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
          let val = value.split("").join("\n");
          if (val.length > 18) {
            val = val.substr(0, 18) + '...';
            return val;
          } else {
            return val;
          }
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
      right:'2%',
      bottom:'32%',
      left:'12%'
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
  let xData = [];
  let lastYearData = [];
  let thisYearData = [];
  first_city_sr.forEach((item, index)=>{
    for (let itemKey in item) {
      xData.push(city_code_map[itemKey])
      let y_data = {
        value: 0,
        bfb: 0,
        city: ""
      }
      y_data.city = city_code_map[itemKey];
      if (item[itemKey] == 0){
        y_data.value = 0
        y_data.bfb = 100
        lastYearData.push(y_data)
        thisYearData.push('')
      }else if(last_city_sr[index][itemKey] == 0){
        y_data.value = 0
        y_data.bfb = 100
        lastYearData.push('')
        thisYearData.push(y_data)
      }else{
        let n = (((item[itemKey] / last_city_sr[index][itemKey]) - 1) * 100).toFixed(2);
        if (n < 0){
          y_data.value = Number((item[itemKey] / 100000000).toFixed(2))
          y_data.bfb = Number(n)
          lastYearData.push(y_data)
          thisYearData.push('')
        }else{
          y_data.value = Number((item[itemKey] / 100000000).toFixed(2))
          y_data.bfb = Number(n)
          lastYearData.push('')
          thisYearData.push(y_data)
        }
      }
    }
  })

  // var xData = ['长沙市', '岳阳市', '常德市', '衡阳市', '株洲市', '郴州市', '湘潭市','邵阳市','永州市','益阳市', '娄底市', '怀化市', '湘西州', '张家界市', '湘江新区']
  // var lineData = [100, 100, 100, 100, 100, 100, 100,100,100,100,100, 100,100,100,100,100]
  // var lastYearData = [1, 2, 6.2, 3.4, 5.5, 6.5, 3.2,2.3,'', '', '', '', '', '', ''];
  // var thisYearData = ['', '', '', '', '', '', '', '', 1.4,2.1, 6.6, 7.9,3.4,3.4,2.1];

  var timeLineData = [1];
  let legend=['减少', '增长'];
  var background = "rgba(8, 16, 35, 0)"; //背景
  let textColor = "#fff";
  let lineColor="rgba(255,255,255,0.2)";
  let colors = [{
    borderColor: "rgb(227,96,96)",
    start: "rgba(227,96,96,0.8)",
    end: "rgba(227,96,96,0.3)"

    // 'down': ["", "#c475a0", "#bb5e90", "#b14780", "#a73070"],

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
  let option:any = {
    baseOption: {
      backgroundColor: background,
      tooltip: {
        show: true,
        formatter: function(params) {
          let p = params[0].data
          if (p) {
            return '<div style="text-align: left">' +
                p.city + "</br>" + p.value + '亿元</br>' + p.bfb + '%' +
                '</div>';
          }
        },
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
        left: '6%',
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
        right: '6%',
        top: '10%',
        bottom: '8%',
        containLabel: true,
        width: '37%'
      }],
      xAxis: [{
        max:400,
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
        max:400,
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
          position: 'left',
          formatter: function (params) {
            let p = params.data;
            return p.value+'亿元';
          },
          show: true,
          color: 'white'
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
            position: 'right',
            formatter: function (params) {
              let p = params.data;
              return p.value+'亿元';
            },
            show: true,
            color: 'white',
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

function initChart4(y,shui_srs,sbf_srs,fs_srs){
  const myChart = init(document.getElementById('time-line-right-'+y) as HTMLDivElement)
  let option = {
    // backgroundColor: "#081023",
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
    tooltip: {
      show: true,
      formatter: "{b}: {c}亿元",
      trigger: "item",
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
    xAxis: {
      max:4000,
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
      // data: ['税收入', '社保费收入', '非税收入'],
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
      tooltip: {
        trigger: 'item',
        formatter: "税收收入: {c}亿元",
      },
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'inside', //在上方显示  inside 中心  正数 向右 向下
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
      data: shui_srs
    },
      {
        type: 'bar',
        // name: "检测人数",
        tooltip: {
          trigger: 'item',
          formatter: "社保费收入: {c}亿元",
        },
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
        data: sbf_srs
      },
      {
        type: 'bar',
        // name: "检测人数",
        tooltip: {
          trigger: 'item',
          formatter: "非税收入: {c}亿元",
        },
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
              color: 'rgb(15,45,243)'
            }, {
              offset: 1,
              color: 'rgba(15,45,243,0)'
            }]),
            borderWidth: 2,
            barBorderRadius:15
          }
        },
        data: fs_srs
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

function initChart5(y,shui_srs,sbf_srs,fs_srs){
  const myChart = init(document.getElementById('time-line-right-'+y) as HTMLDivElement)
  let option = {
    // backgroundColor: "#081023",
    legend: {
      // data: ["采样人数", "检测人数"],
      top: "5%",
      // right: '10',
      textStyle: {
        color: "rgba(250,250,250,0.6)",
        fontSize: 16
      }
    },
    tooltip: {
      show: true,
      formatter: "{b}: {c}亿元",
      trigger: "item",
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
    barWidth: 15,
    grid: {
      right: '3%',
    },
    xAxis: {
      max:4500,
      type: 'value',
      position: 'in',
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
      tooltip: {
        trigger: 'item',
        formatter: "税收收入: {c}亿元",
      },
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'inside', //在上方显示
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
      data: shui_srs
    },
      {
        type: 'bar',
        // name: "检测人数",
        tooltip: {
          trigger: 'item',
          formatter: "社保费收入: {c}亿元",
        },
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
        data: sbf_srs
      },
      {
        type: 'bar',
        // name: "检测人数",
        tooltip: {
          trigger: 'item',
          formatter: "非税收入: {c}亿元",
        },
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
              color: 'rgba(15,87,243,0)'
            }, {
              offset: 1,
              color: 'rgb(15,45,243)'
            }]),
            borderWidth: 2,
            barBorderRadius:15
          }
        },
        data: fs_srs
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

// 费种、市州 .title-right-end
const incomeTab = ref<TabsInstance['incomeTab']>('left-top-right');

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
  'one': {'d':[0,0,0,0,0,0],'c':[0,0,0,0,0]},
  'two': {'d':[0,0,0,0,0,0],'c':[0,0,0,0,0]},
  'three':{'d':[0,0,0,0,0,0],'c':[0,0,0,0,0]},
  'four':{'d':[0,0,0,0,0,0],'c':[0,0,0,0,0]}
}

// 扫描疑点数据
// one
let tudi_yidian_num = 0;
tudi_zhibiao_data.forEach((item, index)=>{
  tudi_yidian_num += item['yidian_num']
})
// two
let kuangchan_yidian_num = 0;
kuangchan_zhibiao_data.forEach((item, index)=>{
  kuangchan_yidian_num += item['yidian_num']
})
// three
let chanjiren_yidian_num = 0;
chanjiren_zhibiao_data.forEach((item, index)=>{
  chanjiren_yidian_num += item['yidian_num']
})
// four
let jichu_yidian_num = 0;
jichu_zhibiao_data.forEach((item, index)=>{
  jichu_yidian_num += item['yidian_num']
})

for (let itemDataKey in item_data) {
  switch (itemDataKey){
    case 'one':
      item_data[itemDataKey]['c'][0] = tudi_yidian_num;
      break;
    case 'two':
      item_data[itemDataKey]['c'][0] = kuangchan_yidian_num;
      break;
    case 'three':
      item_data[itemDataKey]['c'][0] = chanjiren_yidian_num;
      break;
    case 'four':
      item_data[itemDataKey]['c'][0] = jichu_yidian_num;
      break;
  }
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
    document.querySelector('#lblb-l #'+risk_change_id+'-category').setAttribute('style','display: none !important')
    document.querySelector('#lblb-m #'+risk_change_id+'-min').setAttribute('style','display: none !important')
  }else{
    document.querySelector('#item-card #item-card-div').style.display = 'none';
    document.querySelector('#lblb-l #item-card-category').setAttribute('style','display: none !important')
    document.querySelector('#lblb-m #item-card-min').setAttribute('style','display: none !important')
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
    document.querySelector('#lblb-l #'+risk_change_id+'-category').setAttribute('style',"display: ''")
    document.querySelector('#lblb-m #'+risk_change_id+'-min').setAttribute('style',"display: ''")

    clearInterval(category_tab_time)
    category_time_params = [];

    category_tab(change_card_data,categoryTab.value, risk_change_id)
    categoryTab.value = 'one'; // 每次切换都会回到原点

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
  // ToDo:待处理
  let lbrb_data = data[categoryTab]['d'];
  let lbrb_count = data[categoryTab]['c'];
  //
  // // 卡片信息
  // for (let i = 0; i < lbrb_data.length; i++) {
  //   let card_dom = document.querySelector('#'+divID+'-div .'+categoryTab+' .card-'+(i+1)+' .el-card__body .count');
  //   card_dom.textContent = lbrb_data[i];
  // }
  // 扫描统计
  for (let i = 0; i < lbrb_count.length; i++) {
    let count_dom = document.querySelector('.'+categoryTab+' .c'+(i+1));
    count_dom.textContent = lbrb_count[i];
  }
}

// // 定时每 4 秒轮播
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
// }, 10000);

// 事件
function categoryTab_event() {
  // 左下角按钮悬停  // 鼠标悬停 & 鼠标离开
  let lb_c_dom: unknown = null;
  if (risk_change_id !== '') {
    lb_c_dom = document.querySelector('#lblb-l #' + risk_change_id + '-category .el-radio-group');
  } else {
    lb_c_dom = document.querySelector('#lblb-l #item-card-category .el-radio-group');
  }

  lb_c_dom.childNodes.forEach((el) => {
    el.addEventListener('mouseover', function (e) {
      lb_c_dom.childNodes.forEach((el) => {
        if (el.nodeName != '#text'){
          el.classList.remove('is-active')
        }
      })
      el.classList.add('is-active')
      categoryTab.value = el.querySelector('input').value
    })

    el.addEventListener('mouseout', function (e) {

    })

    el.addEventListener('click', function (e) {
      let title = el.querySelector('.el-radio-button__inner').textContent;
      let type = el.querySelector('input').value;
      store.commit('set_title', {title: title});

      if (risk_change_id == 'area-card') {
        router.push('/riskArea')
      } else {
        let risk_item = [];
        switch (type){
          case 'one':
            tudi_zhibiao_data.forEach((item,index) => {
              risk_item.push(item['zhibiao_name'])
            })
            store.commit('set_risk_item', {risk_item: risk_item});
            router.push('/riskItem')
            break;
          case 'two':
            kuangchan_zhibiao_data.forEach((item,index) => {
              risk_item.push(item['zhibiao_name'])
            })
            store.commit('set_risk_item', {risk_item: risk_item});
            router.push('/riskItem')
            break;
          case 'three':
            chanjiren_zhibiao_data.forEach((item,index) => {
              risk_item.push(item['zhibiao_name'])
            })
            store.commit('set_risk_item', {risk_item: risk_item});
            router.push('/riskItem')
            break;
          case 'four':
            jichu_zhibiao_data.forEach((item,index) => {
              risk_item.push(item['zhibiao_name'])
            })
            store.commit('set_risk_item', {risk_item: risk_item});
            router.push('/riskItem')
            break;
        }
      }
    })
  })
}

// 时间线
const years = [
  {
    year: '2018',
    title: '2018年度情况',
    // content: '教育费附加、地方教育附加、残疾人就业保障金、水利建设基金、文化事业建设费、废弃电器电子产品处理基金、工会经费',
    content: '',
    shui_sr: 41760375,
    sbf_sr: 128298,
    fs_sr: 1417760
  },
  {
    year: '2019',
    title: '2019年度情况',
    content: '农网还贷基金、可再生能源发展基金、国家重大水利工程建设基金、大中型水库移民后期扶持基金、跨省际大中型水库库区基金、广告收入、河道砂石资源开采权出让收入',
    shui_sr: 42135206,
    sbf_sr: 6111892,
    fs_sr: 2042964
  },
  {

    year: '2020',
    title: '2020年度情况',
    content: '',
    shui_sr: 42222702,
    sbf_sr: 8134402,
    fs_sr: 1953922
  },
  {
    year: '2021',
    title: '2021年度情况',
    content: '水土保持补偿费、排污权出让收入、地方水库移民扶持基金、防空地下室易地建设费、土地闲置费、成真垃圾处理费、河道砂石经营收益、生态环境损害赔偿金',
    shui_sr: 45072877,
    sbf_sr: 19202803,
    fs_sr: 2754313
  },
  {
    year: '2022',
    title: '2022年度情况',
    content: '国有土地使用权出让收入、矿产资源专项收入、国有资产占用费、土地及地面建筑资产处置、非土地及地面建筑资产处置、破损公路及设施赔(补)偿费和占用费、停车泊位和公共停车场有偿使用收入',
    shui_sr: 39118268,
    sbf_sr: 21675309,
    fs_sr: 30636979
  },
  {
    year: '2023',
    title: '2023年度情况',
    content: '森林植被恢复费',
    shui_sr: 43715324,
    sbf_sr: 23283013,
    fs_sr: 27155186
  },
  // {
  //   year: '2024',
  //   title: '2024年度情况',
  //   content: '',
  //   shui_sr: '',
  //   sbf_sr: '',
  //   fs_sr: ''
  // },
]

years.forEach(function (item, index) {
  years[index].shui_sr = Number((item.shui_sr/10000).toFixed(2))
  years[index].sbf_sr = Number((item.sbf_sr/10000).toFixed(2))
  years[index].fs_sr = Number((item.fs_sr/10000).toFixed(2))
})

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
    //       dom.querySelector('.card-1 .card-div-item-title').textContent = j;
    //   }
    // }
  }
})

</script>


<template>
  <div class="screen-bg">
    <div class="container" ref="dataScreenRef">
      <div class="header">
        <div class="title">
          监管大屏
        </div>
        <div class="time">
          {{ currentDate + ' ' + str }}
        </div>
      </div>
      <div class="body">
        <div class="left">
          <div class="left-top">
            <div class="left-top-left">
              <div class="title-box">
                <div class="title">
                  分费种收入
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
                  分市州收入
                </div>
                <div class="change-btn">
                  <el-radio-group v-model="incomeTab" class="top-content">
<!--                    <el-radio-button value="left-top-min">费种</el-radio-button>-->
<!--                    <el-radio-button value="left-top-right">市州</el-radio-button>-->
                  </el-radio-group>
                </div>
              </div>
              <div class="content-box">
                <div class="content">
                  <div :id="incomeTab"></div>
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
                <el-radio-group v-model="riskTab">
                  <el-radio-button value="item-card">项目</el-radio-button>
                  <el-radio-button value="area-card">市州</el-radio-button>
                  <el-radio-button value="pici-card">批次</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="content-box">
              <div class="left-bottom-left" id="lblb-l">
                <div id="item-card-category" class="category">
                  <el-radio-group v-model="categoryTab">
                    <el-radio-button value="one">土地出让收入</el-radio-button>
                    <el-radio-button value="two">矿产资源专项收入</el-radio-button>
                    <el-radio-button value="three">残疾人就业保障金</el-radio-button>
                    <el-radio-button value="four">基础费种</el-radio-button>
                  </el-radio-group>
                </div>

                <div id="area-card-category" class="category" style="display: none">
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

                <div id="pici-card-category" class="category" style="display: none">
                  <div class="card-title-box">
                    <div class="card-title-text" style="font-size: 1.3rem;color: #0091ea;padding:0 10px 10px 10px">下发途径</div>
                  </div>
                  <el-radio-group v-model="categoryTab">
                    <el-radio-button value="one">一体式监管平台</el-radio-button>
                    <el-radio-button value="two">一体化风险管理系统</el-radio-button>
                    <el-radio-button value="three">决策二包风险管理系统</el-radio-button>
                    <el-radio-button value="four">数据质量监控平台</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="left-bottom-min" id="lblb-m">
                <div id="item-card-min" class="min">
                  <div class="lblb-r" :class="categoryTab">
                    <div class="box">
                      <el-text class="title">扫描数量</el-text>
                      <el-text class="content c1">11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title">涉及企业</el-text>
                      <el-text class="content c2">11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >已下发</el-text>
                      <el-text class="content c3">11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >已反馈</el-text>
                      <el-text class="content c4" >11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >已入库</el-text>
                      <el-text class="content c5" >11</el-text>
                    </div>
                  </div>
                </div>
                <div id="area-card-min" class="min" style="display: none">
                  <div class="lblb-r" :class="categoryTab">
                    <div class="box">
                      <el-text class="title">扫描数量</el-text>
                      <el-text class="content c1">11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title">涉及企业</el-text>
                      <el-text class="content c2">11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >已下发</el-text>
                      <el-text class="content c3">11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >已反馈</el-text>
                      <el-text class="content c4" >11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >已入库</el-text>
                      <el-text class="content c5" >11</el-text>
                    </div>
                  </div>
                </div>
                <div id="pici-card-min" class="min" style="display: none">
                  <div class="lblb-r" :class="categoryTab">
                    <div class="card-title-box">
                      <div class="card-title-text" style="font-size: 1.3rem;color: #0091ea;padding:0 10px 10px 10px">批次</div>
                    </div>
                    <div class="box">
                      <el-text class="title" >总户数</el-text>
                      <el-text class="content c3">11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >涉及金额</el-text>
                      <el-text class="content c4" >11</el-text>
                    </div>
                    <div class="box">
                      <el-text class="title" >风险等级</el-text>
                      <el-text class="content c5" >11</el-text>
                    </div>
                  </div>
                </div>
              </div>
              <div class="left-bottom-right">
                <div :id="riskTab" class="box">
                  <div style="height: 100%" id="item-card-div">
                    <el-row class="left-button-right-button" :class="categoryTab">
                      <el-carousel :interval="4000" arrow="hover">
                        <el-carousel-item v-for="item in enterpriseCount" :key="item">
                          <el-card :class="`card-all card-all-${item}`">
                            <div class="card-div-box">
                              <el-row>
                                <el-col :span="10">
                                  <el-row class="card-left">
                                    <el-col>
                                      <div class="card-left-top">
                                        <el-row>
                                          <span class="title-max">风险企业简报</span>
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
                                              <div>
                                                <div class="card-div-item-title">
                                                  本年纳税金额
                                                </div>
                                                <div class="card-div-item-content money">
                                                  56 <span>万元</span>                                            </div>
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
                                                  历史应对疑点
                                                </div>
                                                <div class="card-div-item-content yidian">
                                                  36
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
                    </el-row>
                  </div>
                  <div style="height: 100%;display: none" id="area-card-div">
                    <el-row class="left-button-right-button" :class="categoryTab">
                      <el-carousel :interval="4000" arrow="hover">
                        <el-carousel-item v-for="item in enterpriseCount" :key="item">
                          <el-card :class="`card-all card-all-${item}`">
                            <div class="card-div-box">
                              <el-row>
                                <el-col :span="10">
                                  <el-row class="card-left">
                                    <el-col>
                                      <div class="card-left-top">
                                        <el-row>
                                          <span class="title-max">风险企业简报</span>
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
                                              <div>
                                                <div class="card-div-item-title">
                                                  本年纳税金额
                                                </div>
                                                <div class="card-div-item-content money">
                                                  56 <span>万元</span>                                            </div>
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
                                                  历史应对疑点
                                                </div>
                                                <div class="card-div-item-content yidian">
                                                  36
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
                    </el-row>
                  </div>
                  <div style="height: 100%;display: none" id="pici-card-div">
                    <el-row class="left-button-right-button" :class="categoryTab">

                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title-box">
            <div class="title">
              费种收入/划转时间线
            </div>
          </div>
          <div class="content-box">
            <div class="content">
              <el-row class="right-button-main">
                <el-col :span="24">
                  <v-timeline align="start" line-thickness="2" line-inset="1">
                    <v-timeline-item
                        v-for="(year, i) in years"
                        :key="i"
                        dot-color="#0091EA"
                        size="small"
                    >
                      <template v-slot:opposite>
                        <!--                            <div-->
                        <!--                                :class="`pt-1 headline font-weight-bold text-${year.color}`"-->
                        <!--                                v-text="year.year"-->
                        <!--                            ></div>-->

                        <div :id="`time-line-right-${year.year}`">

                        </div>
                      </template>
                      <div>
                        <h2 :class="`mt-n1 headline font-weight-light mb-4 text-light-blue-accent-4`">
                          {{year.title}}
                        </h2>
                        <div>

                        </div>
                        <div class="content">
                          <el-tag v-if="year.content !== ''" type="success" class="el-tag-success">—————— <el-tag style="background:none;border:0;color: #409EFF">新增</el-tag> ——————</el-tag>
                          <el-tag v-if="year.content == ''" type="success" class="el-tag-success">—————— <el-tag style="background:none;border:0;color: #409EFF">无变化</el-tag> ——————</el-tag>
                        </div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@base-height: 1080px;

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
    color: white;

    .header{
      caret-color: transparent; // 去掉闪烁光标
      background-image: url("@/assets/img/头.png");
      background-size: 100%;
      height: 400px;
      //background-color: #333;
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

        font-family: "Arial Black";

        font-weight: bold;
      }
      .time{
        margin-top: 24px;
        margin-left: 12px;
        font-size: 20px;
        font-weight: bold;
      }
    }

    .body{
      caret-color: transparent; // 去掉闪烁光标

      flex: 1;
      background: none;
      z-index: 1;
      margin-top: 135px;
      display: flex;
      flex-direction: row;
      padding: 0 30px 30px 30px;
      font-family: "Arial Black";

      .left{
        height: 100%;
        width: 68%;
        
        margin-right: 20px;
        display: flex;
        flex-direction: column;

        .left-top{
          height: 56%;
          margin-bottom: 10px;
          display: flex;
          flex-direction: row;

          .left-top-left{
            width: 40%;
            margin-right: 20px;
            
            display: flex;
            flex-direction: column;

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

            .content-box{
              flex: 1;
              background-image: url("@/assets/img/box框.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;
              padding: 20px;
              .content{
                width: 100%;
                height: 100%;
                
                #left-top-left{
                  width: 100%;
                  height: 100%;
                }
              }
            }

          }

          .left-top-right{
            flex: 1;
            
            display: flex;
            flex-direction: column;

            .title-box {
              height: 60px;
              margin-bottom: 10px;
              
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

                :deep(.el-radio-button__inner){
                  background: none;
                  color: white;
                }
                :deep(.el-radio-button__inner:hover){
                  background: #2A77C6 !important;
                }
                :deep(.is-active .el-radio-button__inner){
                  background: #6FB1FC !important;
                  color: gold;
                }
              }
            }

            .content-box {
              flex: 1;
              background-image: url("@/assets/img/box框.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;
              padding: 20px;

              .content {
                width: 100%;
                height: 100%;
                
                #left-top-min, #left-top-right{
                  width: 100%;
                  height: 100%
                }
              }
            }
          }
        }

        .left-bottom {
          flex: 1;
          
          display: flex;
          flex-direction: column;

          .title-box {
            height: 60px;
            margin-bottom: 10px;
            
            background-image: url("@/assets/img/文本框.png");
            background-repeat: no-repeat;
            margin-left: -35px;
            z-index: 1;

            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .title {
              height: 100%;
              font-size: 30px;
              padding-left: 60px;
              display: flex;
              justify-content: left;
              align-items: center;
            }

            .change-btn {
              display: flex;
              align-self: end;
              padding: 5px;

              :deep(.el-radio-button__inner){
                background: none;
                color: white;
              }
              :deep(.el-radio-button__inner:hover){
                background: #2A77C6 !important;
              }
              :deep(.is-active .el-radio-button__inner){
                background: #6FB1FC !important;
                color: gold;
              }
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
              
              .category{
                padding: 20px;
                width: 100%;
                height: 100%;
                display: flex;
                background-image: url("@/assets/img/box框.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;

                :deep(.is-active .el-radio-button__inner){
                  width: 100%;
                  background: rgb(89, 148, 255) !important;
                  color: gold;
                }
              }

              #item-card-category{
                .el-radio-group{
                  display: inline-flex;
                  font-size: 0;
                  justify-content: space-around;
                  flex-wrap: wrap;
                  align-content: space-between;
                }

                :deep(.el-radio-button){
                  width: 100%;
                  background-color: #10306b4a;

                  .el-radio-button__inner{
                    background: none;
                    height: 40px;
                    width: 100%;
                    color: aqua;
                    border: 0;
                    font-size: 16px;

                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                }
              }

              #area-card-category{
                .el-radio-group{
                  display: inline-flex;
                  font-size: 0;
                  justify-content: space-around;
                  flex-wrap: wrap;
                  align-content: space-between;
                }

                :deep(.el-radio-button){
                  width: 45%;
                  background-color: #10306b4a;

                  .el-radio-button__inner{
                    background: none;
                    height: 30px;
                    width: 100%;
                    color: aqua;
                    border: 0;
                  }
                }
              }


              #pici-card-category{
                display: flex;
                flex-direction: column;

                .el-radio-group{
                  flex: 1;
                  display: inline-flex;
                  font-size: 0;
                  justify-content: space-around;
                  flex-wrap: wrap;
                  align-content: space-between;
                }

                :deep(.el-radio-button){
                  width: 100%;
                  background-color: #10306b4a;

                  .el-radio-button__inner{
                    background: none;
                    height: 40px;
                    width: 100%;
                    color: aqua;
                    border: 0;
                    font-size: 16px;

                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                }
              }

            }

            .left-bottom-min {
              width: 25%;
              margin-right: 20px;

              .min{
                height: 100%;
                width: 100%;

                .lblb-r{
                  height: 100%;
                  width: 100%;
                  background-image: url("@/assets/img/box框.png");
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  padding: 20px;

                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: space-between;
                  :deep(.el-text){
                    color: white !important;
                  }
                  .box{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;

                    .title{
                      font-size: 18px;
                      display: block;
                      padding: 5px 0 5px 15px;
                    }
                    .content{
                      font-size: 18px;
                      display: block;
                      padding: 5px 15px 5px 0;
                    }

                  }

                  .box:not(:last-child){
                    margin-bottom: 10px;
                  }

                  .box:nth-child(odd){
                    background-color: #10306b4a;
                  }
                }
              }
            }

            .left-bottom-right {
              flex: 1;

              .box{
                height: 100%;
                width: 100%;
                background-image: url("@/assets/img/box框.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                padding: 20px;

                #item-card-div,#area-card-div{
                  height: 100%;
                  width: 100%;
                  .left-button-right-button {
                    height: 100%;
                    width: 100%;
                    border-radius: 4px;
                    background-image: url("@/assets/img/企业框3.png");
                    background-repeat: no-repeat;
                    background-size: 100% 100%;

                    .el-carousel__item:nth-child(2n) {
                      background-color: #99a9bf;
                    }

                    .el-carousel__item:nth-child(2n + 1) {
                      background-color: #d3dce6;
                    }

                    :deep(.el-carousel){
                      height: 100%;
                      width: 100%;
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
                        padding: 0;
                      }

                      .card-div-box{
                        .cl-card, .el-card__body {
                          padding: 20px;
                        }
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

                      .title-max{
                        font-size: 1.5rem;
                        color: #0091ea !important;
                        text-align: center;
                        width: 100%;
                        padding: 10px 0 0 0;
                      }

                      .card-div-item-title{
                        text-align: left;
                        font-size: 0.9rem;
                        font-weight: bold;
                        padding: 2px 3px 2px 5px;
                        background-color: #10306b4a;
                        //background-color: #133979;
                        margin-top: 5px;
                      }

                      .card-div-item-content{
                        padding-left: 5px;
                        font-size: 0.85rem;
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
                                margin-left: -4px;
                                height: 60px;
                              }

                              .zzsxssr,.zgswfj{
                                display: flex;
                                justify-content: start;
                                align-items: flex-end;
                                .card-div-item-title{

                                }
                                .card-div-item-content{
                                  margin-left: 5px;
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

      .right{
        flex: 1;
        
        display: flex;
        flex-direction: column;

        .title-box{
          height: 60px;
          margin-bottom: 10px;
          
          background-image: url("@/assets/img/文本框.png");
          background-repeat: no-repeat;
          margin-left: -35px;
          z-index: 0;
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
          background-size: 100% 100%;
          padding: 20px;
          .content{
            width: 100%;
            height: 100%;
            
            .right-button-main{
              height: @base-height - 275px;
              overflow-y: auto;
              overflow-x: hidden;

              :deep(.v-timeline-divider){
                .v-timeline-divider__before{
                  height: 100%;
                }
                .v-timeline-divider__dot{
                  margin-top: 92px;
                }
              }

              .content{
                width: auto;
                margin-top: 63px;
                .el-tag-success{
                  //background-color: rgba(82, 206, 107, 0.1);
                  background: none;
                  //border-color: rgba(211, 255, 240, 0.46);
                  color: #007e9a;
                  margin-bottom: 10px;
                  border: 0;
                }
                .text-su{
                  text-align: center;
                  font-size: 12px;
                }
              }
            }
            .right-button-main::-webkit-scrollbar {
              display: none;
            }
          }
        }
      }
    }
  }
}

:deep(.v-timeline-divider){
  .v-timeline-divider__before,.v-timeline-divider__dot,.v-timeline-divider__after {
    background: white !important;
  }
}

</style>