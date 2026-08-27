import React, { useEffect, useState, useRef } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  useIonRouter,
  IonModal,
  IonButtons,
} from "@ionic/react";
import {
  locationOutline,
  mapOutline,
  informationCircleOutline,
  logoWhatsapp,
} from "ionicons/icons";
import api from "../../services/api";

interface PaketWisata {
  id: number;
  nama_paket: string;
  durasi: string;
  deskripsi_singkat: string;
  harga: string;
  gambar_url: string;
}

interface WisataTunggal {
  id: number;
  nama_tempat: string;
  deskripsi: string;
  lokasi: string;
  gambar_url: string;
}

const Home = () => {
  const router = useIonRouter();
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const [paketList, setPaketList] = useState<PaketWisata[]>([]);
  const [wisataList, setWisataList] = useState<WisataTunggal[]>([]);
  const [nomorWA, setNomorWA] = useState("");
  const [namaSistem, setNamaSistem] = useState("Wisata Religi");
  const [filterMode, setFilterMode] = useState<"beranda" | "paket" | "wisata">(
    "beranda",
  );
  const [detailWisata, setDetailWisata] = useState<WisataTunggal | null>(null);

  useEffect(() => {
    const ambilData = async () => {
      try {
        const resPaket = await api.get("/paket");
        setPaketList(resPaket.data);
        const resWisata = await api.get("/wisata");
        setWisataList(resWisata.data);
        const resWa = await api.get("/pengaturan/wa");
        const rawWa = resWa as unknown as Record<string, unknown>;
        const dataWa = (
          rawWa.data !== undefined ? rawWa.data : rawWa
        ) as Record<string, string>;

        if (dataWa) {
          if (dataWa.nomor_wa) setNomorWA(dataWa.nomor_wa);
          if (dataWa.nama_sistem) setNamaSistem(dataWa.nama_sistem);
        }
      } catch (error) {
        console.error("Gagal memuat data", error);
      }
    };
    ambilData();
  }, []);

  const tanganiPilihMenu = (mode: "beranda" | "paket" | "wisata") => {
    setFilterMode(mode);
    if (contentRef.current) {
      contentRef.current.scrollToTop(500);
    }
  };

  const noImage =
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=600&auto=format&fit=crop";

  const renderHeroSection = () => {
    if (filterMode === "paket") {
      return (
        <div
          style={{
            backgroundColor: "transparent",
            padding: "10px 20px 20px 20px",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "bold",
              fontFamily: "'Playfair Display', serif",
              color: "#1f2937",
              margin: "0 0 15px 0",
              lineHeight: "1.2",
            }}
          >
            Paket Ziarah
          </h1>
          <p
            style={{
              fontSize: "16px",
              margin: 0,
              color: "#4b5563",
              lineHeight: "1.6",
            }}
          >
            Satu perjalanan, banyak tempat suci. Semua sudah kami atur,
            Bapak/Ibu tinggal berangkat dengan tenang.
          </p>
        </div>
      );
    } else if (filterMode === "wisata") {
      return (
        <div
          style={{
            backgroundColor: "transparent",
            padding: "10px 20px 20px 20px",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "bold",
              fontFamily: "'Playfair Display', serif",
              color: "#1f2937",
              margin: "0 0 15px 0",
              lineHeight: "1.2",
            }}
          >
            Wisata Religi
          </h1>
          <p
            style={{
              fontSize: "16px",
              margin: 0,
              color: "#4b5563",
              lineHeight: "1.6",
            }}
          >
            Tempat-tempat suci dan bersejarah yang siap Bapak & Ibu kunjungi.
          </p>
        </div>
      );
    } else {
      return (
        <div
          style={{
            backgroundColor: "transparent",
            padding: "10px 20px 20px 20px",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              fontFamily: "'Playfair Display', serif",
              color: "#1f2937",
              margin: "0 0 20px 0",
              lineHeight: "1.2",
            }}
          >
            Ziarah dengan Tenang, <br />
            <span style={{ fontStyle: "italic", color: "#065f46" }}>
              Ibadah dengan Khusyuk
            </span>
          </h1>
          <p
            style={{
              fontSize: "16px",
              margin: 0,
              color: "#4b5563",
              lineHeight: "1.6",
            }}
          >
            Kami membantu Bapak/Ibu mengunjungi masjid bersejarah, makam para
            wali, dan tempat suci islami di seluruh Indonesia. Tanpa perlu
            mendaftar, cukup tekan satu tombol dan pesan lewat WhatsApp.
          </p>
        </div>
      );
    }
  };

  return (
    <IonPage>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <IonHeader className="ion-no-border">
        <IonToolbar
          style={
            {
              "--background": "#f9fafb",
              padding: "10px 10px 0 10px",
            } as React.CSSProperties
          }
        >
          <IonTitle
            style={{
              fontSize: "35px",
              fontWeight: "900",
              fontFamily: "'Playfair Display', serif",
              color: "#1f2937",
              textAlign: "left",
              paddingLeft: "5px",
            }}
          >
            {namaSistem}
          </IonTitle>
        </IonToolbar>

        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "10px",
            padding: "10px 20px",
            backgroundColor: "#f9fafb",
            overflowX: "auto",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={() => tanganiPilihMenu("beranda")}
            style={{
              padding: "10px 22px",
              borderRadius: "25px",
              backgroundColor: filterMode === "beranda" ? "#065f46" : "#ffffff",
              color: filterMode === "beranda" ? "white" : "#4b5563",
              fontWeight: "bold",
              border: filterMode === "beranda" ? "none" : "1px solid #d1d5db",
              whiteSpace: "nowrap",
              fontSize: "14px",
              transition: "0.3s",
            }}
          >
            Beranda
          </button>
          <button
            onClick={() => tanganiPilihMenu("paket")}
            style={{
              padding: "10px 22px",
              borderRadius: "25px",
              backgroundColor: filterMode === "paket" ? "#065f46" : "#ffffff",
              color: filterMode === "paket" ? "white" : "#4b5563",
              fontWeight: "bold",
              border: filterMode === "paket" ? "none" : "1px solid #d1d5db",
              whiteSpace: "nowrap",
              fontSize: "14px",
              transition: "0.3s",
            }}
          >
            Paket Pilihan
          </button>
          <button
            onClick={() => tanganiPilihMenu("wisata")}
            style={{
              padding: "10px 22px",
              borderRadius: "25px",
              backgroundColor: filterMode === "wisata" ? "#065f46" : "#ffffff",
              color: filterMode === "wisata" ? "white" : "#4b5563",
              fontWeight: "bold",
              border: filterMode === "wisata" ? "none" : "1px solid #d1d5db",
              whiteSpace: "nowrap",
              fontSize: "14px",
              transition: "0.3s",
            }}
          >
            Wisata Pilihan
          </button>
        </div>
      </IonHeader>

      <IonContent
        id="home-content"
        ref={contentRef}
        style={{ "--background": "#ffffff" } as React.CSSProperties}
      >
        <div
          style={{
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "10px",
            paddingTop: "15px",
          }}
        >
          {renderHeroSection()}
        </div>

        <div style={{ backgroundColor: "#f3f4f6", padding: "15px" }}>
          {(filterMode === "beranda" || filterMode === "paket") && (
            <>
              {paketList.map((paket) => (
                <IonCard
                  key={paket.id}
                  style={{
                    borderRadius: "20px",
                    marginBottom: "25px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                    border: "none",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={paket.gambar_url || noImage}
                      onError={(e) => {
                        e.currentTarget.src = noImage;
                      }}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <IonCardContent style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#065f46",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: "#4b5563",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        PAKET PERJALANAN {paket.durasi && ` • ${paket.durasi}`}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "26px",
                        fontWeight: "bold",
                        color: "#1f2937",
                        marginTop: 0,
                        marginBottom: "10px",
                        lineHeight: "1.2",
                      }}
                    >
                      {paket.nama_paket}
                    </h2>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        marginBottom: "20px",
                        lineHeight: "1.6",
                      }}
                    >
                      {paket.deskripsi_singkat}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#9ca3af",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Harga Mulai
                        </span>
                        <h3
                          style={{
                            fontSize: "20px",
                            color: "#065f46",
                            fontWeight: "900",
                            margin: 0,
                          }}
                        >
                          Rp {Number(paket.harga).toLocaleString("id-ID")}
                        </h3>
                      </div>
                      <IonButton
                        color="success"
                        style={{
                          "--border-radius": "12px",
                          fontWeight: "bold",
                          padding: "0 10px",
                        }}
                        onClick={() =>
                          router.push(`/paket/${paket.id}`, "forward")
                        }
                      >
                        Lihat Paket
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          )}

          {(filterMode === "beranda" || filterMode === "wisata") && (
            <>
              {wisataList.map((wisata) => (
                <IonCard
                  key={wisata.id}
                  style={{
                    borderRadius: "20px",
                    marginBottom: "25px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                    border: "none",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={wisata.gambar_url || noImage}
                      onError={(e) => {
                        e.currentTarget.src = noImage;
                      }}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <IonCardContent style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#2563eb",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: "#4b5563",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        DESTINASI SATUAN
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "26px",
                        fontWeight: "bold",
                        color: "#1f2937",
                        marginTop: 0,
                        marginBottom: "8px",
                        lineHeight: "1.2",
                      }}
                    >
                      {wisata.nama_tempat}
                    </h2>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        marginBottom: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      📍 {wisata.lokasi}
                    </p>
                    <IonButton
                      expand="block"
                      fill="outline"
                      color="success"
                      style={{ "--border-radius": "12px", fontWeight: "bold" }}
                      onClick={() => setDetailWisata(wisata)}
                    >
                      <IonIcon slot="start" icon={informationCircleOutline} />{" "}
                      Lihat Info Lengkap
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          )}

          {paketList.length === 0 && wisataList.length === 0 && (
            <div
              style={{ textAlign: "center", marginTop: "60px", color: "gray" }}
            >
              <p>Data belum tersedia.</p>
            </div>
          )}

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "30px 20px",
              margin: "40px 0 20px 0",
              borderRadius: "25px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "28px",
                color: "#1f2937",
                fontWeight: "bold",
                marginBottom: "25px",
                marginTop: "0",
                textAlign: "left",
              }}
            >
              Cara Memesan
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "15px",
                  display: "flex",
                  gap: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "#065f46",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1f2937",
                    }}
                  >
                    Pilih Wisata atau Paket
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    }}
                  >
                    Lihat foto dan penjelasan lengkap setiap tempat ziarah, lalu
                    pilih yang Bapak/Ibu inginkan.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "15px",
                  display: "flex",
                  gap: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "#065f46",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1f2937",
                    }}
                  >
                    Tekan Tombol WhatsApp
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    }}
                  >
                    Tekan tombol besar berwarna hijau di bagian bawah layar.
                    Tidak perlu mengetik apa pun, pesan sudah kami siapkan
                    otomatis.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "15px",
                  display: "flex",
                  gap: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "#065f46",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1f2937",
                    }}
                  >
                    Admin Kami Akan Membalas
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    }}
                  >
                    Admin ramah kami akan membalas pesan Bapak/Ibu, kemudian
                    menjelaskan jadwal, dan membantu mengurus semua kebutuhan
                    Bapak/Ibu selama perjalanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            padding: "40px 20px 30px 20px",
            color: "#9ca3af",
          }}
        >
          <IonIcon
            icon={locationOutline}
            style={{ fontSize: "24px", color: "#d1d5db", marginBottom: "5px" }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "bold",
              color: "#6b7280",
            }}
          >
            © 2026 {namaSistem}.
          </p>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
            Perjalanan spiritual aman dan terpercaya.
          </p>
        </div>
      </IonContent>

      <IonModal
        isOpen={detailWisata !== null}
        onDidDismiss={() => setDetailWisata(null)}
      >
        <IonHeader className="ion-no-border">
          <IonToolbar
            style={
              {
                "--background": "#ffffff",
                padding: "5px",
              } as React.CSSProperties
            }
          >
            <IonTitle
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: "bold",
                fontSize: "22px",
                color: "#1f2937",
              }}
            >
              Detail Destinasi
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                onClick={() => setDetailWisata(null)}
                style={{ color: "#4b5563", fontWeight: "bold" }}
              >
                Tutup
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent
          className="ion-padding"
          style={{ "--background": "#f9fafb" } as React.CSSProperties}
        >
          {detailWisata && (
            <div style={{ paddingBottom: "30px" }}>
              <img
                src={detailWisata.gambar_url}
                onError={(e) => (e.currentTarget.src = noImage)}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "15px",
                  marginBottom: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "32px",
                  fontWeight: "bold",
                  margin: "10px 0",
                  color: "#1f2937",
                  lineHeight: "1.2",
                }}
              >
                {detailWisata.nama_tempat}
              </h1>
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
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "15px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  marginBottom: "25px",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    fontWeight: "bold",
                    color: "#10b981",
                    borderBottom: "2px solid #10b981",
                    paddingBottom: "10px",
                    display: "inline-block",
                  }}
                >
                  Tentang Tempat Ini
                </h3>
                <p
                  style={{
                    lineHeight: "1.8",
                    color: "#4b5563",
                    fontSize: "16px",
                    marginTop: "15px",
                  }}
                >
                  {detailWisata.deskripsi}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <IonButton
                  expand="block"
                  color="primary"
                  style={{
                    "--border-radius": "12px",
                    height: "50px",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailWisata.nama_tempat + " " + detailWisata.lokasi)}`,
                      "_blank",
                    )
                  }
                >
                  <IonIcon slot="start" icon={mapOutline} /> Rute Google Maps
                </IonButton>
                <IonButton
                  expand="block"
                  color="success"
                  style={{
                    "--border-radius": "12px",
                    height: "50px",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    const urlHalaman = window.location.href;
                    const pesan = `Halo Admin, saya ingin bertanya info atau menyewa transportasi untuk mengunjungi destinasi: *${detailWisata.nama_tempat}*.\n\nLink Referensi: ${urlHalaman}`;
                    window.open(
                      `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`,
                      "_blank",
                    );
                  }}
                >
                  <IonIcon slot="start" icon={logoWhatsapp} /> Tanya Admin via
                  WA
                </IonButton>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Home;
