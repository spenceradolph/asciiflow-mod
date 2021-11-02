import { Layer } from "../layer";
import { store } from "../store";
import { Vector } from "../vector";
import { AbstractDrawFunction } from "./function";
import { allTemplates } from "./template_ascii";

export class TemplatePaste extends AbstractDrawFunction {
  start(position: Vector) {
    store.currentCanvas.setScratchLayer(
      Layer.deserialize(
        JSON.stringify({
          x: position.x,
          y: position.y,
          text: allTemplates[store.currentTemplateSelection].ascii,
        })
      )
    );
  }

  end() {
    store.currentCanvas.commitScratch();
  }

  getCursor(position: Vector) {
    return "crosshair";
  }

  handleKey(value: string) {
    if (value && value.length === 1 && ["1", "2", "3", "4"].includes(value)) {
      // The value is not a special character, so lets use it.
      // TODO: better selection of template mechanism (select from a list?)
      store.currentTemplateSelection = value;
    }
  }
}
