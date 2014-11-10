// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
    





//     if(err){
//      console.log("line 7" + err);   
//     }

//     var query = { $all: { 'type': 'homework' } };
//     // var projection = { 'State' : 1, 'Temperature' : -1 };
//     // var sort = {"Temperature" : -1 };     
//     // var cursor = db.collection('data').find(query);
//     console.log(db.collection('students').find(query));






// });

var MongoClient = require('mongodb').MongoClient;


console.log("HW 3-1");
var removeLowestHomework=function(scores) {
    var lowest = 1000;
    var index = -1;
    for (var i = 0 ; i < scores.length; i++) {
        var score = scores[i];
        if(score['type'] == 'homework') {
            if (score['score'] < lowest) {
                lowest = score['score'];
                index = i;
            }
        }

    }
    if (index > -1) {
        console.log("Lowest score was: %d", scores[index]['score']);
        scores.splice(index, 1);
    }
    return scores;
}

MongoClient.connect(
    'mongodb://localhost:27017/school',
    function(err, db) {
        if(err) throw err;
        var coll=db.collection('students');
        var query = {};
        var sort = [['name',1]];
        var cursor = coll.find(query).sort(sort);
        var jedCount = 0;
        cursor.each(function(err,doc) {
            if(err) throw err;
            if(doc==null) {
              db.close();
              console.log("jedCount: %d",jedCount);
              return;
          } else {
              jedCount++;
          }
          var scores = doc['scores'];
          scores = removeLowestHomework(scores);
          doc['scores']=scores;
          coll.update({'_id':doc['_id']},doc,function(err){});
          console.dir(doc);
      });


    });