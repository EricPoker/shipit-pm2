'use strict'

var utils = require('shipit-utils')

/**
 * Register PM2 tasks.
 * - pm2:run
 */

module.exports = function (shipit) {
  var _shipit = utils.getShipit(shipit)

  require('./init')(shipit)
  require('./update-interpreter')(shipit)
  require('./start-or-restart')(shipit)
  require('./cmd')(shipit)

  let tasks = [ 'pm2:init', 'pm2:cmd' ]
  utils.registerTask(shipit, 'pm2:run', tasks)

  _shipit.on('deploy', function () {
    _shipit.start('pm2:init')

    _shipit.on('pm2_inited', function () {
      _shipit.on('nvm_inited', function () {
        _shipit.on('updated', function () {
          _shipit.start('pm2:update-interpreter')
        })
      })

      _shipit.on('published', function () {
        _shipit.start('pm2:start-or-restart')
      })
    })
  })
}
