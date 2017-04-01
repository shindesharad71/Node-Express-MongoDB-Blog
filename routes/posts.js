var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
  var categories = db.get('categories');

  categories.find({}, {}, function(err, categories){
      res.render('addpost', {
      title: 'Add Post',
      'categories': categories
    });
  });
  
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  // Get form values
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
 // 
  var author = req.body.author;
  var date = new Date();

  if(req.file){
    var mainimage = req.file.filename;
  } else {
    var mainimage = 'no-image.jpg';
  }

  // Form Validation
  req.checkBody('title', 'Title should not empty').notEmpty();
  req.checkBody('body', 'Body should not empty').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if(errors)
  {
    res.render('addpost', {
      "errors": errors 
    });
  }
  else
  {
    var posts = db.get('posts');
    posts.insert({
      "title": title,
      "body": body,
      "category": category,
      "author": author,
      "date": date,
      "mainimage": mainimage
    }, function(err, post){
      if(err) {
        res.sennd(err);
      } else {
        req.flash('succes', 'Post Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
