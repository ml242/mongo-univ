var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    

    if(err){
     console.log("line 7" + err);   
    }

    var query = {};
    var projection = { 'State' : 1, 'Temperature' : 1 };
    var cursor = db.collection('data').find(query, projection);
    console.log("cursor" + "\n" + cursor);

    var state = '';
    var operator = {'$set' : {'month_high' : true } };

    cursor.each(function(err, doc) {
        if (err) throw err;

        if (doc == null) {
            console.log("docs have value:" + doc);
            db.close();
        } else if (doc.State !== state) {
            // first record for each state is the high temp one
            state = doc.State;

            db.collection('data').update( {'_id':doc._id}, operator, function(err, updated) {
                if (err) console.log(err);
                // return db.close(); ?
            });

        }   

    });


});