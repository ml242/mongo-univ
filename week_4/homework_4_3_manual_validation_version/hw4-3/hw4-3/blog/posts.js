/* The PostsDAO must be constructed with a connected database object */
function PostsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof PostsDAO)) {
        console.log('Warning: PostsDAO constructor called without "new" operator');
        return new PostsDAO(db);
    }

    // var posts = db.posts.ensureIndex({"date" : -1, "permalink" : 1, "tags" : 1});
    var posts = db.collection("posts");

    this.insertEntry = function (title, body, tags, author, callback) {
        "use strict";
        console.log("inserting blog entry" + title + body);

        // fix up the permalink to not include whitespace
        var permalink = title.replace( /\s/g, '_' );
        permalink = permalink.replace( /\W/g, '' );

        // Build a new post
        var post = {
                "title": title,
                "author": author,
                "body": body,
                "permalink": permalink,
                "tags": tags,
                "comments": [],
                "date": new Date()
            }

        // hw3.2
        posts.insert(post, function (err, result) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Inserted new post");
            callback(err, permalink);
        });
    }

    this.addComment = function(permalink, name, email, body, callback) {
        "use strict";

        var comment = {'author': name, 'body': body}

        if (email != "") {
            comment['email'] = email
        }

        // hw3.3 TODO
        posts.update({'permalink': permalink}, {'$push': {'comments': comment}}, function(err, numModified) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, numModified);
        });
    }

    
    // HOMEWORK 4.3 MAKE BLOG FAST

    // original get posts
    // Optimize this to use index.

    this.getPosts = function(num, callback) {
        "use strict";

        posts.find().sort('date', -1).limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " posts");

            callback(err, items);
        });
    }

    // Optimize this to use index.

    this.getPostsByTag = function(tag, num, callback) {
        "use strict";

        posts.find({ tags : tag }).sort('date', -1).limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " posts");

            callback(err, items);
        });
    }

    // Optimize this to use index.

    this.getPostByPermalink = function(permalink, callback) {
        "use strict";
        posts.findOne({'permalink': permalink}, function(err, post) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, post);
        });
    }


}

module.exports.PostsDAO = PostsDAO;
