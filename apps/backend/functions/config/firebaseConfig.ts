
import admin from 'firebase-admin';
const functions = require('firebase-functions');
import * as path from 'path';
require('dotenv').config();
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore(); // Initialize Firestore
export { admin, db };