var DeepTokenSale = artifacts.require('DeepTokenSale');

contract(DeepTokenSale , (accounts)=>{
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000;
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
            tokenSaleInstance = instance;
            
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
            return okenSaleInstance.buyTokens(numberOfTokens , {from :buyer , value:1})
        }).then(assert.fail).catch((e)=>{
            assert(e.message !=null , 'msg.val must equal number of tokens in wei')
        })
    })
})