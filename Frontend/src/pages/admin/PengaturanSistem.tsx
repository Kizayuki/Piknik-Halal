import React, { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  IonLabel,
} from "@ionic/react";
import { saveOutline, imageOutline } from "ionicons/icons";
import axios from "axios";
import api from "../../services/api";

interface Props {
  onUpdateNamaSistem?: (namaBaru: string) => void;
}

const PengaturanSistem: React.FC<Props> = ({ onUpdateNamaSistem }) => {
  const [nomorWA, setNomorWA] = useState("");
  const [namaSistem, setNamaSistem] = useState("Wisata Religi CMS");
  const [ikonSistem, setIkonSistem] = useState("");
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    color: "success",
  });

  useEffect(() => {
    const ambilPengaturan = async () => {
      try {
        const res = await api.get("/pengaturan/wa");
        const rawRes = res as unknown as Record<string, unknown>;
        const data = (
          rawRes.data !== undefined ? rawRes.data : rawRes
        ) as Record<string, string>;

        if (data) {
          setNomorWA(data.nomor_wa || "");
          setNamaSistem(data.nama_sistem || "Wisata Religi CMS");
          setIkonSistem(data.ikon_sistem || "");
        }
      } catch (error) {
        console.error("Gagal load pengaturan", error);
      }
    };
    ambilPengaturan();
  }, []);

  const tampilNotif = (pesan: string, warna: string = "success") => {
    setToast({ isOpen: true, message: pesan, color: warna });
  };

  const handleUploadIkon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIkonSistem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simpanPengaturan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/pengaturan/wa", {
        nomor_baru: nomorWA,
        nama_sistem: namaSistem,
        ikon_sistem: ikonSistem,
      });

      document.title = namaSistem;
      if (onUpdateNamaSistem) onUpdateNamaSistem(namaSistem);

      if (ikonSistem) {
        let link = document.querySelector(
          "link[rel~='icon']",
        ) as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = ikonSistem;
      }

      tampilNotif("Pengaturan sistem berhasil diperbarui!");
    } catch (error: unknown) {
      console.error("Detail Error API Pengaturan:", error);
      const errResponse = axios.isAxiosError(error)
        ? (error.response?.data as Record<string, string>)
        : null;
      tampilNotif(
        errResponse?.message ||
          errResponse?.error ||
          "Gagal menyimpan pengaturan.",
        "danger",
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <IonCard
        style={{
          borderRadius: "20px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        }}
      >
        <IonCardContent style={{ padding: "30px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#1f2937",
            }}
          >
            Konfigurasi Sistem Utama
          </h2>
          <form onSubmit={simpanPengaturan}>
            <div style={{ marginBottom: "20px" }}>
              <IonLabel
                style={{
                  fontWeight: "bold",
                  color: "#4b5563",
                  marginBottom: "10px",
                  display: "block",
                }}
              >
                Nama Aplikasi / Sistem
              </IonLabel>
              <IonItem
                lines="none"
                style={{
                  "--background": "#f9fafb",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <IonInput
                  type="text"
                  value={namaSistem}
                  onIonChange={(e) => setNamaSistem(e.detail.value!)}
                  required
                />
              </IonItem>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <IonLabel
                style={{
                  fontWeight: "bold",
                  color: "#4b5563",
                  marginBottom: "10px",
                  display: "block",
                }}
              >
                Nomor WhatsApp Admin (Penerima Pesanan)
              </IonLabel>
              <IonItem
                lines="none"
                style={{
                  "--background": "#f9fafb",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <IonInput
                  type="text"
                  inputmode="numeric"
                  placeholder="Contoh: 62812345678"
                  value={nomorWA}
                  onIonChange={(e) => setNomorWA(e.detail.value!)}
                  required
                />
              </IonItem>
              <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
                *Gunakan kode negara (62) tanpa tanda plus (+).
              </p>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <IonLabel
                style={{
                  fontWeight: "bold",
                  color: "#4b5563",
                  marginBottom: "10px",
                  display: "block",
                }}
              >
                Ikon / Logo Sistem
              </IonLabel>
              <div
                style={{
                  padding: "15px",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "10px",
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                }}
              >
                {ikonSistem ? (
                  <img
                    src={ikonSistem}
                    alt="Ikon"
                    style={{
                      height: "80px",
                      marginBottom: "15px",
                      borderRadius: "10px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <IonIcon
                    icon={imageOutline}
                    style={{
                      fontSize: "40px",
                      color: "#94a3b8",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <br />
                <IonButton
                  fill="outline"
                  size="small"
                  onClick={() =>
                    document.getElementById("upload-ikon")?.click()
                  }
                >
                  Pilih Gambar Ikon
                </IonButton>
                <input
                  type="file"
                  id="upload-ikon"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleUploadIkon}
                />
              </div>
            </div>
            <IonButton
              expand="block"
              type="submit"
              color="primary"
              style={{
                "--border-radius": "10px",
                height: "50px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              <IonIcon slot="start" icon={saveOutline} /> SIMPAN PENGATURAN
            </IonButton>
          </form>
        </IonCardContent>
      </IonCard>
      <IonToast
        isOpen={toast.isOpen}
        onDidDismiss={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        duration={3000}
        color={toast.color}
      />
    </div>
  );
};

export default PengaturanSistem;
