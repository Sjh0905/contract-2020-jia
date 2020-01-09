import logo from '../../assets/欧联logo.png'

const root = {}
root.name = 'PopAlert'

root.props = {}

root.props.switch = {
  type: Boolean,
  default: false
}
root.props.close = {
  type: Function,
  default: function () {
  }
}

root.data = function () {
  return {
    popType: 0,
    popText: '',
    promptOpen: false,
    shareUrl: '',
    logo: logo,
    size: 180,
    bgColor: '#fff',
    fgColor: '#000',
    value: '', // 活动详情页
  }
}

root.created = function () {
  let sharUrl = 'https://' + document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId + '&source=share';
  this.shareUrl = sharUrl;
  this.value = 'https://' + document.location.host + '/huoDong?a=' + sharUrl
}
root.mounted = function () {
  this.size = 180 /  window.devicePixelRatio
}

root.components = {
  'Qrcode': resolve => require(['qrcode-vue'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve)
}

root.computed = {}
root.computed.show = function () {
  return this.switch
}

root.methods = {}

root.methods.closeClick = function () {
  this.$emit('close')
}

// 复制url
root.methods.copyInputUrl = function () {
  let input = document.getElementById('copyInput');
  input.select();
  document.execCommand("Copy");
  this.popType = 1;
  this.popText = this.$t('popAlert.popText');
  this.promptOpen = true;
}

root.methods.closePrompt = function () {
  this.promptOpen = false;
}


export default root
