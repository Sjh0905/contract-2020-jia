const root = {}
root.name = 'PersonalCenterSecurityStrategy'

root.dataContainer = {}
root.dataContainer.validateLogon = 1
root.dataContainer.modifyPassword = 1
root.dataContainer.modifyAssetsPsw = 1
root.dataContainer.transactionVerification = 1
root.dataContainer.withdrawalsVerification = 1


root.data = function () {
  return root.dataContainer
}


export default root
