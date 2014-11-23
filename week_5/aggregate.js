// use aggregate function, synonymous to groupBy in SQL
db.products.aggregate([
  {$group: {
        // this will be our resulting key
        _id: "$category",
        //this give us our count
        num_products: {$sum: 1}
      }
    }
    ])

// quiz assignment to get the population by state

db.zips.aggregate([
  { 
    $group: {
      _id: "$state",
      population: {$sum: "$pop" } 
    }
  }
])

// avg price example from a store db

db.products.aggregate([
{
  $group: {
    _id: {"category": "$category"}
  },
  avg_price: {$avg: "$price"}
}
])

// trying to get the average pop by zip

db.zips.aggregate([
  {
    $group: {
      _id: {"category": "$state"}, "population": {$avg: "$pop"}
    }
  }
])


// add to set with products

db.products.aggregate([{
  $group: {
    _id: {"maker": "$manufacturer"},
    categories: {$addToSet: "$category"}
  }
}])


// add to set with people

// db.zips.aggregate([
//   {
//     $group: {
//       _id: {"category": "$city"}, 
//       "categories": {$addToSet: "$_id"}
//     }
//   }
// ])

db.zips.aggregate([{
  "$group":{
    "_id":"$city", 
    "postal_codes" : {"$addToSet":"$_id"}
}}])

// max price with products

db.products.aggregate([{
  $group: {
    _id: {"maker": "$manufacturer"},
  },
  maxprice: {$max: "$price"}
}])


// show the product that corresponds with max price




// show the zip that has the highest pop in each state


db.zips.aggregate([
  {
    $group: {
      _id: "$state", 
      pop: {$max: "$pop"}
    }
  }
])


// double aggregate the scores for the average of all exams, perstudent + per class


db.grades.aggregate([
  {'$group': {_id: {class_id: "$class_id", student_id: "$student_id"}, "average": {"$avg": "$score"}}},
  {"$group": {_id: "$_id.class_id", "average": {"$avg": "$average"}}}
])

// $project
// $toUpper
// $toLower

// using key to project

db.products.aggregate([
  {$project: 
    {
      _id: 0,
      "maker": {$toLower: "$manufacturer" },
      "details": {"category": "$category",
        "price": {"$multiply": ["$price", 10]}
    },
      "item": "$name"
    }
  }
])

// suppress the id of a city, lowercase the name, include the pop, state, and make the zip equal to the original _id

db.zips.aggregate([
  {
    $project:
      { _id:0, 
        city:{$toLower:"$city"}, 
        pop:1, 
        state:1, 
        zip:"$_id"
      }
  }
])

// match docs in a collection

db.zips.aggregate([
  {
    "$match": {
      state: "CA"
    }
  }
  ])

// match and group

db.zips.aggregate([
  { "$match": 
    {
      state: "CA"
    }
  },
    // second stage with the matched docs
  { "$group":
    {
      _id: "$city",
      population: {$sum: "$pop"},
      zip_codes: {$addToSet: "$_id"}
    }
  }
])

// rename the _id with projection:

db.zips.aggregate([
  { "$match": 
    {
      state: "CA"
    }
  },
    // second stage with the matched docs
  { "$group":
    {
      _id: "$city",
      population: {$sum: "$pop"},
      zip_codes: {$addToSet: "$_id"}
    }
  },
  {"$project":
    {
      _id: 0,
      city: "$_id",
      population: 1,
      zip_codes: 1
    }
  }
])

// aggregate zips greater than 100k, basically a find

db.zips.aggregate([
    {$match:
        {
            "pop": {"$gt": 100000}
        }
    }
])


// Write an aggregation query with just a sort stage to sort by (state, city), both ascending. Assume the collection is called zips.

db.zips.aggregate([
    {
        $sort: 
        {
            "state": 1,
            "city": 1
        }
    }
])

// skip and limit

// homework 5.1
db.posts.aggregate([
  {
    $project: 
    {
      "_id": 0,
      "comments.author": 1
    }
  },
  {
    $unwind: "$comments"
  },
  {
    $group: 
    {
      "_id": "$comments.author",
      sum: {"$sum": 1}
    }
  },
  {
    $sort: {"sum": -1}
  },
])


// homework 5.2
db.zips.aggregate([
  {
    $group:
    {
      "_id": 
      {
        state: "$state",
        city: "$city"
      },
      pop: 
      {
        "$sum": "$pop"
      }
    }
  },
  {
  $match:
    {
      "pop": {"$gt":25000}, 
      "_id.state": {"$in": ["CA", "NY"]}
    }
  },
  {
    $group: {
    "_id":null,
    avg: {"$avg": "$pop"}
  }}  
])

// homework 5.3

db.grades.aggregate([
  // unwind all scores to be a separate doc
  { "$unwind": "$scores" },
  // match only the quizes
  { "$match": {"scores.type":{"$ne": "quiz"}}},
  // group
  {$group:{"_id": {class_id: "$class_id",
            student_id: "$student_id"},
    avg_per_student: {"$avg": "$scores.score"}
  }},
  {$group: {"_id": "$_id.class_id",
      avg: {"$avg": "$avg_per_student"}
  }},
  {$sort: {"avg": -1}}
])


// homework 5.4
db.zips.aggregate([
    {$project: 
     {
       first_char: {$substr : ["$city",0,1]},
       pop:1
     }},
     {$match:{"first_char":{"$regex": "[0-9]"}}},
     {$group:{
       "_id":null,
       sum: {"$sum": "$pop"}
     }}
])
