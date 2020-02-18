const CONSTANTS = require("./constants");
const fetch = require("isomorphic-fetch");
const _ = require(`lodash/cloneDeep`)

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
    constructor(token, endpoint) {
        this.token = `Basic ${token}`;

        if (!endpoint || endpoint.toUpperCase() === `PRODUCTION`) this.endpoint = CONSTANTS.PRODUCTION;
        else if (endpoint.toUpperCase() === `SANDBOX`) this.endpoint = CONSTANTS.SANDBOX;
        else this.endpoint = endpoint;

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

    //==============================================================================================
    //===========================================SITES==============================================
    //==============================================================================================

    getSite(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}`);
    }

    getSiteByExtId(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}byexternalid/${siteName}`);
    }

    createSite(templateID, options) {
        let data;
        if (!options) {
            data = {
                "template_id": templateID
            }
        }
        else {
            data = _(options);
            data.template_id = templateID;
        }
        return this.post(`${CONSTANTS.SITE_ENDPOINT}create`, data);
    }

    updateSite(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}update/${siteName}`, data);
    }

    deleteSite(siteName) {
        return this.delete(`${CONSTANTS.SITE_ENDPOINT}${siteName}`);
    }

    publishSite(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}publish/${siteName}`);
    }

    unpublishSite(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}unpublish/${siteName}`);
    }

    duplicateSite(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}reset/${siteName}`, data)
    }

    switchTemplate(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}switchTemplate/${siteName}`, data)
    }

    //==============================================================================================
    //==========================================TEMPLATES===========================================
    //==============================================================================================

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

    deleteTemplate(templateID) {
        return this.delete(`${CONSTANTS.TEMPLATE_ENDPOINT}${templateID}`)
    }


    //==============================================================================================
    //===========================================ACCOUNT============================================
    //==============================================================================================

    getAccountDetails(accountName) {
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}`)
    }

    createAccount(accountName, options) {
        let data;
        if (!options) {
            data = {
                "account_name": accountName
            }
        }
        else {
            data = _(options);
            data.template_id = templateID;
        }
        return this.post(`${CONSTANTS.ACCOUNT_ENDPOINT}create`, data);
    }

    updateAccount(accountName, data) {
        return this.post(`${CONSTANTS.ACCOUNT_ENDPOINT}update/${accountName}`, data);
    }

    deleteAccount(accountName) {
        return this.delete(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}`)
    }


    //==============================================================================================
    //===========================================CONTENT============================================
    //==============================================================================================

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

    //==============================================================================================
    //=====================================COLLECTION FIELDS========================================
    //==============================================================================================

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