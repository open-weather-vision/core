/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import HistoryController from '#controllers/history_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/station/:station/history/now', [HistoryController, 'now'])
router.get('/station/:station/history/', [HistoryController, 'interval'])
