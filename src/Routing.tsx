import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavBar from "./components/AppNavBar";
import About from "./pages/about";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

export type Page = {
  name: string;
  path: string;
  component: JSX.Element;
};
const pages: Page[] = [
  { name: "Home", path: "/", component: <Home /> },
  { name: "About", path: "/about", component: <About /> },
];

export default function Routing() {
  return (
    <BrowserRouter>
      <AppNavBar pages={pages} />
      <Routes>
        {pages.map((page) => (
          <Route key={page.path} path={page.path} element={page.component} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
