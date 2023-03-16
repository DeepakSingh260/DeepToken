var DeepToken = artifacts.require('DeepToken')

contract(DeepToken , function(accounts){
    var tokenInstance;
    it('check if the token is  initialised correctly',()=>{
        return DeepToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.name()
        }).then((name)=>{
            assert.equal(name , 'Deep Token' , 'has the correct name')
            return tokenInstance.symbol()
        }).then((symbol)=>{
            assert.equal(symbol , 'Deep' , 'has the correct Symbol')
            return tokenInstance.standard()
        }).then((standard)=>{
            assert.equal(standard , 'Deep Token v1.0' , 'has the correct standard')
        })
    })
    it('sets the total supply on deployment', ()=>{
        return DeepToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply)=>{
            assert.equal(Number(totalSupply) , 1000000 , 'set the total supply to one millions')
            return tokenInstance.balance_of(accounts[0])
        }).then((adminBalance)=>{
            assert.equal(Number(adminBalance) , 1000000 , 'it allocate the initial supply to admin account')
        })
    })

    it('transfer Deep token ownership' , ()=>{
        return DeepToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance;
        }).then(assert.fail).catch((e)=>{
            assert(e.message!=null, 'error message contain revert');
            return tokenInstance.transfer.call(accounts[1] , 25000 , {from:accounts[0]})

        }).then((sucess)=>{
            assert.equal(sucess , true , 'it return true')
            return tokenInstance.transfer(accounts[1] , 25000 , {from:accounts[0]})
        }).then((reciept)=>{
            assert(reciept.logs.length,1,'trigger one event')
            assert(reciept.logs[0].event,'Transfer','trigger Transfer event')
            assert(reciept.logs[0].args._from,accounts[0],'logs the account the tokens are transfered from')
            assert(reciept.logs[0].args._to,accounts[1],'logs the account the tokens are transfered to')
            assert(reciept.logs[0].args._value,25000,'lods the  Transfer amount')
            assert(tokenInstance.balance_of(accounts[1]) , 25000 , 'adds the amount to recieved account')
            return tokenInstance.balance_of(accounts[0])
        }).then((sender)=>{
            assert(sender , 1000000 - 25000 , 'subtract the tokens from senders account ')
        })
    })
})