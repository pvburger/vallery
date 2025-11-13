import express from 'express';
import { QueryRequest, VideoStats } from '../types';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
// import cors from 'cors';

export default function createServer() {
  const server = express();

  // hardcoded port
  const PORT = 3333;

  // function to return object with video stats based on request header string
  const getVidStats = (inpPath: string, inpRange: string): VideoStats => {
    try {
      const result = new VideoStats();

      // this could be implemented asynchronously
      const vStats = fs.statSync(inpPath);

      const startIdx = inpRange.indexOf('=') + 1;
      const endIdx = inpRange.indexOf('-') + 1;
      result.duration = vStats.size;

      if (endIdx === startIdx + 1) {
        // using a negative index; eg, bytes=-500
        result.start = result.duration - parseInt(inpRange.slice(endIdx), 10);

        // should be a normal end with start and end; eg, bytes=0-500
      } else {
        result.start = parseInt(inpRange.slice(startIdx, endIdx), 10);
      }

      result.end = vStats.size - 1;

      return result;
    } catch (err) {
      console.log(`There was a problem retrieving video information: ${err}`);
      return new VideoStats();
    }
  };

  // server.use(cors());

  // parses JSON from incoming request
  server.use(express.json());

  // router for all valid endpoints
  server.get('/video', (req, res) => {
    const filePath = req.query.path;
    const range = req.headers.range;

    // type check
    if (typeof filePath !== 'string' || !range) {
      return res.status(400).send('Invalid path');
    }

    // filePath is known to be string at this point

    // make sure filePath is a valid path
    // this shouldn't be an issue at this point as the path is chosen with Electron's dialog.showOpenDialog method
    // the async version of existsSync (fs.exists) is deprecated
    if (!fs.existsSync(filePath as string)) {
      return res.status(404).send('File not found');
    }

    // added for development
    console.log(`Range value: ${req.headers.range}`);

    // added for development
    console.log('Range specified');
    const vidStats = getVidStats(filePath as string, range);
    if (
      vidStats.start === null ||
      vidStats.end === null ||
      vidStats.duration === null
    ) {
      // added for development
      console.log(`Invalid range...`);
      res.writeHead(200, { 'Content-Type': 'video/mp4' });
      return fs.createReadStream(filePath as string).pipe(res);
    } else {
      res.writeHead(206, {
        'Content-Range': `bytes ${vidStats.start}-${vidStats.end}/${vidStats.duration}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': vidStats.end - vidStats.start + 1,
        'Content-Type': 'video/mp4',
      });
      return fs
        .createReadStream(filePath as string, {
          start: vidStats.start,
          end: vidStats.end,
        })
        .pipe(res);
    }
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
