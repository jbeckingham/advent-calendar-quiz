const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const R = require("ramda");

const getAdminDoc = async (id) => {
    const response = admin
        .firestore()
        .collection("admin")
        .where("calendar_id", "==", parseInt(id));
    const data = await response.get();
    const resultsArray = data.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });

    return resultsArray;
};

const checkPassword = async (id, password) => {
    const resultsArray = await getAdminDoc(id);

    if (R.isEmpty(resultsArray)) {
        return false;
    } else {
        const correctPassword = resultsArray[0].password;
        return correctPassword === password;
    }
};

exports.verifyPassword = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { password, id } = req.body.data;

        const result = await checkPassword(id, password);

        return res.json({ result: result });
    });
});

exports.changePassword = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { id, password, newPassword } = req.body.data;

        const passwordCheck = await checkPassword(id, password);

        if (passwordCheck) {
            const db = admin.firestore().collection("admin");
            const resultsArray = await getAdminDoc(id);

            await db.doc(resultsArray[0].id).update({
                password: newPassword,
            });
            res.json({ result: true });
        } else {
            res.json({ result: false });
        }
    });
});
