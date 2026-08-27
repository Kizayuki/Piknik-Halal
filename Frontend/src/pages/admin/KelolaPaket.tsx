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
  IonSelect,
  IonSelectOption,
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
  id: number;
  nama_tempat: string;
}

interface Paket {
  id?: number;
  nama_paket: string;
  durasi: string;
  deskripsi_singkat: string;
  fasilitas: string;
  harga: string;
  gambar_url: string;
  wisata_ids: number[] | string;
}

const KelolaPaket: React.FC = () => {
  const [paketList, setPaketList] = useState<Paket[]>([]);
  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    color: "success",
  });

  const [showModalPaket, setShowModalPaket] = useState(false);
  const [isEditPaket, setIsEditPaket] = useState(false);
  const [formPaket, setFormPaket] = useState<Paket>({
    nama_paket: "",
    durasi: "",
    deskripsi_singkat: "",
    fasilitas: "",
    harga: "",
    gambar_url: "",
    wisata_ids: [],
  });
  const [tipeGambar, setTipeGambar] = useState<"url" | "file">("url");
  const [detailPaket, setDetailPaket] = useState<Paket | null>(null);
  const [hapusId, setHapusId] = useState<number | null>(null);

  useEffect(() => {
    ambilDataPaket();
    ambilDataWisata();
  }, []);

  const ambilDataPaket = async () => {
    try {
      const res = await api.get("/paket");
      const raw = res as unknown as Record<string, unknown>;
      const dataArr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.data)
          ? raw.data
          : [];
      setPaketList(dataArr as Paket[]);
    } catch (error) {
      console.error(error);
    }
  };

  const ambilDataWisata = async () => {
    try {
      const res = await api.get("/wisata");
      setWisataList(res.data);
    } catch (error: unknown) {
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
        setFormPaket({ ...formPaket, gambar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const simpanPaket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditPaket && formPaket.id) {
        await api.put(`/paket/${formPaket.id}`, formPaket);
        tampilNotif("Data Paket berhasil diperbarui!");
      } else {
        await api.post("/paket", formPaket);
        tampilNotif("Paket Perjalanan baru berhasil dibuat!");
      }
      setShowModalPaket(false);
      ambilDataPaket();
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.response?.data?.error
        : "Gagal simpan paket.";
      tampilNotif(
        msg || "Gagal simpan paket. Ukuran gambar mungkin terlalu besar.",
        "danger",
      );
    }
  };

  const eksekusiHapus = async () => {
    if (hapusId === null) return;
    try {
      await api.delete(`/paket/${hapusId}`);
      tampilNotif("Data paket berhasil dihapus!");
      ambilDataPaket();
    } catch (error: unknown) {
      console.error(error);
      tampilNotif("Gagal menghapus data paket!", "danger");
    } finally {
      setHapusId(null);
    }
  };

  const noImage = "https://ionicframework.com/docs/img/demos/thumbnail.svg";

  const parseWisataIds = (ids: unknown): number[] => {
    if (!ids) return [];
    if (Array.isArray(ids)) return ids.map(Number);
    if (typeof ids === "string") {
      if (ids.includes(",")) {
        return ids.split(",").map((id) => Number(id.trim()));
      }
      try {
        const parsed = JSON.parse(ids);
        return Array.isArray(parsed) ? parsed.map(Number) : [Number(parsed)];
      } catch {
        return [Number(ids)];
      }
    }
    if (typeof ids === "number") return [ids];
    return [];
  };

  const getSelectedWisataNames = () => {
    const ids = parseWisataIds(formPaket.wisata_ids);
    if (ids.length === 0) return undefined;
    const names = wisataList
      .filter((w) => ids.includes(w.id))
      .map((w) => `• ${w.nama_tempat}`);
    return names.join("\n");
  };

  return (
    <div>
      <style>
        {`
          /* SANGAT PENTING: Membobol CSS bawaan Ionic Select agar teks bisa multi-baris */
          .custom-select-wrap::part(text) {
             white-space: pre-line !important; 
             display: block !important;
             line-height: 1.6 !important;
             padding-top: 8px !important;
             padding-bottom: 8px !important;
          }
        `}
      </style>

      <IonButton
        expand="block"
        color="success"
        style={{ "--border-radius": "10px", marginBottom: "15px" }}
        onClick={() => {
          setIsEditPaket(false);
          setFormPaket({
            nama_paket: "",
            durasi: "",
            deskripsi_singkat: "",
            fasilitas: "",
            harga: "",
            gambar_url: "",
            wisata_ids: [],
          });
          setTipeGambar("url");
          setShowModalPaket(true);
        }}
      >
        <IonIcon slot="start" icon={addCircle} /> Buat Paket Baru
      </IonButton>

      <IonList
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        {paketList.map((p) => (
          <IonItem key={p.id}>
            <IonThumbnail
              slot="start"
              onClick={() => setDetailPaket(p)}
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <img
                src={p.gambar_url || noImage}
                onError={(e) => (e.currentTarget.src = noImage)}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </IonThumbnail>
            <IonLabel
              onClick={() => setDetailPaket(p)}
              style={{ cursor: "pointer" }}
            >
              <h2>
                <strong>{p.nama_paket}</strong>
              </h2>
              <p style={{ color: "#ea580c", fontWeight: "bold" }}>
                Rp {Number(p.harga).toLocaleString("id-ID")}
              </p>
            </IonLabel>
            <IonButton
              fill="clear"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditPaket(true);
                setFormPaket({
                  ...p,
                  durasi: p.durasi || "",
                  wisata_ids: parseWisataIds(p.wisata_ids),
                });
                setTipeGambar(
                  p.gambar_url.startsWith("data:image") ? "file" : "url",
                );
                setShowModalPaket(true);
              }}
            >
              <IonIcon icon={create} />
            </IonButton>
            <IonButton
              fill="clear"
              color="danger"
              onClick={(e) => {
                e.stopPropagation();
                setHapusId(p.id!);
              }}
            >
              <IonIcon icon={trash} />
            </IonButton>
          </IonItem>
        ))}
        {paketList.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px", color: "gray" }}>
            Belum ada data paket perjalanan.
          </div>
        )}
      </IonList>

      <IonModal
        isOpen={showModalPaket}
        onDidDismiss={() => setShowModalPaket(false)}
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>
              {isEditPaket ? "Edit Paket" : "Buat Paket Baru"}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModalPaket(false)}>
                Batal
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={simpanPaket}>
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
                label="Nama Paket"
                labelPlacement="stacked"
                value={formPaket.nama_paket}
                onIonChange={(e) =>
                  setFormPaket({ ...formPaket, nama_paket: e.detail.value! })
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
                label="Durasi Paket"
                placeholder="Contoh: 3 Hari 2 Malam"
                labelPlacement="stacked"
                value={formPaket.durasi}
                onIonChange={(e) =>
                  setFormPaket({ ...formPaket, durasi: e.detail.value! })
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
                label="Harga Paket (Rp)"
                labelPlacement="stacked"
                type="number"
                value={formPaket.harga}
                onIonChange={(e) =>
                  setFormPaket({ ...formPaket, harga: e.detail.value! })
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
                    label="Link Gambar Cover"
                    labelPlacement="stacked"
                    type="url"
                    value={formPaket.gambar_url}
                    onIonChange={(e) =>
                      setFormPaket({
                        ...formPaket,
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
                  {formPaket.gambar_url &&
                    formPaket.gambar_url.startsWith("data:image") && (
                      <img
                        src={formPaket.gambar_url}
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
              <IonSelect
                className="custom-select-wrap"
                label="Destinasi Wisata Terkait"
                labelPlacement="stacked"
                multiple={true}
                cancelText="Batal"
                okText="Pilih"
                value={formPaket.wisata_ids}
                selectedText={
                  formPaket.wisata_ids &&
                  parseWisataIds(formPaket.wisata_ids).length > 0
                    ? getSelectedWisataNames()
                    : undefined
                }
                onIonChange={(e) =>
                  setFormPaket({ ...formPaket, wisata_ids: e.detail.value })
                }
              >
                {wisataList.map((w) => (
                  <IonSelectOption key={w.id} value={w.id}>
                    {w.nama_tempat}
                  </IonSelectOption>
                ))}
              </IonSelect>
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
              <IonTextarea
                label="Deskripsi Singkat"
                labelPlacement="stacked"
                value={formPaket.deskripsi_singkat}
                onIonChange={(e) =>
                  setFormPaket({
                    ...formPaket,
                    deskripsi_singkat: e.detail.value!,
                  })
                }
                required
                rows={2}
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
              <IonTextarea
                label="Fasilitas Lengkap"
                labelPlacement="stacked"
                value={formPaket.fasilitas}
                onIonChange={(e) =>
                  setFormPaket({ ...formPaket, fasilitas: e.detail.value! })
                }
                required
                rows={3}
              />
            </IonItem>
            <IonButton
              expand="block"
              type="submit"
              color="success"
              style={{ "--border-radius": "10px", height: "50px" }}
            >
              Simpan Paket
            </IonButton>
          </form>
        </IonContent>
      </IonModal>

      <IonModal
        isOpen={detailPaket !== null}
        onDidDismiss={() => setDetailPaket(null)}
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Detail Paket</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setDetailPaket(null)}>Tutup</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {detailPaket && (
            <div style={{ textAlign: "center", paddingBottom: "40px" }}>
              <img
                src={detailPaket.gambar_url}
                onError={(e) => (e.currentTarget.src = noImage)}
                style={{
                  width: "100%",
                  borderRadius: "15px",
                  marginBottom: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <div
                style={{
                  backgroundColor: "#065f46",
                  color: "white",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "inline-block",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Durasi: {detailPaket.durasi || "Belum diatur"}
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "0 0 10px 0",
                  color: "#1f2937",
                }}
              >
                {detailPaket.nama_paket}
              </h2>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#fff7ed",
                  color: "#ea580c",
                  padding: "8px 20px",
                  borderRadius: "15px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                Rp {Number(detailPaket.harga).toLocaleString("id-ID")}
              </div>

              <div
                style={{
                  textAlign: "left",
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  marginBottom: "15px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  Deskripsi:
                </h4>
                <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.6" }}>
                  {detailPaket.deskripsi_singkat}
                </p>
              </div>

              <div
                style={{
                  textAlign: "left",
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  marginBottom: "15px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  Destinasi Kunjungan:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    color: "#4b5563",
                    lineHeight: "1.6",
                  }}
                >
                  {(() => {
                    const ids = parseWisataIds(detailPaket.wisata_ids);
                    const destinasiTerpilih = wisataList.filter((w) =>
                      ids.includes(w.id),
                    );
                    if (destinasiTerpilih.length === 0)
                      return <li>Belum ada destinasi yang dipilih.</li>;
                    return destinasiTerpilih.map((d) => (
                      <li key={d.id}>{d.nama_tempat}</li>
                    ));
                  })()}
                </ul>
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
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  Fasilitas:
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: "#4b5563",
                    whiteSpace: "pre-line",
                    lineHeight: "1.6",
                  }}
                >
                  {detailPaket.fasilitas}
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
        message="Hapus paket ini secara permanen?"
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

export default KelolaPaket;
