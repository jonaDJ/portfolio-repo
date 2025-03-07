import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  Timestamp,
  getDocs,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const formatDate = (date: Timestamp | string): string => {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return date;
};

// Fetch using Collection + ID (its doc ID)
export const fetchDocumentById = async (
  collectionName: string,
  id: string
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      for (const key in data) {
        if (data[key] instanceof Timestamp) {
          data[key] = formatDate(data[key]);
        }
      }

      return data;
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};

// Fetch using Collection + field types([] === all)
export const fetchCollection = async <T>(
  collectionName: string,
  fields?: (keyof T)[]
): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const dataList: T[] = [];

    querySnapshot.forEach((doc) => {
      let data: DocumentData = doc.data();

      if (fields && fields.length > 0) {
        const selectedData: DocumentData = {};
        fields.forEach((field) => {
          if (data.hasOwnProperty(field)) {
            selectedData[field as string] = data[field as string];
          }
        });
        data = selectedData;
      }

      dataList.push({
        id: doc.id,
        ...data,
        date: formatDate(data.date),
      } as T);
    });

    return dataList;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

export const messagesCollection = collection(db, "messages");

export { db };
