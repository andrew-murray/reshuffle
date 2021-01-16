const express = require('express');
const path = require('path');
const app = express();

app.use("/reshuffle", express.static(path.join(__dirname, 'build')));

app.get('/reshuffle', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);
