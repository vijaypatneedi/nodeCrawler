const urlModel = require('../Models/urlModel');
const util = require('util');
var e = {};

// returns array of objects
enrichUrl = (urlsArray, callback) => {
    let urls_arrayObject = [];
    //
    urlsArray.map(url => {
        let splitedUrl = url.split('?'); // array of url and params
        let obj = {}
        obj.url = splitedUrl[0];
        splitedUrl.shift(); //to remove the first element(url)
        obj.parameters = splitedUrl.map(urlParams => {
            return urlParams.split('=')[0];//to get only keys values 
        })
        urls_arrayObject.push(obj);
    })
    callback(null, urls_arrayObject);
}

const promisifyEnrichUrl = util.promisify(enrichUrl);



e.insertInDB = async (urlsArray) => {
    promisifyEnrichUrl(urlsArray).then(async docs => {


        for (let i = 0; i < docs.length; i++) {
            let element = docs[i];
            let isFoundAndUpdated = await urlModel.findOne({ url: element.url })//select query //check if a url is present

            if (!isFoundAndUpdated) {
                //url added to db for first time
                let create = new urlModel();// instantiate an object
                create.url = element.url;
                create.referenceCount = 1;// first count marked 
                create.parameters = element.parameters;
                await create.save();// insert query in sql
            } else {
                //url is present in db and params to be updated
                isFoundAndUpdated.referenceCount++; //count is incremented
                for (let i = 0; i < element.parameters.length; i++) {
                    if (isFoundAndUpdated.parameters.indexOf(element.parameters[i]) == -1) isFoundAndUpdated.parameters.push(element.parameters[i]);
                }
                new urlModel(isFoundAndUpdated);
                await isFoundAndUpdated.save();// check params and update
            }

        }


    })
}


module.exports = e;