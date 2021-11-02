import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useObserver } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, useParams } from "react-router-dom";
// @ts-ignore
import "./app.css";
import { Drawer, View } from "./components";
import { Controller, DesktopController, TouchController } from "./controller";
import { DrawingId, store } from "./store";

const controller = new Controller();
const touchController = new TouchController(controller);
const desktopController = new DesktopController(controller);

export interface IRouteProps {
  local: string;
  share: string;
}

export const App = () => {
  return useObserver(() => {
    const routeProps = useParams<IRouteProps>();
    store.setRoute(
      routeProps.share
        ? DrawingId.share(decodeURIComponent(routeProps.share))
        : DrawingId.local(routeProps.local || null)
    );

    const theme = React.useMemo(
      () =>
        createMuiTheme({
          palette: {
            type: store.darkMode.get() ? "dark" : "light",
          },
        }),
      [store.darkMode.get()]
    );
    return (
      <ThemeProvider theme={theme}>
        <div className={["app", store.darkMode.get() ? "dark" : ""].join(" ")}>
          <Drawer />
          <View
            {...desktopController.getHandlerProps()}
            {...touchController.getHandlerProps()}
          />
        </div>
      </ThemeProvider>
    );
  });
};

async function render() {
  ReactDOM.render(
    <HashRouter>
      <Route exact path="/" component={App} />
      <Route path="/local/:local" component={App} />
      <Route path="/share/:share" component={App} />
    </HashRouter>,
    document.getElementById("root")
  );
}

// tslint:disable-next-line: no-console
render().catch((e) => console.log(e));

window.addEventListener("keypress", (e) => controller.handleKeyPress(e));
window.addEventListener("keydown", (e) => controller.handleKeyDown(e));
window.addEventListener("keyup", (e) => controller.handleKeyUp(e));
