import { Layer } from "../layer";
import { store } from "../store";
import { Vector } from "../vector";
import { AbstractDrawFunction } from "./function";

export class DrawFreeform extends AbstractDrawFunction {
  private currentLayer: Layer;

  start(position: Vector) {
    this.currentLayer = new Layer();
    this.currentLayer.set(position, store.freeformCharacter);
    store.currentCanvas.setScratchLayer(this.currentLayer);
  }

  move(position: Vector) {
    [this.currentLayer] = new Layer().apply(this.currentLayer);
    this.currentLayer.set(position, store.freeformCharacter);
    store.currentCanvas.setScratchLayer(this.currentLayer);
  }

  end() {
    store.currentCanvas.commitScratch();
  }

  getCursor(position: Vector) {
    return "crosshair";
  }

  handleKey(value: string) {
    if (value && value.length === 1) {
      // The value is not a special character, so lets use it.
      store.freeformCharacter = value;
    }
  }
}
