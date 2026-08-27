import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAlert,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonInput,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonToast,
  IonThumbnail,
} from "@ionic/react";
import {
  trash,
  addCircle,
  create,
  imageOutline,
  linkOutline,
} from "ionicons/icons";
import axios from "axios";
import api from "../../services/api";

interface Wisata {
  id?: number;
  nama_tempat: string;
  deskripsi: string;
  lokasi: string;
  gambar_url: string;
}

const KelolaWisata: React.FC = () => {
  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    color: "success",
  });

  const [showModalWisata, setShowModalWisata] = useState(false);
  const [isEditWisata, setIsEditWisata] = useState(false);
  const [formWisata, setFormWisata] = useState<Wisata>({
    nama_tempat: "",
    deskripsi: "",
    lokasi: "",
    gambar_url: "",
  });
  const [tipeGambar, setTipeGambar] = useState<"url" | "file">("url");
  const [detailWisata, setDetailWisata] = useState<Wisata | null>(null);
  const [hapusId, setHapusId] = useState<number | null>(null);

  useEffect(() => {
    ambilDataWisata();
  }, []);

  const ambilDataWisata = async () => {
    try {
      const res = await api.get("/wisata");
      const raw = res as unknown as Record<string, unknown>;
      const dataArr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.data)
          ? raw.data
          : [];
      setWisataList(dataArr as Wisata[]);
    } catch (error) {
      console.error(error);
    }
  };

  const tampilNotif = (pesan: string, warna: string = "success") => {
    setToast({ isOpen: true, message: pesan, color: warna });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormWisata({ ...formWisata, gambar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const simpanWisata = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditWisata && formWisata.id) {
        await api.put(`/wisata/${formWisata.id}`, formWisata);
        tampilNotif("Data Wisata berhasil diperbarui!");
      } else {
        await api.post("/wisata", formWisata);
        tampilNotif("Destinasi Wisata baru berhasil ditambahkan!");
      }
      setShowModalWisata(false);
      ambilDataWisata();
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Gagal simpan wisata.";
      tampilNotif(
        msg || "Gagal simpan wisata. Ukuran gambar mungkin terlalu besar.",
        "danger",
      );
    }
  };

  const eksekusiHapus = async () => {
    if (hapusId === null) return;
    try {
      await api.delete(`/wisata/${hapusId}`);
      tampilNotif("Data wisata berhasil dihapus!");
      ambilDataWisata();
    } catch (error: unknown) {
      console.error(error);
      tampilNotif("Gagal menghapus data wisata!", "danger");
    } finally {
      setHapusId(null);
    }
  };

  const noImage = "https://ionicframework.com/docs/img/demos/thumbnail.svg";

  return (
    <div>
      <IonButton
        expand="block"
        color="success"
        style={{ "--border-radius": "10px", marginBottom: "15px" }}
        onClick={() => {
          setIsEditWisata(false);
          setFormWisata({
            nama_tempat: "",
            deskripsi: "",
            lokasi: "",
            gambar_url: "",
          });
          setTipeGambar("url");
          setShowModalWisata(true);
        }}
      >
        <IonIcon slot="start" icon={addCircle} /> Tambah Destinasi
      </IonButton>

      <IonList
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        {wisataList.map((w) => (
          <IonItem key={w.id}>
            <IonThumbnail
              slot="start"
              onClick={() => setDetailWisata(w)}
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <img
                src={w.gambar_url || noImage}
                onError={(e) => (e.currentTarget.src = noImage)}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </IonThumbnail>
            <IonLabel
              onClick={() => setDetailWisata(w)}
              style={{ cursor: "pointer" }}
            >
              <h2>
                <strong>{w.nama_tempat}</strong>
              </h2>
              <p>{w.lokasi}</p>
            </IonLabel>
            <IonButton
              fill="clear"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditWisata(true);
                setFormWisata(w);
                setTipeGambar(
                  w.gambar_url.startsWith("data:image") ? "file" : "url",
                );
                setShowModalWisata(true);
              }}
            >
              <IonIcon icon={create} />
            </IonButton>
            <IonButton
              fill="clear"
              color="danger"
              onClick={(e) => {
                e.stopPropagation();
                setHapusId(w.id!);
              }}
            >
              <IonIcon icon={trash} />
            </IonButton>
          </IonItem>
        ))}
        {wisataList.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px", color: "gray" }}>
            Belum ada data wisata.
          </div>
        )}
      </IonList>

      <IonModal
        isOpen={showModalWisata}
        onDidDismiss={() => setShowModalWisata(false)}
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>
              {isEditWisata ? "Edit Wisata" : "Tambah Wisata"}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModalWisata(false)}>
                Batal
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={simpanWisata}>
            <IonItem
              lines="none"
              className="ion-margin-bottom"
              style={{
                "--background": "#f9fafb",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            >
              <IonInput
                label="Nama Tempat"
                labelPlacement="stacked"
                value={formWisata.nama_tempat}
                onIonChange={(e) =>
                  setFormWisata({ ...formWisata, nama_tempat: e.detail.value! })
                }
                required
              />
            </IonItem>
            <IonItem
              lines="none"
              className="ion-margin-bottom"
              style={{
                "--background": "#f9fafb",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            >
              <IonInput
                label="Lokasi"
                labelPlacement="stacked"
                value={formWisata.lokasi}
                onIonChange={(e) =>
                  setFormWisata({ ...formWisata, lokasi: e.detail.value! })
                }
                required
              />
            </IonItem>

            <div style={{ marginBottom: "15px" }}>
              <IonSegment
                value={tipeGambar}
                onIonChange={(e) =>
                  setTipeGambar(e.detail.value as "url" | "file")
                }
                style={{ marginBottom: "10px" }}
              >
                <IonSegmentButton value="url">
                  <IonIcon icon={linkOutline} />
                  <IonLabel>URL Link</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="file">
                  <IonIcon icon={imageOutline} />
                  <IonLabel>Perangkat</IonLabel>
                </IonSegmentButton>
              </IonSegment>
              {tipeGambar === "url" ? (
                <IonItem
                  lines="none"
                  style={{
                    "--background": "#f9fafb",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <IonInput
                    label="Link Gambar"
                    labelPlacement="stacked"
                    type="url"
                    value={formWisata.gambar_url}
                    onIonChange={(e) =>
                      setFormWisata({
                        ...formWisata,
                        gambar_url: e.detail.value!,
                      })
                    }
                    required
                  />
                </IonItem>
              ) : (
                <div
                  style={{
                    padding: "15px",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "10px",
                    textAlign: "center",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {formWisata.gambar_url &&
                    formWisata.gambar_url.startsWith("data:image") && (
                      <img
                        src={formWisata.gambar_url}
                        style={{
                          marginTop: "10px",
                          maxHeight: "100px",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                </div>
              )}
            </div>

            <IonItem
              lines="none"
              className="ion-margin-bottom"
              style={{
                "--background": "#f9fafb",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            >
              <IonTextarea
                label="Deskripsi Lengkap"
                labelPlacement="stacked"
                value={formWisata.deskripsi}
                onIonChange={(e) =>
                  setFormWisata({ ...formWisata, deskripsi: e.detail.value! })
                }
                required
                rows={4}
              />
            </IonItem>
            <IonButton
              expand="block"
              type="submit"
              color="success"
              style={{ "--border-radius": "10px", height: "50px" }}
            >
              Simpan Data
            </IonButton>
          </form>
        </IonContent>
      </IonModal>

      <IonModal
        isOpen={detailWisata !== null}
        onDidDismiss={() => setDetailWisata(null)}
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Detail Wisata</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setDetailWisata(null)}>Tutup</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {detailWisata && (
            <div style={{ textAlign: "center" }}>
              <img
                src={detailWisata.gambar_url}
                onError={(e) => (e.currentTarget.src = noImage)}
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  marginBottom: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "10px 0",
                  color: "#1f2937",
                }}
              >
                {detailWisata.nama_tempat}
              </h2>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#e0e7ff",
                  color: "#4338ca",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                📍 {detailWisata.lokasi}
              </div>
              <div
                style={{
                  textAlign: "left",
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
              >
                <p style={{ margin: 0, lineHeight: "1.8", color: "#4b5563" }}>
                  {detailWisata.deskripsi}
                </p>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={hapusId !== null}
        onDidDismiss={() => setHapusId(null)}
        header="Konfirmasi"
        message="Hapus data wisata ini secara permanen?"
        buttons={[
          { text: "Batal", role: "cancel" },
          { text: "Hapus", role: "destructive", handler: eksekusiHapus },
        ]}
      />
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

export default KelolaWisata;
