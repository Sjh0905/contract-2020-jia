/*
* 组件使用方法：
* 传参：
* width:Number    宽度，数字，px，优先级比百分比高
* height:Number   高度，数字，px，优先级比百分比高
* widthPercent:Number   宽度百分比，数字，%
* heightPercent:Number  高度百分比，数字，%
* circleSize:Number   圆的大小，数字，px
* */

const root = {}
root.name = 'Loading'
root.props = {}


root.props.width = {
  type: Number,

}
root.props.height = {
  type: Number,

}
root.props.widthPercent = {
  type: Number,
  default: 100
}
root.props.heightPercent = {
  type: Number,
  default: 100
}



export default root
