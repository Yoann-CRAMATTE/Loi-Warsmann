import { EligibilityStep } from "@/types";

export const ELIGIBILITY_STEPS: EligibilityStep[] = [
  {
    id: "abonne",
    question: "Êtes-vous le titulaire du contrat d'abonnement au service de l'eau ?",
    explanation:
      "Le dégrèvement prévu par la loi Warsmann ne peut être demandé que par la personne dont le nom figure sur le contrat d'abonnement et qui reçoit les factures d'eau.",
    helpText:
      "Si vous êtes locataire, vérifiez sur votre facture d'eau si le contrat est à votre nom ou à celui de votre propriétaire. Si c'est votre propriétaire qui est abonné, vous devrez le contacter pour qu'il fasse la demande.",
    yesLabel: "Oui, je suis l'abonné",
    noLabel: "Non, je ne suis pas l'abonné",
    disqualifyOn: "no",
    disqualifyMessage: "Vous n'êtes pas l'abonné au service de l'eau",
    disqualifyDetail:
      "Seul le titulaire du contrat d'abonnement peut effectuer la demande de dégrèvement. Si vous êtes locataire et que votre propriétaire est l'abonné, contactez-le pour qu'il fasse la démarche. Si vous êtes bien l'usager mais que le contrat est au nom d'un tiers, régularisez d'abord votre situation auprès du service des eaux.",
  },
  {
    id: "consommation_anormale",
    question: "Votre facture d'eau affiche-t-elle une consommation anormalement élevée ?",
    explanation:
      "Pour bénéficier du dégrèvement, votre consommation doit avoir été significativement supérieure à votre consommation habituelle lors de la période de fuite.",
    helpText:
      "Une consommation est considérée comme anormale lorsqu'elle est nettement supérieure à votre consommation moyenne des années précédentes (généralement plus du double). Vérifiez vos factures antérieures pour comparer.",
    yesLabel: "Oui, ma consommation est anormalement élevée",
    noLabel: "Non, ma consommation est normale",
    disqualifyOn: "no",
    disqualifyMessage: "Aucune consommation anormale constatée",
    disqualifyDetail:
      "Le dégrèvement Warsmann s'applique uniquement lorsqu'une fuite a entraîné une consommation d'eau anormalement élevée. Sans surcoût de consommation significatif, il n'y a pas de base légale pour obtenir un dégrèvement.",
  },
  {
    id: "canalisation_enterree",
    question:
      "La fuite provenait-elle d'une canalisation d'eau potable enterrée (souterraine), après le compteur ?",
    explanation:
      "La loi Warsmann s'applique exclusivement aux fuites sur les canalisations enterrées situées sur votre propriété, en aval du compteur d'eau.",
    helpText:
      "Les canalisations enterrées sont celles qui passent sous le sol, entre le compteur d'eau (généralement en limite de propriété) et votre habitation. Ne sont PAS concernés : les fuites à l'intérieur du logement (robinets, chasse d'eau, chauffe-eau, joints, appareils électroménagers, piscines, systèmes d'arrosage en surface, etc.).",
    yesLabel: "Oui, la fuite était sur une canalisation enterrée",
    noLabel: "Non, la fuite était à l'intérieur du logement",
    disqualifyOn: "no",
    disqualifyMessage: "La fuite ne concerne pas une canalisation enterrée",
    disqualifyDetail:
      "La loi Warsmann (article L2224-12-4-1 du Code général des collectivités territoriales) ne s'applique qu'aux fuites sur canalisations enterrées situées après le compteur. Les fuites intérieures (robinets qui fuient, chasse d'eau défectueuse, chauffe-eau, lave-linge, tuyaux apparents…) ne sont pas éligibles à ce dispositif légal. Vous pouvez toutefois tenter une négociation amiable auprès de votre distributeur d'eau.",
  },
  {
    id: "reparee",
    question: "La fuite a-t-elle été réparée ?",
    explanation:
      "La réparation effective de la fuite est une condition indispensable pour bénéficier du dégrèvement. Elle doit être réalisée par un plombier professionnel.",
    helpText:
      "La réparation doit être effectuée par un professionnel qualifié (plombier, entreprise de plomberie). Une réparation provisoire ou effectuée par vous-même pourrait ne pas être acceptée par le service des eaux.",
    yesLabel: "Oui, la fuite a été réparée par un professionnel",
    noLabel: "Non, la fuite n'est pas encore réparée",
    disqualifyOn: "no",
    disqualifyMessage: "La fuite n'a pas encore été réparée",
    disqualifyDetail:
      "Vous ne pouvez pas encore déposer votre demande de dégrèvement. La première étape est de faire réparer la fuite par un plombier professionnel, puis d'obtenir une attestation de réparation. Dès que la réparation est effectuée, vous aurez 1 mois pour envoyer votre demande au service des eaux.",
  },
  {
    id: "attestation",
    question:
      "Disposez-vous d'une attestation de réparation délivrée par un plombier professionnel ?",
    explanation:
      "L'attestation de réparation est le document clé de votre dossier. Elle doit être établie par le plombier qui a effectué la réparation et mentionner la nature de la fuite, sa localisation et la date de réparation.",
    helpText:
      "Si vous n'avez pas encore reçu l'attestation, contactez votre plombier pour qu'il vous en établisse une. Ce document doit préciser : l'adresse du chantier, la nature de la fuite (canalisation enterrée), la date de l'intervention, la confirmation que la fuite est réparée, et les coordonnées du plombier (SIRET).",
    yesLabel: "Oui, j'ai l'attestation du plombier",
    noLabel: "Non, je n'ai pas encore l'attestation",
    disqualifyOn: "no",
    disqualifyMessage: "Attestation de réparation manquante",
    disqualifyDetail:
      "Sans attestation de réparation d'un plombier professionnel, votre demande de dégrèvement ne pourra pas aboutir. Contactez le plombier qui a effectué la réparation pour qu'il vous établisse ce document. Le délai d'un mois pour faire la demande court à partir de la date de cette attestation.",
  },
  {
    id: "delai",
    question:
      "L'attestation de réparation a-t-elle été établie il y a moins d'un mois ?",
    explanation:
      "Vous devez adresser votre demande de dégrèvement au service des eaux dans un délai d'un mois suivant la date figurant sur l'attestation de réparation du plombier.",
    helpText:
      "Le délai court à partir de la date de délivrance de l'attestation par le plombier (et non à partir de la date de la fuite ou de la réparation). Si ce délai est dépassé, certains services des eaux acceptent tout de même les demandes tardives, mais ce n'est pas une obligation légale.",
    yesLabel: "Oui, l'attestation date de moins d'un mois",
    noLabel: "Non, le délai d'un mois est dépassé",
    disqualifyOn: "no",
    disqualifyMessage: "Délai légal d'un mois potentiellement dépassé",
    disqualifyDetail:
      "Le délai légal d'un mois pour déposer la demande est dépassé. Cependant, vous pouvez tout de même tenter votre chance : de nombreux services des eaux acceptent les demandes hors délai, notamment si le dépassement est limité. Préparez votre dossier et expliquez les raisons du retard dans votre courrier. La décision appartient au service des eaux.",
    warningOnly: true,
  },
];
