import Link from "next/link";
import React from "react";
import Layout from "@/components/Layout";
import { useProfileQuery } from "@/graphql/generated/schema";

const ProfilPage = () => {
  const { data, loading, error } = useProfileQuery();

  if (loading) return <div className="bb-screen">Chargement...</div>;
  if (error) return <div className="bb-screen">Erreur de connexion au serveur.</div>;

  const user = data?.me;

  return (
    <Layout pageTitle="Mon Profil">
      <div className="bb-screen">
        <div className="bb-mobile-container">
          <header className="bb-header">
            <img src="/babyboardlogo.png" alt="BabyBoard" className="bb-logo-big" />
            {/* Avatar en haut à droite (optionnel) */}
            <img
              src={user?.avatar || "/avatarfille.png"}
              alt="Profil"
              className="bb-top-avatar-big"
            />
          </header>

          <main className="bb-main">
            <div className="bb-title-card">
              <h1>Mon profil</h1>
            </div>

            <div className="bb-profile-card">
              <div className="bb-avatar-center-container">
                <div className="bb-avatar-outline">
                  {/* Avatar principal au centre */}
                  <img
                    src={user?.avatar || "/avatarfille.png"}
                    alt="User"
                    className="bb-avatar-img"
                  />
                  <Link href="/profil/edit">
                    <div className="bb-edit-circle">
                      <img src="/modifier.png" alt="Edit" />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bb-info-list">
                {/* 4. Affichage des données réelles du backend */}
                <div className="bb-info-field">
                  <strong>Nom :</strong> {user?.last_name}
                </div>
                <div className="bb-info-field">
                  <strong>Prénom :</strong> {user?.first_name}
                </div>
                <div className="bb-info-field">
                  <strong>Email :</strong> {user?.email}
                </div>
                <div className="bb-info-field">
                  <strong>Tel :</strong> {user?.phone}
                </div>
                <div className="bb-info-field">
                  <strong>Rôle :</strong> {user?.role}
                </div>
              </div>
            </div>
          </main>

          <nav className="bb-bottom-nav">
            <div className="bb-nav-item">
              <img src="/home.png" alt="Home" />
            </div>
            <div className="bb-nav-item">
              <img src="/calendrier.png" alt="Calendar" />
            </div>
            <div className="bb-nav-item">
              <img src="/chat.png" alt="Chat" />
            </div>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilPage;
