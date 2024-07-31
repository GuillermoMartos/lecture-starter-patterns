import type { Socket } from 'socket.io'

import { ListEvent } from '../common/enums/enums'
import { List } from '../data/models/list'
import { SocketHandler } from './socket.handler'

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this))
    socket.on(ListEvent.GET, this.getLists.bind(this))
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this))
    socket.on(ListEvent.DELETE, this.deleteList.bind(this))
    socket.on(ListEvent.RENAME, this.renameList.bind(this))
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData())
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData()
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex,
    )
    this.finalCardChangesProcess(
      reorderedLists,
      ListEvent.REORDER,
      `Reorder list with indexes [SOURCE]:${sourceIndex} [DESTINATION]${destinationIndex} [Status Reorder Done]: ${lists.map(
        (list, index) => `${index}: ${list.name}`,
      )}`,
    )
  }

  private createList({ listName }: { listName: string }): void {
    const lists = this.db.getData()
    const newList = new List(listName)
    const updatedLists = [...lists, newList]
    this.finalCardChangesProcess(
      updatedLists,
      ListEvent.CREATE,
      JSON.stringify(newList),
    )
  }

  private deleteList({ listId }: { listId: string }): void {
    const lists = this.db.getData()
    let deletedList: List
    const updatedLists = lists.filter((list) => {
      if (list.id === listId) {
        deletedList = list
      }
      return list.id !== listId
    })
    this.finalCardChangesProcess(
      updatedLists,
      ListEvent.DELETE,
      JSON.stringify(deletedList),
    )
  }

  private renameList({
    listId,
    listName,
  }: {
    listId: string
    listName: string
  }): void {
    const lists = this.db.getData()
    let renamedList: List
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.name = listName
        renamedList = list
      }
      return list
    })
    this.finalCardChangesProcess(
      updatedLists,
      ListEvent.RENAME,
      JSON.stringify(renamedList),
    )
  }
}

export { ListHandler }
