export class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(observerFunction) {
    this.observers.push(observerFunction);
  }

  unsubscribe(observerFunction) {
    this.observers = this.observers.filter((subscriber) => subscriber !== observerFunction);
  }

  publish(data) {
    this.observers.forEach((observer) => observer(data));
  }
}
