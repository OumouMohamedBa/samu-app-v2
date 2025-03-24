import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from 'emailjs-com';

// 📌 Génère un code de validation à 6 chiffres
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 📩 Envoie un email contenant le code de validation
export const sendEmailVerificationCode = async (email: string) => {
  try {
    const verificationCode = generateVerificationCode();
    console.log('📩 Code généré:', verificationCode);

    // Sauvegarde le code et la date d'envoi dans Firestore
    const userRef = doc(db, 'emailVerification', email);
    await setDoc(userRef, {
      code: verificationCode,
      createdAt: serverTimestamp(),
    });

    // Configuration EmailJS
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID!;

    // Vérifier que les variables d'environnement sont bien définies
    if (!serviceId || !templateId || !userId) {
      throw new Error("❌ Les identifiants EmailJS ne sont pas configurés.");
    }

    // Envoi de l'email via EmailJS
    await emailjs.send(serviceId, templateId, {
      to_email: email,
      verification_code: verificationCode,
    }, userId);

    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du code :", error);
    throw new Error("Impossible d'envoyer le code de vérification.");
  }
};

// ✅ Vérifie si le code saisi correspond à celui enregistré dans Firestore
export const verifyEmailCode = async (email: string, code: string) => {
  try {
    const userRef = doc(db, 'emailVerification', email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("❌ Code invalide ou expiré.");
    }

    const storedCode = userDoc.data()?.code;
    if (storedCode !== code) {
      throw new Error("❌ Code incorrect.");
    }

    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du code :", error);
    throw error;
  }
};
