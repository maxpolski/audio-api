export class PubSub {
  private subscripbers: { [key in string]: Array<() => void> } = {};

  subscribe(evt: string, handler: () => void) {
    if (!this.subscripbers[evt]) {
      this.subscripbers[evt] = [];
    }

    this.subscripbers[evt].push(handler);
  }

  emit(evt: string) {
    this.subscripbers[evt]?.forEach((s) => s());
  }
}
