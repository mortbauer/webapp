# React-Redux-Flask #

Boilerplate application for a Flask JWT Backend and a React/Redux Front-End with Material UI. 

* Python 2.7
* Pytest
* Heroku
* Flask
* React
* Redux
* React-Router 2.0
* React-Router-Redux
* Babel 6
* SCSS processing
* Webpack

![screenshot](http://i.imgur.com/ZIS4qkw.png)

# Todos

* security/websockets use Content-Security-Policy in production

  see: [Websockets the elephant in the room](https://gist.github.com/subudeepak/9897212)

  for the express server the following middleware did the trick:

  ```javascript
  app.use(function(req,res,next){
      res.setHeader("Content-Security-Policy", "connect-src 'self'");
      next();
  });
  ```

### Create DB
```sh
$ alembic init
$ alembic revision --autogenerate -m "init"
$ alembic upgrade head
```

### Run Back-End

```sh
$ python watcher.py
```

### Test Back-End

```sh
$ python test.py --cov-report=term --cov-report=html --cov=application/ tests/
```

### Run Front-End

```sh
$ cd static
$ npm install
$ npm start
```


### Build Front-End

```sh
$ npm run build:production
```
