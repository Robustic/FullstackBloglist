const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.headers.authorization
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const splitted = authorization.substring(7)
        request.token = splitted
    } else {
        request.token = ''
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const authorization = request.headers.authorization
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        if (!token) {
            return response.status(401).json({ error: 'token missing' })
        }
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(401).json({ error: 'user not found' })
        }
        logger.info('user:', user)
        request.user = user
    } else {
        return response.status(401).json({ error: 'authorization header missing or invalid' })
    }
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}
