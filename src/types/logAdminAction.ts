import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const logAdminAction = async (
  action: string,
  userEmail: string,
  target: string,
  additionalInfo: string = ''
) => {
  try {
    await addDoc(collection(db, 'actionHistory'), {
      action,
      userEmail,
      target,
      additionalInfo,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erreur lors de l’enregistrement de l’action admin :', error);
  }
};
