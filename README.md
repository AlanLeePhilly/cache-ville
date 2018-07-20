CACHE-VILLE

Cache-ville is an in-memory cache manager built in Node.js

## HOW TO USE

Required:  
`node` (built in 8.9.4, tested to work in 10.7.0)

Installation:  
`git clone https://github.com/AlanLeePhilly/cache-ville.git`  
`cd cache-ville`  
`node index.js`  

BASIC COMMANDS

| Command | Purpose |
|---------|---------|
| SET _key_ _value_ | Set key-value pair in cache |
| GET _key_ | Print the value of a given key, or NULL if undefined |
| UNSET _key_ | Remove key (and value) from cache |
| NUMEQUALTO _value_ | Print the number of entries containing the given value |
| HELP | Print available commands in terminal |
| STATE | Print current state of cache, as well as any snapshots held in `state_log` |
| END | Exit program |

TRANSACTION COMMANDS

| Command | Purpose |
|---------|---------|
| BEGIN | Open a new transaction block. |
| ROLLBACK | Undo all of the data commands issued within the most recent transaction block and close that block. |
| COMMIT | Close all open transaction blocks, permanently applying all data commands made within them. |

## HOW IT WAS BUILT  
I started by building the `process.stdin.on` block to receive user input from the command line. It parses the input and uses a switch statement as a directory to trigger the requested function and send along any given arguments. 

Next, I built the basic cache by initializing the cache object and writing the functions which handle reading and writing content to the cache.  
* `SET` accepts a key-value pair, and places it directly into the cache object via `cache[key] = value`.  
* `GET` accepts a key and looks for it in cache via `cache[key]`, returning the set value if present, or "NULL" if not.  
* `UNSET` accepts a key and runs `delete cache[key]` to remove that entry from the cache.  
* `NUMEQUALTO` accepts a value and runs `Object.values(cache)` to return an array of all values in the cache. That array is filtered to only include values matching the given argument, and the length of that array is returned as the number of instances of that value in the cache.
* `HELP` prints a list of available commands within the terminal.  
* `STATE` prints out the present contents of the cache and the state log. Originally built to assist with debugging, but kept as useful feature. It utilizes `util.inspect()` to print out contents of objects in-line.
* `END` runs `process.exit()`

Finally, I built the transactional commands by adding a `state_log` array which would act as a stack of snapshots of the cache.  
* `BEGIN` command adds a snapshot of the current state of the cache to the top of the stack (the end of the array).  
* `ROLLBACK` command pops the most recent snapshot off the top of the stack and replaces the current cache with it, therefore 'undo-ing' all commands which took place since the most recent `BEGIN` command.  
* `COMMIT` command empties the `state_log`, therefore finalizing any commands which were being tracked in the log. 

