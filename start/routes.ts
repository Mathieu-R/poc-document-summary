/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const HomeController = () => import('#controllers/home_controller')
const UploadsController = () => import('../app/controllers/uploads_controller.js')

router.get('/', [HomeController, 'index'])
router.post('/upload', [UploadsController, 'createSummary'])
