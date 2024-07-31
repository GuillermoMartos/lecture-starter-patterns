import { Server, Socket } from "socket.io";

import { CardEventType, ListEvent, ListEventType } from "../common/enums/enums";
import { Database } from "../data/database";
import { List } from "../data/models/list";
import logger from "../services/ChangeObserver";
import { ReorderService } from "../services/services";

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderService;

  protected io: Server;

  public constructor(io: Server, db: Database, reorderService: ReorderService) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }

  public finalCardChangesProcess(
    updatedLists: List[],
    eventType: CardEventType | ListEventType,
    message: string
  ): void {
    this.db.setData(updatedLists);
    this.updateLists();
    // PATTERN:{OBSERVER}
    logger.notifyObservers(eventType, message);
  }
}

export { SocketHandler };
