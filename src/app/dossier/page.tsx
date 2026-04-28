"use client";

import { useState } from "react";
import Link from "next/link";
import { DossierFormData } from "@/types";

const EMPTY_FORM: DossierFormData = {
  subscriberLastName: "",
  subscriberFirstName: "",
  subscriberAddress: "",
  subscriberPostalCode: "",
  subscriberCity: "",
  subscriberPhone: "",
  subscriberEmail: "",
  contractNumber: "",
  waterCompanyName: "",
  waterCompanyAddress: "",
  waterCompanyCity: "",
  leakDiscoveryDate: "",
  leakLocation: "",
  repairDate: "",
  certificateDate: "",
  plumberName: "",
  plumberCompany: "",
  plumberSiret: "",
  normalConsumption: "",
  abnormalConsumption: "",
  billingPeriod: "",
  letterDate: new Date().toISOString().split("T")[0],
  letterCity: "",
};

function formatDateFR(dateStr: string): string {
  if (!dateStr) return "___________";
  const [y, m, d] = dateStr.split("-");
  const months = [
    "janvier","février","mars","avril","mai","juin",
    "juillet","août","septembre","octobre","novembre","décembre",
  ];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function generateLetter(form: DossierFormData): string {
  const fullName =
    [form.subscriberFirstName, form.subscriberLastName].filter(Boolean).join(" ") ||
    "___________";
  const address = [
    form.subscriberAddress,
    form.subscriberPostalCode && form.subscriberCity
      ? `${form.subscriberPostalCode} ${form.subscriberCity}`
      : form.subscriberCity || form.subscriberPostalCode,
  ]
    .filter(Boolean)
    .join(", ") || "___________";

  const waterCo =
    [form.waterCompanyName, form.waterCompanyAddress, form.waterCompanyCity]
      .filter(Boolean)
      .join(", ") || "Service des eaux compétent";

  return `${form.letterCity || "___________"}, le ${formatDateFR(form.letterDate)}


${fullName}
${form.subscriberAddress || "___________"}
${form.subscriberPostalCode || ""} ${form.subscriberCity || ""}
${form.subscriberPhone ? `Tél. : ${form.subscriberPhone}` : ""}
${form.subscriberEmail ? `Courriel : ${form.subscriberEmail}` : ""}
N° contrat / abonné : ${form.contractNumber || "___________"}


À l'attention du service des eaux
${form.waterCompanyName || "___________"}
${form.waterCompanyAddress || ""}
${form.waterCompanyCity || ""}


Objet : Demande de dégrèvement suite à fuite sur canalisation enterrée
         (article L2224-12-4-1 du Code général des collectivités territoriales – loi Warsmann)


Madame, Monsieur,

Je soussigné(e) ${fullName}, domicilié(e) au ${address}, titulaire du contrat d'abonnement au service de l'eau n° ${form.contractNumber || "___________"}, me permets de solliciter un dégrèvement de ma facture d'eau en application de l'article L2224-12-4-1 du Code général des collectivités territoriales, issu de la loi n° 2011-525 du 17 mai 2011 (dite loi Warsmann).

**Exposé des faits**

J'ai constaté une consommation d'eau anormalement élevée le ${formatDateFR(form.leakDiscoveryDate)}, révélant l'existence d'une fuite sur une canalisation d'eau potable enterrée, située ${form.leakLocation || "sur mon réseau privé après compteur"}.

Cette fuite a été réparée le ${formatDateFR(form.repairDate)} par ${
    form.plumberCompany
      ? `l'entreprise ${form.plumberCompany}${form.plumberName ? ` (${form.plumberName})` : ""}${form.plumberSiret ? `, SIRET ${form.plumberSiret}` : ""}`
      : form.plumberName
      ? `M./Mme ${form.plumberName}${form.plumberSiret ? `, SIRET ${form.plumberSiret}` : ""}`
      : "un plombier professionnel"
  }.

Une attestation de réparation m'a été remise le ${formatDateFR(form.certificateDate)}.

**Consommation constatée**

Ma consommation habituelle est de ${form.normalConsumption || "___"} m³ par an. Durant la période de facturation concernée (${form.billingPeriod || "___________"}), ma consommation a atteint ${form.abnormalConsumption || "___"} m³, soit une consommation anormalement élevée imputable à cette fuite souterraine.

**Fondement juridique de la demande**

En application de l'article L2224-12-4-1 du CGCT, votre service ne peut pas facturer, sur la période concernée, une consommation supérieure au double de la consommation moyenne annuelle. Je vous demande en conséquence de procéder au dégrèvement correspondant à la part de consommation excédant ce plafond légal.

**Documents joints**

- Attestation de réparation établie par le plombier (en date du ${formatDateFR(form.certificateDate)})
- Copie de la facture d'eau faisant apparaître la consommation anormale
- Copie des factures antérieures (justificatif de consommation habituelle)

Dans l'attente de votre retour, je reste à votre disposition pour tout renseignement complémentaire.

Je vous adresse, Madame, Monsieur, l'expression de mes salutations distinguées.


${fullName}


---
Pièces jointes :
1. Attestation de réparation du plombier
2. Facture d'eau concernée
3. Factures antérieures (consommation habituelle)
`;
}

export default function DossierPage() {
  const [form, setForm] = useState<DossierFormData>(EMPTY_FORM);
  const [showLetter, setShowLetter] = useState(false);
  const [copied, setCopied] = useState(false);

  function update(field: keyof DossierFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const letter = generateLetter(form);

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  const requiredFilled =
    form.subscriberLastName &&
    form.subscriberAddress &&
    form.contractNumber &&
    form.waterCompanyName &&
    form.leakDiscoveryDate &&
    form.repairDate &&
    form.certificateDate &&
    form.plumberCompany;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--primary-dark)" }}
        >
          📄 Préparer ma demande de dégrèvement
        </h1>
        <p className="text-gray-600 text-sm">
          Remplissez les champs ci-dessous pour générer automatiquement votre
          courrier de demande.
        </p>
      </div>

      {/* Checklist documents */}
      <div
        style={{ backgroundColor: "var(--surface-alt)", borderColor: "var(--border)" }}
        className="border rounded-xl p-4 mb-6"
      >
        <p className="text-sm font-bold mb-2" style={{ color: "var(--primary-dark)" }}>
          📋 Documents à joindre à votre courrier
        </p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex gap-2">
            <span>□</span>
            <span>
              <strong>Attestation de réparation</strong> délivrée par le
              plombier professionnel
            </span>
          </li>
          <li className="flex gap-2">
            <span>□</span>
            <span>
              <strong>Facture d&apos;eau anormale</strong> (celle qui montre la
              consommation élevée)
            </span>
          </li>
          <li className="flex gap-2">
            <span>□</span>
            <span>
              <strong>Factures antérieures</strong> (pour justifier votre
              consommation habituelle)
            </span>
          </li>
          <li className="flex gap-2">
            <span>□</span>
            <span>
              <strong>RIB</strong> si vous souhaitez un remboursement par virement
            </span>
          </li>
        </ul>
      </div>

      <div className="grid gap-6">
        {/* Section 1: Abonné */}
        <div className="card p-5">
          <p className="section-title">Vos coordonnées (abonné)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Prénom</label>
              <input
                type="text"
                className="input-field"
                placeholder="Marie"
                value={form.subscriberFirstName}
                onChange={(e) => update("subscriberFirstName", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="DUPONT"
                value={form.subscriberLastName}
                onChange={(e) => update("subscriberLastName", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">
                Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="12 rue des Lilas"
                value={form.subscriberAddress}
                onChange={(e) => update("subscriberAddress", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Code postal</label>
              <input
                type="text"
                className="input-field"
                placeholder="75001"
                value={form.subscriberPostalCode}
                onChange={(e) => update("subscriberPostalCode", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Ville</label>
              <input
                type="text"
                className="input-field"
                placeholder="Paris"
                value={form.subscriberCity}
                onChange={(e) => update("subscriberCity", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input
                type="tel"
                className="input-field"
                placeholder="06 12 34 56 78"
                value={form.subscriberPhone}
                onChange={(e) => update("subscriberPhone", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="marie.dupont@email.fr"
                value={form.subscriberEmail}
                onChange={(e) => update("subscriberEmail", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">
                N° de contrat / abonné <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : 1234567"
                value={form.contractNumber}
                onChange={(e) => update("contractNumber", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Numéro visible sur votre facture d&apos;eau.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Service des eaux */}
        <div className="card p-5">
          <p className="section-title">Service des eaux destinataire</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">
                Nom du service des eaux <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : Veolia Eau, SAUR, Suez, Régie des Eaux de..."
                value={form.waterCompanyName}
                onChange={(e) => update("waterCompanyName", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Adresse du service</label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : 10 avenue du Service, 75000 Paris"
                value={form.waterCompanyAddress}
                onChange={(e) => update("waterCompanyAddress", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Fuite */}
        <div className="card p-5">
          <p className="section-title">Informations sur la fuite</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Date de découverte de la fuite <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input-field"
                value={form.leakDiscoveryDate}
                onChange={(e) => update("leakDiscoveryDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Date de réparation <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input-field"
                value={form.repairDate}
                onChange={(e) => update("repairDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Date de l&apos;attestation du plombier{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input-field"
                value={form.certificateDate}
                onChange={(e) => update("certificateDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Localisation de la fuite</label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : canalisation enterrée en jardin, avant la façade"
                value={form.leakLocation}
                onChange={(e) => update("leakLocation", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Plombier */}
        <div className="card p-5">
          <p className="section-title">Plombier ayant effectué la réparation</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Entreprise / raison sociale <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : Plomberie Martin SARL"
                value={form.plumberCompany}
                onChange={(e) => update("plumberCompany", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Nom du plombier</label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : Jean Martin"
                value={form.plumberName}
                onChange={(e) => update("plumberName", e.target.value)}
              />
            </div>
            <div>
              <label className="label">SIRET</label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : 123 456 789 00012"
                value={form.plumberSiret}
                onChange={(e) => update("plumberSiret", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Consommation */}
        <div className="card p-5">
          <p className="section-title">Consommation d&apos;eau</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Consommation habituelle (m³/an)</label>
              <input
                type="number"
                className="input-field"
                placeholder="ex : 120"
                value={form.normalConsumption}
                onChange={(e) => update("normalConsumption", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Consommation anormale (m³)</label>
              <input
                type="number"
                className="input-field"
                placeholder="ex : 400"
                value={form.abnormalConsumption}
                onChange={(e) => update("abnormalConsumption", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Période de facturation concernée</label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : du 1er janvier 2024 au 31 mars 2024"
                value={form.billingPeriod}
                onChange={(e) => update("billingPeriod", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 6: Lettre */}
        <div className="card p-5">
          <p className="section-title">En-tête de la lettre</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Ville de rédaction</label>
              <input
                type="text"
                className="input-field"
                placeholder="ex : Lyon"
                value={form.letterCity}
                onChange={(e) => update("letterCity", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Date de la lettre</label>
              <input
                type="date"
                className="input-field"
                value={form.letterDate}
                onChange={(e) => update("letterDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowLetter(true)}
          disabled={!requiredFilled}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex-1 justify-center"
        >
          📄 Générer le courrier
        </button>
        {!requiredFilled && (
          <p className="text-xs text-gray-500 self-center sm:ml-2">
            * Les champs marqués d&apos;un astérisque rouge sont obligatoires.
          </p>
        )}
      </div>

      {/* Generated letter */}
      {showLetter && (
        <div className="mt-8 fade-in" id="letter-preview">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="font-bold text-lg"
              style={{ color: "var(--primary-dark)" }}
            >
              Votre courrier
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="btn-secondary text-sm py-2 px-3"
              >
                {copied ? "✅ Copié !" : "📋 Copier"}
              </button>
              <button
                onClick={handlePrint}
                className="btn-secondary text-sm py-2 px-3"
              >
                🖨️ Imprimer
              </button>
            </div>
          </div>

          <div
            className="card p-6 sm:p-8 font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap"
            style={{ fontSize: "0.82rem" }}
          >
            {letter}
          </div>

          <div
            style={{ backgroundColor: "var(--surface-alt)", borderColor: "var(--border)" }}
            className="border rounded-lg p-4 mt-4 text-sm text-gray-600"
          >
            <p className="font-semibold mb-1">
              ✉️ Comment envoyer ce courrier ?
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                • <strong>Recommandé avec accusé de réception</strong> (recommandé
                pour conserver une preuve d&apos;envoi)
              </li>
              <li>
                • Conservez une copie du courrier et de tous les documents joints
              </li>
              <li>
                • Envoyez dans le délai d&apos;un mois suivant la date de
                l&apos;attestation du plombier
              </li>
              <li>
                • Le service des eaux a l&apos;obligation de répondre dans un délai
                raisonnable
              </li>
            </ul>
          </div>

          <div
            style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}
            className="border rounded-lg p-4 mt-3 text-xs text-amber-700"
          >
            ⚠️ Vérifiez et adaptez ce courrier à votre situation avant envoi. Il
            est fourni à titre indicatif et ne remplace pas un conseil juridique.
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link href="/calcul" className="btn-secondary text-sm">
          ← Calcul du montant
        </Link>
        <Link href="/eligibilite" className="btn-secondary text-sm">
          ← Vérifier l&apos;éligibilité
        </Link>
      </div>
    </div>
  );
}
