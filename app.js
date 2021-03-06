const express = require('express'),
	path = require('path'),
	//favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	flash = require('express-flash'),
	expressValidator = require('express-validator'),
	passport = require('passport');

/*
* Load Routes
*/

var index = require('./routes/index'),
	lang = require('./routes/lang'),
	project = require('./routes/project'),
	projects = require('./routes/projects'),
	auth = require('./routes/auth'),
	profile = require('./routes/profile'),
	admin = require('./routes/admin');

//Create express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/*
* Middleware
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//parses forms
app.use(bodyParser.urlencoded({ extended: false }));
//parses cookies
app.use(cookieParser());
//Display flash messages
app.use(flash());
//Everything in the public folder can be requested directly
app.use(express.static(path.join(__dirname, 'public')));
//Form Validation
app.use(expressValidator(
{
	customValidators: {
		isArray: function(value){
			return Array.isArray(value);
		},
		between(value,min,max)
		{
			return (parseInt(value) >= min && parseInt(value) <= max);
		}
	},
	customSanitizers: {
		escapeAndTrim(what)
		{
			//escape code
			what = what.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\\/g, '&#x5C;').replace(/`/g, '&#96;');
			var idx = what.length - 1, pattern = new RegExp("/\s/");
			while (idx >= 0 && pattern.test(what[idx]))
			{
				idx--;
			}

			what = idx < what.length ? what.substr(0, idx + 1) : what;
			return what.replace(/^\s+/g, '');
		}
	}
}));
//Express session handling
app.use(session({secret:"WhyNot",saveUninitialized:false,resave:false,signed:true}));
//Use passport
app.use(passport.initialize());
//Passport session manager
app.use(passport.session());

app.use(function(req, res, next)
{
	res.locals.user = req.user;
	next();
});

/*
* Routes
*/

app.use('/', index);
app.use('/lang', lang);
app.use('/project', project);
app.use('/projects', projects);
app.use('/auth', auth);
app.use('/profile', profile);
app.use('/admin', admin);
app.get('/login', function(req,res)
{
	if(req.user)
		res.redirect('/profile');
	else
		res.redirect('/auth/google');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;