import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import config from '../config/main';
import User from '../models/user';

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080
  });
}

function setUserInfo(req) {
  return {
    _id: req._id,
    firstName: req.profile.firstName,
    lastName: req.profile.lastName,
    email: req.email,
    role: req.role
  };
}

const login = (req, res, next) => {
  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT' + generateToken(userInfo),
    userInfo: userInfo
  });
}

const register = (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  if(!email){
    return res.status(422).send({ error: 'You must eneter an email address.' });
  }

  if(!firstName || !lastName){
    return res.status(422).send({ error: 'You must enter your full name.' });
  }

  if(!password){
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) return next(err);

    if(existingUser){
      return res.status(422).send({ error: 'Thhis email address is already in use.' });
    }

    let user = new User({
      email: email,
      password: password,
      profile: { firstName: firstName, lastName: lastName }
    });

    user.save((err, user) => {
      if(err) return next(err);

      let userInfo = setUserInfo(user);
      res.status(201).json({
        token: 'JWT' + generateToken(userInfo),
        user: userInfo
      });
    });
  });
}

const roleAuthorization = (role) => {
  return (req, res, next) => {
    const user = req.user;

    User.findById(user._id, (err, foundUser) => {
      if(err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      if(foundUser.role == role){
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    });
  }
}

export default {
  login,
  register,
  roleAuthorization
}
