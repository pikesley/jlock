import { io } from "./vendor/socket.io.esm.min.js";
import { run } from "./modules/controls.js";

let socket = io(`ws://${location.hostname}:5000`);

run(socket);
