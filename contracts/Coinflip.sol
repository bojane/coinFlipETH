pragma solidity 0.5.12;
import "./Ownable.sol";
import "./Random.sol";

contract Coinflip is Ownable, Random{

struct Game {
  bool betHead;
  bool isHead;
  uint betSize;
  uint payAmount;
  bool winGame;
}

  uint public balance;

  modifier betable(uint max,uint min){
      require(msg.value <= max && msg.value >= min);
      require(msg.value <= balance);
      _;
  }

  modifier pay(){
      require(msg.value >= 0);
      _;
  }

  event gamePlayed( bool betHead, bool isHead, bool winGame, uint payout);


  function doCoinFlip( bool betHead ) public payable betable(1 ether, 0.1 ether){
    balance += msg.value;
    Game memory newGame;
    newGame.betHead = betHead;
    newGame.isHead = flipHead();
    newGame.betSize = msg.value;
    newGame.winGame = didWin( newGame.betHead, newGame.isHead);
    if(newGame.winGame == true){
      newGame.payAmount = 2 * newGame.betSize;
      msg.sender.transfer(newGame.payAmount);

    }
    else{
      newGame.payAmount = 0;
    }

    emit gamePlayed( newGame.betHead, newGame.isHead, newGame.winGame, newGame.payAmount );

  }

  function incBalance() public payable pay(){
    balance += msg.value;

  }
  function withdrawAll() public onlyOwner returns(uint) {
      uint toTransfer = balance;
      balance = 0;
      msg.sender.transfer(toTransfer);
      return toTransfer;
  }

  function didWin( bool betHead, bool isHead ) private returns( bool ){
    if( betHead == isHead ){
      return true;
    }
    else{
      return false;
    }
  }

  function payout( uint betsize ) private returns(bool){


  }

}
