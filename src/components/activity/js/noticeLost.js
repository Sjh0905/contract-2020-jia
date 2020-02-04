const root = {}
root.name = 'noticeLost'

import Countdown from '../../../../static/js/countdown'

root.data = function () {
  return {
    // 弹框
    popType: 0,
    popText: this.lang == 'CH' ? '还未开放!' : 'unavailable!',
    promptOpen: false,
    // 分页
    maxPage: 1,
    selectIndex: 1,
    size: 100,
    maxLimit: 100, //交易奖励每页显示多少条

    endTime: '', // 结束时间
    startTime: '',  // 开始时间戳
    serverTime: '', // 服务器时间
    open_time: '1520845200000', // 交易排行榜开启时间
    charge_time: '1520920800000', // 充值开启时间 用作倒计时
    charge_end_time: '1521104400000',   // 倒计时结束时间
    // 页面
    ranking: this.$store.state.lang == 'CH' ? '未上榜' : 'unavailable', // 排名
    volume: '0',  // 交易量

    recharge: '0', // 充值
    reward: '0', // 奖励
    surplus: 0,  // 剩余奖励

    list: [],  // 奖励list
    list_1: [], // 充值
    list_type: '1',  //列表类型


    // 注册奖励
    registerList: [], //注册奖励
    registerFrom: 1,
    registerLimit: 50,
    registerMaxPage: 0,
    registerSelectIndex: 1,
    registerReward: 0,

    // 推荐奖励
    recommendList: [],//推荐奖励
    recommendFrom: 1,
    recommendLimit: 50,
    recommendMaxPage: 0,
    recommendSelectIndex: 1,
    recommendReward: 0,

    langs: {
      home: this.$store.state.lang == 'CH' ? '首页' : 'Home',
      detail: this.$store.state.lang == 'CH' ? '活动详情' : 'Event info',
      title0: this.$store.state.lang == 'CH' ? 'IOST上币活动交易排行榜' : 'Valuable IOST Market Members',
      title1: this.$store.state.lang == 'CH' ? 'IOST上币活动充值奖励' : 'IOST Deposits Bonus',
      title2: this.$store.state.lang == 'CH' ? 'IOST上币活动注册奖励' : 'IOST Registration Reward',
      title3: this.$store.state.lang == 'CH' ? 'IOST上币活动推荐奖励' : 'IOST Referral Reward',
      title_2: this.$store.state.lang == 'CH' ? '注册奖励' : 'Registration reward',
      title_3: this.$store.state.lang == 'CH' ? '推荐奖励' : 'Referral reward',
      title_gift: this.$store.state.lang == 'CH' ? '当前奖励' : 'Current reward',
      ranking: this.$store.state.lang == 'CH' ? '当前排名' : 'My ranking',
      Volume: this.$store.state.lang == 'CH' ? '当前交易量' : 'Transaction Volume',
      valuable_members_list: this.$store.state.lang == 'CH' ? '交易排行榜' : 'Valuable Members List',
      Ranking: this.$store.state.lang == 'CH' ? '排行' : 'Ranking',
      uid: this.$store.state.lang == 'CH' ? '用户名' : 'UID',
      buy: this.$store.state.lang == 'CH' ? '买入' : 'Buy',
      sell: this.$store.state.lang == 'CH' ? '卖出' : 'Sell',
      value: this.$store.state.lang == 'CH' ? '交易量' : 'Volume',
      Bonus: this.$store.state.lang == 'CH' ? '奖励' : 'Bonus',

      one: this.$store.state.lang == 'CH' ? '活动时间：2018年3月12日17:00-3月14日17:00' : 'Time: 2018/3/12 17:00-2018/3/14 17:00 (HKT)',
      two: this.$store.state.lang == 'CH' ? '活动内容：活动期间凡参与IOST交易的用户，按IOST交易量（买入量+卖出量）进行排名发放IOST奖励' : 'Details: TwentyTwenty offers extra bonus for valuable IOST market members. Top 50 members with high volume IOST transactions (sum of both Buy and Sell amount) will get the bonus.Bonus for Valuable IOST Market Members :',
      three_title: this.$store.state.lang == 'CH' ? '活动奖励' : 'Bonus',
      three_one: this.$store.state.lang == 'CH' ? '第一名奖励：5万枚IOST' : 'First: 50,000 IOST',
      three_two: this.$store.state.lang == 'CH' ? '第二名奖励：3万枚IOST' : 'Second: 30,000 IOST',
      three_three: this.$store.state.lang == 'CH' ? '第三名奖励：1.5万枚IOST' : 'Third: 15,000 IOST',
      three_four: this.$store.state.lang == 'CH' ? '第四名至第十名各奖励：5000枚IOST' : '4th – 10th: 5000 IOST  ',
      three_five: this.$store.state.lang == 'CH' ? '第十一名至第五十名各奖励：3000枚IOST' : '11th – 50th: 3000 IOST',
      four: this.$store.state.lang == 'CH' ? '奖励发放：活动奖励将于活动结束后2个工作日内发放' : 'Settlement: Bonus will be settled 2 business days after this event.',
      rules: this.$store.state.lang == 'CH' ? '活动规则' : 'activity rules',
      five_one: this.$store.state.lang == 'CH' ? '自成交不计入奖励排行' : 'Please note that transactions made to oneself will not be taken into account',
      five_two: this.$store.state.lang == 'CH' ? '如发现恶意交易等不当行为，TwentyTwenty有权取消活动资格及奖励' : 'Any behavior of unfair competition will be disqualified immediately.',
      five_three: this.$store.state.lang == 'CH' ? '本活动最终解释权归TwentyTwenty所有' : 'TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',

      Total_Deposit: this.$store.state.lang == 'CH' ? '当前充值' : 'Total Deposit',
      now_Bonus: this.$store.state.lang == 'CH' ? '奖励' : 'Bonus',
      Bonus_list: this.$store.state.lang == 'CH' ? '充值奖励' : 'Deposits Bonus List',
      Remaining: this.$store.state.lang == 'CH' ? '剩余奖励' : 'Remaining',
      count_down: this.$store.state.lang == 'CH' ? '倒计时' : 'Count down',
      last_deposit: this.$store.state.lang == 'CH' ? '充值时间' : 'Last deposit',
      total_deposit: this.$store.state.lang == 'CH' ? '充值' : 'Total deposit',

      recharge_one: this.$store.state.lang == 'CH' ? '活动时间：2018年3月12日14:00-3月14日17:00' : 'Time: 2018/3/12 14:00-2018/3/14 17:00 (HKT)',
      recharge_two: this.$store.state.lang == 'CH' ? '活动奖励：充值IOST可按照500：1的比例奖励获得IOST奖励,总计25万IOST送完即止！先充先得！' : 'Details: Total of 250,000 IOST bonus will be rewarded to IOST deposits at a rate of 500 IOST deposit to 1 IOST reward. Due to limited quantity of coin, whoever comes first gets first till all IOST bonus are given out. ',
      recharge_three: this.$store.state.lang == 'CH' ? '奖励发放：活动奖励将于活动结束后2个工作日内发放;' : 'Settlement: Bonus will be settled 2 business days after this event',
      recharge_four_one: this.$store.state.lang == 'CH' ? '单个账户IOST充值奖励最小发放为1枚；最大发放为1万枚。即单个账户充值低于500 IOST或高于500万枚的部分不计入奖励' : 'For each account, the minimum reward is 1 IOST, and the maximum reward limit is up to 10,000 IOST',
      recharge_four_two: this.$store.state.lang == 'CH' ? '如发现恶意充值等不当行为，TwentyTwenty有权取消活动资格及奖励' : 'Any behavior of unfair competition will be disqualified immediately.',
      recharge_four_three: this.$store.state.lang == 'CH' ? '本活动最终解释权归TwentyTwenty所有' : 'TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement',
      List: this.$store.state.lang == 'CH' ? '序号' : 'List',

      activity_rule_title_3: this.$store.state.lang == 'CH' ? '狂送20万IOST' : 'Become a member, get 200,000 IOST!',
      activity_rule_detail_3_title_1: this.$store.state.lang == 'CH' ? '活动时间:' : 'Time:',
      activity_rule_detail_3_detail_1: this.$store.state.lang == 'CH' ? '2018年3月13日14:00-3月15日17:00' : '2018/3/13 14:00 – 2018/3/15 17:00 ',
      activity_rule_detail_3_title_2: this.$store.state.lang == 'CH' ? '活动奖励:' : 'Details:',
      activity_rule_detail_3_detail_2: this.$store.state.lang == 'CH' ? '推荐新用户注册并实名认证，推荐者获得50枚IOST奖励，同时新用户也将获得50枚IOST奖励，总计20万枚IOST送完即止！先推荐先注册先得！' : 'TwentyTwenty user, who refers a friend to register and finish the KYC verification, will get 50 IOST reward. 50 IOST will be rewarded to the new member as well. Due to limited quantity of the coin, whoever comes first gets first, till all IOST bonuses are given out. ',
      activity_rule_detail_3_title_3: this.$store.state.lang == 'CH' ? '奖励发放:' : 'Settlement:',
      activity_rule_detail_3_detail_3: this.$store.state.lang == 'CH' ? '活动奖励将于活动结束后2个工作日内发放；' : 'Bonus will be settle 2 business days after this event.',
      activity_rule_detail_3_title_4: this.$store.state.lang == 'CH' ? '活动规则:' : 'Rules:',
      activity_rule_detail_3_detail_4_1: this.$store.state.lang == 'CH' ? '1.活动期间新用户自行注册（没有推荐者）也获得50枚IOST奖励。对推荐者推荐新用户的数量不作限制。推荐者享受被推荐者一年交易手续费的30%返佣奖励；' : '1.      A new member, who registers and finishes KYC verification with during the event, will get 50 IOST, with or without referrals. There no limit in the number of referrals. Members, who made successful referrals, will enjoy a 30% commission of their friends’ transaction fee for one year.',
      activity_rule_detail_3_detail_4_2: this.$store.state.lang == 'CH' ? '2.如发现恶意推荐、注册等不当行为，TwentyTwenty有权取消活动资格及奖励；' : '2.      Any behavior of unfair competition will be disqualified immediately.',
      activity_rule_detail_3_detail_4_3: this.$store.state.lang == 'CH' ? '3.本活动最终解释权归TwentyTwenty所有。' : '3.      TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',


      activity_rule_title_2: this.$store.state.lang == 'CH' ? '交易IOST狂送15万枚IOST' : 'Trade IOST, get 150,000 IOST bonus!',
      activity_rule_detail_2_title_1: this.$store.state.lang == 'CH' ? '活动时间:' : 'Time:',
      activity_rule_detail_2_detail_1: this.$store.state.lang == 'CH' ? '2018年3月13日17:00-3月15日17:00' : '2018/3/13 17:00-2018/3/15 17:00 (HKT)',
      activity_rule_detail_2_title_2: this.$store.state.lang == 'CH' ? '活动内容:' : 'Details:',
      activity_rule_detail_2_detail_2: this.$store.state.lang == 'CH' ? '活动期间凡参与IOST交易的用户，按IOST交易量（买入量+卖出量）进行排名发放IOST奖励；' : 'TwentyTwenty offers extra bonus for valuable IOST market members. Top 50 members with high volume IOST transactions (sum of both Buy and Sell amount) will get the bonus.',
      activity_rule_detail_2_title_3: this.$store.state.lang == 'CH' ? '活动奖励:' : '',
      activity_rule_detail_2_detail_3_1: this.$store.state.lang == 'CH' ? 'IOST交易量前50名即可获得如下奖励：' : '',
      activity_rule_detail_2_detail_3_2: this.$store.state.lang == 'CH' ? '第一名奖励：4万枚IOST' : 'First     40,000 IOST',
      activity_rule_detail_2_detail_3_3: this.$store.state.lang == 'CH' ? '第二名奖励：2万枚IOST' : 'Second   20,000 IOST',
      activity_rule_detail_2_detail_3_4: this.$store.state.lang == 'CH' ? '第三名奖励：1.5万枚IOST' : 'Third     15,000 IOST',
      activity_rule_detail_2_detail_3_5: this.$store.state.lang == 'CH' ? '第四名至第十名各奖励：5000枚IOST' : '4th – 10th  5000 IOST',
      activity_rule_detail_2_detail_3_6: this.$store.state.lang == 'CH' ? '第十一名至第五十名各奖励：1000枚IOST' : '11th – 50th  1000 IOST',
      activity_rule_detail_2_title_4: this.$store.state.lang == 'CH' ? '奖励发放:' : 'Settlement:',
      activity_rule_detail_2_detail_4: this.$store.state.lang == 'CH' ? '活动奖励将于活动结束后2个工作日内发放；' : 'Bonus will be settled 2 business days after this event.',
      activity_rule_detail_2_title_5: this.$store.state.lang == 'CH' ? '活动规则:' : 'Rules:',
      activity_rule_detail_2_detail_5_1: this.$store.state.lang == 'CH' ? '1.自成交不计入奖励排行；' : '1. Please note that transactions made to oneself will not be taken into account. ',
      activity_rule_detail_2_detail_5_2: this.$store.state.lang == 'CH' ? '2.如发现恶意交易等不当行为，TwentyTwenty有权取消活动资格及奖励；' : '2. Any behavior of unfair competition will be disqualified immediately.',
      activity_rule_detail_2_detail_5_3: this.$store.state.lang == 'CH' ? '3.本活动最终解释权归TwentyTwenty所有。' : '3. TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',

      activity_rule_title_1: this.$store.state.lang == 'CH' ? '充值IOST狂送15万IOST ' : 'Make IOST deposit, get 150,000 IOST',
      activity_rule_detail_1_title_1: this.$store.state.lang == 'CH' ? '活动时间:' : 'Time:',
      activity_rule_detail_1_detail_1: this.$store.state.lang == 'CH' ? '2018年3月13日14:00-3月15日17:00' : '2018/3/1314:00-2018/3/15 17:00 (HKT)',
      activity_rule_detail_1_title_2: this.$store.state.lang == 'CH' ? '活动奖励:' : 'Details:',
      activity_rule_detail_1_detail_2: this.$store.state.lang == 'CH' ? '充值IOST可按照200：1的比例奖励获得IOST奖励,总计15万IOST送完即止！先充先得！' : 'Total of 150,000 IOST bonus will be rewarded to IOST deposits at a rate of 200 IOST deposit to 1 IOST reward. Due to limited quantity of coin, whoever comes first gets first till all IOST bonus are given out. ',
      activity_rule_detail_1_title_3: this.$store.state.lang == 'CH' ? '奖励发放:' : 'Settlement:',
      activity_rule_detail_1_detail_3: this.$store.state.lang == 'CH' ? '活动奖励将于活动结束后2个工作日内发放；' : 'Bonus will be settled 2 business days after this event. ',
      activity_rule_detail_1_title_4: this.$store.state.lang == 'CH' ? '活动规则:' : 'Rules:',
      activity_rule_detail_1_detail_4_1: this.$store.state.lang == 'CH' ? '1.单个账户IOST充值奖励最小发放为1枚；最大发放为1万枚。即单个账户充值低于200 IOST或高于200万枚的部分不计入奖励；' : '1.For each account, the minimum reward is 1 IOST, and the maximum reward limit is up to 10,000 IOST.',
      activity_rule_detail_1_detail_4_2: this.$store.state.lang == 'CH' ? '2.如发现恶意充值等不当行为，TwentyTwenty有权取消活动资格及奖励；' : '2.Any behavior of unfair competition will be disqualified immediately. ',
      activity_rule_detail_1_detail_4_3: this.$store.state.lang == 'CH' ? '3.本活动最终解释权归TwentyTwenty所有。' : '3.TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',
      // 注册时间
      register_time: this.$store.state.lang == 'CH' ? '注册时间' : 'Registration',
      // 推荐人
      register_people: this.$store.state.lang == 'CH' ? '推荐人' : 'Referrer',
      // 推荐人数
      register_person: this.$store.state.lang == 'CH' ? '推荐人数' : 'Number of referrals',
      titleTemp: this.$store.state.lang == 'CH' ? 'IOST上币活动规则' : 'IOST listing bonus program',

    },
  }
}

