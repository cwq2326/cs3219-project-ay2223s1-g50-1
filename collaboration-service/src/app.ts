import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from '../build/routes'
import { errorHandler, requestLogger } from './middleware/logging'
import { corsWithOptions } from './middleware/cors'
import cookieParser from 'cookie-parser'
import { CollaborationSocketHandler } from './routes/collaboration/collaboration.socket'
import { Server } from 'socket.io'
import { userServiceClientImpl } from './clients/user-service/user-service.client'

export const app: Application = express()

app.use(cookieParser())
app.use(corsWithOptions)
app.use(express.json())
app.use(requestLogger)

app.use('/docs', swaggerUi.serve, async (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../build/swagger.json')))
})

RegisterRoutes(app)

app.use(errorHandler)

export const io = new Server({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})

const socketPort = Number(process.env.SOCKET_PORT) ?? 3000
io.listen(socketPort)
console.log(`Socket live at port ${socketPort}`)

// bind event handler
new CollaborationSocketHandler(io, userServiceClientImpl)
