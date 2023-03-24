var DeepToken = artifacts.require('DeepToken');
var DeepTokenSale = artifacts.require('DeepTokenSale');
var tokenPrice = 1000000000000000
module.exports = async function(deployer){
    await deployer.deploy(DeepToken , 1000000 ).then(async(instance)=>{
        await deployer.deploy(DeepTokenSale ,DeepToken.address , tokenPrice );

    });
};