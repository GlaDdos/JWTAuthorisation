import express from 'express';
import passport from 'passport';

import AuthenticationController from './controllers/authentication';
import passportService from './config/passport';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default function(app){
  const apiRoutes = express.Router();
  const authRoutes = express.Router();

  apiRoutes.use('/auth', authRoutes);
  authRoutes.post('/register', AuthenticationController.register);
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  app.use('/api', apiRoutes);
};
