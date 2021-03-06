import { Box } from "../common";
import {
  isSpecial,
  KEY_BACKSPACE,
  KEY_COPY,
  KEY_CUT,
  KEY_DELETE,
} from "../constants";
import { Layer } from "../layer";
import { IModifierKeys, store } from "../store";
import { layerToText, textToLayer } from "../text_utils";
import { Vector } from "../vector";
import { AbstractDrawFunction } from "./function";
import { DrawMove } from "./move";

export class DrawSelect extends AbstractDrawFunction {
  private moveTool: DrawMove;

  private selectBox: Box;

  private dragStart: Vector;
  private dragEnd: Vector;

  constructor() {
    super();
    window.document.addEventListener("paste", (e) => {
      const clipboardText = e.clipboardData.getData("text");
      if (this.selectBox) {
        const pastedLayer = textToLayer(
          clipboardText,
          this.selectBox.topLeft()
        );
        store.currentCanvas.setScratchLayer(pastedLayer);
        store.currentCanvas.commitScratch();
      }
    });
  }

  start(position: Vector, modifierKeys: IModifierKeys) {
    if (
      this.selectBox != null &&
      this.selectBox.contains(position) &&
      !modifierKeys.shift
    ) {
      // Start a drag.
      this.startDrag(position);
    } else if (
      isSpecial(store.currentCanvas.committed.get(position)) &&
      !modifierKeys.shift
    ) {
      // Start a resize.
      this.moveTool = new DrawMove();
      this.moveTool.start(position);
    } else {
      // Start a selection.
      this.startSelect(position);
    }
  }

  startSelect(position: Vector) {
    this.selectBox = new Box(position, position);
    store.currentCanvas.setSelection(this.selectBox);
  }

  startDrag(position: Vector) {
    this.dragStart = position;
    this.dragEnd = position;
  }

  move(position: Vector) {
    if (this.dragStart != null) {
      this.moveDrag(position);
    } else if (!!this.moveTool) {
      this.moveTool.move(position);
    } else {
      this.moveSelect(position);
    }
  }

  moveSelect(position: Vector) {
    this.selectBox = new Box(this.selectBox.start, position);

    const selectionLayer = new Layer();

    store.currentCanvas.committed.entries().forEach(([key, value]) => {
      if (this.selectBox.contains(key)) {
        selectionLayer.set(key, value);
      }
    });

    store.currentCanvas.setScratchLayer(selectionLayer);
    store.currentCanvas.setSelection(this.selectBox);
  }

  moveDrag(position: Vector) {
    this.dragEnd = position;
    const moveDelta = this.dragEnd.subtract(this.dragStart);
    store.currentCanvas.setSelection(
      new Box(
        this.selectBox.topLeft().add(moveDelta),
        this.selectBox.bottomRight().add(moveDelta)
      )
    );

    const layer = new Layer();

    // Erase existing drawing.
    store.currentCanvas.committed.entries().forEach(([key]) => {
      if (this.selectBox.contains(key)) {
        layer.set(key, "");
      }
    });
    // Move characters.
    store.currentCanvas.committed.entries().forEach(([key, value]) => {
      if (this.selectBox.contains(key)) {
        layer.set(key.add(moveDelta), value);
      }
    });

    store.currentCanvas.setScratchLayer(layer);
  }

  end() {
    if (this.dragStart != null) {
      store.currentCanvas.commitScratch();
      this.selectBox = new Box(
        this.selectBox.topLeft().add(this.dragEnd).subtract(this.dragStart),
        this.selectBox.bottomRight().add(this.dragEnd).subtract(this.dragStart)
      );
      store.currentCanvas.setSelection(this.selectBox);
    } else if (!!this.moveTool) {
      this.moveTool.end();
      this.moveTool = null;
    }
    this.dragStart = null;
    this.dragEnd = null;
  }

  getCursor(position: Vector) {
    if (this.selectBox != null && this.selectBox.contains(position)) {
      return "pointer";
    }
    if (isSpecial(store.currentCanvas.committed.get(position))) {
      return "move";
    }
    return "default";
  }

  handleKey(value: string) {
    if (this.selectBox != null) {
      // Use the native keyboard for copy pasting.
      if (value === KEY_COPY || value === KEY_CUT) {
        const copiedText = layerToText(
          store.currentCanvas.rendered,
          this.selectBox
        );
        navigator.clipboard.writeText(copiedText);
      }
      if (value === KEY_CUT) {
        const layer = new Layer();
        store.currentCanvas.committed.entries().forEach(([key]) => {
          if (this.selectBox.contains(key)) {
            layer.set(key, "");
          }
        });
        store.currentCanvas.setScratchLayer(layer);
        store.currentCanvas.commitScratch();
      }
    }
    if (value === KEY_BACKSPACE || value === KEY_DELETE) {
      const layer = new Layer();
      store.currentCanvas.committed.entries().forEach(([key]) => {
        if (this.selectBox.contains(key)) {
          layer.set(key, "");
        }
      });
      store.currentCanvas.setScratchLayer(layer);
      store.currentCanvas.commitScratch();
    }
  }
}
