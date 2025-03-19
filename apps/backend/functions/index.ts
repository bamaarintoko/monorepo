import app from './core/app';
import dotenv from 'dotenv';
import * as functions from 'firebase-functions';
import express from 'express';

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.STANDALONE === 'true') {
	// Running as a standalone Express server
	app.listen(PORT, () => {
		console.log(`🚀 Server is running on http://localhost:${PORT}`);
	});
} else {
	exports.api = functions.https.onRequest(app);
	// exports.api = functions.https.onRequest(app as unknown as (req: functions.Request, res: functions.Response) => void);
}