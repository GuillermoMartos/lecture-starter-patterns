import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(
      CardEvent.CHANGE_DESCRIPTION,
      this.changeCardDescription.bind(this)
    );
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
  }

  public createCard({
    listId,
    cardName,
  }: {
    listId: string;
    cardName: string;
  }): void {
    const newCard = new Card(cardName, "");
    const lists = this.db.getData();
    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private deleteCard({ cardId }: { cardId: string }): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((listCards) =>
      listCards.setCards(listCards.cards.filter((card) => card.id !== cardId))
    );
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private renameCard({
    cardId,
    cardName,
  }: {
    cardId: string;
    cardName: string;
  }): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((listCards) => {
      return listCards.setCards(
        listCards.cards.map((card) => {
          if (card.id === cardId) {
            card.name = cardName;
          }
          return card;
        })
      );
    });
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private changeCardDescription({
    cardId,
    cardDescription,
  }: {
    cardId: string;
    cardDescription: string;
  }): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((listCards) => {
      return listCards.setCards(
        listCards.cards.map((card) => {
          if (card.id === cardId) {
            card.description = cardDescription;
          }
          return card;
        })
      );
    });
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private duplicateCard({ cardId }: { cardId: string }): void {
    const lists = this.db.getData();
    let foundOne: Card;
    lists.forEach((listCards) => {
      listCards.cards.forEach((card) => {
        if (card.id === cardId) {
          foundOne = card;
        }
      });
    });
    const newCard = foundOne ? foundOne.clone() : null;
    const updatedLists = lists.map((list) =>
      newCard ? list.setCards(list.cards.concat(newCard)) : list
    );
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }
}

export { CardHandler };
