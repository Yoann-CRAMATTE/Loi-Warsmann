# Dégrèvement Eau – Loi Warsmann

Application web d'aide à la demande de dégrèvement de facture d'eau suite à une fuite sur canalisation enterrée, en application de l'**article L2224-12-4-1 du Code général des collectivités territoriales** (loi n°2011-525 du 17 mai 2011, dite loi Warsmann).

## Fonctionnalités

- **Vérification d'éligibilité** : questionnaire guidé en 6 étapes pour savoir si l'usager remplit les conditions légales
- **Calcul estimatif** : estimation du montant du dégrèvement basé sur la consommation habituelle et la consommation anormale
- **Génération de courrier** : formulaire de saisie + génération automatique d'une lettre de demande prête à envoyer en recommandé

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans un navigateur.

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com)

## Base légale

> Article L2224-12-4-1 du Code général des collectivités territoriales  
> Loi n°2011-525 du 17 mai 2011 (article 37-1)  
> Modifié par la loi n°2014-1545 du 20 décembre 2014

**Conditions du dégrèvement :**
1. Être l'abonné au service de l'eau
2. Consommation anormalement élevée suite à une fuite
3. Fuite sur **canalisation enterrée** après le compteur (hors installations intérieures)
4. Réparation par un plombier professionnel avec **attestation**
5. Demande dans le **délai d'un mois** suivant l'attestation

**Plafond légal :** le service des eaux ne peut facturer plus du double de la consommation moyenne annuelle sur la période de fuite.

---

*Cet outil est fourni à titre informatif et ne constitue pas un conseil juridique.*
