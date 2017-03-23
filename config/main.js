import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const config = {
  'database': {
    'url': 'mongodb://localhost:27017/jwtauth'
  },
  'port': process.env.PORT || 3000,
  'secret': 'secret passphrase'
}

export default config;
