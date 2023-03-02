import MainServer from './app';
const obj = new MainServer();
obj.initialize();


// const express = require('express');
// const app = express();
// const server = app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

// // Stop server after 10 minutes (600000 milliseconds)
// const timeout = setTimeout(() => {
//   server.close(() => {
//     console.log('Server stopped');
//   });
// }, 600000);

// Stop server after 10 minutes (600000 milliseconds)
// const timeout = setTimeout(() => {
//     server.close(() => {
//       console.log('Server stopped');
//     });
//   }, 600000);
  
//   // Stop server immediately if user hits the /stop route
//   app.get('/stop', (req, res) => {
//     clearTimeout(timeout);
//     server.close(() => {
//       console.log('Server stopped');
//       res.send('Server stopped');
//     });
//   });
  