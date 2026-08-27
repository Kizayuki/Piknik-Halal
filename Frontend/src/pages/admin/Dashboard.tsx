import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  useIonRouter,
  IonAlert,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonToast,
} from "@ionic/react";
import {
  mapOutline,
  busOutline,
  settingsOutline,
  closeOutline,
  peopleOutline,
  personCircleOutline,
  homeOutline,
} from "ionicons/icons";

import ProfilAdmin from "./ProfilAdmin";
import RingkasanDashboard from "./RingkasanDashboard";
import KelolaWisata from "./KelolaWisata";
import KelolaPaket from "./KelolaPaket";
import KelolaAdmin from "./KelolaAdmin";
import PengaturanSistem from "./PengaturanSistem";
import api from "../../services/api";

interface LoggedInUser {
  id?: number;
  username: string;
  role: string;
  foto_profil?: string;
}

const Dashboard = () => {
  const router = useIonRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [tabAktif, setTabAktif] = useState<
    "ringkasan" | "wisata" | "paket" | "pengaturan" | "admin" | "profil"
  >("ringkasan");
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    color: "success",
  });

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [namaSistemHeader, setNamaSistemHeader] = useState("CMS");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/admin/login", "back", "replace");
      return;
    }

    setUser(JSON.parse(userData));

    api
      .get("/pengaturan/wa")
      .then((res) => {
        const rawRes = res as unknown as Record<string, unknown>;
        const data = (
          rawRes.data !== undefined ? rawRes.data : rawRes
        ) as Record<string, string>;

        if (data && data.nama_sistem) {
          setNamaSistemHeader(data.nama_sistem);
        }
      })
      .catch((err) => console.error(err));

    const loginNotif = localStorage.getItem("login_notif");
    if (loginNotif) {
      tampilNotif(loginNotif);
      localStorage.removeItem("login_notif");
    }
  }, [router]);

  const tampilNotif = (pesan: string, warna: string = "success") => {
    setToast({ isOpen: true, message: pesan, color: warna });
  };

  const executeLogout = () => {
    tampilNotif("Berhasil logout dari sistem", "success");

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/admin/login", "back", "replace");
    }, 1500);
  };

  if (!user) return null;

  return (
    <>
      <IonPage>
        <IonMenu contentId="admin-content" menuId="admin-menu">
          <IonHeader>
            <IonToolbar color="dark">
              <IonTitle>Menu Admin</IonTitle>
              <IonButtons slot="end">
                <IonMenuToggle>
                  <IonButton>
                    <IonIcon icon={closeOutline} style={{ fontSize: "24px" }} />
                  </IonButton>
                </IonMenuToggle>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <IonList style={{ flexGrow: 1 }}>
                <IonMenuToggle autoHide={false}>
                  <IonItem button onClick={() => setTabAktif("ringkasan")}>
                    <IonIcon slot="start" icon={homeOutline} />{" "}
                    <IonLabel>Beranda Utama</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => setTabAktif("wisata")}>
                    <IonIcon slot="start" icon={mapOutline} />{" "}
                    <IonLabel>Daftar Wisata</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => setTabAktif("paket")}>
                    <IonIcon slot="start" icon={busOutline} />{" "}
                    <IonLabel>Daftar Paket</IonLabel>
                  </IonItem>

                  {user.role === "Super Admin" && (
                    <>
                      <IonItem button onClick={() => setTabAktif("admin")}>
                        <IonIcon slot="start" icon={peopleOutline} />{" "}
                        <IonLabel>Kelola Admin</IonLabel>
                      </IonItem>
                      <IonItem button onClick={() => setTabAktif("pengaturan")}>
                        <IonIcon slot="start" icon={settingsOutline} />{" "}
                        <IonLabel>Pengaturan Sistem</IonLabel>
                      </IonItem>
                    </>
                  )}
                </IonMenuToggle>
              </IonList>

              <IonList
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingBottom: "20px",
                }}
              >
                <IonMenuToggle autoHide={false}>
                  <IonItem
                    button
                    onClick={() => setTabAktif("profil")}
                    lines="none"
                  >
                    <IonIcon slot="start" icon={personCircleOutline} />{" "}
                    <IonLabel>Profil Saya</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </IonList>
            </div>
          </IonContent>
        </IonMenu>

        <IonHeader>
          <IonToolbar color="dark">
            <IonButtons slot="start">
              <IonMenuButton menu="admin-menu" />
            </IonButtons>
            <IonTitle>Dashboard - {namaSistemHeader}</IonTitle>
            <IonButtons slot="end">
              <IonButton
                fill="solid"
                color="danger"
                style={{
                  borderRadius: "8px",
                  fontWeight: "bold",
                  padding: "0 10px",
                }}
                onClick={() => setShowLogoutAlert(true)}
              >
                LOGOUT
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent
          id="admin-content"
          className="ion-padding"
          style={{ "--background": "#f3f4f6" } as React.CSSProperties}
        >
          {tabAktif === "ringkasan" && (
            <RingkasanDashboard user={user} setTabAktif={setTabAktif} />
          )}
          {tabAktif === "profil" && (
            <ProfilAdmin
              user={user}
              setUser={setUser}
              tampilNotif={tampilNotif}
            />
          )}
          {tabAktif === "wisata" && <KelolaWisata />}
          {tabAktif === "paket" && <KelolaPaket />}
          {tabAktif === "admin" && <KelolaAdmin />}
          {tabAktif === "pengaturan" && (
            <PengaturanSistem onUpdateNamaSistem={setNamaSistemHeader} />
          )}

          <IonAlert
            isOpen={showLogoutAlert}
            onDidDismiss={() => setShowLogoutAlert(false)}
            header="Konfirmasi Keluar"
            message="Apakah Anda yakin ingin keluar dari sistem?"
            buttons={[
              { text: "Batal", role: "cancel" },
              { text: "Keluar", role: "destructive", handler: executeLogout },
            ]}
          />
          <IonToast
            isOpen={toast.isOpen}
            onDidDismiss={() => setToast({ ...toast, isOpen: false })}
            message={toast.message}
            duration={3000}
            color={toast.color}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Dashboard;
