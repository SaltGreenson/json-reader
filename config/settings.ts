import dotenv from 'dotenv';
import { CorsOptions } from 'cors';

dotenv.config();

// Cors settings
const cors: CorsOptions = {
  origin: [String(process.env.ORIGIN_URL)],
  methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'User-Agent',
    'Referer',
    'x-access-token',
    'x-locale',
  ],
};

// App settings
const app = {
  port: Number(process.env.PORT),
};

// File service settings
const file = {
  rootDir: String(process.env.UPLOAD_DIR),
  encryptedDir: String(process.env.ENCRYPTED_DIR),
};

const config = {
  cors,
  app,
  file,
};

export default config;
