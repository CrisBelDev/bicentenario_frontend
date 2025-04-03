import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-quill-new/dist/quill.snow.css"; // o el tema que prefieras

//import "./assets/css/styles.css";
//import "./assets/css/app.css";
import "./assets/css/main.css";

//import "./assets/css/sb-admin-2.css";
import "./assets/css/misestilos.css";
createRoot(document.getElementById("root")).render(<App />);
