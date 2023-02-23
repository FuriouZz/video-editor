/* @refresh reload */
import { render } from "solid-js/web";

import "./styles/main.scss";
import Main from "./Main";

render(() => <Main />, document.getElementById("root") as HTMLElement);
