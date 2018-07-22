var request = require('request');
var cheerio = require('cheerio');
const routes = require('express').Router();
var utils = require('util');
var fs = require('fs');
 
routes.get('/processcsv/:filepath', (req,resp) => {
    var outputArray =[];
    resp.send(req.params.filepath);

});

routes.get('/product/:id', (req, response) => {  
    var url = 'https://mall.industry.siemens.com/mall/en/ww/Catalog/Product/'+ req.params.id;
    var productJSON = {
        ArticleNumber: "",
        ProductDescription: "",
        ProductFamily: "",
        ProductLifecycle: "",
        PLMEffectiveDate: "",
        Notes: ""
    };
    request(url, (err, res, html) => {

        if(!err && res.statusCode == 200) {
            var $= cheerio.load(html);            
            var productTable = $('.ProductDetailsTable').children('tbody').children('tr');

            var articleNumber  = productTable.children("td:contains('Article Number')");
            var articleNumberText = articleNumber.length ? articleNumber.siblings('td').text().trim() : "";

            var productDescription  = productTable.children("td:contains('Product Description')");
            var productDescriptionText = productDescription.length ? productDescription.siblings('td').text().trim()
                                        .replace(/\s\s+/g, ' ') : "";

            var productFamily  = productTable.children("td:contains('Product family')");
            var productFamilyText = productFamily.length ? productFamily.siblings('td').children('a').text().trim() : "";

            var productLifecycle  = productTable.children("td:contains('Product Lifecycle')");
            var productLifecycleText = productLifecycle.length ? productLifecycle.siblings('td').text().trim() : "";

            var plmEffectiveDate  = productTable.children("td:contains('PLM Effective Date')");
            var plmEffectiveDateText = plmEffectiveDate.length ? plmEffectiveDate.siblings('td').text().trim() : "";

            var notes  = productTable.children("td:contains('Notes')");
            var notesText = notes.length ? notes.siblings('td').children('div').text().trim()
                            .replace(/\s\s+/g, ' ') : "";

            productJSON = {
                ArticleNumber: articleNumberText,
                ProductDescription: productDescriptionText,
                ProductFamily: productFamilyText,
                ProductLifecycle: productLifecycleText,
                PLMEffectiveDate: plmEffectiveDateText,
                Notes: notesText
            };
        }
        response.statusCode = 200;
        response.send(productJSON);
    });
    
});

module.exports = routes;