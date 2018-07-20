'use strict'
process.stdin.resume();  //begin reading from stdin
process.stdin.setEncoding('utf8');
var util = require('util');

// declare cache object
var cache = {}; 
//declare array which will hold snapshots of cache
var state_log = []; 

console.log("\nWelcome to Cache-ville!");
console.log("Enter \"HELP\" for help\n");

// define function to execute upon user input from command line
process.stdin.on('data', function (input) {
  // remove "\n" which gets appended to user input from command line
  input = input.slice(0, -1); 
  
  // convert user input into array with one word per element
  var args = input.split(' ');
  
  // take first word of user input and match against available commands
  // upon match, trigger relevant function and send any necessary arguments from user input
  switch(args[0]){
    case "SET":
      set(args[1], args[2]);
      break;
    case "GET":
      get(args[1]);
      break;
    case "UNSET":
      unset(args[1]);
      break;
    case "NUMEQUALTO":
      numEqualTo(args[1]);
      break;
    case "BEGIN":
      begin();
      break;
    case "ROLLBACK":
      rollback();
      break;
    case "COMMIT":
      commit();
      break;
    case "STATE":
      state();
      break;
    case "HELP":
      help();
      break;
    case "END":
      end();
      break;
    default:
      console.log("bad command\n");
  };
});

// accepts key and value, and inserts or overwrites in cache object
function set(key, value){
  cache[key] = value;
};

// accepts key, looks for value at that key in cache and prints that value if it exists,
// else prints "NULL"
function get(key){
  if(cache[key]){
    console.log(cache[key]);
  } else {
    console.log("NULL");
  };
};

// accepts key and deletes that key (and value if present) from cache
function unset(key){
  delete cache[key]; 
};

// print number of instances of a given value in cache
function numEqualTo(value){
  // create array of all values in cache
  var allValues = Object.values(cache);
  
  // loop through that array and count each time the array element matches
  // the given value
  var count = 0;
  for (var i = 0; i < allValues.length; i++){
    if(allValues[i] == value){
      count++;
    };
  };
  
  // print count
  console.log(count);
};

// make a copy of cache and push copy onto end of state log
// note: Object.assign is not a true deep copy. Nested objects may experience bugs
//       would consider incorporating external library in further versions,
//       as this is a common issue with vanilla JS.
function begin(){
  state_log.push(Object.assign({}, cache));
};

// check to see if there are any snapshots in the state log
// if so, remove most recent snapshot out of the log and 
// make it the new cache
// if not, print "NO TRANSACTION"
function rollback(){
  if(state_log && state_log.length > 0){
    cache = state_log.pop();
  } else {
    console.log("NO TRANSACTION");
  }
};

// finalize any changes to cache by removing all snapshots from the state log
// if no snapshots, print "NO TRANSACTION"
function commit(){
  if(state_log && state_log.length > 0){
    state_log = [];
  } else {
    console.log("NO TRANSACTION");
  };
};

// print out current state of cache and state logs
// uses util.inspect() to display contents in-line
function state(){
  console.log("\nCache: " + util.inspect(cache));
  console.log("State Log: " + util.inspect(state_log) + "\n");
}

// print command list, syntax, and basic instructions
function help(){
  console.log("\nCommands: ");
  console.log("\nSET <key> <value>\n  example: SET foo bar \n  will add the value 'bar' to the cache with a key of 'foo'");
  console.log("\nGET <key>\n  example: GET foo \n  will return whatever value is set for key 'foo'");
  console.log("\nUNSET <key>\n  example: UNSET foo \n  will remove key 'foo' from cache along with its set value");
  console.log("\nNUMEQUALTO <value>\n  example: NUMEQUALTO bar \n  will return the number of keys in cache which have value 'bar'");
  console.log("\nBEGIN\n  example: BEGIN \n  will open a new transaction block");
  console.log("\nROLLBACK\n  example: ROLLBACK \n  will undo all commands within the most recent block and close the block");
  console.log("\nCOMMIT\n  example: COMMIT \n  will close all blocks and permanently apply changes made within them");
  console.log("\nSTATE\n  example: STATE \n  will return the current state of cache as well as any snapshots taken in state log");
  console.log("\nEND\n  example: END \n  will exit the program\n");
}

// exit process to end program
function end() {
  console.log('Thanks, bye!');
  process.exit();
}