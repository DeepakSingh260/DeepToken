var DeepToken = artifacts.require('DeepToken');

module.exports = async function(deployer){
    await deployer.deploy(DeepToken , 1000000   );
};