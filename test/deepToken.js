var DeepToken = artifacts.require('DeepToken')

contract(DeepToken , function(accounts){
    var tokenInstance;
    var fromAccount;
    var toAccount;
    var spendingAccount;
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

    it('approves token for delegate transfer ' , ()=>{
        return DeepToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1] , 100);
        }).then((sucess)=>{
            assert.equal(sucess , true , 'sucess is true')
            return tokenInstance.approve(accounts[1] , 100);
        }).then((reciept)=>{
            assert(reciept.logs.length,1,'trigger one event')
            assert(reciept.logs[0].event,'Approve','should trigger Approve event')
            assert(reciept.logs[0].args._owner,accounts[0],'logs the account the tokens are authorized by')
            assert(reciept.logs[0].args._spender,accounts[1],'logs the account the tokens are authorized to')
            assert(reciept.logs[0].args._value,100,'logs the  token value authorized')
            
           return tokenInstance.allowance(accounts[0] , accounts[1])

        }).then((allowance)=>{
            assert.equal(Number(allowance),100 , 'stores the allowance of delegated transfer')
        })
    });

    it('handle delegate token transfers' , ()=>{
        
        return DeepToken.deployed().then((instance)=>{
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];

            return tokenInstance.transfer(fromAccount , 100 , {from:accounts[0]})

        }).then((reciept)=>{
            return tokenInstance.approve(spendingAccount , 10 , {from :fromAccount})
        }).then((reciept)=>{
            return tokenInstance.transferFrom(fromAccount , toAccount , 99999 , {from :spendingAccount});
        }).then(assert.fail).catch(e=>{
            assert(e.message.toString().indexOf('revert')>=0 , "cannot transfer value larger than balance")

            return tokenInstance.transferFrom(fromAccount , toAccount , 20 , {from:spendingAccount})
        }).then(assert.fail).catch(e=>{
            assert(e.message.toString().indexOf('revert')>=0 , "cannot transfer value larger than approved amount" )
            return tokenInstance.transferFrom.call(fromAccount , toAccount , 10 , {from:spendingAccount})
        }).then((reciept)=>{
            assert.equal(reciept , true , "delegated transfer token occured sucessfully")
            return tokenInstance.transferFrom(fromAccount , toAccount , 10 , {from:spendingAccount})

        }).then((reciept)=>{
            assert(reciept.logs.length,1,'trigger one event')
            assert(reciept.logs[0].event,'Transfer','trigger Transfer event')
            assert(reciept.logs[0].args._from,accounts[0],'logs the account the tokens are transfered from')
            assert(reciept.logs[0].args._to,accounts[1],'logs the account the tokens are transfered to')
            assert(reciept.logs[0].args._value,10,'logs the  Transfer amount')
            assert(tokenInstance.balance_of(toAccount) , 10 , 'adds the amount to recieved account')
            return tokenInstance.balance_of(fromAccount);
        }).then((balance)=>{
            assert.equal(Number(balance) , 90 , 'token deducted from fromAccount')
            return tokenInstance.balance_of(toAccount)
        }).then((balance)=>{
            assert.equal(Number(balance) , 10 , 'tokens added to toAccount')
            return tokenInstance.allowance(fromAccount , spendingAccount);
        }).then((balance)=>{
            assert.equal(Number(balance) , 0 , 'spenders allocated tokens have been deducted')
        })
    })
})