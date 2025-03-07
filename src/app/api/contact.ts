import { NextApiRequest, NextApiResponse } from "next";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;

      const docRef = await addDoc(collection(db, "messages"), {
        name: name,
        email: email,
        message: message,
        timestamp: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
      res
        .status(200)
        .json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error adding document: ", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to send message." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
