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
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import {
  trash,
  create,
  personAddOutline,
  lockClosedOutline,
} from "ionicons/icons";
import axios from "axios";
import api from "../../services/api";

interface AdminUser {
  id?: number;
  username: string;
  role: string;
  password?: string;
}

const KelolaAdmin: React.FC = () => {
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    color: "success",
  });

  const [showModalAdmin, setShowModalAdmin] = useState(false);
  const [isEditAdmin, setIsEditAdmin] = useState(false);
  const [formAdmin, setFormAdmin] = useState<AdminUser>({
    id: 0,
    username: "",
    password: "",
    role: "Admin",
  });

  const [showModalReset, setShowModalReset] = useState(false);
  const [targetResetAdmin, setTargetResetAdmin] = useState<{
    id: number;
    username: string;
  } | null>(null);
  const [newResetPassword, setNewResetPassword] = useState("");
  const [hapusId, setHapusId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
      ambilDataAdmin();
    }
  }, []);

  const ambilDataAdmin = async () => {
    try {
      const res = await api.get("/admins");
      const raw = res as unknown as Record<string, unknown>;
      const dataArr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.data)
          ? raw.data
          : [];
      const adminBiasa = (dataArr as AdminUser[]).filter(
        (a) => a.role !== "Super Admin",
      );
      setAdminList(adminBiasa);
    } catch (error) {
      console.error(error);
    }
  };

  const tampilNotif = (pesan: string, warna: string = "success") => {
    setToast({ isOpen: true, message: pesan, color: warna });
  };

  const simpanAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditAdmin && formAdmin.id) {
        await api.put(`/admins/${formAdmin.id}`, {
          username: formAdmin.username,
          role: formAdmin.role,
        });
        tampilNotif("Data Admin berhasil diperbarui!");
      } else {
        await api.post("/admins", formAdmin);
        tampilNotif("Akun Admin baru berhasil dibuat!");
      }
      setShowModalAdmin(false);
      ambilDataAdmin();
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Gagal menyimpan admin.";
      tampilNotif(msg || "Username mungkin sudah terpakai.", "danger");
    }
  };

  const submitResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetResetAdmin) return;
    try {
      await api.put(`/admins/${targetResetAdmin.id}/reset-password`, {
        newPassword: newResetPassword,
      });
      setShowModalReset(false);
      setNewResetPassword("");
      tampilNotif("Kata sandi admin berhasil direset!");
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Gagal mereset kata sandi.";
      tampilNotif(msg || "Gagal mereset.", "danger");
    }
  };

  const eksekusiHapus = async () => {
    if (hapusId === null) return;
    try {
      await api.delete(`/admins/${hapusId}`);
      tampilNotif("Akun Admin berhasil dihapus!");
      ambilDataAdmin();
    } catch (error: unknown) {
      console.error(error);
      tampilNotif("Gagal menghapus admin!", "danger");
    } finally {
      setHapusId(null);
    }
  };

  return (
    <div>
      <IonButton
        expand="block"
        color="primary"
        style={{ "--border-radius": "10px", marginBottom: "20px" }}
        onClick={() => {
          setIsEditAdmin(false);
          setFormAdmin({ username: "", password: "", role: "Admin" });
          setShowModalAdmin(true);
        }}
      >
        <IonIcon slot="start" icon={personAddOutline} /> Tambah Admin Baru
      </IonButton>

      <IonList
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        {adminList.map((a) => (
          <IonItem key={a.id}>
            <IonLabel>
              <h2
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#1f2937",
                }}
              >
                {a.username}
              </h2>
              <p style={{ color: "#6b7280" }}>{a.role}</p>
            </IonLabel>

            {a.username !== currentUser?.username && (
              <>
                <IonButton
                  fill="clear"
                  color="primary"
                  onClick={() => {
                    setIsEditAdmin(true);
                    setFormAdmin({
                      id: a.id,
                      username: a.username,
                      role: a.role,
                    });
                    setShowModalAdmin(true);
                  }}
                >
                  <IonIcon icon={create} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color="warning"
                  onClick={() => {
                    setTargetResetAdmin({ id: a.id!, username: a.username });
                    setShowModalReset(true);
                  }}
                >
                  <IonIcon icon={lockClosedOutline} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => setHapusId(a.id!)}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </>
            )}
          </IonItem>
        ))}
      </IonList>

      <IonModal
        isOpen={showModalAdmin}
        onDidDismiss={() => setShowModalAdmin(false)}
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>{isEditAdmin ? "Edit Admin" : "Tambah Admin"}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModalAdmin(false)}>
                Batal
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={simpanAdmin}>
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
                label="Username"
                labelPlacement="stacked"
                value={formAdmin.username}
                onIonChange={(e) =>
                  setFormAdmin({ ...formAdmin, username: e.detail.value! })
                }
                required
              />
            </IonItem>
            {!isEditAdmin && (
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
                  label="Kata Sandi Sementara"
                  type="password"
                  labelPlacement="stacked"
                  value={formAdmin.password}
                  onIonChange={(e) =>
                    setFormAdmin({ ...formAdmin, password: e.detail.value! })
                  }
                  required
                />
              </IonItem>
            )}
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
                label="Role Akses"
                labelPlacement="stacked"
                value={formAdmin.role}
                onIonChange={(e) =>
                  setFormAdmin({ ...formAdmin, role: e.detail.value })
                }
              >
                <IonSelectOption value="Admin">Admin Biasa</IonSelectOption>
                <IonSelectOption value="Super Admin">
                  Super Admin
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton
              expand="block"
              type="submit"
              color="success"
              style={{ "--border-radius": "10px", height: "50px" }}
            >
              Simpan Admin
            </IonButton>
          </form>
        </IonContent>
      </IonModal>

      <IonModal
        isOpen={showModalReset}
        onDidDismiss={() => setShowModalReset(false)}
      >
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Reset Sandi Admin</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModalReset(false)}>
                Batal
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={submitResetPassword}>
            <div
              style={{
                marginBottom: "20px",
                textAlign: "center",
                color: "gray",
              }}
            >
              Mengubah sandi akun: <strong>{targetResetAdmin?.username}</strong>
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
              <IonInput
                label="Masukkan Kata Sandi Baru"
                type="password"
                labelPlacement="stacked"
                value={newResetPassword}
                onIonChange={(e) => setNewResetPassword(e.detail.value!)}
                required
                minlength={6}
              />
            </IonItem>
            <IonButton
              expand="block"
              type="submit"
              color="warning"
              style={{ "--border-radius": "10px", height: "50px" }}
            >
              Paksa Reset Sandi
            </IonButton>
          </form>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={hapusId !== null}
        onDidDismiss={() => setHapusId(null)}
        header="Konfirmasi"
        message="Hapus akun admin ini secara permanen?"
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

export default KelolaAdmin;
