declare module "aplayer" {
  export default class APlayer {
    constructor(options: Record<string, unknown>);
    destroy(): void;
  }
}

declare module "meting/dist/Meting.min.js";
