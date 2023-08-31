import User from '../models/User.js';
import { generateToken } from '../utils.js';

//Créer un nouvel utilisateur
export const register = async (req, res, next) => {
  // On crée un nouvel utilisateur (newUser)
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8), //Son mot de passe est crypté
  });

  const user = await newUser.save(); //Le nouvel utilisateur est enregistré dans la DB

  // L'utilisateur sera connecté en même temps(cette partie est très similaire à signin)
  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
};

//Verifier un compte
export const verifyAccount = async (req, res, next) => {};

//Se connecter
export const login = async (req, res, next) => {
  //req.body contient les valeurs envoyées à la base de donnée via l'api
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    // req.body.password: mot de passe saisi par l'user dans le formulaire de connexion
    // user.password: mot de passe saisi crypté qui se trouve déja dans la BD
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: 'Invalid emaillll or password' });
};

//Recupérer un utilisateur
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
    // res.status(501).json(err);
  }
};

//Modifier un utilisateur
export const updateProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not found' });
  }
};

//Mot de passe oublié (Grace à cette route, on envoie le mail dans la boite de l'utilisateur)
export const forgotPasswordUser = async (req, res, next) => {
  try {
    const oldUser = await User.findOne({ email: req.body.email }); //On recherche l'utilisateur ds la BD grace au mail qu'il a rentré
    //console.log(oldUser);

    // Voyons si cet utilisateur existe dans la BD
    if (!oldUser) {
      // return res.send("Cet Utilisateur n'existe pas!");
      return next(createError(400, "Cet Utilisateur n'existe pas"));
    }
    // Si l'user existe alors:
    else {
      const secret = process.env.JWT_SECRET + oldUser.password; //on cree une variable combinant JWT_SECRET et l'ancien mot de passe

      // Ensuite on crée un token contenat le mail et le id de l'utilisateur, il s'expire après 5 min
      const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
        expiresIn: '10m',
      });

      const link = `http://localhost:9000/api/users/reset-password/${oldUser._id}/${token}`; //C'est ce lien qu'on envoi dans la boite mail

      // NodeMailer
      var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'admin_mail', //Email Admin
          pass: 'password', //Mot de passe de l'email Admin
        },
      });

      var mailOptions = {
        from: 'admin_mail', //Email Admin
        to: oldUser.email, //Le mail qui reçoit le lien pour réinitialiser le mot de passe
        subject: 'Password Reseet',
        text: link, //Le lien envoyé
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(link);
    }
    res.send("L'utilsateur est:" + oldUser);
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};

//Mot de passe oublié (Celui ci est un get, il permet d'afficher l'émail de l'utilisateur et le formualire pour réinitailser)
export const resetPasswordGetUser = async (req, res, next) => {
  const { id, token } = req.params;
  //console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return next(createError(400, "Cet Utilisateur n'existe pas"));
  } else {
    const secret = process.env.JWT_SECRET + oldUser.password;

    // On vérifie si "secret" est valide
    try {
      const verify = jwt.verify(token, secret);
      res.render('index', { email: verify.email, status: 'verified' });
    } catch (error) {
      //console.log(error);
      res.send('Not Verified');
    }
  }
};

//Mot de passe oublié (Formulaire qui envoie le nouveau password)
export const resetPasswordPostUser = async (req, res, next) => {
  const { id, token } = req.params;

  const { password, confirm_password } = req.body; //On recupère les champs saisi par le user

  // On exécute le code à condition que les 2 mots de passe soient identique
  if (password === confirm_password) {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.send('User Not Exists!');
    } else {
      const secret = process.env.JWT_SECRET + oldUser.password;

      try {
        const verify = jwt.verify(token, secret);
        const encryptPassword = await bcrypt.hashSync(password, 8);
        await User.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              password: encryptPassword,
            },
          }
        );
        res.send('Bravo!!! La mise à jour du mot de passe est un succès');

        // index: c'est index.ejs (ejs est un template qui nous permet de créer une page html,css et js etant sur nodejs)
        res.render('index', { email: verify.email, status: 'verified' });
      } catch (error) {
        console.log(error);
        res.send("Quelque chose s'est mal passé");
        //app.use(express.urlencoded({ extended: false })); Si il y a erreur,Ecrire cette ligne dans index.js
      }
    }
  } else {
    //return next(createError(400, 'Les deux mots de passes sont différents '));
    res.send('Les deux mots de passes sont différents');
  }
};

//Créer un nouvel utilisateur
export const logout = async (req, res, next) => {};
