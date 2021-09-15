const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter = require('./routes/auth.router.js');

const tweetRouter = require('./routes/tweet.router.js')
const userRouter = require('./routes/user.router.js')
const dbConnection = require('./database/database.js')
dbConnection()

const app = express();

app.use(cors());
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.use('/api', authRouter);
app.use('/api', tweetRouter);
app.use('/api' , userRouter);


app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});