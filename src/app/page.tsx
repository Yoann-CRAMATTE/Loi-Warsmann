import Link from "next/link";

const steps = [
  {
    icon: "✅",
    title: "Vérifiez votre éligibilité",
    desc: "Répondez à 6 questions simples pour savoir si vous pouvez bénéficier du dégrèvement.",
    href: "/eligibilite",
    cta: "Commencer",
  },
  {
    icon: "🧮",
    title: "Estimez le montant",
    desc: "Calculez le montant du dégrèvement auquel vous avez droit en fonction de votre consommation.",
    href: "/calcul",
    cta: "Calculer",
  },
  {
    icon: "📄",
    title: "Générez votre courrier",
    desc: "Remplissez le formulaire et obtenez une lettre prête à envoyer à votre service des eaux.",
    href: "/dossier",
    cta: "Préparer le dossier",
  },
];

const conditions = [
  {
    icon: "🔵",
    title: "Canalisation enterrée",
    desc: "La fuite doit se trouver sur une canalisation d'eau potable souterraine, après le compteur, sur votre propriété.",
  },
  {
    icon: "🔧",
    title: "Réparation professionnelle",
    desc: "La fuite doit être réparée par un plombier professionnel qui établit une attestation de réparation.",
  },
  {
    icon: "📅",
    title: "Délai d'un mois",
    desc: "Vous devez envoyer votre demande au service des eaux dans le mois suivant la date de l'attestation.",
  },
  {
    icon: "👤",
    title: "Être l'abonné",
    desc: "Seul le titulaire du contrat d'abonnement peut faire la demande (propriétaire ou locataire abonné).",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%)",
        }}
        className="text-white py-16 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">💧</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Dégrèvement eau — Loi Warsmann
          </h1>
          <p className="text-sky-100 text-lg mb-2 max-w-2xl mx-auto">
            Vous avez eu une fuite d&apos;eau souterraine et votre facture a
            explosé ?
          </p>
          <p className="text-white text-xl font-semibold mb-8">
            La loi vous protège. Découvrez si vous avez droit à un remboursement.
          </p>
          <Link
            href="/eligibilite"
            className="inline-flex items-center gap-2 bg-white text-sky-800 font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:bg-sky-50 transition-colors"
          >
            Vérifier mon éligibilité
            <span>→</span>
          </Link>
          <p className="text-sky-200 text-sm mt-4">
            Gratuit · Sans inscription · 2 minutes
          </p>
        </div>
      </section>

      {/* What is it */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="card p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--primary-dark)" }}>
            C&apos;est quoi la loi Warsmann ?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            La{" "}
            <strong>loi n°2011-525 du 17 mai 2011</strong> (dite loi Warsmann),
            codifiée à l&apos;article{" "}
            <strong>L2224-12-4-1 du Code général des collectivités territoriales</strong>,
            oblige les services de distribution d&apos;eau à accorder un{" "}
            <strong>dégrèvement sur la facture d&apos;eau</strong> lorsqu&apos;une fuite
            souterraine a causé une consommation anormalement élevée.
          </p>
          <div
            style={{ backgroundColor: "var(--surface-alt)", borderColor: "var(--border)" }}
            className="rounded-lg border p-4 text-sm"
          >
            <p className="font-semibold mb-1" style={{ color: "var(--primary-dark)" }}>
              Principe du dégrèvement :
            </p>
            <p className="text-gray-700">
              Le service des eaux ne peut pas vous facturer plus du{" "}
              <strong>double de votre consommation moyenne annuelle</strong> lors
              d&apos;une période de fuite éligible. L&apos;excédent vous est remboursé ou
              déduit de votre facture.
            </p>
          </div>
        </div>

        {/* Steps */}
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--primary-dark)" }}>
          Comment ça marche ?
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {steps.map((step, i) => (
            <div key={step.href} className="card p-5 text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <div
                className="text-xs font-bold mb-1"
                style={{ color: "var(--primary-light)" }}
              >
                ÉTAPE {i + 1}
              </div>
              <h3 className="font-bold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {step.desc}
              </p>
              <Link
                href={step.href}
                style={{ color: "var(--primary)" }}
                className="text-sm font-semibold hover:underline"
              >
                {step.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--primary-dark)" }}>
          Les 4 conditions à remplir
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {conditions.map((c) => (
            <div key={c.title} className="card p-5 flex gap-4 items-start">
              <span className="text-2xl flex-shrink-0">{c.icon}</span>
              <div>
                <p className="font-bold text-gray-800 mb-1">{c.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary))" }}
          className="rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-xl font-bold mb-2">
            Prêt à vérifier votre dossier ?
          </h2>
          <p className="text-sky-100 mb-6 text-sm">
            Notre outil vous guide étape par étape. En 2 minutes, vous saurez si
            vous êtes éligible.
          </p>
          <Link
            href="/eligibilite"
            className="inline-flex items-center gap-2 bg-white text-sky-800 font-bold px-8 py-3 rounded-xl hover:bg-sky-50 transition-colors"
          >
            Commencer la vérification →
          </Link>
        </div>
      </section>
    </div>
  );
}
