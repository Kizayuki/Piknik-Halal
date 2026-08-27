import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonToast,
  useIonRouter,
  IonIcon,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import { eyeOutline, eyeOffOutline, logInOutline } from "ionicons/icons";
import axios from "axios";
import api from "../../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState({ isOpen: false, message: "" });
  const router = useIonRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem(
        "login_notif",
        `Selamat datang, ${response.data.user.username}!`,
      );
      router.push("/admin/dashboard", "forward", "replace");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message ||
          "Gagal login, periksa koneksi server.";
        setShowToast({ isOpen: true, message: errorMsg });
      }
    }
  };

  return (
    <IonPage>
      <IonContent
        className="ion-padding"
        style={
          {
            "--background":
              "linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)",
          } as React.CSSProperties
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0" }}>
              Login Admin
            </h1>
            <p style={{ fontSize: "16px", opacity: 0.8 }}>
              Kelola Wisata Religi Anda
            </p>
          </div>

          <IonCard
            style={{
              width: "100%",
              borderRadius: "20px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <IonCardContent style={{ padding: "25px" }}>
              <form onSubmit={handleLogin}>
                <IonItem lines="full" style={{ "--padding-start": "0" }}>
                  <IonInput
                    label="Username"
                    labelPlacement="floating"
                    type="text"
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem
                  lines="full"
                  style={{ "--padding-start": "0", marginTop: "10px" }}
                >
                  <IonInput
                    label="Password"
                    labelPlacement="floating"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    required
                  />
                  <IonButton
                    fill="clear"
                    slot="end"
                    style={{ marginTop: "auto" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      color="medium"
                    />
                  </IonButton>
                </IonItem>

                <IonButton
                  type="submit"
                  expand="block"
                  color="primary"
                  style={{
                    marginTop: "30px",
                    "--border-radius": "10px",
                    height: "50px",
                    fontSize: "18px",
                  }}
                >
                  <IonIcon slot="start" icon={logInOutline} /> Login
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast.isOpen}
          message={showToast.message}
          duration={3000}
          color="danger"
          onDidDismiss={() => setShowToast({ isOpen: false, message: "" })}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