root.components = {
  'IndexHeader': resolve => require(['../../vue/IndexHeader'], resolve),
  'IndexFooter': resolve => require(['../../vue/IndexFooter'], resolve),
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'PageBar': resolve => require(['../../vue/BasePageBar'], resolve),
}

root.mounted = function () {
  // this.initTimes(1520594400000, 1520608800000);
}

root.computed = {}
root.computed.lang = function () {
  return this.$store.state.lang;
}

root.computed.is_login = function () {
  return this.$store.state.isLogin
}


root.watch = {}
root.watch.lang = function (newValue, oldValue) {
  this.get_server_time();
  this.ranking = newValue == 'CH' ? '未上榜' : 'unavailable'
  this.langs = {
    home: this.$store.state.lang == 'CH' ? '首页' : 'Home',
    detail: this.$store.state.lang == 'CH' ? '活动详情' : 'Event info',
    title0: this.$store.state.lang == 'CH' ? 'IOST上币活动交易排行榜' : 'Valuable IOST Market Members',
    title1: this.$store.state.lang == 'CH' ? 'IOST上币活动充值奖励' : 'IOST Deposits Bonus',
    title2: this.$store.state.lang == 'CH' ? 'IOST上币活动注册奖励' : 'IOST Registration Reward',
    title3: this.$store.state.lang == 'CH' ? 'IOST上币活动推荐奖励' : 'IOST Referral Reward',
    title_2: this.$store.state.lang == 'CH' ? '注册奖励' : 'Registration reward',
    title_3: this.$store.state.lang == 'CH' ? '推荐奖励' : 'Referral reward',
    title_gift: this.$store.state.lang == 'CH' ? '当前奖励' : 'Current reward',
    ranking: this.$store.state.lang == 'CH' ? '当前排名' : 'My ranking',
    Volume: this.$store.state.lang == 'CH' ? '当前交易量' : 'Transaction Volume',
    valuable_members_list: this.$store.state.lang == 'CH' ? '交易排行榜' : 'Valuable Members List',
    Ranking: this.$store.state.lang == 'CH' ? '排行' : 'Ranking',
    uid: this.$store.state.lang == 'CH' ? '用户名' : 'UID',
    buy: this.$store.state.lang == 'CH' ? '买入' : 'Buy',
    sell: this.$store.state.lang == 'CH' ? '卖出' : 'Sell',
    value: this.$store.state.lang == 'CH' ? '交易量' : 'Volume',
    Bonus: this.$store.state.lang == 'CH' ? '奖励' : 'Bonus',

    one: this.$store.state.lang == 'CH' ? '活动时间：2018年3月12日17:00-3月14日17:00' : 'Time: 2018/3/12 17:00-2018/3/14 17:00 (HKT)',
    two: this.$store.state.lang == 'CH' ? '活动内容：活动期间凡参与IOST交易的用户，按IOST交易量（买入量+卖出量）进行排名发放IOST奖励' : 'Details: TwentyTwenty offers extra bonus for valuable IOST market members. Top 50 members with high volume IOST transactions (sum of both Buy and Sell amount) will get the bonus.Bonus for Valuable IOST Market Members :',
    three_title: this.$store.state.lang == 'CH' ? '活动奖励' : 'Bonus',
    three_one: this.$store.state.lang == 'CH' ? '第一名奖励：5万枚IOST' : 'First: 50,000 IOST',
    three_two: this.$store.state.lang == 'CH' ? '第二名奖励：3万枚IOST' : 'Second: 30,000 IOST',
    three_three: this.$store.state.lang == 'CH' ? '第三名奖励：1.5万枚IOST' : 'Third: 15,000 IOST',
    three_four: this.$store.state.lang == 'CH' ? '第四名至第十名各奖励：5000枚IOST' : '4th – 10th: 5000 IOST  ',
    three_five: this.$store.state.lang == 'CH' ? '第十一名至第五十名各奖励：3000枚IOST' : '11th – 50th: 3000 IOST',
    four: this.$store.state.lang == 'CH' ? '奖励发放：活动奖励将于活动结束后2个工作日内发放' : 'Settlement: Bonus will be settled 2 business days after this event.',
    rules: this.$store.state.lang == 'CH' ? '活动规则' : 'activity rules',
    five_one: this.$store.state.lang == 'CH' ? '自成交不计入奖励排行' : 'Please note that transactions made to oneself will not be taken into account',
    five_two: this.$store.state.lang == 'CH' ? '如发现恶意交易等不当行为，TwentyTwenty有权取消活动资格及奖励' : 'Any behavior of unfair competition will be disqualified immediately.',
    five_three: this.$store.state.lang == 'CH' ? '本活动最终解释权归TwentyTwenty所有' : 'TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',

    Total_Deposit: this.$store.state.lang == 'CH' ? '当前充值' : 'Total Deposit',
    now_Bonus: this.$store.state.lang == 'CH' ? '奖励' : 'Bonus',
    Bonus_list: this.$store.state.lang == 'CH' ? '充值奖励' : 'Deposits Bonus List',
    Remaining: this.$store.state.lang == 'CH' ? '剩余奖励' : 'Remaining',
    count_down: this.$store.state.lang == 'CH' ? '倒计时' : 'Count down',
    last_deposit: this.$store.state.lang == 'CH' ? '充值时间' : 'Last deposit',
    total_deposit: this.$store.state.lang == 'CH' ? '充值' : 'Total deposit',

    recharge_one: this.$store.state.lang == 'CH' ? '活动时间：2018年3月12日14:00-3月14日17:00' : 'Time: 2018/3/12 14:00-2018/3/14 17:00 (HKT)',
    recharge_two: this.$store.state.lang == 'CH' ? '活动奖励：充值IOST可按照500：1的比例奖励获得IOST奖励,总计25万IOST送完即止！先充先得！' : 'Details: Total of 250,000 IOST bonus will be rewarded to IOST deposits at a rate of 500 IOST deposit to 1 IOST reward. Due to limited quantity of coin, whoever comes first gets first till all IOST bonus are given out. ',
    recharge_three: this.$store.state.lang == 'CH' ? '奖励发放：活动奖励将于活动结束后2个工作日内发放;' : 'Settlement: Bonus will be settled 2 business days after this event',
    recharge_four_one: this.$store.state.lang == 'CH' ? '单个账户IOST充值奖励最小发放为1枚；最大发放为1万枚。即单个账户充值低于500 IOST或高于500万枚的部分不计入奖励' : 'For each account, the minimum reward is 1 IOST, and the maximum reward limit is up to 10,000 IOST',
    recharge_four_two: this.$store.state.lang == 'CH' ? '如发现恶意充值等不当行为，TwentyTwenty有权取消活动资格及奖励' : 'Any behavior of unfair competition will be disqualified immediately.',
    recharge_four_three: this.$store.state.lang == 'CH' ? '本活动最终解释权归TwentyTwenty所有' : 'TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement',
    List: this.$store.state.lang == 'CH' ? '序号' : 'List',

    activity_rule_title_3: this.$store.state.lang == 'CH' ? '狂送20万IOST' : 'Become a member, get 200,000 IOST!',
    activity_rule_detail_3_title_1: this.$store.state.lang == 'CH' ? '活动时间:' : 'Time:',
    activity_rule_detail_3_detail_1: this.$store.state.lang == 'CH' ? '2018年3月13日14:00-3月15日17:00' : '2018/3/13 14:00 – 2018/3/15 17:00 ',
    activity_rule_detail_3_title_2: this.$store.state.lang == 'CH' ? '活动奖励:' : 'Details:',
    activity_rule_detail_3_detail_2: this.$store.state.lang == 'CH' ? '推荐新用户注册并实名认证，推荐者获得50枚IOST奖励，同时新用户也将获得50枚IOST奖励，总计20万枚IOST送完即止！先推荐先注册先得！' : 'TwentyTwenty user, who refers a friend to register and finish the KYC verification, will get 50 IOST reward. 50 IOST will be rewarded to the new member as well. Due to limited quantity of the coin, whoever comes first gets first, till all IOST bonuses are given out. ',
    activity_rule_detail_3_title_3: this.$store.state.lang == 'CH' ? '奖励发放:' : 'Settlement:',
    activity_rule_detail_3_detail_3: this.$store.state.lang == 'CH' ? '活动奖励将于活动结束后2个工作日内发放；' : 'Bonus will be settle 2 business days after this event.',
    activity_rule_detail_3_title_4: this.$store.state.lang == 'CH' ? '活动规则:' : 'Rules:',
    activity_rule_detail_3_detail_4_1: this.$store.state.lang == 'CH' ? '1.活动期间新用户自行注册（没有推荐者）也获得50枚IOST奖励。对推荐者推荐新用户的数量不作限制。推荐者享受被推荐者一年交易手续费的30%返佣奖励；' : '1.      A new member, who registers and finishes KYC verification with during the event, will get 50 IOST, with or without referrals. There no limit in the number of referrals. Members, who made successful referrals, will enjoy a 30% commission of their friends’ transaction fee for one year.',
    activity_rule_detail_3_detail_4_2: this.$store.state.lang == 'CH' ? '2.如发现恶意推荐、注册等不当行为，TwentyTwenty有权取消活动资格及奖励；' : '2.      Any behavior of unfair competition will be disqualified immediately.',
    activity_rule_detail_3_detail_4_3: this.$store.state.lang == 'CH' ? '3.本活动最终解释权归TwentyTwenty所有。' : '3.      TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',

    activity_rule_title_2: this.$store.state.lang == 'CH' ? '交易IOST狂送15万枚IOST' : 'Trade IOST, get 150,000 IOST bonus!',
    activity_rule_detail_2_title_1: this.$store.state.lang == 'CH' ? '活动时间:' : 'Time:',
    activity_rule_detail_2_detail_1: this.$store.state.lang == 'CH' ? '2018年3月13日17:00-3月15日17:00' : '2018/3/13 17:00-2018/3/15 17:00 (HKT)',
    activity_rule_detail_2_title_2: this.$store.state.lang == 'CH' ? '活动内容:' : 'Details:',
    activity_rule_detail_2_detail_2: this.$store.state.lang == 'CH' ? '活动期间凡参与IOST交易的用户，按IOST交易量（买入量+卖出量）进行排名发放IOST奖励；' : 'TwentyTwenty offers extra bonus for valuable IOST market members. Top 50 members with high volume IOST transactions (sum of both Buy and Sell amount) will get the bonus.',
    activity_rule_detail_2_title_3: this.$store.state.lang == 'CH' ? '活动奖励:' : '',
    activity_rule_detail_2_detail_3_1: this.$store.state.lang == 'CH' ? 'IOST交易量前50名即可获得如下奖励：' : '',
    activity_rule_detail_2_detail_3_2: this.$store.state.lang == 'CH' ? '第一名奖励：4万枚IOST' : 'First     40,000 IOST',
    activity_rule_detail_2_detail_3_3: this.$store.state.lang == 'CH' ? '第二名奖励：2万枚IOST' : 'Second   20,000 IOST',
    activity_rule_detail_2_detail_3_4: this.$store.state.lang == 'CH' ? '第三名奖励：1.5万枚IOST' : 'Third     15,000 IOST',
    activity_rule_detail_2_detail_3_5: this.$store.state.lang == 'CH' ? '第四名至第十名各奖励：5000枚IOST' : '4th – 10th  5000 IOST',
    activity_rule_detail_2_detail_3_6: this.$store.state.lang == 'CH' ? '第十一名至第五十名各奖励：1000枚IOST' : '11th – 50th  1000 IOST',
    activity_rule_detail_2_title_4: this.$store.state.lang == 'CH' ? '奖励发放:' : 'Settlement:',
    activity_rule_detail_2_detail_4: this.$store.state.lang == 'CH' ? '活动奖励将于活动结束后2个工作日内发放；' : 'Bonus will be settled 2 business days after this event.',
    activity_rule_detail_2_title_5: this.$store.state.lang == 'CH' ? '活动规则:' : 'Rules:',
    activity_rule_detail_2_detail_5_1: this.$store.state.lang == 'CH' ? '1.自成交不计入奖励排行；' : '1. Please note that transactions made to oneself will not be taken into account. ',
    activity_rule_detail_2_detail_5_2: this.$store.state.lang == 'CH' ? '2.如发现恶意交易等不当行为，TwentyTwenty有权取消活动资格及奖励；' : '2. Any behavior of unfair competition will be disqualified immediately.',
    activity_rule_detail_2_detail_5_3: this.$store.state.lang == 'CH' ? '3.本活动最终解释权归TwentyTwenty所有。' : '3. TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',

    activity_rule_title_1: this.$store.state.lang == 'CH' ? '充值IOST狂送15万IOST ' : 'Make IOST deposit, get 150,000 IOST',
    activity_rule_detail_1_title_1: this.$store.state.lang == 'CH' ? '活动时间:' : 'Time:',
    activity_rule_detail_1_detail_1: this.$store.state.lang == 'CH' ? '2018年3月13日14:00-3月15日17:00' : '2018/3/1314:00-2018/3/15 17:00 (HKT)',
    activity_rule_detail_1_title_2: this.$store.state.lang == 'CH' ? '活动奖励:' : 'Details:',
    activity_rule_detail_1_detail_2: this.$store.state.lang == 'CH' ? '充值IOST可按照200：1的比例奖励获得IOST奖励,总计15万IOST送完即止！先充先得！' : 'Total of 150,000 IOST bonus will be rewarded to IOST deposits at a rate of 200 IOST deposit to 1 IOST reward. Due to limited quantity of coin, whoever comes first gets first till all IOST bonus are given out. ',
    activity_rule_detail_1_title_3: this.$store.state.lang == 'CH' ? '奖励发放:' : 'Settlement:',
    activity_rule_detail_1_detail_3: this.$store.state.lang == 'CH' ? '活动奖励将于活动结束后2个工作日内发放；' : 'Bonus will be settled 2 business days after this event. ',
    activity_rule_detail_1_title_4: this.$store.state.lang == 'CH' ? '活动规则:' : 'Rules:',
    activity_rule_detail_1_detail_4_1: this.$store.state.lang == 'CH' ? '1.单个账户IOST充值奖励最小发放为1枚；最大发放为1万枚。即单个账户充值低于200 IOST或高于200万枚的部分不计入奖励；' : '1.For each account, the minimum reward is 1 IOST, and the maximum reward limit is up to 10,000 IOST.',
    activity_rule_detail_1_detail_4_2: this.$store.state.lang == 'CH' ? '2.如发现恶意充值等不当行为，TwentyTwenty有权取消活动资格及奖励；' : '2.Any behavior of unfair competition will be disqualified immediately. ',
    activity_rule_detail_1_detail_4_3: this.$store.state.lang == 'CH' ? '3.本活动最终解释权归TwentyTwenty所有。' : '3.TwentyTwenty reserves the right of further adjustment and final interpretation of this announcement.',
    // 注册时间
    register_time: this.$store.state.lang == 'CH' ? '注册时间' : 'Registration',
    // 推荐人
    register_people: this.$store.state.lang == 'CH' ? '推荐人' : 'Referrer',
    // 推荐人数
    register_person: this.$store.state.lang == 'CH' ? '推荐人数' : 'Number of referrals',
    titleTemp: this.$store.state.lang == 'CH' ? 'IOST上币活动规则' : 'IOST listing bonus program',

  }
}

