import { Card } from "../../common/types/card.type";
import { List } from "../../common/types/list.type";

export const findListByDraggableLocation =
  (droppableId: string) => (list: List) => {
    return list.id === droppableId;
  };

export const reorderSameListCards = (
  cards: Card[],
  sourceIndex: number,
  destinationIndex: number
) => {
  const cardsCopy = cards.slice();
  const [removed] = cardsCopy.splice(sourceIndex, 1);
  cardsCopy.splice(destinationIndex, 0, removed);
  const reorderedCards: Card[] = cardsCopy;
  return reorderedCards;
};

const updateList =
  (start: number, end: number, middle: Card[] = []) =>
  (cards: Card[]): Card[] =>
    cards.slice(0, start).concat(middle).concat(cards.slice(end));

export const removeCardFromList = (index: number) =>
  updateList(index, index + 1);

export const addCardToList = (index: number) => (card: Card) =>
  updateList(index, index, [card]);
