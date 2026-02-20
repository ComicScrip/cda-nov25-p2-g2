/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import { useRouter } from "next/router";
import type React from "react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useProfileQuery, useUpdateProfileMutation } from "@/graphql/generated/schema";

const EditProfilePage = () => {
  const router = useRouter();

  const { data, loading: queryLoading } = useProfileQuery();
  const [updateUser, { loading: mutationLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (data?.me) {
      setFormData({
        first_name: data.me.first_name || "",
        last_name: data.me.last_name || "",
        phone: data.me.phone || "",
        avatar: data.me.avatar || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        variables: {
          data: {
            id: data?.me?.id as number,
            ...formData,
          },
        },
        refetchQueries: ["Profile"],
      });

      // Redirection vers le chemin spécifique demandé
      router.push("/profil/profil");
    } catch (err) {
      console.error("Erreur mutation:", err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  if (queryLoading) return <div className="bb-screen">Chargement...</div>;

  return (
    <Layout pageTitle="Modifier mon profil">
      <div className="bb-screen">
        <div className="bb-mobile-container">
          <main className="bb-main">
            <div className="bb-title-card">
              <h1>Modifier Profil</h1>
            </div>

            <form onSubmit={handleSubmit} className="bb-profile-card">
              <div className="bb-avatar-center-container">
                <div className="bb-avatar-outline">
                  <img
                    src={formData.avatar || "/avatarfille.png"}
                    className="bb-avatar-img"
                    alt="User"
                  />
                </div>
              </div>

              <div className="bb-info-list">
                <div className="bb-info-field">
                  <label className="bb-label">Nom</label>
                  <input
                    className="bb-edit-input"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>

                <div className="bb-info-field">
                  <label className="bb-label">Prénom</label>
                  <input
                    className="bb-edit-input"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>

                <div className="bb-info-field">
                  <label className="bb-label">Téléphone</label>
                  <input
                    className="bb-edit-input"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="bb-info-field">
                  <label className="bb-label">Lien Avatar</label>
                  <input
                    className="bb-edit-input"
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  />
                </div>

                <button type="submit" className="bb-btn-valider" disabled={mutationLoading}>
                  {mutationLoading ? "Envoi..." : "Valider"}
                </button>

                <button
                  type="button"
                  className="bb-btn-change-password"
                  onClick={() => router.push("/profil/password")}
                >
                  Changer de mot de passe
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfilePage;
