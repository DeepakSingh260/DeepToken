var DeepTokenSale = artifacts.require('DeepTokenSale');
var DeepToken = artifacts.require('DeepToken');
contract(DeepTokenSale , (accounts)=>{
    var tokenSaleInstance;
    var tokenInstance;
    var tokenPrice = 1000000000000000;
    var admin = accounts[0];
    var tokensAvailable = 750000;
    var numberOfTokens = 10;
    var buyer = accounts[1];
    it('initialises the contract with correct value' , ()=>{
        return DeepTokenSale.deployed().then((instance)=>{
            tokenSaleInstance = instance

            return tokenSaleInstance.address
        }).then((address)=>{
            assert.notEqual(address ,0x0 , 'has contract address')
            return tokenSaleInstance.tokenContract();
        }).then((tokenContract)=>{
            assert.notEqual(tokenContract , 0x0 , 'has token contract')
            return tokenSaleInstance.tokenPrice()
        }).then((price)=>{
            // price is in wei
            assert.equal(Number(price) ,tokenPrice  , 'has correct token price')
        })
    })

    it('facilitates token buying', ()=>{

        return DeepTokenSale.deployed().then((instance)=>{
            tokenInstance = instance;
            return DeepTokenSale.deployed()  
        }).then((instance)=>{
            tokenSaleInstance = instance;

            return tokenInstance.transfer(tokenSaleInstance.address , tokensAvailable , {from:admin})
        }).then((reciept)=>{

            var value = numberOfTokens*tokenPrice
            return tokenSaleInstance.buyTokens(numberOfTokens , {from :buyer , value:value})
        }).then((reciept)=>{
            assert(reciept.logs.length,1,'trigger one event')
            assert(reciept.logs[0].event,'Sell','trigger Sell event')
            assert(reciept.logs[0].args._buyer,buyer,'logs the account that purchased the tokens')
            assert(reciept.logs[0].args._amount,numberOfTokens,'logs the number of tokens purchased')
            return tokenSaleInstance.tokenSold()
            
        }).then((Amount)=>{
            assert.equal(Number(Amount) , numberOfTokens , "amount added to sold tokens")
            return tokenInstance.balance_of(buyer)
        }).then((balance)=>{
            assert.equal(Number(balance) ,numberOfTokens , "tokens transfered to buyer")
            return tokenInstance.balance_of(tokenSaleInstance.address)
        }).then((balance)=>{
            assert.equal(Number(balance) , tokensAvailable- numberOfTokens , "tokens transfered from sender")
            return tokenSaleInstance.buyTokens(numberOfTokens , {from :buyer , value:1})
        }).then(assert.fail).catch((e)=>{
            assert(e.message !=null , 'msg.val must equal number of tokens in wei')
            var value = numberOfTokens*tokenPrice
            return tokenSaleInstance.buyTokens(800000 , {from :buyer , value:value} )
        }).then(assert.fail).catch((e)=>{
            assert(e.message !=null , 'more tokens than that are available')
        })
    })

    it('end sales',()=>{
        return DeepToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return DeepTokenSale.deployed();  
        }).then((instance)=>{
            tokenSaleInstance = instance;
            return tokenInstance.endSale({from:buyer});
        }).then(assert.fail).catch((error)=>{
            assert(error.message !=null , "not authorised to end sale");
            return tokenInstance.transfer(tokenSaleInstance.address , tokensAvailable , {from:admin})
        }).then((reciept)=>{
            return tokenSaleInstance.endSale({from:admin});
        }).then((reciept)=>{
            return tokenInstance.balance_of(tokenSaleInstance.address)
        }).then((balance)=>{
            return tokenInstance.balance_of(admin);
        }).then((balance)=>{
            assert.equal(Number(balance) , 1000000 , 'returns all unsold dapp tokens to admin');
          
        })
    })
})