const MementoEvent = {
  REDO: 'memento:redo',
  UNDO: 'memento:undo',
} as const
type MementoEventType = (typeof MementoEvent)[keyof typeof MementoEvent]

export { MementoEvent, MementoEventType }
