// Import packages
const express = require("express");
const home = require("./routes/home");
const routes = require('./src/routes');
// Middlewares
const app = require("./app");

// const app = express();
app.use(express.json());


// Routes
app.use("/home", home);
app.get('/', (req, res) => res.send(`api - v1`))

app.use('/api/v1', routes)
// connection
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Listening to port ${port}`));
