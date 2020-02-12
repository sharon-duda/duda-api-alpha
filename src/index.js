const fetch = require("isomorphic-fetch");
const CONSTANTS = require("./constants");

class Duda {
    constructor(token) {
        //needs to receive 1. useranme, 2. password (or token) and 3. production environment.
        (this.token = `Basic ${token}`), 
        (this.endpoint = CONSTANTS.production);
    }

    fetchData(method, path, data) {
        const uri = `${this.endpoint}${path}`;
        let options = {
            method,
            headers: new Headers({
                authorization: this.token,
                "content-type": "application/json"
            })
        };
        fetch(uri, options)
            .then(res => res.json())
            .then(json => console.log(json));
    }

    get(path) {
        this.fetchData("GET", path);
    }

    post(path, data) {
        this.fetchData("POST", path, data);
    }

    delete(path) {
        this.fetchData("DELETE", path);
    }

    //Sites
    getSite(siteName) {
        this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}`);
    }
}

module.exports = Duda;

/* Questions:
1. Why when I do module.exports = class Duda this works, while when I do export class duda it doesn't.
2. Why when is there a difference between writing moudle.exports at top and buttom*/
