const fetch = require("isomorphic-fetch");
const CONSTANTS = require("./constants");

const responseHandler = response => {
  if(response.status === 204) {
    console.log(`succefully returned with ${response.status}`)
    return
  }
  else if (response.status == 200) {
    response.json().then(json => console.log(json))
  }
  else {
    console.error(new Error(`Status ${response.status}: ${response.statusText}`))
    return Promise.reject(response)
  }
}

class Duda {
    constructor(token) {
        //needs to receive 1. useranme, 2. password (or token) and 3. production environment.
        (this.token = `Basic ${token}`), (this.endpoint = `https://my-test-master.dud4.co/api/`);

        this.fetchData = (method, path, data) => {
            const uri = `${this.endpoint}${path}`;
            let options = {
                method,
                headers: new Headers({
                    authorization: this.token,
                    "content-type": "application/json"
                })
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            fetch(uri, options).then(responseHandler)
        };

        this.get = path => {
            this.fetchData("GET", path);
        };

        this.post = (path, data) => {
            this.fetchData("POST", path, data);
        };

        this.put = (path, data) => {
            this.fetchData("PUT", path, data);
        };


        this.delete = path => {
            this.fetchData("DELETE", path);
        };
    }

    //Sites
    getSite(siteName) {
        this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}`);
    }

    getSiteByExtId(siteName) {
        this.get(`${CONSTANTS.SITE_ENDPOINT}byexternalid/${siteName}`);
    }

    createSite(templateID) {
        this.post(`${CONSTANTS.SITE_ENDPOINT}create`, templateID);
    }

    updateSite(siteName, data) {
        this.post(`${CONSTANTS.SITE_ENDPOINT}update/${siteName}`, data);
    }

    publishSite(siteName) {
        this.post(`${CONSTANTS.SITE_ENDPOINT}publish/${siteName}`);
    }

    unpublishSite(siteName) {
        this.post(`${CONSTANTS.SITE_ENDPOINT}unpublish/${siteName}`);
    }

    //tempalates
    getTemplate(templateID) {
        this.get(`${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}`);
    }

    getAllTemplates() {
        this.get(CONSTANTS.TEMPLATE_ENDPOINT);
    }

    updateTemplateName(templateID, newTemplateName) {
        this.post(`${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}`, newTemplateName);
    }

    createTemplateFromSite(siteName, newTemplateName) {
        const body = {
            site_name: siteName,
            new_template_name: newTemplateName
        };
        this.post(`${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}fromsite`, body);
    }

    createTemplateFromTemplate(templateID, newTemplateName) {
        const body = {
            template_id: templateID,
            new_template_name: newTemplateName
        };
        this.post(`${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}fromtemplate`, body);
    }

    //content

    getSiteContentLibrary(siteName) {
      this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}/content`);
    }

    updateSiteContentLibrary(siteName, data) {
      this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/content`, data);
    }

    uploadResource(siteName, data) {
      this.post(`${CONSTANTS.SITE_ENDPOINT}resources/${siteName}/upload`, data)
    }

    injectContent(siteName, data) {
      this.post(`${CONSTANTS.SITE_ENDPOINT}inject-content/${siteName}`, data)
    }

    //collections

    getCollection(siteName, collectionName) {
        this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}`)
    }

    getSiteCollections(siteName) {
        this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection`)
    }

    createCollection(siteName, data) {
        this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection`, data)
    }

    updateCollectionName(siteName, currentCollectionName, newCollectionName) {
        this.put(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${currentCollectionName}`, newCollectionName)
    }

    deleteCollection(siteName, collectionName) {
        this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}`)
    }

    //collection rows

    addRow(siteName, collectionName, data) {
        this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/row`, data)
    }

    updateRow(siteName, collectionName, data) {
        this.put(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/row`, data)
    }

    delteRow(siteName, collectionName, data) {
        this.delete(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/row`, data)
    }

    //collectinos fields
    
    addField(siteName, collectionName, data) {
        this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/field`, data)
    }

    addField(siteName, collectionName, fieldName, data) {
        this.put(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/field/${fieldName}`, data)
    }

    deleteField(siteName, collectionName, fieldName) {
        this.put(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/field/${fieldName}`)
    }




}

module.exports = Duda;

/* 
Questions:
1. Why when I do module.exports = class Duda this works, while when I do export class duda it doesn't.
2. Why when is there a difference between writing moudle.exports at top and buttom
3. How to break dwown index.js to smaller components
4. How to measure code performace
5. Right now - all error handling is make by our server, do we want to delegate some of that responsibility to the js library?
6. Move response handler to its own  
*/
