import * as fs from 'fs'
import * as path from 'path'
import {
  CardEventType,
  ListEventType,
  MementoEventType,
} from '../common/enums/enums'

enum EventType {
  INFO = 'INFO',
  ERROR = 'ERROR',
}
interface LoggerData {
  type: EventType
  message: string
}
interface Observer {
  update(event: LoggerData): void
}

class Subject {
  private observers: Observer[]

  constructor() {
    this.observers = []
  }

  addObserver(observer: Observer) {
    this.observers.push(observer)
  }

  removeObserver(observer: Observer) {
    this.observers = this.observers.filter(
      (_observer) => _observer !== observer,
    )
  }

  notifyObservers(
    action: CardEventType | ListEventType | MementoEventType,
    message: string,
  ) {
    const templateMessage = `[TIMESTAMP]: ${Date.now()} [ACTION]: ${action} [MESSAGE]: ${message}`
    try {
      this.observers.forEach((observer) =>
        observer.update({ message: templateMessage, type: EventType.INFO }),
      )
    } catch (error) {
      this.observers.forEach((observer) => {
        if (error instanceof Error) {
          observer.update({ message: error.message, type: EventType.ERROR })
        } else {
          observer.update({
            message: JSON.stringify(error),
            type: EventType.ERROR,
          })
        }
      })
    }
  }
}

class InfoLogger implements Observer {
  private logFilePath: string
  private logMementoFilePath: string
  private fileName = 'dataLogged.txt'
  private mementoFileName = 'mementoLogged.txt'

  constructor() {
    const directoryPath = path.join(__dirname, '..', 'data')
    this.logFilePath = path.join(directoryPath, this.fileName)
    this.logMementoFilePath = path.join(directoryPath, this.mementoFileName)
    this.initializeOrResetLogsFile()
  }

  initializeOrResetLogsFile() {
    fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true })
    fs.mkdirSync(path.dirname(this.logMementoFilePath), { recursive: true })
    fs.writeFileSync(this.logFilePath, '')
    fs.writeFileSync(this.logMementoFilePath, '')
  }

  update(event: LoggerData) {
    if (event.message.includes('memento')) {
      return fs.appendFileSync(this.logMementoFilePath, event.message + '\n')
    }
    if (event.type === EventType.INFO) {
      fs.appendFileSync(this.logFilePath, event.message + '\n')
    }
  }
}

class ErrorLogger implements Observer {
  private name = 'ErrorLogger'
  constructor() {}

  update(event: LoggerData) {
    if (event.type == EventType.ERROR) {
      console.error(`${this.name} received message: ${event.message}`)
    }
  }
}

const logPublisher = new Subject()
const infoLogger = new InfoLogger()
const errorLogger = new ErrorLogger()
logPublisher.addObserver(infoLogger)
logPublisher.addObserver(errorLogger)

export default logPublisher
