"use client";

import { useState } from "react";
import Link from "next/link";
import { ELIGIBILITY_STEPS } from "@/data/eligibilitySteps";
import { EligibilityAnswer } from "@/types";

type StepResult = {
  answer: EligibilityAnswer;
  stepId: string;
};

export default function EligibilitePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<StepResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<EligibilityAnswer>(null);
  const [showResult, setShowResult] = useState(false);
  const [finalEligible, setFinalEligible] = useState<boolean | null>(null);
  const [disqualifiedStep, setDisqualifiedStep] = useState<number | null>(null);

  const step = ELIGIBILITY_STEPS[currentStep];
  const progress = ((currentStep) / ELIGIBILITY_STEPS.length) * 100;

  function handleSelect(answer: EligibilityAnswer) {
    setSelectedAnswer(answer);
  }

  function handleNext() {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, { answer: selectedAnswer, stepId: step.id }];
    setAnswers(newAnswers);

    const isDisqualified =
      selectedAnswer === step.disqualifyOn && !step.warningOnly;

    if (isDisqualified) {
      setDisqualifiedStep(currentStep);
      setFinalEligible(false);
      setShowResult(true);
      return;
    }

    if (currentStep === ELIGIBILITY_STEPS.length - 1) {
      const hasWarning = selectedAnswer === step.disqualifyOn && step.warningOnly;
      setFinalEligible(!hasWarning);
      setShowResult(true);
      return;
    }

    setCurrentStep((s) => s + 1);
    setSelectedAnswer(null);
  }

  function handleBack() {
    if (currentStep === 0) return;
    setCurrentStep((s) => s - 1);
    const prev = answers[answers.length - 1];
    setSelectedAnswer(prev?.answer ?? null);
    setAnswers((a) => a.slice(0, -1));
  }

  function handleRestart() {
    setCurrentStep(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setFinalEligible(null);
    setDisqualifiedStep(null);
  }

  if (showResult) {
    const isWarning =
      finalEligible === false && disqualifiedStep === null;
    const disqualStep =
      disqualifiedStep !== null ? ELIGIBILITY_STEPS[disqualifiedStep] : null;
    const lastStep = ELIGIBILITY_STEPS[ELIGIBILITY_STEPS.length - 1];
    const lastAnswer = answers[answers.length - 1];
    const isLateWarning =
      lastStep.warningOnly &&
      lastAnswer?.answer === "no" &&
      disqualifiedStep === null;

    return (
      <div className="max-w-2xl mx-auto px-4 py-10 fade-in">
        {/* Eligible */}
        {finalEligible === true && (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--success)" }}
            >
              Vous êtes éligible au dégrèvement !
            </h1>
            <p className="text-gray-600 mb-6">
              D&apos;après vos réponses, vous remplissez toutes les conditions
              pour bénéficier du dégrèvement prévu par la loi Warsmann.
            </p>
            <div
              style={{ backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" }}
              className="border rounded-lg p-4 mb-6 text-left"
            >
              <p className="font-semibold text-green-800 mb-2">
                Prochaines étapes :
              </p>
              <ol className="text-green-700 text-sm space-y-2 list-decimal list-inside">
                <li>
                  Rassemblez vos documents (attestation plombier, factures d&apos;eau,
                  RIB si remboursement)
                </li>
                <li>
                  Calculez le montant estimé du dégrèvement
                </li>
                <li>
                  Préparez et envoyez votre courrier au service des eaux
                </li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/calcul" className="btn-primary">
                🧮 Calculer le montant
              </Link>
              <Link href="/dossier" className="btn-secondary">
                📄 Préparer mon courrier
              </Link>
            </div>
          </div>
        )}

        {/* Late warning (délai dépassé) */}
        {isLateWarning && (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--warning)" }}
            >
              Délai légal dépassé — tentez quand même
            </h1>
            <p className="text-gray-600 mb-4">
              Le délai légal d&apos;un mois est dépassé, mais de nombreux services
              des eaux acceptent les demandes tardives. Rien ne vous empêche
              d&apos;envoyer le dossier en expliquant la situation.
            </p>
            <div
              style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}
              className="border rounded-lg p-4 mb-6 text-left"
            >
              <p className="font-semibold text-amber-800 mb-2">Conseils :</p>
              <ul className="text-amber-700 text-sm space-y-1 list-disc list-inside">
                <li>Mentionnez les raisons du dépassement dans votre courrier</li>
                <li>
                  Joignez tous vos justificatifs (attestation plombier, factures)
                </li>
                <li>
                  En cas de refus, vous pouvez saisir le médiateur de l&apos;eau ou
                  votre mairie
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/calcul" className="btn-primary">
                🧮 Calculer le montant
              </Link>
              <Link href="/dossier" className="btn-secondary">
                📄 Préparer mon courrier
              </Link>
            </div>
          </div>
        )}

        {/* Not eligible */}
        {finalEligible === false && !isWarning && disqualStep && (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--danger)" }}
            >
              {disqualStep.disqualifyMessage}
            </h1>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {disqualStep.disqualifyDetail}
            </p>
            <div
              style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
              className="border rounded-lg p-4 mb-6 text-left text-sm text-red-700"
            >
              <p className="font-semibold mb-1">Blocage à l&apos;étape :</p>
              <p>
                &laquo; {disqualStep.question} &raquo; → vous avez répondu{" "}
                <strong>
                  {answers[disqualifiedStep!]?.answer === "yes" ? "Oui" : "Non"}
                </strong>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleRestart} className="btn-secondary">
                🔄 Recommencer
              </button>
              <Link href="/" className="btn-secondary">
                🏠 Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        )}

        {/* Summary of answers */}
        <div className="card p-6 mt-6">
          <p className="section-title">Récapitulatif de vos réponses</p>
          <div className="space-y-2">
            {answers.map((a, i) => {
              const s = ELIGIBILITY_STEPS[i];
              return (
                <div
                  key={s.id}
                  className="flex items-start gap-3 text-sm py-2 border-b last:border-b-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {a.answer === "yes" ? "✅" : "❌"}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-700">{s.question}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                      a.answer === "yes"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.answer === "yes" ? "Oui" : "Non"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleRestart}
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            ← Recommencer le questionnaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            Question {currentStep + 1} / {ELIGIBILITY_STEPS.length}
          </span>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {Math.round(progress)}% complété
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step breadcrumb */}
      <div className="flex gap-1.5 mb-6">
        {ELIGIBILITY_STEPS.map((s, i) => (
          <div
            key={s.id}
            className="h-1.5 rounded-full flex-1 transition-colors duration-300"
            style={{
              backgroundColor:
                i < currentStep
                  ? "var(--success)"
                  : i === currentStep
                  ? "var(--primary)"
                  : "#e2e8f0",
            }}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="card p-6 sm:p-8 fade-in" key={step.id}>
        <div className="mb-6">
          <p className="section-title">Critère {currentStep + 1}</p>
          <h2 className="text-xl font-bold text-gray-800 leading-snug mb-3">
            {step.question}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {step.explanation}
          </p>
        </div>

        {/* Help box */}
        {step.helpText && (
          <div
            style={{ backgroundColor: "var(--surface-alt)", borderColor: "var(--border)" }}
            className="border rounded-lg p-4 mb-6"
          >
            <p className="text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>
              💡 Pour vous aider
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {step.helpText}
            </p>
          </div>
        )}

        {/* Answer buttons */}
        <div className="space-y-3 mb-6">
          <button
            className={`answer-btn ${
              selectedAnswer === "yes" ? "selected-yes" : ""
            }`}
            onClick={() => handleSelect("yes")}
          >
            <span className="text-xl flex-shrink-0">
              {selectedAnswer === "yes" ? "✅" : "⭕"}
            </span>
            <span>{step.yesLabel ?? "Oui"}</span>
          </button>
          <button
            className={`answer-btn ${
              selectedAnswer === "no" ? "selected-no" : ""
            }`}
            onClick={() => handleSelect("no")}
          >
            <span className="text-xl flex-shrink-0">
              {selectedAnswer === "no" ? "❌" : "⭕"}
            </span>
            <span>{step.noLabel ?? "Non"}</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-sm font-medium transition-opacity disabled:opacity-30"
            style={{ color: "var(--primary)" }}
          >
            ← Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            {currentStep === ELIGIBILITY_STEPS.length - 1
              ? "Voir le résultat"
              : "Suivant →"}
          </button>
        </div>
      </div>

      {/* Criteria mini-map */}
      <div className="card p-4 mt-4">
        <p className="section-title text-xs">Critères à vérifier</p>
        <div className="space-y-1.5">
          {ELIGIBILITY_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 text-xs">
              <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                {i < currentStep ? (
                  <span className="text-green-500">✓</span>
                ) : i === currentStep ? (
                  <span
                    style={{ color: "var(--primary)" }}
                    className="font-bold"
                  >
                    •
                  </span>
                ) : (
                  <span className="text-gray-300">○</span>
                )}
              </span>
              <span
                className={
                  i < currentStep
                    ? "text-green-600 line-through"
                    : i === currentStep
                    ? "font-semibold text-gray-800"
                    : "text-gray-400"
                }
              >
                {s.question.length > 60
                  ? s.question.slice(0, 60) + "…"
                  : s.question}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
