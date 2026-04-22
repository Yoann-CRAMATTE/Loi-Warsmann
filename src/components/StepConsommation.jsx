import { useState } from 'react'
import Field from './Field'

const TVA_OPTIONS = [
  { value: '5.5', label: '5,5 % (taux réduit eau potable)' },
  { value: '10', label: '10 % (taux intermédiaire)' },
  { value: '20', label: '20 % (taux normal)' },
]

export default function StepConsommation({ data, onChange, onBack, onNext }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!data.consommationReelle || isNaN(data.consommationReelle) || Number(data.consommationReelle) <= 0)
      e.consommationReelle = 'Valeur invalide'
    if (!data.consommationRef || isNaN(data.consommationRef) || Number(data.consommationRef) <= 0)
      e.consommationRef = 'Valeur invalide'
    if (!data.prixM3HT || isNaN(data.prixM3HT) || Number(data.prixM3HT) <= 0)
      e.prixM3HT = 'Valeur invalide'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  const seuil = data.consommationRef ? Number(data.consommationRef) * 2 : null
  const surConso = seuil && data.consommationReelle
    ? Math.max(0, Number(data.consommationReelle) - seuil)
    : null

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Données de consommation</h2>
      <p className="text-sm text-gray-500 mb-6">
        Renseignez les volumes et tarifs pour calculer le montant du dégrèvement.
      </p>

      <div className="space-y-5">
        {/* Consommation réelle */}
        <Field
          label="Consommation réelle sur la période concernée"
          required
          error={errors.consommationReelle}
          hint="Volume facturé incluant la surconsommation liée à la fuite (m³)"
        >
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.consommationReelle}
              onChange={(e) => onChange({ consommationReelle: e.target.value })}
              placeholder="ex : 420"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">m³</span>
          </div>
        </Field>

        {/* Consommation de référence */}
        <Field
          label="Consommation de référence (moyenne annuelle)"
          required
          error={errors.consommationRef}
          hint="Moyenne des consommations des 3 dernières années, ou estimation si historique insuffisant (m³/an)"
        >
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.consommationRef}
              onChange={(e) => onChange({ consommationRef: e.target.value })}
              placeholder="ex : 120"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">m³</span>
          </div>
        </Field>

        {/* Récapitulatif seuil */}
        {seuil !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-800 mb-1">Seuil légal de facturation</p>
            <p className="text-blue-700">
              2 × {Number(data.consommationRef).toLocaleString('fr-FR')} m³ = <strong>{seuil.toLocaleString('fr-FR')} m³</strong>
            </p>
            {surConso !== null && (
              <p className="mt-1 text-blue-700">
                Volume dégrévable :{' '}
                <strong className={surConso > 0 ? 'text-blue-900' : 'text-gray-500'}>
                  {surConso.toLocaleString('fr-FR')} m³
                </strong>
                {surConso === 0 && ' — pas de surconsommation'}
              </p>
            )}
          </div>
        )}

        {/* Prix unitaire */}
        <Field
          label="Prix unitaire de l'eau (HT)"
          required
          error={errors.prixM3HT}
          hint="Tarif en vigueur du service des eaux (hors taxes)"
        >
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.001"
              value={data.prixM3HT}
              onChange={(e) => onChange({ prixM3HT: e.target.value })}
              placeholder="ex : 1.85"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€/m³</span>
          </div>
        </Field>

        {/* Taux TVA */}
        <Field label="Taux de TVA applicable">
          <div className="flex flex-wrap gap-2">
            {TVA_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer text-sm transition-colors
                  ${data.tauxTVA === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
              >
                <input
                  type="radio"
                  name="tauxTVA"
                  value={opt.value}
                  checked={data.tauxTVA === opt.value}
                  onChange={() => onChange({ tauxTVA: opt.value })}
                  className="accent-blue-600"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          ← Retour
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Calculer →
        </button>
      </div>
    </div>
  )
}
