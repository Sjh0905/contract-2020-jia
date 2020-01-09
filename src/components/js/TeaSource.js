const root = {};

root.name = 'TeaSource',


  root.components = {
    'TeaSource': resolve => require(['../vue/TeaSource'], resolve),
  }

export default root;
