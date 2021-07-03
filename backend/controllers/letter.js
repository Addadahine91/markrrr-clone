const Letter = require('../models/letter');
const e = require('express');

exports.createLetter = (req,res,next) => {

    const company = req.body.company;
    const title = req.body.title;
    const link = req.body.link;
    const lastModified = Math.floor(Date.now());

    const letter = new Letter({
        company: company,
        title: title,
        link: link,
        user: req.userData.userId,
        lastModified: lastModified
      });
      letter
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

exports.getLetter = (req, res, next) => {
  Letter.findById(req.params.id).then(letter => {
    if (letter) {    
      res.status(200).json(letter);
    } else {
      res.status(404).json({ message: "Letter not found!" });
    }
  });
}

exports.getLetters = (req, res, next) => {
    let query = {};
    query = Letter.find({"user" : req.userData.userId})
    .sort({"_id": -1})
      .then(letters => {
        res.status(200).json({
          message: "Letters fetched successfully!",
          letters: letters,
        });
    }).catch((err) => {
      res.status(500).json({
          code: 500,error: err
      });
    });
  }

  exports.editLetter = (req, res, next) => {
    var company = req.body.company;
    var title = req.body.title;
    var body = req.body.body;
    var id = req.body.id;
    var link = req.body.link;
    const lastModified = Math.floor(Date.now());
    
    console.log(body);
    Letter.findById(id, function (err, letter) {
      if (!letter) {
        res.status(500).json({code: 500,error: err});
      }
      letter.company = company;
      letter.title = title;
      letter.body = body;
      letter.lastModified = lastModified;
      letter.link = link;
      letter.save()
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

  exports.deleteLetter = (req, res, next) => {
    Letter.deleteOne({ _id: req.params.id })
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

