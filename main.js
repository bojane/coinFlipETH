var web3 = new Web3(Web3.givenProvider);

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x6CF0228E1c5bc96bE2a3C80089E5D9176bcc6392", {from: accounts[0]});
      console.log(contractInstance);
      console.log("we are here!");
    });
    $("#add_data_button").click(inputData);
    $("#toggle_button").click(fetchAndChangeFace);
    $("#fillup_button").click(fillUpp);

});

function inputData(){
  var betHead;
  if( $("#coinface_input").text() === 'Head' ){
    betHead = true;
  }
  else {
    betHead = false;
  }
  var betSize = $("#betSize_input").val();
  var config = { value: web3.utils.toWei(betSize,"ether") };

  contractInstance.methods.doCoinFlip(betHead).send(config)
  .on("transacionHash", function(hash){
    console.log(hash);
  })
  .on("confirmation", function(confirmationNR){
    console.log(confirmationNR);
  })
  .on("receipt", function(receipt){
    console.log(receipt);
  })
  contractInstance.events.gamePlayed(function (error,result){
    console.log(result);
    console.log('Here it is' + ' ' + result.returnValues[0])
    console.log("events picked up!!!!!")
  })
  eventListener();
}

function eventListener(){
  contractInstance.events.gamePlayed(function (error,result){
    //console.log(result);
    //console.log('Here it is' + ' ' + result.returnValues[3])
    //console.log("events picked up!!!!!")
    let playb = result.returnValues[0];
    let resultb = result.returnValues[1];
    let win = result.returnValues[2];
    let payout = result.returnValues[3];
    //console.log("eventListener");
    placeResult( playb, resultb, win, payout );

  })
}

function placeResult( playb, resultb, win, pay ){
  let playbet = playb;
  let resultbet = resultb;
  let winning = win;
  let payout = pay;
  //console.log("placeResult");
  if( playbet === true ){
    $("#youbet_output").text("Head");
  }
  else{
    $("#youbet_output").text("Tail");
  }
  if( resultbet === true ){
    $("#result_output").text("Head");
  }
  else{
    $("#result_output").text("Tail");
  }
  if( winning === true ){
    $("#winloose_output").text("You won!");
  }
  else{
    $("#winloose_output").text("You loose :(");
  }
  $("#payout_output").text(web3.utils.fromWei(payout, 'ether'));
}

function fetchAndChangeFace(){
  let face = $("#coinface_input").text()
  console.log("coinface: " + face);
  if( face === ""){
    $("#coinface_input").text("Head");
  }
  else if ( face === "Head") {
    $("#coinface_input").text("Tail");
  }
  else {
    $("#coinface_input").text("Head");
  }

}

function fillUpp(){

  var betSize = $("#fillupp_input").val();
  var config = { value: web3.utils.toWei(betSize,"ether") };

  contractInstance.methods.incBalance().send(config)
  .on("transacionHash", function(hash){
    console.log(hash);
  })
  .on("confirmation", function(confirmationNR){
    console.log(confirmationNR);
  })
  .on("receipt", function(receipt){
    console.log(receipt);
  })
}
