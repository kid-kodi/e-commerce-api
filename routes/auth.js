import express from 'express';
import {
  register,
  login,
  verifyAccount,
  getProfile,
  updateProfile,
  forgotPasswordUser,
  resetPasswordGetUser,
  resetPasswordPostUser,
  logout,
} from '../controllers/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: le nom de l'utilisateur
 *         lastName:
 *           type: string
 *           description: le prénom de l'utilisateur
 *         telephone:
 *           type: string
 *           description: le telephone de l'utilisateur
 *         email:
 *           type: string
 *           description: l'adresse email de l'utilisateur
 *         password:
 *           type: string
 *           description: le mot de passe de l'utilisateur
 *         isAdmin:
 *           type: boolean
 *           default: false
 *           description: definit si l'utilisateur est un admin ou pas
 *         createdAt:
 *           type: timestamps
 *           format: date
 *           description: La date d'enregistrement de l'utilisateur
 *         updatedAt:
 *           type: timestamps
 *           format: date
 *           description: La date de dernière modification des informations de l'utilisateur
 *       example:
 *         _id: d5fE_asz
 *         firstName: Konan
 *         lastName: Brou aya
 *         telephone: 02909018
 *         email: baya@gmail.com
 *         password: 12345
 *         isAdmin: true
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: la gestion de l'API de l'authentifcation
 * /api/auth:
 *   post:
 *     summary: Enregistrement d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: retourne l'utilisateur créer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Des erreurs du serveur
 *
 */

router.post('/register', register);

router.get('/verifyAccount', verifyAccount);

router.post('/login', login);

router.get('/getProfile/:id', getProfile);

router.put('/updateProfile', updateProfile);

//Mot de passe oublé
router.post('/forgotPassword', forgotPasswordUser);

//Mot de passe oublié (Celui ci est un get, il permet d'afficher l'émail de l'utilisateur et le formualire pour réinitailser)
router.get('/resetPassword/:id/:token', resetPasswordGetUser);

//Mot de passe oublié (Formulaire qui envoie le nouveau password)
router.post('/resetPassword/:id/:token', resetPasswordPostUser);

router.post('/logout', logout);

export default router;
