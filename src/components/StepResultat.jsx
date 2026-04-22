import { useMemo } from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const fmtM3 = (n) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n)

function checkEligibilite(data) {
  const motifs = []

  if (data.typeAbonne !== 'particulier')
    motifs.push('L\'abonné doit être un particulier (non professionnel).')

  if (data.typeFuite === 'chauffage' || data.typeFuite === 'arrosage')
    motifs.push('Les fuites sur installations de chauffage ou d\'arrosage sont exclues du dispositif.')

  if (data.typeFuite === 'autre')
    motifs.push('La nature de la fuite n\'est pas conforme (doit être sur canalisation privée hors chauffage/arrosage).')

  if (data.dateNotification && data.dateReparation) {
    const delai = Math.round(
      (new Date(data.dateReparation) - new Date(data.dateNotification)) / (1000 * 60 * 60 * 24)
    )
    if (delai < 0) {
      motifs.push('La date de réparation est antérieure à la date de notification.')
    } else if (delai > 30) {
      motifs.push(`La réparation a eu lieu ${delai} jours après la notification (délai légal : 30 jours maximum).`)
    }
  } else {
    motifs.push('Les dates de notification et/ou de réparation sont manquantes.')
  }

  if (data.plombierCertifie !== 'oui')
    motifs.push('La réparation doit être effectuée par un professionnel qualifié.')

  if (data.attestationFournie !== 'oui')
    motifs.push('L\'attestation de réparation n\'a pas été fournie au service.')

  return motifs
}

