// page-flip ships without type declarations; this covers the parts the Showcase layout uses.
declare module "page-flip" {
  export type FlipSetting = {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    usePortrait?: boolean;
    maxShadowOpacity?: number;
    mobileScrollSupport?: boolean;
  };

  export class PageFlip {
    constructor(element: HTMLElement, setting: FlipSetting);
    loadFromHTML(items: HTMLElement[]): void;
    loadFromImages(images: string[]): void;
    on(event: "flip" | "changeOrientation" | "changeState" | "init" | "update", cb: (e: { data: unknown }) => void): this;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    destroy(): void;
  }
}
