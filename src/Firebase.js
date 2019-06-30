import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyA_l9bJNsDjZUqcid_Mq1oq5Dis0YtTDf8",
  authDomain: "react-test-9ddda.firebaseapp.com",
  databaseURL: "https://react-test-9ddda.firebaseio.com",
  projectId: "react-test-9ddda",
  storageBucket: "",
  messagingSenderId: "1059924843353",
  appId: "1:1059924843353:web:3f98d1a613cf3598"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
