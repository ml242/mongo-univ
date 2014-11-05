var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    





    if(err){
     console.log("line 7" + err);   
    }

    var query = {};
    var projection = { 'State' : 1, 'Temperature' : -1 };
    var sort = {"Temperature" : -1 };     
    var cursor = db.collection('data').find(query, projection, sort);
    console.log("cursor:" + cursor);

    var state = '';
    var operator = {'$set' : {'month_high' : true } };

    cursor.each(function(err, doc) {

        if (err) throw err;
        console.log('Update callback complete') 
        if (doc == null) {
            console.log("closing database");
            db.close();
        } else if (doc.State !== state) {
            console.log("doc:" + doc)
            // first record for each state is the high temp one
            state = doc.State;

            db.collection('data').update( {'_id':doc._id}, operator, function(err, updated) {
                if (err) console.log(err);
                // return db.close(); ?
            });

        }   

    });


});