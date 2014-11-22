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

