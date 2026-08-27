import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import {
  logoWhatsapp,
  checkmarkCircleOutline,
  locationOutline,
} from "ionicons/icons";
import api from "../../services/api";

interface DetailPaketType {
  nama_paket: string;
  durasi?: string;
  deskripsi_singkat: string;
  fasilitas: string;
  harga: string;
  gambar_url: string;
  daftar_wisata: {
    id: number;
    nama_tempat: string;
    lokasi: string;
    gambar_url: string;
  }[];
}

const DetailPaket = () => {
  const { id } = useParams<{ id: string }>();
  const [paket, setPaket] = useState<DetailPaketType | null>(null);
  const [nomorWA, setNomorWA] = useState<string>("");

  useEffect(() => {
    const ambilData = async () => {
      try {
        const resPaket = await api.get(`/paket/${id}`);
        setPaket(resPaket.data);
        const resWA = await api.get("/pengaturan/wa");

        const rawWa = resWA as unknown as Record<string, unknown>;
        const dataWa = (
          rawWa.data !== undefined ? rawWa.data : rawWa
        ) as Record<string, string>;
        if (dataWa && dataWa.nomor_wa) setNomorWA(dataWa.nomor_wa);
      } catch (error) {
        console.error("Gagal memuat detail", error);
      }
    };
    ambilData();
  }, [id]);

  const tanganiPesanWA = () => {
    if (!nomorWA) {
      alert("Sedang menghubungkan ke sistem Admin...");
      return;
    }
    const urlHalaman = window.location.href;
    const pesan = `Assalamu'alaikum Admin, saya ingin bertanya dan memesan tiket untuk: *${paket?.nama_paket}*. \n\nMohon informasi lebih lanjut. \n\nLink Paket: ${urlHalaman}`;
    window.open(
      `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`,
      "_blank",
    );
  };

  const noImage =
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=600&auto=format&fit=crop";

  if (!paket) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            Memuat detail perjalanan...
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');`}
      </style>
      <IonHeader
        className="ion-no-border"
        style={{ position: "absolute", top: 0, width: "100%", zIndex: 10 }}
      >
        <IonToolbar
          style={{ "--background": "transparent" } as React.CSSProperties}
        >
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/"
              text="Kembali"
              style={{
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "20px",
                marginLeft: "10px",
              }}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ "--background": "#f3f4f6" } as React.CSSProperties}>
        <div
          style={{
            width: "100%",
            backgroundColor: "#1f2937",
            position: "relative",
            paddingBottom: "15px",
          }}
        >
          <img
            src={paket.gambar_url || noImage}
            onError={(e) => {
              e.currentTarget.src = noImage;
            }}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "450px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: "25px",
            borderTopRightRadius: "25px",
            position: "relative",
            zIndex: 5,
            padding: "30px 20px",
            minHeight: "calc(100vh - 310px)",
            paddingBottom: "100px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#065f46",
                  marginRight: "10px",
                }}
              ></div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#4b5563",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                PAKET PERJALANAN
              </span>
            </div>

            {paket.durasi && (
              <div
                style={{
                  backgroundColor: "#065f46",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Durasi: {paket.durasi}
              </div>
            )}
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              fontWeight: "bold",
              color: "#1f2937",
              marginTop: "0",
              marginBottom: "25px",
              lineHeight: "1.2",
            }}
          >
            {paket.nama_paket}
          </h1>

          <div
            style={{
              width: "100%",
              backgroundColor: "#fff7ed",
              color: "#ea580c",
              padding: "15px 20px",
              borderRadius: "12px",
              marginBottom: "25px",
              border: "1px solid #ffedd5",
            }}
          >
            <span
              style={{ fontSize: "14px", fontWeight: "500", color: "#ea580c" }}
            >
              Harga Paket
            </span>
            <br />
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: "5px 0 0 0",
                color: "#ea580c",
              }}
            >
              Rp {Number(paket.harga).toLocaleString("id-ID")}
            </h2>
          </div>

          <div style={{ width: "100%", marginBottom: "15px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#10b981",
                borderBottom: "2px solid #10b981",
                paddingBottom: "8px",
                display: "inline-block",
                margin: 0,
              }}
            >
              Tentang Paket Ini
            </h3>
          </div>
          <p
            style={{
              width: "100%",
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#4b5563",
              marginBottom: "30px",
              whiteSpace: "pre-line",
            }}
          >
            {paket.deskripsi_singkat}
          </p>

          {paket.daftar_wisata && paket.daftar_wisata.length > 0 && (
            <div style={{ width: "100%", marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#2563eb",
                  borderBottom: "2px solid #2563eb",
                  paddingBottom: "8px",
                  display: "inline-block",
                  margin: "0 0 15px 0",
                }}
              >
                Destinasi Kunjungan
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {paket.daftar_wisata.map((wisata, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#f8fafc",
                      padding: "12px 15px",
                      borderRadius: "15px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#dbeafe",
                        padding: "10px",
                        borderRadius: "12px",
                        marginRight: "15px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IonIcon
                        icon={locationOutline}
                        style={{ color: "#2563eb", fontSize: "24px" }}
                      />
                    </div>
                    <div>
                      <h4
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#1f2937",
                        }}
                      >
                        {wisata.nama_tempat}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        {wisata.lokasi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              width: "100%",
              backgroundColor: "#f0fdf4",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid #bbf7d0",
              marginBottom: "30px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                margin: "0 0 15px 0",
                color: "#166534",
              }}
            >
              Fasilitas yang Didapat
            </h3>
            <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
              {paket.fasilitas
                .split("\n")
                .filter((f) => f.trim() !== "")
                .map((item, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                      color: "#374151",
                      lineHeight: "1.4",
                    }}
                  >
                    <IonIcon
                      icon={checkmarkCircleOutline}
                      style={{
                        color: "#10b981",
                        fontSize: "24px",
                        marginRight: "10px",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flexGrow: 1 }}>{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            padding: "15px 20px",
            backgroundColor: "white",
            borderTop: "1px solid #e5e7eb",
            zIndex: 20,
          }}
        >
          <IonButton
            expand="block"
            color="success"
            onClick={tanganiPesanWA}
            style={{
              "--border-radius": "15px",
              height: "55px",
              fontSize: "18px",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
            }}
          >
            <IonIcon
              slot="start"
              icon={logoWhatsapp}
              style={{ fontSize: "26px" }}
            />{" "}
            PESAN VIA WHATSAPP
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DetailPaket;
