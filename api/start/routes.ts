/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import HistoryController from '#controllers/history_controller'
import SensorsController from '#controllers/sensors_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('v1/stations/:station/history/now', [HistoryController, 'now'])
router.get('v1/stations/:station/history/', [HistoryController, 'interval'])

// Get sensors and upload sensor data
router.post('v1/stations/:station/sensors/:sensor', [SensorsController, 'write'])
router.get('v1/stations/:station/sensors', [SensorsController, 'getAll'])
