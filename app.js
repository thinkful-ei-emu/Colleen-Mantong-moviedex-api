require('dotenv').config();
const express = require ('express');
const morgan = require ('morgan');
const helmet = require('helmet');
const cors = require('cors');
const moviedex = require('./movie.json');
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
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
    response = response.filter(movie => {
      return movie.avg_vote >= Number(req.query.avg_vote);
     
    }
    );
  }
  if(Number(req.query.avg_vote) < 0 || Number(req.query.avg_vote) > 10 || !Number(req.query.avg_vote) ){
    return res.status(400).json({error: 'avg_vote query must be a number between 0 and 10'})
  }
  res.json(response);
  
});

const PORT = process.env.PORT || 9000
app.listen(PORT, ()=>{console.log(`Server started on PORT ${PORT}`);
});