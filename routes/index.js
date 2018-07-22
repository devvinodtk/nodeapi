var request = require('request');
var cheerio = require('cheerio');
const routes = require('express').Router();
var utils = require('util');
var fs = require('fs');
 
routes.get('/processcsv/:filepath', (req,resp) => {
    var outputArray =[];
    resp.send(req.params.filepath);

});

routes.get('/allproducts', (req, response) => {
    var allproducts = new Array();
    var idsList = [
        '7NG3033-0JN00',
        '7MF4033-1CA00-1AA7-Z',
        '7NG3242-0BA10',
        '6ES7400-1TA00-0AA0',
        '6ES7400-1TA00-0AA0',
        '6ES7153-2DA80-0XB0',
        '6ES7153-2DA80-0XB0',
        '6ES7153-4BA00-0XB0',
        '6GK7443-1EX30-0XE0',
        '6GK7443-5DX05-0XE0',
        '6ES7414-3EM06-0AB0',
        '6ES7407-0KA02-0AA0',
        '6ES7331-7TF01-0AB0',
        '6ES7331-7TF01-0AB0',
        '6ES7332-8TF01-0AB0'
    ];
    var count = 0;
    var url = 'https://testpredi.azurewebsites.net/product/';
    for(var id of idsList) {
        request (url+ id, (err, res, html) => {
            count +=1;
            if(!err && res.statusCode == 200) {
                allproducts.push(res.body); 
            }
            if(count == idsList.length) {
                response.statusCode = 200;
                response.send('['+ allproducts.toString()+ ']');
                return;
            }
        });
    }    
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
