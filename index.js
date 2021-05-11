const path = require('path');
var express = require('express');
var app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/clicker'))

app.listen(port, ()=> {
    console.log("Server listening on port: " + port);
});