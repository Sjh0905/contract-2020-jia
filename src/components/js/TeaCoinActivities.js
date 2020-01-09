const root = {};

root.name = 'TeaCoinActivities',

root.data = function(){
  return {
    pagerCount:3
  }
}


root.components = {
  'TeaCoinActivities': resolve => require(['../vue/TeaCoinActivities'], resolve),
}

export default root;
