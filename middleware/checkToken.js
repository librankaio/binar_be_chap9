const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(403).json({
            message: 'please provide a token'
        })
    }

    // if provided with Bearer then remove it
    if (token.toLowerCase().startsWith('bearer')) {
        token = token.slice('bearer'.length).trim()
    }

    try {
        const jwtPayload = jwt.verify(token, 'secret')

        if (!jwtPayload) { return res.status(403).json({ message: 'unauthenticated' }) }

        res.user = jwtPayload

        next()
    } catch (error) {
        return res.status(403).json({ message: 'failed to authenticated' })
    }
}

module.exports = checkToken
