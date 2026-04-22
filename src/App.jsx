import { useState } from 'react'
import Header from './components/Header'
import StepIndicator from './components/StepIndicator'
import StepEligibilite from './components/StepEligibilite'
import StepConsommation from './components/StepConsommation'
import StepResultat from './components/StepResultat'

const STEPS = [
  { id: 1, label: 'Éligibilité' },
  { id: 2, label: 'Consommation' },
  { id: 3, label: 'Résultat' },
]

const initialData = {
  // Step 1 – Éligibilité
  typeAbonne: '',           // 'particulier' | 'professionnel'
  typeFuite: '',            // 'privee' | 'chauffage' | 'arrosage' | 'autre'
  dateNotification: '',     // date ISO
  dateReparation: '',       // date ISO
  plombierCertifie: '',     // 'oui' | 'non'
  attestationFournie: '',   // 'oui' | 'non'

  // Step 2 – Consommation
  consommationReelle: '',   // m³
  consommationRef: '',      // m³ (moyenne des années précédentes)
  prixM3HT: '',             // €/m³
  tauxTVA: '5.5',           // % TVA eau
}

export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)

  const updateData = (fields) => setData((prev) => ({ ...prev, ...fields }))

  const handleReset = () => {
    setData(initialData)
    setStep(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <StepIndicator steps={STEPS} currentStep={step} />
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {step === 1 && (
            <StepEligibilite
              data={data}
              onChange={updateData}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepConsommation
              data={data}
              onChange={updateData}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepResultat
              data={data}
              onReset={handleReset}
            />
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Art. L2224-12-4 du Code général des collectivités territoriales – Loi Warsmann n°2011-525 du 17 mai 2011
        </p>
      </main>
    </div>
  )
}
