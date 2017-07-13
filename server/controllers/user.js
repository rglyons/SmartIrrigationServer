const User = require('../models').User;
const Node = require('../models').Node;
const randomstring = require("randomstring")

module.exports = {
  create(req, res) {
    return User
      .create({
        username: req.body.username,
        password: req.body.password,
        nodeCount: 0,
      })
      .then(user => {
          user.password = null 
          res.status(201).send(user)
        }
      )
      .catch(error => res.status(400).send(error));
  },
    
  getUser(req, res) {
    response = {}
    response["id"] = req.user.id
    response["username"] = req.user.username
    response["nodeCount"] = req.user.nodeCount
    response["nodes"] = req.user.nodes
    return res.status(200).send(response);
  },
  
  generateApiToken(req, res) {
    return req.user
      .update({
        api_token: randomstring.generate(30)
      })
      .then(() => {
        user.password = null 
        res.status(200).send(user)  // Send back the updated user.
      })
      .catch((error) => res.status(400).send(error));
  },
  
  update(req, res) {
    return req.user
      .update({
        password: req.body.password || user.password,
        username: req.body.username || user.username,
      })
      .then(() => res.status(200).send(user))  // Send back the updated user.
      .catch((error) => res.status(400).send(error));
  },
  
  destroy(req, res) {
    return req.user
      .destroy()
      .then(() => res.status(204).send())
      .catch(error => res.status(400).send(error));
  }  
};