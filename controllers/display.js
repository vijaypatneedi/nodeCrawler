const ParsedUrls = require('../models/urlModel');
var e = {};

e.getParsedUrls = async (req, res) => {
    try {
        let parsedUrls = await ParsedUrls.find({}); //select query
        res.status(200).json({
            NoOfUniqueUrls: parsedUrls.length || 0,
            parsedUrls: parsedUrls

        })
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }

}

module.exports = e;