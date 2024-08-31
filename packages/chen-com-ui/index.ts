import * as components from "@chen-com/components";
import type { App } from "vue";
const install = (app: App) => {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
};
export default {
  install,
};
export * from "@chen-com/components";