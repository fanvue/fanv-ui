import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <div>
      <h1>@fanvue/ui-internal</h1>
      <p>Run `pnpm storybook` to view components.</p>
    </div>
  </StrictMode>,
);
