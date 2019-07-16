require('dotenv').config();
const express = require ('express');
const morgan = require ('morgan');
const moviedex = require('./movie.json');

console.log(process.env.API_TOKEN);
const app = express();

const helmet = require('helmet');
const cors = require('cors');

 
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

app.get('/movie', function handleGetMovie(req, res){
  let response = moviedex;
  
  if (req.query.genre) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  if (req.query.country) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }
  if (req.query.avg_vote) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.avg_vote.toLowerCase().includes(req.query.avg_vote.toLowerCase())
    );
  }
  res.json(response);
  
});

app.listen(8080, ()=>{console.log('Server started on PORT 8080');
});