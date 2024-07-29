export class SktAction<T> {
  private _listeners: {
    callback: (data: T) => void
    once: boolean
  }[] = []

  addListener(callback: (data: T) => void): void {
    this._listeners.push({
      callback,
      once: false
    })
  }
  addOnceListener(callback: (data: T) => void): void {
    this._listeners.push({
      callback,
      once: true
    })
  }

  removeListener(callback: (data: T) => void): void {
    const index = this._listeners.findIndex((l) => l.callback === callback)
    if (index >= 0) {
      this._listeners.splice(index, 1)
    }
  }

  dispatch(data: T): void {
    const listeners = this._listeners.slice()
    for (const listener of listeners) {
      listener.callback(data)
      if (listener.once) {
        this.removeListener(listener.callback)
      }
    }
  }

  on = this.addListener
  subscribe = this.addListener
  once = this.addOnceListener
  off = this.removeListener
  unsubscribe = this.removeListener
  emit = this.dispatch
  invoke = this.dispatch
  trigger = this.dispatch
}
