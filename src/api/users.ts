import { User } from "firebase/auth";
import { db } from "../../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const userCollection = collection(db, 'users');

export const addUser = async (user: User) => {
    setDoc(await doc(userCollection, user.uid), {
        email: user.email
    });
}