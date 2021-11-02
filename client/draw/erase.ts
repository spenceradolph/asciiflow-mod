import { Layer } from "../layer";
import { store } from "../store";
import { Vector } from "../vector";
import { AbstractDrawFunction } from "./function";

export class DrawErase extends AbstractDrawFunction {
  private startPosition: Vector;
  private endPosition: Vector;

  start(position: Vector) {
    this.startPosition = position;
    this.move(position);
  }

  move(position: Vector) {
    const layer = new Layer();
    this.endPosition = position;

    const startX = Math.min(this.startPosition.x, this.endPosition.x);
    const startY = Math.min(this.startPosition.y, this.endPosition.y);
    const endX = Math.max(this.startPosition.x, this.endPosition.x);
    const endY = Math.max(this.startPosition.y, this.endPosition.y);

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        layer.set(new Vector(i, j), "");
      }
    }
    store.currentCanvas.setScratchLayer(layer);
  }

  end() {
    store.currentCanvas.commitScratch();
  }

  getCursor() {
    return "crosshair";
  }
}
