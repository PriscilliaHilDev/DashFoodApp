import app from 'firebase/app';
import 'firebase/auth';
import "firebase/firestore"; 
import 'firebase/storage';
// import 'firebase/functions';
// import 'firebase/messaging';


const  firebaseConfig = {
    apiKey: "AIzaSyCsj4pae0Gxtz2YkJCqa_xsjXvQZVUzDWI",
    authDomain: "myfastfood-9b2c4.firebaseapp.com",
    projectId: "myfastfood-9b2c4",
    storageBucket: "myfastfood-9b2c4.appspot.com",
    messagingSenderId: "461301969120",
    appId: "1:461301969120:web:297dd53714a6cb4b406085"
};

class Firebase {
    constructor(){
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage()
        // this.messaging = app.messaging();
        // this.functions = app.functions();
        this.idDoc = app.firestore.FieldPath.documentId()
      
    } 

    // on crée le document dans la collection (la table) users
    queryAddUser  = (userID, data) => this.db.collection('users').doc(userID).set(data);
    getCurrentUser = (userID) =>this.db.collection('users').doc(userID)
    queryUsersAdmins = () =>this.db.collection('users').where('admin', '==', true).orderBy('createdAt', "desc")
    queryAllProducts = () => this.db.collection('products')
    queryListProducts = () => this.db.collection('products').orderBy('name', 'asc')

    queryAllCategories = () => this.db.collection('category')
    queryOneProduct = (id) => this.db.collection('products').doc(id)
    queryCategoriesSucrees = () => this.db.collection('category').where('typeOfCat', '==', 'Sucré').orderBy('createdAt', "desc")
    queryCategoriesSalees = () => this.db.collection('category').where('typeOfCat', '==', 'Salé').orderBy('createdAt', "desc")
    queryMultiDeleteCat = (tabMultiID) => this.db.collection('category').where(this.idDoc, 'in', tabMultiID);
    queryOneCategory = (id) => this.db.collection('category').doc(id);
    queryMultiDeleteProducts = (tabMultiID) => this.db.collection('products').where(this.idDoc, 'in', tabMultiID);
    
    // queryActifsAdmins = () =>this.db.collection('users').where('admin', '==', true).where('status', '==', 'actif')
    // a remplacer pour admin seul
    // queryActifsAdmins = () =>this.db.collection('users').where('admin', '==', true).where('status', '==', 'actif')
    queryUpAdminStatus = (id) => this.db.collection('users').doc(id)
    querySuperAdmin = () => this.db.collection('users').where('superAdmin', '==', 'true');
    queryCustomers = () => this.db.collection('users').orderBy('createdAt', "desc");
    queryOrders = (id) => this.db.collection('orders').where('user_id', '==', id).orderBy('createdAt', "desc")
    queryOneOrder = (id) => this.db.collection('orders').doc(id);
    queryDetailOrder = (idOrder, idUser) =>this.db.collection('order_items').where('order_id', '==', idOrder).where('user_id','==', idUser)


    // logoutUser = () => this.auth.signOut()

    // // creer collection avec id automatique dans la doc pour cibler le contenu de chaque document dans une collection
    // // newProduct = () => this.db.collection("Product").doc();
    //  // fonction générique pour ajouter des données a une collection
    // newData = (collectionName) => this.db.collection(collectionName).doc();

    // //lire les données
    // // getProduct = () => this.db.collection("Product");
    // // fonction générique pour lire toutes les données d'une collection
    // getData = (collectionName) => this.db.collection(collectionName).orderBy('date', 'desc').limitToLast();

    // //delete produits
    // // fonction generique pour la suppression d'une donnée dans une collection
    // // delProduct = (idProduct) => this.db.collection("Product").doc(idProduct).delete()
    // delData = (idDoc, collectionName) => this.db.collection(collectionName).doc(idDoc).delete()

    // // requete pour obtenir infos sur le produit a editer (mise a jour  update fonction)
    // // getCurrentProduct =  (idProduct) => this.db.collection('Product').doc(idProduct);
    // // fonction pour lire la données selectionnée à editer
    // getCurrentData =  (idDoc, collectionName) => this.db.collection(collectionName).doc(idDoc);

    

}

export default Firebase;