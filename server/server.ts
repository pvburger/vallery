import express from 'express';
import { QueryRequest } from '../types';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
// import cors from 'cors';

export default function createServer() {
  const server = express();

  const PORT = 3333;

  // function to check if 'req.query.path' is valid type
  const reqIsValid = (inp: QueryRequest): boolean => {
    // any type other than a simple string is invalid in this case
    return typeof inp === 'string';
  };

  // server.use(cors());

  // parses JSON from incoming request
  server.use(express.json());

  // router for all valid endpoints
  server.get('/video', (req, res) => {
    const filePath = req.query.path;
    // no path parameter
    if (!reqIsValid(filePath)) {
      return res.status(400).send('Invalid path');
    }

    // filePath is known to be string at this point

    // make sure filePath is a valid path
    // this shouldn't be an issue at this point as the path is chosen with Electron's dialog.showOpenDialog method
    // the async version of existsSync (fs.exists) is deprecated
    if (!fs.existsSync(filePath as string)) {
      return res.status(404).send('File not found');
    }

    res.writeHead(200, { 'Content-Type': 'video/mp4' });
    fs.createReadStream(filePath as string).pipe(res);
  });

  // catch-all error handler
  server.use((req, res) => {
    res.status(404).send('Page not found');
  });

  // Global error handling middleware
  server.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });

  // Bind server to local host
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Video server listening on port: ${PORT}`);
  });
}
