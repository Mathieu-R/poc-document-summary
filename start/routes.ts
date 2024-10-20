/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const HomeController = () => import('#controllers/home_controller')
const CreditsController = () => import('#controllers/credits_controller')
const UploadsController = () => import('../app/controllers/uploads_controller.js')

router.get('/', [HomeController, 'index'])
router.get('/login/github', [AuthController, 'store'])
router.get('/login/github/callback', [AuthController, 'callback'])

router
  .group(() => {
    router.get('/credits', [CreditsController, 'index'])
    router.get('/logout', [AuthController, 'logout'])
    router.post('/credits', [CreditsController, 'store'])
    router.post('/upload', [UploadsController, 'createSummary'])
  })
  .use(middleware.auth())
