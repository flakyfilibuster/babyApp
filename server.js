var express = require('express');
var app = express();
var multer  = require('multer');
//var levelup = require('levelup');
//var db = levelup('./mydb');
var WebSocket = require('ws').Server;

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(multer({ dest: './uploads/'}));
app.set('views', './views');
app.set('view engine', 'jade');

// variables needed for timers
var dateStart,
    dateEnd,
    minutes,
    timeSinceLastMeal,
    timePassed

// utility function for levelDB retrieval
function findAll(input, order, cbSuccess, cbError) {
  var result = [],
      re = new RegExp(input);
      order = "reverse" ? true : false;
  db.createReadStream({reverse: order})
    .on('error', function() {
      cbError();
    })
    .on('data', function(data) {
      if(data.key.match(re)) {
        result.push(data);
      }
    })
    .on('end', function() {
      cbSuccess(result);
    });
}

function calcTimePassed(start, end) {
  var temp = secs = Math.floor((end.valueOf() - start.valueOf()) / 1000),
      hours = Math.floor(secs/3600),
      mins = Math.floor((temp %= 3600) / 60);

  return {hours: hours,
          mins: mins,
          secs: secs};
}

app.get('/', function (req, res) {
  res.redirect(301, '/meals');
});

app.use('/temp', require('./routes/temp.js'));

app.post('/addDiaper', function(req, res) {
  var diaperTime = new Date(Date.now());

  var diaperInfo  = {
    diaperTime : diaperTime.valueOf(),
    type: req.body.form
  };

  res.render('diaperTr', diaperInfo);

  db.put('diaper-' + diaperTime.valueOf(), JSON.stringify(diaperInfo));
})

// DIAPER route
app.get('/diaper', function (req, res) {
  findAll('diaper-', 'reverse', function(diapers) {
    res.render('diaper', {
      title: 'Line babyApp',
      message: 'Diapers',
      dateStart: dateStart,
      data: diapers
    });
  })
});

// MEALS route
app.get('/meals', function (req, res) {
  findAll('meal-', 'reverse', function(meals) {
    var lastMeal = JSON.parse(meals[0].value).dateEnd,
        timeSinceLastMeal = calcTimePassed(new Date(lastMeal), new Date(Date.now()));

    res.render('index', {
      title: 'Line babyApp',
      message: 'Meals',
      dateStart: dateStart,
      timeSinceLastMeal: timeSinceLastMeal,
      data: meals
    });
  })
});


app.get('/start', function(req, res) {
  dateStart = dateStart || new Date(Date.now());

  var timesOfMeal = {
    dateStart: dateStart.valueOf(),
    dateEnd: "no end yet",
    total: "..."
  };

  res.render('tr', timesOfMeal);

  db.put('meal-' + dateStart.valueOf(), JSON.stringify(timesOfMeal));
});


app.get('/stop', function(req, res) {

  //calculate minutes from start to end
  var dateEnd = new Date(Date.now());

  minutes = calcTimePassed(dateStart, dateEnd).mins;

  var timesOfMeal = {
    dateStart: dateStart.valueOf(),
    dateEnd: dateEnd.valueOf(),
    total: minutes
  };

  res.render('tr', timesOfMeal);

  db.put('meal-' + dateStart.valueOf(), JSON.stringify(timesOfMeal));

  //reset both start and end time
  dateStart = dateEnd = undefined;
});


var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Listening at http://%s:%s', host, port)
});


// WEBSOCKET Games
var wss = new WebSocket({server: server});

wss.on('connection', function(ws) {
  var id = setInterval(function() {
      ws.send(JSON.stringify({type: 'status', msg: 'connection established'})), function() { };
    }, 1000);

  console.log('started client interval');

  setTimeout(function() {
    ws.send(JSON.stringify({type: 'data', msg: 'the eagle has landed!'}), function() {})
  }, 3000)

  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);
  });
});
