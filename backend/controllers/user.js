const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

sgMail.setApiKey("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");
sgMail.setSubstitutionWrappers("{{", "}}");

exports.createUser = (req,res,next) => {
    bcrypt.hash(req.body.password, 10).then(hash=> {
    const user = new User({
        email: req.body.email,
        password: hash,
        fName: req.body.fName,
        lName: req.body.lName
    });
    user
    .save()
        .then(result => {
            res.status(201).json({
                code: 201,
                message: 'User created!',
                result: result
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

exports.login = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed"
          });
        } 
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          'jwt_secret'
        );
        res.status(200).json({
          token: token,
          _id: fetchedUser._id,
          fName: fetchedUser.fName,
          lName: fetchedUser.lName
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Auth failed"
        });
      });
  }

  exports.editUserDetails = (req, res, next) => {
    var name = req.body.name;
    var gender = req.body.gender
    
    User.findById(req.userData.userId, function (err, user) {
      if (!user) {
        res.status(500).json({code: 500,error: err});
      }
      user.name = name;
      user.gender = gender;
      user.save()
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

  exports.postReset = (req, res, next) => {
    const token = crypto.randomBytes(16).toString('hex');
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res
            .status(409)
            .json({
              message: "User not found"
          });
        }
        fetchedUser = user;
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        const msg = {
          to: req.body.email,
          from: {
            email: 'info@apperfect.co',
            name: 'YTWorkouts'
          },
          templateId: 'd-bc70b464f5fe46219a5488456de7c658',
          dynamic_template_data: {
            subject: 'YTWorkouts Password Reset',
            token: `http://ytworkouts/reset-password/${token}`,
          },
        };
        sgMail.send(msg, (err) => {
            if(err){
              console.log("Error", err);
              res.status(500).json({
                message: "Unable to send email"
              });
            } else{
              res.status(201).json({
                message: "Password Reset Successful"
              });
            }
          }).catch(err => {
              res.status(500).json({
                message: "Unable to send email"
              });
          });
        });
    }
  
    exports.changePassword = (req, res, next) => {
  
      const token = req.body.token;
      const password = req.body.password;
      let fetchedUser;
  
      User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
      })
      .then(user => {
        if (!user) {
          console.log('not found or token expired');
          return res
          .status(409)
          .json({
            message: "User not found or token expired"
          });
        }
        fetchedUser = user;
        return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
          fetchedUser.password = hashedPassword;
          fetchedUser.resetToken = undefined;
          fetchedUser.resetTokenExpiration = undefined;
          return fetchedUser.save();
        })
        .then(result => {
          res.status(200).json({
            message: 'password changed successfully',
          });
        })
        .catch(err => {
          console.log(err);
        });
    };