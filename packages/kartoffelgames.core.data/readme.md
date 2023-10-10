# KartoffelGames Core Data

This package consists mostly of helper classes and storage types, aimed at reducing code redundance and improving clarity.

---

* [Usage](#Usage)
* [Data storage](#data-storage)
    * [Dictionary](#dictionary)

## Installation
```
npm install @kartoffelgames/core.data
```

## Data Storage
Hold generic data but mostly extends existing javascript types by new data access methods.

### Dictionary
Wrapper for a JavaScript [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). 
Extended by `add`, `getAllKeysOfValue` and `getOrDefault`.
```TypeScript
const dictionary = new Dictionary<string, number>();

// Set example data.
dictionary.set('a', 1);
dictionary.set('b', 2);
dictionary.set('c', 2);

// add
dictionary.add('d', 4); // => OK
dictionary.add('a', 4); // => Fail: Dublicate key.

// getAllKeysOfValue
const keys = dictionary.getAllKeysOfValue(1);
console.log(keys); => // Output => ['a', 'c']

// getOrDefault
const keyA = dictionary.getAllKeysOfValue('a', 22);
console.log(keyA);  // Output => 1

const keyZ = dictionary.getAllKeysOfValue('z', 22);
console.log(keyZ);  // Output => 22
```