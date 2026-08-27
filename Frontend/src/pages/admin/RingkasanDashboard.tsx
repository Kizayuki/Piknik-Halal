import React, { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonBadge,
} from "@ionic/react";
import {
  mapOutline,
  busOutline,
  peopleOutline,
  chevronForwardOutline,
  personCircleOutline,
} from "ionicons/icons";
import axios from "axios";
import api from "../../services/api";

interface PreviewData {
  id: number;
  nama_tempat?: string;
  lokasi?: string;
  gambar_url?: string;
  nama_paket?: string;
  harga?: string | number;
  username?: string;
  role?: string;
}

interface Props {
  user: { role: string };
  setTabAktif: (
    tab: "ringkasan" | "wisata" | "paket" | "pengaturan" | "admin" | "profil",
  ) => void;
}

const RingkasanDashboard: React.FC<Props> = ({ user, setTabAktif }) => {
  const [dataWisata, setDataWisata] = useState<PreviewData[]>([]);
  const [dataPaket, setDataPaket] = useState<PreviewData[]>([]);
  const [dataAdmin, setDataAdmin] = useState<PreviewData[]>([]);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const noImage = "https://ionicframework.com/docs/img/demos/thumbnail.svg";

  const penyelamatData = (res: unknown): PreviewData[] => {
    const raw = res as Record<string, unknown>;
    if (Array.isArray(raw)) return raw as PreviewData[];
    if (Array.isArray(raw.data)) return raw.data as PreviewData[];
    return [];
  };

  useEffect(() => {
    const fetchSemuaData = async () => {
      try {
        setPesanError(null);

        const resW = await api.get("/wisata");
        setDataWisata(penyelamatData(resW));

        const resP = await api.get("/paket");
        setDataPaket(penyelamatData(resP));

        if (user.role === "Super Admin") {
          const resA = await api.get("/admins");
          const allAdmins = penyelamatData(resA);
          const filteredAdmins = allAdmins.filter(
            (a) => a.role !== "Super Admin",
          );
          setDataAdmin(filteredAdmins);
        }
      } catch (error: unknown) {
        console.error("DEBUG API ERROR:", error);
        if (axios.isAxiosError(error)) {
          setPesanError(
            `Status: ${error.response?.status || "Network Error"} | Pesan: ${error.message}`,
          );
        } else {
          setPesanError("Gagal mengeksekusi API (Error Tidak Diketahui).");
        }
      }
    };
    fetchSemuaData();
  }, [user]);

  return (
    <div
      style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "30px" }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#1f2937",
          textAlign: "center",
        }}
      >
        Ringkasan Sistem
      </h2>

      {pesanError && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            border: "2px solid #ef4444",
            color: "#b91c1c",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          🚨 GAGAL TERHUBUNG KE BACKEND 🚨 <br />
          <span style={{ fontSize: "16px" }}>{pesanError}</span>
        </div>
      )}

      <IonGrid style={{ padding: 0 }}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="12" sizeMd="4">
            <IonCard
              style={{
                borderRadius: "20px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                margin: "10px",
                backgroundColor: "#ffffff",
              }}
            >
              <IonCardContent
                style={{ textAlign: "center", padding: "30px 20px" }}
              >
                <IonIcon
                  icon={mapOutline}
                  style={{
                    fontSize: "50px",
                    color: "#2563eb",
                    marginBottom: "15px",
                  }}
                />
                <h2
                  style={{
                    fontSize: "48px",
                    fontWeight: "900",
                    margin: "0",
                    color: "#1f2937",
                  }}
                >
                  {dataWisata.length}
                </h2>
                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                    fontSize: "16px",
                    marginTop: "5px",
                  }}
                >
                  Destinasi Wisata
                </p>
                <IonButton
                  expand="block"
                  fill="solid"
                  color="primary"
                  style={{
                    "--border-radius": "12px",
                    height: "45px",
                    fontWeight: "bold",
                  }}
                  onClick={() => setTabAktif("wisata")}
                >
                  KELOLA WISATA
                </IonButton>
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol size="12" sizeMd="4">
            <IonCard
              style={{
                borderRadius: "20px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                margin: "10px",
                backgroundColor: "#ffffff",
              }}
            >
              <IonCardContent
                style={{ textAlign: "center", padding: "30px 20px" }}
              >
                <IonIcon
                  icon={busOutline}
                  style={{
                    fontSize: "50px",
                    color: "#10b981",
                    marginBottom: "15px",
                  }}
                />
                <h2
                  style={{
                    fontSize: "48px",
                    fontWeight: "900",
                    margin: "0",
                    color: "#1f2937",
                  }}
                >
                  {dataPaket.length}
                </h2>
                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "25px",
                    fontSize: "16px",
                    marginTop: "5px",
                  }}
                >
                  Paket Perjalanan
                </p>
                <IonButton
                  expand="block"
                  fill="solid"
                  color="success"
                  style={{
                    "--border-radius": "12px",
                    height: "45px",
                    fontWeight: "bold",
                  }}
                  onClick={() => setTabAktif("paket")}
                >
                  KELOLA PAKET
                </IonButton>
              </IonCardContent>
            </IonCard>
          </IonCol>

          {user.role === "Super Admin" && (
            <IonCol size="12" sizeMd="4">
              <IonCard
                style={{
                  borderRadius: "20px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  margin: "10px",
                  backgroundColor: "#ffffff",
                }}
              >
                <IonCardContent
                  style={{ textAlign: "center", padding: "30px 20px" }}
                >
                  <IonIcon
                    icon={peopleOutline}
                    style={{
                      fontSize: "50px",
                      color: "#f59e0b",
                      marginBottom: "15px",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: "48px",
                      fontWeight: "900",
                      margin: "0",
                      color: "#1f2937",
                    }}
                  >
                    {dataAdmin.length}
                  </h2>
                  <p
                    style={{
                      color: "#6b7280",
                      marginBottom: "25px",
                      fontSize: "16px",
                      marginTop: "5px",
                    }}
                  >
                    Akun Terdaftar
                  </p>
                  <IonButton
                    expand="block"
                    fill="solid"
                    color="warning"
                    style={{
                      "--border-radius": "12px",
                      height: "45px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    onClick={() => setTabAktif("admin")}
                  >
                    KELOLA ADMIN
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          )}
        </IonRow>
      </IonGrid>

      <h3
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginTop: "30px",
          marginLeft: "10px",
          color: "#1f2937",
        }}
      >
        Data Terbaru
      </h3>
      <IonGrid style={{ padding: 0 }}>
        <IonRow>
          <IonCol size="12">
            <IonCard
              style={{
                borderRadius: "15px",
                margin: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                📍 Destinasi Wisata
              </div>
              <IonList style={{ padding: 0, margin: 0 }}>
                {dataWisata.slice(0, 3).map((w, index) => (
                  <IonItem
                    key={index}
                    lines="full"
                    button
                    onClick={() => setTabAktif("wisata")}
                  >
                    <IonThumbnail
                      slot="start"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={w.gambar_url || noImage}
                        onError={(e) => (e.currentTarget.src = noImage)}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          display: "block",
                        }}
                      />
                    </IonThumbnail>
                    <IonLabel className="ion-text-wrap">
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          marginBottom: "4px",
                        }}
                      >
                        {w.nama_tempat}
                      </h3>
                      <p style={{ fontSize: "13px", color: "#6b7280" }}>
                        {w.lokasi}
                      </p>
                    </IonLabel>
                    <IonIcon
                      icon={chevronForwardOutline}
                      slot="end"
                      color="medium"
                      style={{ fontSize: "16px" }}
                    />
                  </IonItem>
                ))}
                {dataWisata.length === 0 && !pesanError && (
                  <IonItem lines="none">
                    <IonLabel
                      color="medium"
                      className="ion-text-center"
                      style={{ padding: "20px 0" }}
                    >
                      Belum ada data
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </IonCard>
          </IonCol>

          <IonCol size="12">
            <IonCard
              style={{
                borderRadius: "15px",
                margin: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                🚌 Paket Perjalanan
              </div>
              <IonList style={{ padding: 0, margin: 0 }}>
                {dataPaket.slice(0, 3).map((p, index) => (
                  <IonItem
                    key={index}
                    lines="full"
                    button
                    onClick={() => setTabAktif("paket")}
                  >
                    <IonThumbnail
                      slot="start"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={p.gambar_url || noImage}
                        onError={(e) => (e.currentTarget.src = noImage)}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          display: "block",
                        }}
                      />
                    </IonThumbnail>
                    <IonLabel className="ion-text-wrap">
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          marginBottom: "4px",
                        }}
                      >
                        {p.nama_paket}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#10b981",
                          fontWeight: "bold",
                        }}
                      >
                        Rp {Number(p.harga || 0).toLocaleString("id-ID")}
                      </p>
                    </IonLabel>
                    <IonIcon
                      icon={chevronForwardOutline}
                      slot="end"
                      color="medium"
                      style={{ fontSize: "16px" }}
                    />
                  </IonItem>
                ))}
                {dataPaket.length === 0 && !pesanError && (
                  <IonItem lines="none">
                    <IonLabel
                      color="medium"
                      className="ion-text-center"
                      style={{ padding: "20px 0" }}
                    >
                      Belum ada data
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </IonCard>
          </IonCol>

          {user.role === "Super Admin" && (
            <IonCol size="12">
              <IonCard
                style={{
                  borderRadius: "15px",
                  margin: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: "bold",
                    color: "#1f2937",
                  }}
                >
                  👥 Akun Admin
                </div>
                <IonList style={{ padding: 0, margin: 0 }}>
                  {dataAdmin.slice(0, 3).map((a, index) => (
                    <IonItem
                      key={index}
                      lines="full"
                      button
                      onClick={() => setTabAktif("admin")}
                    >
                      <IonIcon
                        icon={personCircleOutline}
                        slot="start"
                        style={{
                          fontSize: "40px",
                          color: "#9ca3af",
                          margin: "5px 15px 5px 0",
                        }}
                      />
                      <IonLabel className="ion-text-wrap">
                        <h3
                          style={{
                            fontWeight: "bold",
                            fontSize: "15px",
                            marginBottom: "4px",
                          }}
                        >
                          {a.username}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#6b7280" }}>
                          {a.role}
                        </p>
                      </IonLabel>
                      <IonBadge
                        color={a.role === "Super Admin" ? "primary" : "medium"}
                        slot="end"
                        style={{ padding: "5px 8px" }}
                      >
                        {a.role === "Super Admin" ? "SA" : "A"}
                      </IonBadge>
                    </IonItem>
                  ))}
                  {dataAdmin.length === 0 && !pesanError && (
                    <IonItem lines="none">
                      <IonLabel
                        color="medium"
                        className="ion-text-center"
                        style={{ padding: "20px 0" }}
                      >
                        Belum ada data
                      </IonLabel>
                    </IonItem>
                  )}
                </IonList>
              </IonCard>
            </IonCol>
          )}
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default RingkasanDashboard;
