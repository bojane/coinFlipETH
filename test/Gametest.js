const Coinflip = artifacts.require("Coinflip");
const truffleAssert = require("truffle-assertions");

contract("Coinflip", async function(accounts){

  let instance;

  before(async function(){  // before() will run once, beforeEach before every test
    instance = await Coinflip.new();
    await instance.incBalance({value: web3.utils.toWei("1", "ether")});
  });

  it("should't start game when above 1 ether", async function(){
    await truffleAssert.fails(instance.doCoinFlip(1,{value: web3.utils.toWei("2", "ether")}), truffleAssert.ErrorType.REVERT);

  });

  it("should start game when sending 0.1 ether", async function(){
    await truffleAssert.passes(instance.doCoinFlip(1,{value: web3.utils.toWei("0.1", "ether")}), truffleAssert.ErrorType.REVERT);

  });
  it("should reset balance to zero after withdrawal", async function(){
    await instance.incBalance({value: web3.utils.toWei("1","ether"),from: accounts[2]});
    await instance.withdrawAll();
    let accountWeb3 = parseFloat(await web3.eth.getBalance(instance.address));
    let accountCont = parseFloat(await instance.balance());
    await assert(accountWeb3 === accountCont && accountCont === 0);

  });
  it("should show same balance inside contract and web3 and it should be 1 eth", async function(){
    await instance.incBalance({value: web3.utils.toWei("1","ether"),from: accounts[2]});
    let accountWeb3 = parseFloat(await web3.eth.getBalance(instance.address));
    let accountCont = parseFloat(await instance.balance());
    await assert(accountWeb3 === accountCont && accountCont === parseFloat(web3.utils.toWei("1","ether")));

  });

  it("should't withdraw when not owner", async function(){
    await truffleAssert.fails(instance.withdrawAll({from:accounts[1] }), truffleAssert.ErrorType.REVERT);

  });
  it("should increase balance account[0] after withdrawal", async function(){
    await instance.incBalance({value: web3.utils.toWei("1","ether"),from: accounts[0]});
    let balBefore = parseFloat(await web3.eth.getBalance(accounts[0]));
    await instance.withdrawAll();
    let balAfter = parseFloat(await web3.eth.getBalance(accounts[0]));
    await assert( balAfter > balBefore,"the balance did not increase" );

  });

})
