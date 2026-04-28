"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface CalcInputs {
  averageAnnualM3: string;
  leakPeriodM3: string;
  billingMonths: string;
  pricePerM3: string;
}

export default function CalculPage() {
  const [inputs, setInputs] = useState<CalcInputs>({
    averageAnnualM3: "",
    leakPeriodM3: "",
    billingMonths: "2",
    pricePerM3: "4.50",
  });

  const result = useMemo(() => {
    const avg = parseFloat(inputs.averageAnnualM3);
    const leak = parseFloat(inputs.leakPeriodM3);
    const months = parseFloat(inputs.billingMonths);
    const price = parseFloat(inputs.pricePerM3);

    if (!avg || !leak || !months || !price || avg <= 0 || leak <= 0) return null;

    // Average consumption for the billing period
    const avgForPeriod = (avg / 12) * months;

    // Legal cap: 2x average annual consumption
    // The law caps the total billed for the leak period at 2x the average for the period
    const maxBillable = avgForPeriod * 2;

    if (leak <= maxBillable) {
      return { eligible: false, leak, avgForPeriod, maxBillable };
    }

    const excessM3 = leak - maxBillable;
    const relief = excessM3 * price;

    return {
      eligible: true,
      leak,
      avgForPeriod: Math.round(avgForPeriod * 10) / 10,
      maxBillable: Math.round(maxBillable * 10) / 10,
      excessM3: Math.round(excessM3 * 10) / 10,
      relief: Math.round(relief * 100) / 100,
      normalCost: Math.round(maxBillable * price * 100) / 100,
      abnormalCost: Math.round(leak * price * 100) / 100,
    };
  }, [inputs]);

  function update(field: keyof CalcInputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const allFilled =
    inputs.averageAnnualM3 &&
    inputs.leakPeriodM3 &&
    inputs.billingMonths &&
    inputs.pricePerM3;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--primary-dark)" }}
        >
          🧮 Calcul du dégrèvement estimatif
        </h1>
        <p className="text-gray-600 text-sm">
          Estimez le montant que vous pourrez récupérer sur votre facture d&apos;eau
          grâce à la loi Warsmann.
        </p>
      </div>

      <div className="card p-6 mb-6">
        <p className="section-title">Vos informations de consommation</p>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Consommation annuelle */}
          <div>
            <label className="label" htmlFor="avg">
              Consommation annuelle habituelle (m³)
            </label>
            <input
              id="avg"
              type="number"
              min="0"
              placeholder="ex : 120"
              value={inputs.averageAnnualM3}
              onChange={(e) => update("averageAnnualM3", e.target.value)}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Trouvez cette valeur sur vos factures annuelles précédentes.
            </p>
          </div>

          {/* Consommation période fuite */}
          <div>
            <label className="label" htmlFor="leak">
              Consommation lors de la fuite (m³)
            </label>
            <input
              id="leak"
              type="number"
              min="0"
              placeholder="ex : 350"
              value={inputs.leakPeriodM3}
              onChange={(e) => update("leakPeriodM3", e.target.value)}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Consommation indiquée sur la facture anormale.
            </p>
          </div>

          {/* Durée période de facturation */}
          <div>
            <label className="label" htmlFor="months">
              Durée de la période de facturation
            </label>
            <select
              id="months"
              value={inputs.billingMonths}
              onChange={(e) => update("billingMonths", e.target.value)}
              className="input-field"
            >
              <option value="1">1 mois</option>
              <option value="2">2 mois (bimestriel)</option>
              <option value="3">3 mois (trimestriel)</option>
              <option value="6">6 mois (semestriel)</option>
              <option value="12">12 mois (annuel)</option>
            </select>
          </div>

          {/* Prix du m³ */}
          <div>
            <label className="label" htmlFor="price">
              Prix du m³ TTC (€)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="ex : 4.50"
              value={inputs.pricePerM3}
              onChange={(e) => update("pricePerM3", e.target.value)}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Prix total par m³ (eau + assainissement + taxes). Visible sur votre
              facture.
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {allFilled && result && (
        <div className="fade-in">
          {result.eligible ? (
            <div className="card p-6 mb-6">
              <p className="section-title">Résultat estimatif</p>

              {/* Main result */}
              <div
                style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
                className="rounded-xl p-5 text-white text-center mb-5"
              >
                <p className="text-sm text-emerald-100 mb-1">
                  Montant estimé du dégrèvement
                </p>
                <p className="text-4xl font-bold">
                  {result.relief?.toFixed(2).replace(".", ",")} €
                </p>
                <p className="text-emerald-100 text-sm mt-1">
                  soit {result.excessM3} m³ d&apos;excédent remboursables
                </p>
              </div>

              {/* Detail breakdown */}
              <div className="space-y-3">
                <div
                  className="flex justify-between items-center py-2 border-b text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-gray-600">
                    Votre consommation habituelle (période)
                  </span>
                  <span className="font-semibold">{result.avgForPeriod} m³</span>
                </div>
                <div
                  className="flex justify-between items-center py-2 border-b text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-gray-600">
                    Consommation lors de la fuite
                  </span>
                  <span className="font-semibold text-red-600">
                    {result.leak} m³
                  </span>
                </div>
                <div
                  className="flex justify-between items-center py-2 border-b text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-gray-600">
                    Plafond légal (2× consommation habituelle)
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {result.maxBillable} m³
                  </span>
                </div>
                <div
                  className="flex justify-between items-center py-2 border-b text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-gray-600">
                    Excédent non facturable (fuite)
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {result.excessM3} m³
                  </span>
                </div>
                <div
                  className="flex justify-between items-center py-2 border-b text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-gray-600">Votre facture totale sans dégrèvement</span>
                  <span className="font-semibold text-red-600">
                    {result.abnormalCost?.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm font-bold">
                  <span style={{ color: "var(--success)" }}>
                    Votre facture après dégrèvement (max légal)
                  </span>
                  <span style={{ color: "var(--success)" }}>
                    {result.normalCost?.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
              </div>

              <div
                style={{ backgroundColor: "var(--surface-alt)", borderColor: "var(--border)" }}
                className="border rounded-lg p-3 mt-4 text-xs text-gray-600"
              >
                ⚠️ <strong>Estimation indicative :</strong> Le montant réel dépend
                du tarif exact appliqué par votre service des eaux (part fixe,
                abonnement, tranches de consommation, taxes). Référez-vous à votre
                facture pour un calcul précis.
              </div>
            </div>
          ) : (
            <div className="card p-6 mb-6">
              <div
                style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}
                className="border rounded-xl p-5 text-center mb-4"
              >
                <p className="text-2xl mb-2">ℹ️</p>
                <p className="font-bold text-amber-800">
                  Consommation dans la limite du plafond légal
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  Votre consommation lors de la fuite ({result.leak} m³) est
                  inférieure ou égale au plafond légal (
                  {result.maxBillable?.toFixed(1)} m³ = 2×{" "}
                  {result.avgForPeriod?.toFixed(1)} m³). Aucun dégrèvement n&apos;est
                  dû dans ce cas.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {allFilled && !result && (
        <div className="card p-6 text-center text-gray-400">
          Veuillez saisir des valeurs valides pour obtenir le calcul.
        </div>
      )}

      {/* Info block */}
      <div className="card p-5 mb-6">
        <p className="section-title">Comment fonctionne le calcul ?</p>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3">
            <span className="text-lg">📏</span>
            <p>
              <strong>Plafond légal :</strong> La loi impose que votre
              consommation facturée ne dépasse pas{" "}
              <strong>2 fois votre consommation habituelle</strong> sur la même
              période.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-lg">💶</span>
            <p>
              <strong>Dégrèvement :</strong> Les m³ consommés au-delà de ce
              plafond vous sont remboursés ou déduits de votre prochaine facture.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-lg">📊</span>
            <p>
              <strong>Consommation habituelle :</strong> Elle est calculée sur la
              base de vos factures antérieures (généralement la moyenne des 3
              dernières années).
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/eligibilite" className="btn-secondary">
          ← Vérifier l&apos;éligibilité
        </Link>
        <Link href="/dossier" className="btn-primary">
          📄 Préparer mon courrier →
        </Link>
      </div>
    </div>
  );
}
