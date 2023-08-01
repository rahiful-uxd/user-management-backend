const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./service.json');
const pool = require('./components/mysql');
const compression = require('compression');

app.use('/uploads', express.static('./uploads'));

const user = require('./apis/user/user');

app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.use('/user', user)

app.listen(config.port, () => {
    console.log(`Server running on ${config.urls + config.port}`)
})

module.exports = app;
