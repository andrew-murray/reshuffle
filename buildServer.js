const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use("/reshuffle", express.static(path.join(__dirname, 'build')));

app.get('/reshuffle/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});
