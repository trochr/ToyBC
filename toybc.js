/* Toy BC is a toy blockchain, just to play with the concept
TODO
make the block Id the hash of the block instead of having to pick it
*/

function sha256(str) {
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    return hex(hash);
  });
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    var value = view.getUint32(i)
    var stringValue = value.toString(16)
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }
  return hexCodes.join("");
}

var difficulty = "00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

var Block = class {
  constructor(id,parentBlock) {
    this.id = id;
    this.parentBlock = parentBlock;
    this.nounce = 0;
    this.message = null;
  }

  setMessage(message){
    this.message = message;  
  };

  isValid(){
      var self = this;
      sha256(JSON.stringify(self)).then(function(digest) {
        if (digest < difficulty) {
          return console.log("true");
      }
      return console.log("false");
      }); 
  };

  mine() {
    var self = this;
    var nounces = [];

    function checkShaForNounces(arr) {     
      return arr.reduce(function(promise, nounce) {
        return promise.then(function() {
            self.nounce = nounce;
            return sha256(JSON.stringify(self)).then(function(res) {
              if (res < difficulty) {
                nounces.push(self.nounce);
              }
            });
        });
      }, Promise.resolve());
    }

    var listOfNounces = [];
    for (var i=0;i<10000;i++) {
      listOfNounces.push(i);
    }
    return checkShaForNounces(listOfNounces).then(function() {
      if (nounces[0] == undefined) {
        return console.log("Didn't find a valid nounce, look further!")
      }
      console.log('found a valid nounce: '+nounces[0]);
      self.nounce = nounces[0];
    });
  }
   
  showHash(){
      var self = this;
      sha256(JSON.stringify(this)).then(function(digest) {
        console.log(digest);
       }); 
  };

  getHash(){
      var self = this;
      return sha256(JSON.stringify(this)).then(function(digest) {
        return digest;
       }); 
  };
}

var b1 = new Block(0);
var b2; 
b1.setMessage("this is my origin block");
b1.mine().then(function(){
  b1.getHash().then(function(h){
    b2 = new Block(1,h);
    b2.setMessage("this is my second block");
  });  
})