root.created = function () {
  // 获取充值奖励列表
  this.get_logs_for_elf(1);
  // 获取服务器时间
  this.get_server_time();
}

root.methods = {}
// 获取服务器时间
root.methods.get_server_time = function () {
  this.$http.send('GET_SEVER_TIME', {
    bind: this,
    callBack: this.RE_GET_SEVER_TIME,
  })
}
root.methods.RE_GET_SEVER_TIME = function (res) {
  this.serverTime = res;
  this.startTime = this.$globalFunc.formatDateUitl(res, 'YYYY-MM-DD hh:mm:ss');
  let start_txt = this.lang == 'CH' ? '未开始' : 'unavailable!'
  let end_txt = this.lang == 'CH' ? '已结束' : 'Finished!'
  if (res > this.charge_time) {
    if (res < this.charge_end_time) {   // 小于结束时间
      // 初始化倒计时
      this.initTimes(res, this.endTime);
    } else {
      $('#times').text(end_txt);
    }
  } else {
    $('#times').text(start_txt);
  }
}

// 获取奖励列表信息
root.methods.get_logs_for_elf = function (page) {
  let params = {
    fromIndex: page == 1 ? 1 : ((page - 1) * this.maxLimit) + 1,
    toIndex: page * this.maxLimit > this.size ? this.size : page * this.maxLimit
  }
  this.$http.send("DEPOSIT_LOGS_FOR_IOST", {
    bind: this,
    params: params,
    callBack: this.RE_DISPLAY_LIST,
    errorHandler: this.error_getCurrency
  })
}
// 获取交易排行榜
root.methods.trade_ranking_for_elf = function () {
  this.$http.send("TRADE_RANKING_FOR_IOST", {
    bind: this,
    callBack: this.RE_RANKING_LIST,
    errorHandler: this.error_getCurrency
  })
}
// 提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}
// 切换排行榜类型
root.methods.CHANGE_TYPE = function (type) {
  let now = new Date().getTime();
  if (type == 0 && this.serverTime < this.open_time) {
  	this.popText = this.lang == 'CH' ? '还未开放!' : 'unavailable!';
  	this.promptOpen = true;
  	return;
  }
  this.list_type = type;
  if (this.selectIndex === type) return

  if (type == 1) {
    // 充值奖励
    this.get_logs_for_elf(1);
  }
  if (type == 0) {
    // 获取交易排行榜列表
    this.trade_ranking_for_elf();
  }
  if (type == 2) {
    // this.resetRecommend()
    this.getRegisterAwards(1)
  }
  if (type == 3) {
    // this.resetRegister()
    this.getInviteAwards(1)
  }
}

