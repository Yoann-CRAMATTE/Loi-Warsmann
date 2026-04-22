import { useState } from 'react'
import Field from './Field'
import RadioGroup from './RadioGroup'

export default function StepEligibilite({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!data.typeAbonne) e.typeAbonne = 'Champ obligatoire'
    if (!data.typeFuite) e.typeFuite = 'Champ obligatoire'
    if (!data.dateNotification) e.dateNotification = 'Champ obligatoire'
    if (!data.dateReparation) e.dateReparation = 'Champ obligatoire'
    if (!data.plombierCertifie) e.plombierCertifie = 'Champ obligatoire'
    if (!data.attestationFournie) e.attestationFournie = 'Champ obligatoire'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  // Calcul du délai entre notification et réparation
  const delaiJours = data.dateNotification && data.dateReparation
    ? Math.round(
        (new Date(data.dateReparation) - new Date(data.dateNotification)) / (1000 * 60 * 60 * 24)
      )
    : null

  const delaiOk = delaiJours !== null && delaiJours >= 0 && delaiJours <= 30

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Vérification de l'éligibilité</h2>
      <p className="text-sm text-gray-500 mb-6">
        Renseignez les informations de l'abonné pour déterminer son éligibilité au dégrèvement.
      </p>

      <div className="space-y-6">
        {/* Type d'abonné */}
        <Field label="Type d'abonné" required error={errors.typeAbonne}>
          <RadioGroup
            name="typeAbonne"
            value={data.typeAbonne}
            onChange={(v) => onChange({ typeAbonne: v })}
            options={[
              { value: 'particulier', label: 'Particulier (non professionnel)' },
              { value: 'professionnel', label: 'Professionnel / Entreprise' },
            ]}
          />
          {data.typeAbonne === 'professionnel' && (
            <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>La loi Warsmann s'applique uniquement aux abonnés non professionnels. Le dégrèvement ne pourra pas être accordé.</span>
            </div>
          )}
        </Field>

        {/* Type de fuite */}
        <Field label="Nature de la fuite" required error={errors.typeFuite}>
          <RadioGroup
            name="typeFuite"
            value={data.typeFuite}
            onChange={(v) => onChange({ typeFuite: v })}
            options={[
              { value: 'privee', label: 'Canalisation privée (après compteur, hors chauffage et arrosage)' },
              { value: 'chauffage', label: 'Installation de chauffage' },
              { value: 'arrosage', label: 'Installation d\'arrosage / irrigation' },
              { value: 'autre', label: 'Autre / Indéterminée' },
            ]}
          />
          {(data.typeFuite === 'chauffage' || data.typeFuite === 'arrosage') && (
            <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>Les fuites sur installations de chauffage ou d'arrosage sont exclues du dispositif légal.</span>
            </div>
          )}
        </Field>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Date de notification de la surconsommation" required error={errors.dateNotification}>
            <input
              type="date"
              value={data.dateNotification}
              onChange={(e) => onChange({ dateNotification: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field>
          <Field label="Date de réparation de la fuite" required error={errors.dateReparation}>
            <input
              type="date"
              value={data.dateReparation}
              min={data.dateNotification || undefined}
              onChange={(e) => onChange({ dateReparation: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field>
        </div>

        {/* Indicateur délai */}
        {delaiJours !== null && (
          <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${delaiOk ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {delaiOk ? (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
              </svg>
            )}
            <span>
              Délai entre notification et réparation : <strong>{delaiJours} jour{delaiJours > 1 ? 's' : ''}</strong>
              {delaiOk ? ' — conforme (≤ 30 jours)' : ' — non conforme (dépasse 30 jours, dégrèvement refusé)'}
            </span>
          </div>
        )}

        {/* Plombier certifié */}
        <Field label="La réparation a été effectuée par un plombier qualifié ?" required error={errors.plombierCertifie}>
          <RadioGroup
            name="plombierCertifie"
            value={data.plombierCertifie}
            onChange={(v) => onChange({ plombierCertifie: v })}
            options={[
              { value: 'oui', label: 'Oui – professionnel certifié' },
              { value: 'non', label: 'Non – réparation effectuée par l\'abonné lui-même ou non certifié' },
            ]}
          />
        </Field>

        {/* Attestation */}
        <Field label="Une attestation de réparation a été fournie ?" required error={errors.attestationFournie}>
          <RadioGroup
            name="attestationFournie"
            value={data.attestationFournie}
            onChange={(v) => onChange({ attestationFournie: v })}
            options={[
              { value: 'oui', label: 'Oui – attestation remise au service' },
              { value: 'non', label: 'Non – attestation non fournie' },
            ]}
          />
        </Field>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
