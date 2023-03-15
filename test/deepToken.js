var DeepToken = artifacts.require('DeepToken')

contract(DeepToken , function(accounts){
    it('sets the total supply on deployment', ()=>{
        return DeepToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply)=>{
            assert.equal(Number(totalSupply) , 1000000 , 'set the total supply to one millions')
        })
    })
})