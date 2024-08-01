import { List } from '../data/models/list'
import _ from 'lodash'

class Memento {
  private state

  constructor(state: List[]) {
    this.state = state
  }

  getState() {
    return this.state
  }
}

class MementoService {
  private currentStateIndex
  private mementosRecorded: Memento[]

  constructor() {
    this.mementosRecorded = []
    this.currentStateIndex = -1
  }

  saveState(state: List[]) {
    const stateDeepCopy = _.cloneDeep(state)
    if (this.currentStateIndex < this.mementosRecorded.length - 1) {
      this.mementosRecorded = this.mementosRecorded.slice(
        0,
        this.currentStateIndex + 1,
      )
    }
    const memento = new Memento(stateDeepCopy as List[])
    this.mementosRecorded.push(memento)
    this.currentStateIndex++
  }

  undo() {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--
      return this.mementosRecorded[this.currentStateIndex].getState()
    }
    console.warn('no more states to undo')
    return null // No hay más estados para deshacer
  }

  redo() {
    if (this.currentStateIndex < this.mementosRecorded.length - 1) {
      this.currentStateIndex++
      return this.mementosRecorded[this.currentStateIndex].getState()
    }
    console.warn('no more states to redo')
    return null // No hay más estados para rehacer
  }
}

const initializedMemento = new MementoService()
export default initializedMemento
