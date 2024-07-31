import type { DraggableLocation } from '@hello-pangea/dnd'

import { type Card, type List } from '../common/types/types'
import {
  addCardToList,
  findListByDraggableLocation,
  removeCardFromList,
  reorderSameListCards,
} from './helpers/reorder.service'

export const reorderService = {
  reorderLists(items: List[], startIndex: number, endIndex: number): List[] {
    const itemsCopy = items.slice()
    const [removed] = itemsCopy.splice(startIndex, 1)
    itemsCopy.splice(endIndex, 0, removed)

    return itemsCopy
  },

  reorderCards(
    lists: List[],
    source: DraggableLocation,
    destination: DraggableLocation,
  ): List[] {
    const current: Card[] =
      lists.find(findListByDraggableLocation(source.droppableId))?.cards || []
    const next: Card[] =
      lists.find(findListByDraggableLocation(destination.droppableId))?.cards ||
      []
    const target = current[source.index]

    if (target === undefined) {
      //this should never happens. For the deployment compiler needed.
      throw new Error('Card not found at the source index')
    }

    const isMovingInSameList = source.droppableId === destination.droppableId

    if (isMovingInSameList) {
      const reordered = reorderSameListCards(
        current,
        source.index,
        destination.index,
      )
      return lists.map((list) =>
        list.id === source.droppableId ? { ...list, cards: reordered } : list,
      )
    } else {
      const newLists = lists.map((list) => {
        if (list.id === source.droppableId) {
          const reorderedCardsAfterRemoval = removeCardFromList(source.index)(
            current,
          )
          return {
            ...list,
            cards: reorderedCardsAfterRemoval,
          }
        }

        if (list.id === destination.droppableId) {
          const reorderedCardsAfterAddition = addCardToList(destination.index)(
            target,
          )(next)
          return {
            ...list,
            cards: reorderedCardsAfterAddition,
          }
        }

        return list
      })

      return newLists
    }
  },
}