// 渲染交易排行榜列表
root.methods.RE_RANKING_LIST = function (res) {
  typeof (res) === 'string' && (res = JSON.parse(res))
  let data = res;
  this.list_1 = data.tradeRankings;
  this.ranking = data.myRanking;  // 排名
  this.volume = data.myTradeAmount;  // 交易量
}

// 渲染充值奖励列表
root.methods.RE_DISPLAY_LIST = function (res) {
  typeof (res) === 'string' && (res = JSON.parse(res))
  let data = res.dataMap.depositLogMap;
  this.list = data.depositLogs;
  this.size = data.size;
  this.maxPage = Math.ceil(data.size / 100);
  this.endTime = data.endTime;
  this.startTime = '2018-03-08 14:00:00'
  this.surplus = data.budgetBalance; // 剩余
  this.recharge = data.myDepositAmount;  //充值
  this.reward = data.myReward; // 奖励
  this.get_server_time();
}

// 获取推荐奖励
root.methods.getInviteAwards = function (index) {
  let formIndex = (index - 1) * this.recommendLimit + 1
  let toIndex = index * this.recommendLimit
  this.$http.send('POST_INVITE_AWARDS_IOST', {
    bind: this,
    params: {
      fromIndex: formIndex,
      toIndex: toIndex,
    },
    callBack: this.re_getInviteAwards,
    errorHandler: this.error_getInviteAwards,
  })
}
// 获取推荐奖励回调
root.methods.re_getInviteAwards = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('this is 推荐奖励 data', data)
  this.recommendList = data.dataMap.inviteAwards
  this.recommendReward = data.dataMap.myAward
  this.recommendMaxPage = Math.ceil(data.dataMap.size / this.recommendLimit)
}
// 获取推荐奖励出错
root.methods.error_getInviteAwards = function (err) {
  console.warn('获取推荐奖励出错', err)
}
// 获取注册奖励
root.methods.getRegisterAwards = function (index) {
  let formIndex = (index - 1) * this.registerLimit + 1
  let toIndex = index * this.registerLimit
  this.$http.send('POST_REGIST_AWARDS_IOST', {
    bind: this,
    params: {
      fromIndex: formIndex,
      toIndex: toIndex,
    },
    callBack: this.re_getRegisterAwards,
    errorHandler: this.error_getRegisterAwards,
  })
}

