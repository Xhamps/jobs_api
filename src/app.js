const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const {sequelize} = require('./model');
const contractssRoutes = require('./routes/contracts');
const jobsRoutes = require('./routes/jobs');
const balancesRoutes = require('./routes/balances');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(contractssRoutes);
app.use(jobsRoutes);
app.use(balancesRoutes);
app.use(adminRoutes);

module.exports = app;
