import React, { useState } from "react";
import { IonCard, IonButton, IonIcon, IonItem, IonInput } from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import axios from "axios";
import api from "../../services/api";

interface Props {
  user: { id?: number; username: string; role: string; foto_profil?: string };
  setUser: (user: {
    id?: number;
    username: string;
    role: string;
    foto_profil?: string;
  }) => void;
  tampilNotif: (msg: string, color?: string) => void;
}

const ProfilAdmin: React.FC<Props> = ({ user, setUser, tampilNotif }) => {
  const [formSelfPassword, setFormSelfPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const defaultAvatar = "https://ionicframework.com/docs/img/demos/avatar.svg";

  const handleFotoProfil = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const updatedUser = { ...user, foto_profil: base64String };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        try {
          await api.put("/auth/profil", { foto_profil: base64String });
          tampilNotif("Foto profil berhasil diperbarui!");
        } catch (error) {
          console.error(error);
          tampilNotif(
            "Gagal memperbarui foto. Pastikan rute API tersedia.",
            "danger",
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitGantiPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/auth/ganti-password", formSelfPassword);
      setFormSelfPassword({ oldPassword: "", newPassword: "" });
      tampilNotif("Kata sandi berhasil diperbarui!");
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Gagal mengganti kata sandi.";
      tampilNotif(msg || "Kata sandi lama salah.", "danger");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <IonCard
        style={{
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "130px",
            height: "130px",
            margin: "0 auto 20px auto",
          }}
        >
          <img
            src={user.foto_profil || defaultAvatar}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #10b981",
            }}
          />
          <IonButton
            fill="clear"
            style={{
              position: "absolute",
              bottom: "-5px",
              right: "-5px",
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              width: "45px",
              height: "45px",
            }}
            onClick={() => document.getElementById("upload-avatar")?.click()}
          >
            <IonIcon
              icon={cameraOutline}
              style={{ color: "#10b981", fontSize: "24px" }}
            />
          </IonButton>
          <input
            type="file"
            id="upload-avatar"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFotoProfil}
          />
        </div>
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            margin: "0 0 5px 0",
            color: "#1f2937",
          }}
        >
          {user.username}
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
            marginBottom: "30px",
          }}
        >
          {user.role}
        </div>

        <hr style={{ borderTop: "1px solid #e5e7eb", marginBottom: "30px" }} />

        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "left",
            marginBottom: "15px",
            color: "#374151",
          }}
        >
          Ganti Kata Sandi
        </h3>
        <form onSubmit={submitGantiPassword}>
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
              label="Kata Sandi Lama"
              type="password"
              labelPlacement="stacked"
              value={formSelfPassword.oldPassword}
              onIonChange={(e) =>
                setFormSelfPassword({
                  ...formSelfPassword,
                  oldPassword: e.detail.value!,
                })
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
              label="Kata Sandi Baru"
              type="password"
              labelPlacement="stacked"
              value={formSelfPassword.newPassword}
              onIonChange={(e) =>
                setFormSelfPassword({
                  ...formSelfPassword,
                  newPassword: e.detail.value!,
                })
              }
              required
              minlength={6}
            />
          </IonItem>
          <IonButton
            expand="block"
            type="submit"
            color="primary"
            style={{
              "--border-radius": "10px",
              height: "50px",
              marginTop: "20px",
            }}
          >
            Perbarui Sandi
          </IonButton>
        </form>
      </IonCard>
    </div>
  );
};

export default ProfilAdmin;
