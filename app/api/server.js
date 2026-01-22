const express = require('express');
const app = express();
const { port } = require('./config/config');
const trackingRoutes = require('./routes/trackingRoutes');

app.use(express.json());
app.use('/api', trackingRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});