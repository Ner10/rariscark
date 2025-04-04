import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet } from "react-helmet";

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <title>Prize Wheel Game</title>
      <meta name="description" content="Spin the wheel and win exciting prizes!" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
        rel="stylesheet" 
      />
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
    </Helmet>
    <App />
  </>
);
