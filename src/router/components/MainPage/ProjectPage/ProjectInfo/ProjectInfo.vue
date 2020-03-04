<style lang="scss" scoped>
  .ProjectInfo {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    border-radius: 6px;

    .cell {
      height: 40px;
      line-height: 40px;
    }

    .bb {
      border-bottom: 1px solid #e8e8e8;
    }

    .bt {
      border-top: 1px solid #e8e8e8;
    }

    .bl {
      border-left: 1px solid #e8e8e8;
    }

    .br {
      border-right: 1px solid #e8e8e8;
    }

    .b18 {
      font-size: 18px;
      font-weight: bold;
    }

    .b14 {
      font-size: 14px;
      font-weight: bold;
    }

    .bgFCE4D6 {
      background-color: #FCE4D6;
    }

    .bgBDD7EE {
      background-color: #BDD7EE;
    }

    .bgFFD966 {
      background-color: #FFD966;
    }

    .bgFFF2CC {
      background-color: #FFF2CC;
    }

    .bgDDEBF7 {
      background-color: #DDEBF7;
    }

    .bgE2EFDA {
      background-color: #E2EFDA;
    }

    .click-font {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>

<template>
  <div class="ProjectInfo">
    <a-row class="cell bb b14">
      中南建筑设计院股份有限公司第五营销总监部
    </a-row>
    <a-row class="cell bb b18">
      设  计  项  目  基  本  情  况  表
    </a-row>
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br" :span="2" style="display: flex;align-items: center;justify-content: center">
        概况
      </a-col>
      <a-col :span="22">
        <a-row>
          <a-col class="b14 br bb cell" :span="4">设计号</a-col>
          <a-col class="br bb cell" :span="4">2020-95-031</a-col>
          <a-col class="b14 br bb cell" :span="4">项目名称</a-col>
          <a-col class="bb cell" :span="12">洋塘红金二期标准厂房规划设计项目</a-col>
        </a-row>
        <a-row class="cell">
          总建筑面积152954平米，地上148386、地下4568。
        </a-row>
      </a-col>
    </a-row>
    <a-divider />
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br bt" :span="2" style="display: flex;align-items: center;justify-content: center">
        项目经营
      </a-col>
      <a-col :span="22">
        <a-row>
          <a-col class="b14 br bt cell" :span="4">经营负责人</a-col>
          <a-col class="br bt cell" :span="4">张帆</a-col>
          <a-col class="b14 br bt cell" :span="4">签约状态</a-col>
          <a-col class="br bt cell" :span="4">已签/洽谈/投标</a-col>
          <a-col class="b14 br bt cell bgFCE4D6 click-font" :span="4">合同总额</a-col>
          <a-col class="bt cell bgFCE4D6" :span="4">4000000</a-col>
        </a-row>
        <a-row>
          <a-col class="b14 br bt cell click-font bgBDD7EE" :span="4">累计开票</a-col>
          <a-col class="br bt cell bgBDD7EE" :span="4">4000000</a-col>
          <a-col class="b14 br bt cell click-font bgFFD966" :span="4">累计收费</a-col>
          <a-col class="br bt cell bgFFD966" :span="4">4500000</a-col>
          <a-col class="b14 br bt cell" :span="4">未收发票</a-col>
          <a-col class="bt cell" :span="4">4500000</a-col>
        </a-row>
        <a-row>
          <a-col class="b14 br bt cell" :span="4">应收比例</a-col>
          <a-col class="br bt cell" :span="4">90%</a-col>
          <a-col class="b14 br bt cell" :span="4">应收金额</a-col>
          <a-col class="br bt cell" :span="4">4000000</a-col>
          <a-col class="b14 br bt cell" :span="4"></a-col>
          <a-col class="bt cell" :span="4"></a-col>
        </a-row>
        <a-row>
          <a-col class="b14 br bt cell" :span="4">项目经理</a-col>
          <a-col class="br bt cell" :span="4">黄磊</a-col>
          <a-col class="b14 br bt cell" :span="4">生产阶段</a-col>
          <a-col class="bt cell" :span="12">概念/方案/初设/施工图/后期</a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-divider />
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br bt" :span="2" style="display: flex;align-items: center;justify-content: center">
        项目生产
      </a-col>
      <a-col :span="22">
        <a-row>
          <a-col class="br bt cell" :span="4">专业/专项</a-col>
          <a-col class="br bt cell" :span="4">组织方式</a-col>
          <a-col class="br bt cell" :span="4">设计团队</a-col>
          <a-col class="br bt cell" :span="4">分项设计费</a-col>
          <a-col class="br bt cell" :span="4">价格（拟）</a-col>
          <a-col class="bt cell" :span="4">备注</a-col>
        </a-row>
        <a-row>
          <a-col class="br bt cell" :span="4"></a-col>
          <a-col class="br bt cell" :span="4"></a-col>
          <a-col class="br bt cell" :span="4">合计</a-col>
          <a-col class="br bt cell bgFFF2CC" :span="4"></a-col>
          <a-col class="br bt cell bgFFF2CC" :span="4"></a-col>
          <a-col class="bt cell bgFFF2CC" :span="4"></a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br bt click-font bgDDEBF7" :span="2" style="display: flex;align-items: center;justify-content: center">
        内部流转
      </a-col>
      <a-col :span="22">
        <a-row style="text-align: left;padding: 12px">
          <a-row>
            本人已对以上生产资源进行组织，并已核对设计合同内容。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              项目经理（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
        <a-row class="bt" style="text-align: left;padding: 12px">
          <a-row>
            本人已知晓并核对以上信息。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              行政专员（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
        <a-row class="bt" style="text-align: left;padding: 12px">
          <a-row>
            本人已详细阅读此表，并对以上信息进行校核，同意按此表进行项目运营。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              经营负责人（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
        <a-row class="bt" style="text-align: left;padding: 12px">
          <a-row>
            同意按此表进行项目运营。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              总监（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bb bgE2EFDA" style="text-align: left;padding: 12px;">
      <p>备注：</p>
      <p>1、此表在主合同签订前，由项目经理填写完毕后交由相关负责人；</p>
      <p>2、如有其他内协、外包项请在“其他”栏中如实填写；</p>
      <p>3、建筑、结构、设备、造价等专业设计费按公司默认比例分配。</p>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: "ProjectInfo"
  }
</script>