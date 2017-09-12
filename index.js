var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(function(err, req, res, next) {
  if (err.status === 400) {
    res.status(400).json({
      "error": "Could not decode request: JSON parsing failed"
    });
  } else {
    res.status(err.status).send(err.message);
  }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){ 
  res.render('pages/index');
});

app.post('/', function(req, res) {
  if (req.body.payload){
    var requestArray = req.body.payload
    var responseArray = { response: [] }
      for (var i = 0; i < requestArray.length; i++){
        var payload = requestArray[i]
        if (payload.drm == true && payload.episodeCount > 0){
          responseArray.response.push({
            image: payload.image.showImage,
            slug: payload.slug,
            title: payload.title
          })
        }
      }
      res.send(responseArray) 
  }
  else {
    res.json({
      "error": "Request needs a payload key"
    })
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
