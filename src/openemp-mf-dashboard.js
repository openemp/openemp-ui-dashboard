import "./set-public-path";
import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    return (
      <div className="h-16 flex items-center justify-between px-6 bg-primary text-white">
        Error
      </div>
    );
  },
  domElementGetter
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

function domElementGetter() {
  let el = document.getElementById("dashboard");
  if (!el) {
    el = document.createElement("dashboard");
    el.id = "dashboard";
    el.className = "dashboard";
    document.body.appendChild(el);
  }
  return el;
}

export const devtools = {
  overlays: {
    selectors: [".root.dashboardHeight"],
    options: {
      color: "red"
    }
  }
};
