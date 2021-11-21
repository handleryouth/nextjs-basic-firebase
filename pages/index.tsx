import type { NextPage } from "next";
import { db, firebaseApp } from "../firebase/clientApp";
// Import the useAuthStateHook
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

// for getting data from cloud firestore
import { getFirestore, collection } from "firebase/firestore";

//for sending data to cloud firestore
import { doc, setDoc } from "firebase/firestore";

//for retrives and monitors a collection from cloud firestore
//it also stores the latest data in the value
import { useCollection } from "react-firebase-hooks/firestore";

//for getting auth data
const auth = getAuth(firebaseApp);

const Home: NextPage = () => {
  // Destructure user, loading, and error out of the hook.
  const [user, loading, error] = useAuthState(auth);
  // console.log the current user and loading status

  console.log(user);

  //getting data from collection in firestore
  const [value, votesLoading, votesError] = useCollection(
    collection(getFirestore(firebaseApp), "votes")
  );

  //after getting the data, you can access it by mapping like this code below
  value &&
    value.docs.map((doc) => {
      console.log(doc.data());
    });

  //create document function
  const addVoteDocument = async (vote: string) => {
    // to send data, make sure you know what to fill
    // the row of the data is the same as the table in firestore firecloud
    await setDoc(doc(db, "votes", user!.uid), {
      vote,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        style={{ fontSize: 32, marginRight: 8 }}
        onClick={() => addVoteDocument("yes")}
      >
        ✔️🍍🍕
      </button>

      <h3>
        Pineapple Lovers:{" "}
        {value?.docs?.filter((doc) => doc.data().vote === "yes").length}
      </h3>

      <button style={{ fontSize: 32 }} onClick={() => addVoteDocument("no")}>
        ❌🍍🍕
      </button>

      <h3>
        Pineapple Haters:{" "}
        {value?.docs?.filter((doc) => doc.data().vote === "no").length}
      </h3>
    </div>
  );
};

export default Home;
