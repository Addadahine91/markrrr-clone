const Snippet = require('../models/snippet');
const e = require('express');

exports.createSnippet = (req,res,next) => {

    const content = req.body.content;
    console.log(content);

    const snippet = new Snippet({
        content: content,
        user: req.userData.userId,
      });
      snippet
      .save()
      .then(uploaded => {

        res.status(201).json({
            id: uploaded._id
        });
      }).catch(err => {
        res.status(500).json({
            code: 500,error: err
        });
        console.log(err);
      })
}

exports.getSnippet = (req, res, next) => {
  Snippet.findById(req.params.id).then(snippet => {
    if (snippet) {    
      res.status(200).json(snippet);
    } else {
      res.status(404).json({ message: "Snippet not found!" });
    }
  });
}

exports.getSnippets = (req, res, next) => {
    let query = {};
    query = Snippet.find({"user" : req.userData.userId})
    .sort({"_id": -1})
      .then(snippets => {
        res.status(200).json({
          message: "Snippets fetched successfully!",
          snippets: snippets,
        });
    }).catch((err) => {
      res.status(500).json({
          code: 500,error: err
      });
    });
  }

  exports.editSnippet = (req, res, next) => {
    var content = req.body.content;
    
    Snippet.findById(req.body.id, function (err, snippet) {
      if (!snippet) {
        res.status(500).json({code: 500,error: err});
      }
      snippet.content = content;
      snippet.save()
      .then(result => {
        res.status(201).json({
          code:201,
          message:'saved',
          result:result
        });
      })
      .catch(err => {
        res.status(500).json({
            code: 500,
            error: err
        });
    });
  });
  }

  exports.deleteSnippet = (req, res, next) => {
    Snippet.deleteOne({ _id: req.params.id })
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Deletion successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Deleting offer failed!"
        });
      });
  }

