import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

import Home from "./pages/konsumen/Home";
import DetailPaket from "./pages/konsumen/DetailPaket";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import api from "./services/api";

setupIonicReact();

const App = () => {
  useEffect(() => {
    const updateUI = async () => {
      try {
        const res = await api.get("/pengaturan/wa");
        if (res.data) {
          if (res.data.nama_sistem) document.title = res.data.nama_sistem;
          if (res.data.ikon_sistem) {
            let link = document.querySelector(
              "link[rel~='icon']",
            ) as HTMLLinkElement;
            if (!link) {
              link = document.createElement("link");
              link.rel = "icon";
              document.head.appendChild(link);
            }
            link.href = res.data.ikon_sistem;
          }
        }
      } catch (e) {
        console.error("Gagal memuat pengaturan UI", e);
      }
    };
    updateUI();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" element={<Home />} />
          <Route path="/paket/:id" element={<DetailPaket />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
