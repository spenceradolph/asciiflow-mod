import { Layer } from "../layer";
import { store } from "../store";
import { Vector } from "../vector";
import { AbstractDrawFunction } from "./function";
import { drawLine } from "./utils";

export class DrawBox extends AbstractDrawFunction {
  private startPosition: Vector;

  start(position: Vector) {
    this.startPosition = position;
  }

  move(position: Vector) {
    const layer = new Layer();
    drawLine(layer, this.startPosition, position, true);
    drawLine(layer, this.startPosition, position, false);
    store.currentCanvas.setScratchLayer(layer);
  }

  end() {
    store.currentCanvas.commitScratch();
  }

  getCursor() {
    return "crosshair";
  }
}
