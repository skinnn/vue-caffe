const passport = require('passport')
const User = require('../models/User')
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const Login = require('../models/Login')


// Sign user
function jwtSignUser(user) {
  // Token expires in 1h
  const ONE_HOUR = 60 * 60 * 24
  return jwt.sign(user, config.authentication.jwtSecret, {
    // expiresIn: ONE_HOUR
  })
}

module.exports = {

	async newLogin(req, res) {
		try {
			const userRes = await Admin.find({username: req.body.username})

			if (userRes && userRes.length > 0) {
				const user = userRes[0]
				console.log('U: ', user)
				// TODO: Create login record
				const userJson = JSON.stringify(user)
				const token = jwtSignUser(userJson)
				const login = new Login({
					user: user.id,
					username: user.username,
					password: user.password,
					token
				})

				login.save((err) => {
					if (err) console.error(err)
					else {
						Login.find({}, (err, logins) => {
							if (err) console.error(err)
							else {
								let check = logins[0]
								let filtered = logins.filter(login => login.token !== check.token)
								console.log('All login records:', filtered)
								user.token = token
								res.setHeader('Content-Type', 'application/json')
								res.json(user)
							}
						})
					}
				})
			}

			// const login = {
				
			// }
			// await Login.save(login, (err) => {
			// 	if (err) {
			// 		console.log(err)
			// 	} else {
			// 		res.status(201).send({
			// 			user: user,
			// 			token: jwtSignUser(adminJson),
			// 			success: 'Logged in successfully.'
			// 		})
			// 	}
			// })
		
		} catch (err) {
			console.error(err)
		}
	},

  // User Register
  async registerUser(req, res) {
    try {
      // console.log('FILE', req.file)
      // console.log('BODY', req.body.userMenu.tables)
      const username = req.body.userUsername
      const password = req.body.userPassword
      const password2 = req.body.userPassword2
      const name = req.body.userName
      const telephone1 = req.body.userTelephone1
      const telephone2 = req.body.userTelephone2
      const address = req.body.userAddress
      const note = req.body.userNote

      // const isTable = req.body.isTables

      let image = ''
      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        image = req.file.path
      }
      const createdBy = {
        id: req.body.createdBy.id,
        name: req.body.createdBy.name,
        username: req.body.createdBy.username
      }

      // TODO: Fix User privileges
      // Create user menu
      const userMenu = [
        {
          'warehouse': req.body.userMenu.warehouse,
          'title': 'Warehouse',
          'icon': 'storage',
          'route': '/user/warehouse'
        },
        {
          'tables': req.body.userMenu.tables,
          'title': 'Tables',
          'icon': 'view_carousel',
          'route': '/user/tables'
        },
        {
          'home': req.body.userMenu.home,
          'title': 'Home',
          'icon': 'home',
          'route': '/user/home'
        }
      ]

      const newUser = new User({
        username: username,
        password: password,
        name: name,
        telephone1: telephone1,
        telephone2: telephone2,
        address: address,
        note: note,
        userMenu: userMenu,
        createdBy: createdBy,
        image: image
      })
      await User.createUser(newUser, function(err, user) {
        if (err) {
          console.log(err)
          return res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          return res.send({
            user: user,
            success: `User: ${user.username} is successfully registered.`
          })
        }
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to register the user.'
      })
    }
  },

  // Admin Register
  async registerAdmin(req, res) {
    try {
      // console.log('FILE', req.file)
      // console.log('BODY', req.body)
      const username = req.body.adminUsername
      const password = req.body.adminPassword
      const password2 = req.body.adminPassword2
      const name = req.body.adminName
      const telephone1 = req.body.telephone1
      const telephone2 = req.body.telephone2
      const address = req.body.address
      const note = req.body.userName
      const createdBy = req.body.createdBy

      let image = ''
      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        image = req.file.path
      }

      // Create new admin object
      const newAdmin = new Admin({
        userType: 'admin',
        root_user: false,
        username: username,
        password: password,
        name: name,
        telephone1: telephone1,
        telephone2: telephone2,
        address: address,
        note: note,
        image: image,
        createdBy: createdBy
      })
      await Admin.createAdmin(newAdmin, function(err, admin) {
        if (err) {
          console.log(err)
          return res.status(400).send({
            error: 'This username is already in use.'
          })
        } else {
          return res.send({
            admin: admin,
            success: `You have successfully registered. ${admin.username}`
          })
        }
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: 'An error has occurred trying to register the admin. Please try again.'
      })
    }
  },

  // User Login
  async loginUser(req, res, next) {
    try {
      await passport.authenticate('user', function(err, user, info) {
        if (err) {
          return next(err)
        }
        if (!user) {
          return res.status(403).send({
            error: 'Login authentication has failed.'
          })
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err)
          }
          const userJson = user.toJSON()
          return res.send({
            user: user,
            // Create JWT
            token: jwtSignUser(userJson)
          })
        })
      })(req, res, next)
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to log in.'
      })
    }
  },

  // Admin Login
  async loginAdmin(req, res, next) {
    try {
      await passport.authenticate('admin', function(err, admin, info) {
        if (err) {
          return next(err)
        }
        if (!admin) {
          return res.status(403).send({
            error: 'Log in authentication failed.'
          })
        }
        req.logIn(admin, function(err) {
          if (err) {
            return next(err)
          }
          const adminJson = admin.toJSON()
          return res.send({
            admin: admin,
            // Create JWT
            token: jwtSignUser(adminJson),
            success: `Logged in: ${admin.username}`
          })
        })
      })(req, res, next)
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to log in.'
      })
    }
  },

  // User Logout
  async logoutUser(req, res) {
    try {
      await req.logout()

      return res.send({
        user: false,
        loggedOutMessage: 'Logged out.'
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to logout.'
      })
    }
  },

  // Admin Logout
  async logoutAdmin(req, res) {
    try {
      await req.logout()

      return res.send({
        admin: false,
        loggedOutMessage: 'Logged out.'
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occurred trying to logout.'
      })
    }
	}
	

} /* Module exports */
