import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://huy2001:12345678x%40X@monopoly.cilavyo.mongodb.net/',
    options: {
      tlsAllowInvalidCertificates: true,
    },
  },
}));

