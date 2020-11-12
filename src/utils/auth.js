import jwt from 'jsonwebtoken'

export const newToken = (user) =>
  jwt.sign(
    {
      email: user.email,
      phone: user.phoneNumber,
      userRole: user.userRole,
      active: user.active,
      userId: user._id,
      fname: user.fname,
      lname: user.lname
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  )

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if (error) return reject(error)
      resolve(payload)
    })
  })

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : ""

    const decoded = await verifyToken(token)
    if (decoded && decoded.active) {
      req.userData = decoded
    } else {
      return res.status(401).json({
        message: "User is not Active",
      })
    }
  } catch (error) {
    return res.status(401).json({
      message: "User Authentication Failed",
      error,
    })
  }
  next()
}