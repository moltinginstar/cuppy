import type { CuppyDOMStringMap } from ".";

declare global {
  declare interface HTMLElement {
    readonly dataset:
      | ({ cuppy: {} } & CuppyDOMStringMap)
      | ({ cuppy?: never } & DOMStringMap);
  }
}

// export {};
