const root = {}
root.name = 'OfficialQuantitativeRegistration'

root.data = function(){
  return {
    pagerCount:3
  }
}

root.components = {
  'TeaCoinActivities': resolve => require(['../vue/TeaCoinActivities'], resolve),
}
