import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import "./i18n/i18n";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPendingComponent: () => <Loader />,
  context: {},
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <I18nextProvider i18n={require("./i18n/i18n").default}>
      <RouterProvider router={router} />
    </I18nextProvider>
  );
}
