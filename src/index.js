"use strict";
import React from "react";
import { createRoot } from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App.js";
import './styles.css'
import 'bootstrap-icons/font/bootstrap-icons.css';



const root = createRoot(document.getElementById("root"));
root.render(
    <App title={"Hola mundo"} subtitle={"test"}/>
);

