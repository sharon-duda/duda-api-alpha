const CONSTANTS = require("./constants");
const Utils = require('./Utils')
const fetch = require("isomorphic-fetch");
const _ = require(`lodash/cloneDeep`)


const utils = new Utils();


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
            return fetch(uri, options).then(utils.responseHandler);
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
    //===========================================SITE===============================================
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

    getSiteToken(siteName) {
        return this.get(`store/${siteName}/accessData`)
    }

    publishSite(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}publish/${siteName}`);
    }

    unpublishSite(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}unpublish/${siteName}`);
    }

    duplicateSite(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}duplicate/${siteName}`, data)
    }

    resetSite(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}reset/${siteName}`, data)
    }

    switchTemplate(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}switchTemplate/${siteName}`, data)
    }

    //==============================================================================================
    //==========================================TEMPLATE============================================
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
    //============================================PAGES=============================================
    //==============================================================================================

    getPageDetails(siteName, pageName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}/pages/${pageName}`);
    }

    getSitePages(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}/pages`);
    }

    updatePage(siteName, pageName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/pages/${pageName}/update`, data);
    }

    duplicatePage(siteName, pageName, newPageTitle) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/pages/${pageName}/duplicate?pageTitle=${newPageTitle}`);
    }

    deletePage(siteName, pageName) {
        return this.delete(`${CONSTANTS.SITE_ENDPOINT}${siteName}/pages/${pageName}/delete`);
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

    //permissions

    getAllPermissions() {
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}permissions/multiscreen`)
    }

    getSitePermissions(accountName, siteName) {
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/sites/${siteName}/permissions`)
    }

    getCustomerSites(accountName) {
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}grant-access/${accountName}/sites/multiscreen`)
    }

    grantSitePermissions(accountName, siteName, data) {
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/sites/${siteName}/permissions`, data)
    }

    removeSiteAccess(accountName, siteName) {
        return this.delete(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/sites/${siteName}/permissions`)
    }

    getSSOLink(accountName, siteName, target) {
        if (target) return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/link?site_name=${siteName}&target=${target}`)
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/link?site_name=${siteName}`)
    }

    resetPasswordLink(accountName) {
        this.post(`${CONSTANTS.ACCOUNT_ENDPOINT}/reset-password/${accountName}`)
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

    updateSiteContentLibrary(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/content/publish`);
    }

    
    //multi-location
    
    getLocationData(siteName, locationID) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}/${CONSTANTS.MULTI_LOCATION_ENDPOINT}${locationID}`)
    }
    
    createLocation(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/${CONSTANTS.MULTI_LOCATION_ENDPOINT}`, data)
    }
    
    updateLocation(siteName, locationID) {
        return this.psot(`${CONSTANTS.SITE_ENDPOINT}${siteName}/${CONSTANTS.MULTI_LOCATION_ENDPOINT}${locationID}`)
    }
    
    deleteLocation(siteName, locationID) {
        return this.delete(`${CONSTANTS.SITE_ENDPOINT}${siteName}/${CONSTANTS.MULTI_LOCATION_ENDPOINT}${locationID}`)
    }
    
    //content injection
    
    uploadResource(siteName, data) {
        return this.post(
            `${CONSTANTS.SITE_ENDPOINT}resources/${siteName}/upload`,
            data
        );
    }

    injectContent(siteName, data) {
        return this.post(`${CONTENT_INJECTION_ENDPOINT}${siteName}`, data);
    }

    injectContentToSinglePage(siteName, pageName, data) {
        return this.post(`${CONTENT_INJECTION_ENDPOINT}${siteName}/${pageName}`, data);
    }

    getContentInjectionValues(siteName){
        return this.get(`${CONTENT_INJECTION_ENDPOINT}${siteName}`);
    }

    //==============================================================================================
    //========================================COLLECTIONS===========================================
    //==============================================================================================

    getCollection(siteName, collectionName) {
        return this.get(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}`
        );
    }

    getSiteCollections(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}${siteName}/collection`);
    }

    createCollection(siteName, data) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/collection`, data);
    }

    updateCollectionName(siteName, currentCollectionName, newCollectionName) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${currentCollectionName}`,
            newCollectionName
        );
    }

    deleteCollection(siteName, collectionName) {
        return this.get(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}`
        );
    }

    //collection rows

    addRow(siteName, collectionName, data) {
        return this.post(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}/row`,
            data
        );
    }

    updateRow(siteName, collectionName, data) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}/row`,
            data
        );
    }

    delteRow(siteName, collectionName, data) {
        return this.delete(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}/row`,
            data
        );
    }

    
    //collection fields

    addField(siteName, collectionName, data) {
        return this.post(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}/field`,
            data
        );
    }

    addField(siteName, collectionName, fieldName, data) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}/field/${fieldName}`,
            data
        );
    }

    deleteField(siteName, collectionName, fieldName) {
        return this.put(
            `${CONSTANTS.SITE_ENDPOINT}${siteName}/collection/${collectionName}/field/${fieldName}`
        );
    }

    //==============================================================================================
    //==========================================REPORTING===========================================
    //==============================================================================================

    getRecentlyPublishedSites() {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}published`)
    }

    getRecentlyUnpublishedSites() {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}unpublished`)
    }

    getSitesCreated(from, to = new Date().toJSON().slice(0,10)) {
        if (from) return this.get(`${CONSTANTS.SITE_ENDPOINT}create/from=${from}&to=${to}`)
        return this.get(`${CONSTANTS.SITE_ENDPOINT}create/`)
    }

    getFormSubmissions(siteName, from, to = new Date().toJSON().slice(0,10)) {
        if (from) return this.get(`${CONSTANTS.SITE_ENDPOINT}create/from=${from}&to=${to}`)
        return this.get(`${CONSTANTS.SITE_ENDPOINT}get-forms/${siteName}`)
    }

    getEmailSettings(accountName, siteName) {
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/sites/${siteName}/stats-email`)
    }

    subscribeCustomer(accountName, siteName, frequency) {
        const data = {
            frequency
        }
        return this.post(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/sites/${siteName}/stats-email`, data)
    }

    unsubscribeCustomer(accountName, siteName) {
        return this.get(`${CONSTANTS.ACCOUNT_ENDPOINT}${accountName}/sites/${siteName}/stats-email`)
    }

    // getAnalyticsHistory(siteName, query = {
    //     from: new Date(new Date().setDate(new Date().getDate() - 30)).toJSON().slice(0,10),
    //     to: new Date().toJSON().slice(0,10),

    // })


    //==============================================================================================
    //============================================OTHER=============================================
    //==============================================================================================

    getAllBackups(siteName) {
        return this.get(`${CONSTANTS.SITE_ENDPOINT}multiscreen/backups/${siteName}`)
    }

    createBackup(siteName, backupName) {
        const data = {
            name: backupName
        }
        return this.post(`${CONSTANTS.SITE_ENDPOINT}backups/${siteName}/create`, data)
    }

    restoreSite(siteName, backupName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}backups/${siteName}/restore/${backupName}`)
    }

    deleteBackup(siteName, backupName) {
        return this.delete(`${CONSTANTS.SITE_ENDPOINT}backups/${siteName}/restore/${backupName}`)
    }

    generateSSLCerificate(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/certificate`)
    }

    renewSSLCerificate(siteName) {
        return this.post(`${CONSTANTS.SITE_ENDPOINT}${siteName}/certificate/renew`)
    }

    deleteSSLCerificate(siteName) {
        return this.delete(`${CONSTANTS.SITE_ENDPOINT}${siteName}/certificate`)
    }
}

module.exports = Duda;