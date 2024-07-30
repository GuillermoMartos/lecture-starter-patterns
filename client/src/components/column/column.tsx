import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import { useContext } from "react";
import { CardEvent, ListEvent } from "../../common/enums/enums";

import { type Card } from "../../common/types/types";
import { SocketContext } from "../../context/socket";
import { CardsList } from "../card-list/card-list";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Title } from "../primitives/title";
import { Footer } from "./components/footer";
import { Container } from "./styled/container";
import { Header } from "./styled/header";

type Props = {
  listId: string;
  listName: string;
  cards: Card[];
  index: number;
};

export const Column = ({ listId, listName, cards, index }: Props) => {
  const socket = useContext(SocketContext);

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          className="column-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Header
            className="column-header"
            isDragging={snapshot.isDragging}
            {...provided.dragHandleProps}
          >
            <Title
              aria-label={listName}
              title={listName}
              onChange={(listName) => {
                socket.emit(ListEvent.RENAME, { listId, listName });
              }}
              fontSize="large"
              width={200}
              isBold
            />
            <Splitter />
            <DeleteButton
              color="#FFF0"
              onClick={() => {
                socket.emit(ListEvent.DELETE, { listId });
              }}
            />
          </Header>
          <CardsList listId={listId} listType="CARD" cards={cards} />
          <Footer
            onCreateCard={(cardName) => {
              socket.emit(CardEvent.CREATE, { listId, cardName });
            }}
          />
        </Container>
      )}
    </Draggable>
  );
};
