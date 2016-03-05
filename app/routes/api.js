
var User = require('../../app/models/user'),
    Product = require('../../app/models/product'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    config = require('../../config'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    Grid = require('gridfs-stream'),

    // super secret for creating tokens
    superSecret = config.secret;

module.exports = function(app,express){

  var apiRouter = express.Router();

  var Schema = mongoose.Schema;
  mongoose.createConnection('mongodb://localhost:27017/filesupl');
  var conn = mongoose.connection;

  apiRouter.post('/authenticate', function(req,res){
    //Find user. Проверяем имя пользователя и пароль отдельно
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user){
      if(err){
        throw(err);
      }
      //Check user
      if(!user){
        res.json({success: false, message: "Authentication failed. User not found"});
      } else if(user){
        //Check password
        var validPassword = user.comparePassword(req.body.password);
        if(!validPassword){
          res.json({success: false, message: "Authentication failed. Wrong password"});
        }
        //If everything OK:
        else {
          var token = jwt.sign({
            name: user.name,
            username: user.username},
            superSecret, {expiresIn: 86400});

          res.json({
            success: true,
            message: "Enjoy your token",
            token: token
          });
        }
      }
    });
  });

  //register new user
  apiRouter.post('/register', function(req,res){
    //Find user. Проверяем имя пользователя
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user){
      if(err){
        throw(err);
      }
      //Check user
      if(user){
        res.json({success: false, message: "Register failed. This user is already registered"});
      }
      //If everything OK:
      else {
        var registerUser = new User();

				registerUser.name = req.body.name;
				registerUser.username = req.body.username;
				registerUser.password = req.body.password;

				registerUser.save();

        res.json({
          success: true,
          message: "Registered"
        });

      }
    });
  });

  apiRouter.use(function(req,res,next){
    console.log("Somebody just came to our app!");
    //middleware

    //Checking token middleware
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
      jwt.verify(token, superSecret, function(err, decoded){
        if (err) {
          return res.status(403).send({
            success: false,
            message: "Failed to authenticate token"});
        }
        else {
          req.decoded = decoded;
          next();
        }
      });
    }
    else {
      return res.status(403).send({
        success: false,
        message: "No token provided"
      });
    }

  });

  apiRouter.get('/', function(req,res){
    res.json({ message: "Hooray! Welcome to our API!" });
  });

  apiRouter.route('/users')
  //create user on POST request to "localhost:8080/api/user"
  .post(function(req,res){
      var user = new User();
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      user.save(function(err){
        if(err){
          //duplicate entry
          if (err.code == 11000){
            return res.json({success: false, message: "A user with that username already exists"});
          }
          else {
            return res.send(err);
          }
        }
        res.json({message: "User created"});
      });
  })
  //Get all users
  .get(function(req, res){
    User.find(function(err,users){
      if(err){
        return res.send(err);
      }
      else {
        res.json(users);
      }
    });
  });


  //Getting single user by id

  apiRouter.route('/users/:user_id')
  .get(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if(err){
        res.send(err);
      }
      else {
        res.json(user);
      }
    });
  })
  .put(function(req, res){
    User.findById(req.params.user_id, function(err,user){
      if(err){
        res.send(err);
      }
      /*Блок с тремя if нуждается в дополнительной проверке на совпадение строк
      и защиту от ввода пустой строки(null), чтобы не запускать лишних
      обновлений строк
      user.save рекомендуется запустить после проверки на вышеуказанные условия,
      Добавить доп.информацию, к этому комментраию, если данные проверки будут
      осуществлены во фронтенде
      */
      if(req.body.name !== user.name){
        user.name = req.body.name;
      }
      if(req.body.username !== user.username){
        user.username = req.body.username;
      }
      if(req.body.password !== user.password){
        user.password = req.body.password;
      }

      user.save(function(err) {
      if(err){
        res.send(err);
      }
      else {
        res.json({message: "User updated!"});
      }
      });
    });
  })
  .delete(function(req,res){
    User.remove({_id: req.params.user_id}, function(err,user){
      if(err){
        res.send(err);
      }
      else {
        res.json({message: "Successfully deleted!"});
      }
    });
  });

  apiRouter.get('/me', function(req,res){
    res.send(req.decoded);
  });

  apiRouter.route('/products')
  //create product on POST request to "localhost:8080/api/products"
  .post(function(req,res){
      var product = new Product();
      product.title = req.body.title;
      product.description = req.body.description;
      product.imgsrc = req.body.imgsrc;
      product.price = req.body.price;

      product.save(function(err){
        if(err){
          //duplicate entry
          if (err.code == 11000){
            return res.json({success: false, message: "A product with that username already exists"});
          }
          else {
            return res.send(err);
          }
        }
        res.json({message: "product created"});
      });
  })
  //Get all products
  .get(function(req, res){
    Product.find(function(err,products){
      if(err){
        return res.send(err);
      }
      else {
        res.json(products);
      }
    });
  });

  //Getting single product by id
  apiRouter.route('/products/:product_id')
  .get(function(req, res){
    Product.findById(req.params.product_id, function(err, product){
      if(err){
        res.send(err);
      }
      else {
        res.json(product);
      }
    });
  })
  .delete(function(req,res){
    User.remove({_id: req.params.product_id}, function(err,product){
      if(err){
        res.send(err);
      }
      else {
        res.json({message: "Successfully deleted!"});
      }
    });
  });

  //Catch orders
  apiRouter.route('/orders')
  .post(function(req,res){
    var order = {};
    order.orderedProducts = req.body.orderedProducts;
    order.sumTotal = req.body.sumTotal;
    order.user = req.body.user;
    console.log("products" + order.orderedProducts);
    console.log("with total sum" + order.sumTotal);
    console.log("ordered by" + order.user);
  });

  return apiRouter;
};
