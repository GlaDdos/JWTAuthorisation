'use strict';

import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import config from './config/main';
import router from './router';

const app = express();
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

mongoose.Promise = global.Promise;
mongoose.connect(config.database.url);;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

app.use(bodyParser.urlencoded( {extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Controll-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Controll-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Controll-Allow-Credentials", "true");
  next();
});

app.listen(config.port);
router(app);

console.log('Server is running');
