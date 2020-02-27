// const helpers = {
//   responseHandler: (response) => {
//     if(response.status === 204) {
//       console.log(`succefully returned with ${response.status}`)
//       return
//     }
//     else if (response.status == 200) {
//       response.json().then(json => console.log(json))
//     }
//     else {
//       console.error(new Error(`Status ${response.status}: ${response.statusText}`))
//       return Promise.reject(response)
//     }
//   },
  
//   deepCopy: (o) => {
//     if ((typeof o !== "object" || o === null) && !(o instanceof Function)) return o; // fast obj/null test
//     let n, keys;
//     const c = o.constructor;
//     if (o[Symbol.iterator] instanceof Function) { // fast array test
//         // Map and Set have no length property so they will be correctly constructed
//         const l = o.length;
//         n = (new c(l));
//         switch (c) {
//             case Set:
//                 for (let e of o) n.add(deepCopy(e));
//                 break;
//             case Map:
//                 for (let [key, value] of o) n.set(key, deepCopy(value));
//                 break;
//         }
//         for (let i of Object.keys(o)) n[i] = deepCopy(o[i]);
//     } else {
//         if (c !== Object) {
//             switch (c) {
//                 case Function:
//                     let str = o.toString();
//                     if(/ \[native code\] /.exec(str) === null){
//                         let args=/^.*?\((.*?)\)/.exec(str)[1];//.split(/,/);
//                         let func=/^.*?{(.*)}/.exec(str)[1];
//                         n=new c(args,func);
//                     }else{
//                         n=o;
//                     }
//                     break;
//                 case RegExp:
//                     n = new c(o.valueOf());
//                     break;
//                 case Date:
//                     n = new c(o);
//                     break;
//                 case ArrayBuffer:
//                     n = new c((new Int8Array(o)).length);
//                     break;
//                 default:
//                     n = o;
//             }
//             keys = Object.keys(o);
//         } else {
//             n = {};
//             keys = Object.getOwnPropertyNames(o);
//         }
//         for (let i of keys) n[i] = deepCopy(o[i]);
//     }
//     for (let i of Object.getOwnPropertySymbols(o)) n[i] = deepCopy(o[i]);
//     return n;
//   } 
// }

// const responseHandler = response => {
//     console.log('inside function!!!!!$#$')
//     if(response.status === 204) {
//       console.log(`succefully returned with ${response.status}`)
//       return
//     }
//     else if (response.status == 200) {
//       response.json().then(json => console.log(json))
//     }
//     else {
//       console.error(new Error(`Status ${response.status}: ${response.statusText}`))
//       return Promise.reject(response)
//     }
//   }




class Utils {
    constructor() {}

    responseHandler (response) {
        if (response.status === 204) {
            console.log(`succefully returned with ${response.status}`);
            return response;
        } else if (response.status == 200) {
            // response.json().then(json => console.log(json))
            return response;
        } else {
            console.error(
                new Error(`Status ${response.status}: ${response.statusText}`)
            );
            return Promise.reject(response);
        }
    };
}

module.exports = Utils;