export default function StepResultat({ data, onReset }) {
  const motifsRefus = useMemo(() => checkEligibilite(data), [data])
  const eligible = motifsRefus.length === 0

  const calcul = useMemo(() => {
    const reelle = Number(data.consommationReelle)
    const ref = Number(data.consommationRef)
    const prixHT = Number(data.prixM3HT)
    const tva = Number(data.tauxTVA) / 100

    const seuil = ref * 2
    const surConso = Math.max(0, reelle - seuil)
    const montantHTDegrevable = surConso * prixHT
    const montantTTCDegrevable = montantHTDegrevable * (1 + tva)
    const montantFactureInitialHT = reelle * prixHT
    const montantFactureInitialTTC = montantFactureInitialHT * (1 + tva)
    const montantApresDegrevement = montantFactureInitialTTC - montantTTCDegrevable

    return {
      reelle,
      ref,
      seuil,
      surConso,
      prixHT,
      tva,
      montantHTDegrevable,
      montantTTCDegrevable,
      montantFactureInitialHT,
      montantFactureInitialTTC,
      montantApresDegrevement,
    }
  }, [data])

  const dateNotif = data.dateNotification
    ? new Date(data.dateNotification).toLocaleDateString('fr-FR')
    : '—'
  const dateRep = data.dateReparation
    ? new Date(data.dateReparation).toLocaleDateString('fr-FR')
    : '—'
  const delaiJours = data.dateNotification && data.dateReparation
    ? Math.round((new Date(data.dateReparation) - new Date(data.dateNotification)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Résultat de l'analyse</h2>

      {/* Bandeau éligibilité */}
      {eligible ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-300 rounded-xl p-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-green-800">Éligible au dégrèvement</p>
            <p className="text-sm text-green-700">Toutes les conditions de la loi Warsmann sont remplies.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-red-800 mb-2">Non éligible au dégrèvement</p>
            <ul className="space-y-1">
              {motifsRefus.map((m, i) => (
                <li key={i} className="text-sm text-red-700 flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Récapitulatif conditions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Récapitulatif des conditions</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <CondRow
                label="Type d'abonné"
                value={data.typeAbonne === 'particulier' ? 'Particulier' : 'Professionnel'}
                ok={data.typeAbonne === 'particulier'}
              />
              <CondRow
                label="Nature de la fuite"
                value={
                  data.typeFuite === 'privee' ? 'Canalisation privée' :
                  data.typeFuite === 'chauffage' ? 'Installation de chauffage' :
                  data.typeFuite === 'arrosage' ? 'Installation d\'arrosage' : 'Autre'
                }
                ok={data.typeFuite === 'privee'}
              />
              <CondRow
                label="Notification de la surconsommation"
                value={dateNotif}
                ok={!!data.dateNotification}
              />
              <CondRow
                label="Date de réparation"
                value={dateRep}
                ok={!!data.dateReparation}
              />
              <CondRow
                label="Délai de réparation (≤ 30 jours)"
                value={delaiJours !== null ? `${delaiJours} jour${delaiJours > 1 ? 's' : ''}` : '—'}
                ok={delaiJours !== null && delaiJours >= 0 && delaiJours <= 30}
              />
              <CondRow
                label="Réparation par plombier qualifié"
                value={data.plombierCertifie === 'oui' ? 'Oui' : 'Non'}
                ok={data.plombierCertifie === 'oui'}
              />
              <CondRow
                label="Attestation fournie"
                value={data.attestationFournie === 'oui' ? 'Oui' : 'Non'}
                ok={data.attestationFournie === 'oui'}
                last
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Calcul du dégrèvement */}
      {eligible && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Calcul du dégrèvement</h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <CalcRow label="Consommation réelle" value={`${fmtM3(calcul.reelle)} m³`} />
                <CalcRow label="Consommation de référence" value={`${fmtM3(calcul.ref)} m³/an`} />
                <CalcRow label="Seuil légal (2 × référence)" value={`${fmtM3(calcul.seuil)} m³`} highlight />
                <CalcRow label="Volume dégrévable (réelle − seuil)" value={`${fmtM3(calcul.surConso)} m³`} />
                <CalcRow label="Prix unitaire HT" value={`${fmt(calcul.prixHT)} €/m³`} />
                <CalcRow label="TVA applicable" value={`${(calcul.tva * 100).toFixed(1)} %`} />
                <CalcRow label="Montant dégrèvement HT" value={`${fmt(calcul.montantHTDegrevable)} €`} />
                <CalcRow label="Montant dégrèvement TTC" value={`${fmt(calcul.montantTTCDegrevable)} €`} accent />
              </tbody>
            </table>
          </div>

          {/* Résumé financier */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryCard label="Facture initiale TTC" value={`${fmt(calcul.montantFactureInitialTTC)} €`} color="gray" />
            <SummaryCard label="Dégrèvement accordé TTC" value={`- ${fmt(calcul.montantTTCDegrevable)} €`} color="red" />
            <SummaryCard label="Montant dû après dégrèvement" value={`${fmt(calcul.montantApresDegrevement)} €`} color="green" />
          </div>

          {calcul.surConso === 0 && (
            <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>La consommation réelle ne dépasse pas le seuil légal (2× référence). Le dégrèvement est de 0 €.</span>
            </div>
          )}
        </div>
      )}

      {/* Référence légale */}
      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 mb-6">
        <p className="font-semibold text-gray-600 mb-1">Base légale</p>
        <p>Art. L2224-12-4 du CGCT — Loi n°2011-525 du 17 mai 2011 dite « loi Warsmann ».</p>
        <p className="mt-1">Le service ne peut facturer plus du double de la consommation habituelle lorsque la fuite est avérée, réparée dans le délai légal et attestée.</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Nouvelle demande
        </button>
      </div>
    </div>
  )
}

function CondRow({ label, value, ok, last }) {
  return (
    <tr className={`${!last ? 'border-b border-gray-100' : ''}`}>
      <td className="px-4 py-3 text-gray-600 w-1/2">{label}</td>
      <td className="px-4 py-3 font-medium text-gray-800">{value}</td>
      <td className="px-4 py-3 text-right">
        {ok ? (
          <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/>
            </svg>
            Conforme
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-red-700 text-xs font-medium bg-red-100 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
            Non conforme
          </span>
        )}
      </td>
    </tr>
  )
}

function CalcRow({ label, value, highlight, accent }) {
  return (
    <tr className={`border-b border-gray-100 ${highlight ? 'bg-blue-50' : ''} ${accent ? 'bg-green-50' : ''}`}>
      <td className={`px-4 py-3 ${highlight ? 'text-blue-700 font-medium' : accent ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
        {label}
      </td>
      <td className={`px-4 py-3 text-right font-semibold ${highlight ? 'text-blue-800' : accent ? 'text-green-800' : 'text-gray-800'}`}>
        {value}
      </td>
    </tr>
  )
}

function SummaryCard({ label, value, color }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-50 text-red-700 border border-red-200',
    green: 'bg-green-50 text-green-800 border border-green-200',
  }
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-xs opacity-70 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