// 获取注册奖励回调
root.methods.re_getRegisterAwards = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('this is 注册奖励 data', data)
  this.registerList = data.dataMap.registAwards
  // console.warn('this is registerList', this.registerList)
  this.registerReward = data.dataMap.myAward
  this.registerMaxPage = Math.ceil(data.dataMap.size / this.registerLimit)

}
// 获取注册奖励出错
root.methods.error_getRegisterAwards = function (err) {
  console.warn('获取注册奖励出错', err)

}

// 注册奖励翻页
root.methods.registerChangePage = function (index) {
  this.getRegisterAwards(index)
  this.registerSelectIndex = index
}
// 推荐奖励翻页
root.methods.recommendChangePage = function (index) {
  this.getInviteAwards(index)
  this.recommendSelectIndex = index
}
// 翻页
root.methods.clickChangePage = function (page) {
  this.get_logs_for_elf(page);
  this.selectIndex = page;
}

// 倒计时
root.methods.initTimes = function (now, end) {
  let self = this;
  new Countdown(document.getElementById('times'), {
    format: '<span style="border:1px solid rgba(0,0,0,.7);padding: 2px; border-radius: 3px;margin-left: 5px;">hh</span> :<span style="border:1px solid rgba(0,0,0,.7);padding: 2px; border-radius: 3px;margin-left: 5px;">mm</span> :<span style="border:1px solid rgba(0,0,0,.7);padding: 2px; border-radius: 3px;margin-left: 5px;">ss</span>',
    startTime: now,
    lastTime: end
  });
}


// 重置推荐奖励的相关内容
root.methods.resetRecommend = function () {
  this.recommendList = []//推荐奖
  this.recommendFrom = 1
  // this.recommendLimit = 100
  this.recommendMaxPage = 0
  this.recommendSelectIndex = 1
}
// 重置注册奖励的相关内容
root.methods.resetRegister = function () {
  this.registerList = [] //注册奖励
  this.registerFrom = 1
  // this.registerLimit = 100
  this.registerMaxPage = 0
  this.registerSelectIndex = 1
}


export default root;
