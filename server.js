const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));

// Сервим статические файлы из корня
app.use(express.static(__dirname));

// И отдельно для /public
app.use('/public', express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 1111;

app.listen(port, function () {
  console.log(`Your app is listening on port ${port}`);
});
