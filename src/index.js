const fetch = require("isomorphic-fetch");
const CONSTANTS = require("./constants");
const utils = require("./utils");

const responseHandler = response => {
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

class Duda {
    constructor(token) {
        //needs to receive 1. useranme, 2. password (or token) and 3. production environment.
        (this.token = `Basic ${token}`), (this.endpoint = CONSTANTS.PRODUCTION);

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
            return fetch(uri, options).then(responseHandler);
        };

        this.get = path => {
            return this.fetchData("GET", path);
        };

        this.post = (path, data) => {
            return this.fetchData("POST", path, data);
        };

        this.put = (path, data) => {
            return this.fetchData("PUT", path, data);
        };

        this.delete = path => {
            return this.fetchData("DELETE", path);
        };
    }

    //Sites
    getSite(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}`);
    }

    getSiteByExtId(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}byexternalid/${siteName}`);
    }

    createSite(templateID) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}create`, templateID);
    }

    updateSite(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}update/${siteName}`, data);
    }

    publishSite(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}publish/${siteName}`);
    }

    unpublishSite(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}unpublish/${siteName}`);
    }

    //tempalates
    getTemplate(templateID) {
        return this.get(`${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}`);
    }

    getAllTemplates() {
        return this.get(CONSTANTS.TEMPLATE_ENDPOINT);
    }

    updateTemplateName(templateID, newTemplateName) {
        return this.post(
            `${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}`,
            newTemplateName
        );
    }

    createTemplateFromSite(siteName, newTemplateName) {
        const body = {
            site_name: siteName,
            new_template_name: newTemplateName
        };
        return this.post(
            `${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}fromsite`,
            body
        );
    }

    createTemplateFromTemplate(templateID, newTemplateName) {
        const body = {
            template_id: templateID,
            new_template_name: newTemplateName
        };
        return this.post(
            `${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}fromtemplate`,
            body
        );
    }

    //content

    getSiteContentLibrary(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}/content`);
    }

    updateSiteContentLibrary(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/content`, data);
    }

    uploadResource(siteName, data) {
        return this.post(
            `${CONSTANTS.SITE_ENDPOINT}resources/${siteName}/upload`,
            data
        );
    }

    injectContent(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}inject-content/${siteName}`, data);
    }

    //collections

    getCollection(siteName, collectionName) {
        return this.get(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}`
        );
    }

    getSiteCollections(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection`);
    }

    createCollection(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}collection`, data);
    }

    updateCollectionName(siteName, currentCollectionName, newCollectionName) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${currentCollectionName}`,
            newCollectionName
        );
    }

    deleteCollection(siteName, collectionName) {
        return this.get(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}`
        );
    }

    //collection rows

    addRow(siteName, collectionName, data) {
        return this.post(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/row`,
            data
        );
    }

    updateRow(siteName, collectionName, data) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/row`,
            data
        );
    }

    delteRow(siteName, collectionName, data) {
        return this.delete(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/row`,
            data
        );
    }

    //collectinos fields

    addField(siteName, collectionName, data) {
        return this.post(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/field`,
            data
        );
    }

    addField(siteName, collectionName, fieldName, data) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/field/${fieldName}`,
            data
        );
    }

    deleteField(siteName, collectionName, fieldName) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}collection/${collectionName}/field/${fieldName}`
        );
    }
}

module.exports = Duda;