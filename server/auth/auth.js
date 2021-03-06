const User = require('../models').User
const Node = require('../models').Node
const Notification = require('../models').Notification

module.exports = {

  login (req, res) {
    return User
      .findOne({ where:
      {
        password: req.body.password,
        email: req.body.email
/*
        $or: [
          { username: req.body.username },
          { email: req.body.email }
        ]
*/
      },
        include:
        [{
          model: Node,
          as: 'nodes'
        },
/*
        {
          model: Notification,
          as: 'notifications',
          where: {
            dismissed: false
          },
          required: false // fix issue where above where clause caused
        }    
*/             // user to not be returned from findOne query
        ],
        order: [
          [
              {model: Node, as: 'nodes'},
            'id'
          ],
/*
          [
              {model: Notification, as: 'notifications'},
            'id',
            'DESC'  // put newest notifications at the beginning of the list
          ]
*/
        ]
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'Invalid login credentials provided'
          })
        }
        user.password = null // don't send password back to client
        res.status(200).send(user)
      })
      .catch((error) => res.status(400).send(error))
  },

  validate (req, res, next) {
    return User
      .findOne({ where:
      {
        api_token: req.body.api_token || req.headers.authorization
      },
        include: [{
          model: Node,
          as: 'nodes'
        }],
        order: [
          [
              {model: Node, as: 'nodes'},
            'id'
          ]
        ]
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'Invalid API token provided'
          })
        }
        // console.log(user)
        req.user = user
        return next()
      })
      .catch(next)
  },

  validateLogin (req, res, next) {
    return User
      .findOne({ where:
        { api_token: req.cookies.token },
        include: [{ model: Node, as: 'nodes' }],
        order: [[{model: Node, as: 'nodes'}, 'id']]
      })
      .then(user => {
        req.user = user
        return next()
      })
      .catch(next)
  }

}
