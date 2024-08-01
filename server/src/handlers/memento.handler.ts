import type { Socket } from 'socket.io'
import { MementoEvent } from '../common/enums/memento-event.enum'
import mementoService from '../services/MementoService'

import { SocketHandler } from './socket.handler'
import logger from '../services/ChangeObserver'

class MementoHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(MementoEvent.UNDO, this.performUndo.bind(this))
    socket.on(MementoEvent.REDO, this.performRedo.bind(this))
  }

  private performUndo(): void {
    const previousState = mementoService.undo()
    if (previousState) {
      this.db.setData(previousState)
      this.updateLists()
      // PATTERN:{OBSERVER}
      logger.notifyObservers(
        MementoEvent.UNDO,
        `[UNDO STATE]: ${JSON.stringify(previousState)}`,
      )
    }
  }

  private performRedo(): void {
    const furtherState = mementoService.redo()
    if (furtherState) {
      this.db.setData(furtherState)
      this.updateLists()
      // PATTERN:{OBSERVER}
      logger.notifyObservers(
        MementoEvent.REDO,
        `[REDO STATE]: ${JSON.stringify(furtherState)}`,
      )
    }
  }
}

export { MementoHandler }
