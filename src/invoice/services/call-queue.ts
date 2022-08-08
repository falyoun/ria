export type GenericFunction = (...args: any) => Promise<void>;
export class CallQueue {
  private _queue: GenericFunction[] = [];
  private _running = false;
  push(func: GenericFunction) {
    const callback: GenericFunction = async () =>
      func().finally(() => {
        this.next();
      });
    this._queue.push(callback);
    if (!this._running) {
      // if nothing is running, then start the engines!
      this.next();
    }
  }
  next() {
    this._running = false;
    //get the first element off the queue
    const shift = this._queue.shift();
    if (shift) {
      this._running = true;
      shift().then();
    }
  }
}
