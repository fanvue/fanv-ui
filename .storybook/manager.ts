import { addons, type State } from "storybook/manager-api";
import FanvueTheme from "./FanvueTheme";

addons.setConfig({
  theme: FanvueTheme,
  showToolbar: true,
  panelPosition: "bottom",
  navSize: 280,
  bottomPanelHeight: 300,
  layoutCustomisations: {
    showPanel(state: State, defaultValue: boolean) {
      if (state.viewMode === "docs") return true;

      return defaultValue;
    },
  },
});
