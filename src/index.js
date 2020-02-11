const fetch = require('isomorphic-fetch');
const CONSTANTS = require('./constants');

class Duda {
  constructor() {

  }

  wrapperFetch() {
    let options = {
            method: "GET",
            headers: new Headers({
                Authorization: 'Basic NTYxYzQ3ODE1ZjpwYXNzd29yZDEyMzQ=',
                "content-type": "application/json"
            })
        };
    fetch('https://api.duda.co/api/sites/multiscreen/9a7d4ec5', options)
    .then(res => res.json())
    .then(json => console.log(json));
  }

  wrapperFunc() {
    console.log(CONSTANTS.production);
  }

}



module.exports = Duda;










/* Questions:
1. Why when I do module.exports = class Duda this works, while when I do export class duda it doesn't.
2. Why when is there a difference between writing moudle.exports at top and buttom*/