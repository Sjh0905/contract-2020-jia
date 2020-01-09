const root = {}
root.name = 'MobileCheckbox'


root.props = {}

root.props.changeAgreement = {
  type: Function,
  // require:true,
  // default:()=>{}
}

root.props.agreement = {
  type: Boolean,
  // require:true,
  // default:false
}

root.props.bgColor = {
  type: String,
  // require:true,
  default:'dark'
}

root.methods = {}


export default root
