var express = require('express')
var app = express()

// Airtable configuration
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyU759hT08CdEqKf'}).base('appiONft8AsUiUstg');

const PORT  = 8080 || process.env.PORT; 

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/get-stock-prices', function (req, res) {
    base('Stock Price Table').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        let responseArray = records.map(record => {
            return {
                id : record.id,
                date : record.get('date'), 
                stock_price : record.get('stock_price')
            }; 
        }) 
        res.send(responseArray); 
    });
})

app.put('/update-record', function(req, res) {
    base('Stock Price Table').update(req.body.id, {
        "date": req.body.date,
        "stock_price": Number(req.body.stock_price)
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        res.send(JSON.stringify({
            date : record.get('date'), 
            stock_price : record.get('stock_price')
        })); 
    });
})

// app.delete('/delete-record', function(req, res) {
//     base('Stock Price Table').destroy(req.body.id, function(err, deletedRecord) {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         res.send(deletedRecord.id); 
//     });
// })

app.listen(PORT, ()=> {
    console.log('Server started on port 8080!')
})