import React, {useContext, useState, useEffect, Fragment} from 'react'
import { FirebaseContext } from '../../Firebase';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Edit from "./edit"
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Pagination from "../Pagination"
import Fab from '@material-ui/core/Fab';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import pink from '@material-ui/core/colors/pink';
import EditPhoto from './editPhoto'
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import DefaultImage from "../../assets/images/default.jpeg"
import AddProduct from "./addProduct"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import {getListProducts} from "../../Redux/actions/produits"


const useStyles = makeStyles((theme) => ({  
 
  media: {
    height: 140,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 1),
  },
  heroButtons: {
    marginTop: theme.spacing(3),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: 420,
    maxHeight:420,
    display: 'flex',
    flexDirection: 'column',
    position:"relative",
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
    overflow: 'auto'
  },
  btnActions:{
    position:'absolute',
    bottom:0,
  },
  tabMain: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  price:{
    textAlign:"left",
    
  },
  name:{
    wordBreak: 'break-word',
  }
}));


// rendu visuel de la tables de categories
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};




function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

// fin rendu visuel tabCategories


const Products = () => {

  const dispatch = useDispatch()
  
  const classes = useStyles();

  const {loading:{loadingPhoto, idProduct}} = useSelector(state => state)

  const [loading, setLoading] = useState(true);

  const history = useHistory()

  const {queryListProducts, queryAllCategories, queryOneProduct, queryMultiDeleteProducts} = useContext(FirebaseContext)
  const [readProducts, setReadProducts] = useState([])
  const [readCategory, setReadCategory] = useState([])


  const [value, setValue] = React.useState(0);


  // page actuelle, definit par defaut à 1, 
  const [currentPage, setCurrentPage] = useState(1)
  // Page courate definit sur 1 pour le filtre des produits par categories
  const [currentPageFilter, setCurrentPageFilter] = useState(1)
  // nombre de produits par categories
  const [itemsByPage, setItemsByPage] = useState(6)

  // Utilisation de la fonction slice de Javascripte : 
  // La méthode slice() renvoie un objet tableau, 
  //contenant une copie superficielle (shallow copy) d'une portion du tableau d'origine,
  // la portion est définie par un indice de début et un indice de fin (exclus).
  // Le tableau original ne sera pas modifié.

  // index de fin d'une portion visible du tableau des produits
  const indexOfLastItem = currentPage*itemsByPage

  // index de début d'une portion visible du tableau des produits
  const indexOfFirstItem = indexOfLastItem - itemsByPage

  // resultat de la pagination 
  const currentItems = readProducts.slice(indexOfFirstItem, indexOfLastItem)

  // etat de loading apres suppression d'un produit
  const [refreshDelete, setRefreshDelete] = useState(false)


  // page fait partie du composant pagination de material ui, qui utilise onchange pour detecter la page sur laquel on clique
  // la page selectionner sera stocker dans le state currentPage
  const getPage = (event, page) => {
    console.log("page", page)
      setCurrentPage(page)
  }

  // obtenir le nombre de pages totale en divisant la longeur du tableau de produits par le nombre d'item souhaité par page
  const nbPages = Math.ceil(readProducts.length/itemsByPage)

  // detected si un checkbox est selectionner
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  //limiter l'affichage de la description d'un produit
  const limitTextDesc = (text, count) => {
    return text.substr(0, count) + (text.length > count ? "..." : "");
}

const goDetail = (id) => {
  history.push( `/admin/produit/${id}`)
}

// obenir la liste des produits
  const listProducts = async() => {

    await queryListProducts().onSnapshot((snapshot)=>{
      let allProducts = [];

     
     
      let i = 0;
      if(snapshot && !snapshot.empty){
        snapshot.forEach(element => {
          allProducts = ([...allProducts, {id:element.id, ...element.data()}]);
          i++
      })
      // detecter la iin de la boucle 
       if(i == allProducts.length){
         
          setReadProducts(allProducts)
          dispatch(getListProducts(allProducts))
         setLoading(false)
       }
      }else{ 
        setLoading(false)
      }
    
  })

 
  
}
console.log(readProducts)

const [multiDisabled, setMultiDisabled] = useState(true);


// supprimer plusieurs produits à la fois
// const MultiDelete = ({tabDelete}) => {
//   const [openConfirm, setOpenConfirm] = React.useState(false);

//   const deleteMultiple =  () => {
//     // rechercher tout les produits dont le document id est dans le tableau TabDelete, 
//     setRefreshDelete(true)
//     queryMultiDeleteProducts(tabDelete).onSnapshot((snapshot)=>{
//       snapshot && !snapshot.empty && snapshot.forEach(element => {
//       element.ref.delete().then((res) =>{
//         setRefreshDelete(false)
//       })
    
//    })
  
//    })

//  }
//   const handleClickOpenDelete = () => {
//     setOpenConfirm(true);
   
    
//   };

//   const handleCloseDelete = () => {
//     setOpenConfirm(false);
//   };

//   return (
//     <div>
//       <Fab disabled={multiDisabled} size="small"  color="secondary" title='Supprimer plusieurs produits' >
//         <DeleteForeverIcon  onClick={handleClickOpenDelete}/>
//       </Fab>     
//       <Dialog
//         open={openConfirm}
//         onClose={handleCloseDelete}
//         aria-labelledby="draggable-dialog-title"
//       >
//         <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
//           Subscribe
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Etes sure de vouloir supprimer ces catégories ?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button autoFocus onClick={()=>deleteMultiple()} color="primary">
//             Oui, supprimer !
//           </Button>
//           <Button onClick={handleCloseDelete} color="primary">
//             Non, annuler
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// const Check = ({id}) => {

//   return(
  
//       <Checkbox
//       onChange={handleChangeMultiDelete}
//       inputProps={{ 'aria-label': 'controlled', 'value': id}}
//       /> 
//   )
// }


const listCategory = async() => {

  await queryAllCategories().onSnapshot((snapshot)=>{
    let allCategory = [];
    snapshot && !snapshot.empty && snapshot.forEach(element => {
      allCategory = ([...allCategory, {id:element.id, ...element.data()}]);
    });
  
    setReadCategory(allCategory)
})
}


useEffect(() => {

  
  const filtre = dataFilter();
   return  (
    filtre
   )
     
  }, [])

  useEffect(() => {

  const subscribeProducts = listProducts();

   return  (
    subscribeProducts
   )
     
  }, [])
  
  useEffect(() => {

    const subscribeCategories = listCategory()
   return  (
    subscribeCategories
   )
     
  }, [])


  const Edition = ({id}) => {
    return(
      <Edit id={id} />
    )
  }

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  // let multiDelCat = [];
  // si la checkbox relié au produit est selectionné 
  // dans le tableau multiDel,
//   const handleChangeMultiDelete = (e) => {
//     if(e.target.checked){
//       multiDelCat.push(e.target.value)
//       if(multiDelCat.length > 0 ){
//         setMultiDisabled(false)
//       }
//     }else{
//       const newMultiDel = multiDelCat.filter(item =>item !== e.target.value)
//       multiDelCat = newMultiDel;
//       setMultiDisabled(true)
//   }
// }



  // redondon ! warning a transformer en composant !!!

  // composant confirmDelete, permet d'afficher un modal pour confirmer une suppression
  const ConfirmDelete = ({id, name}) => {

    // controlleur d'état de l'affichage du modal
    const [openConfirm, setOpenConfirm] = React.useState(false);

    // function de suppression du produit
    const deleteProduct = async (id) => {

      // declencher le loading si suppression,
      setRefreshDelete(true)
      await queryOneProduct(id).delete().then(() => {
        setRefreshDelete(false)
      }).catch(() =>{
        setRefreshDelete(false)
        console.log('une erreur est survenue lors de la suppression du produit')
      }) 
    }

    // afficher le modal lorsque le button delete est selectionné
    const handleClickOpenDelete = () => {
      setOpenConfirm(true);
    };
  
    // fermer le modale si je supprime ou annule la supression du produit
    const handleCloseDelete = () => {
      setOpenConfirm(false);
    };

    return (
      <div>
        <DeleteForeverIcon onClick={handleClickOpenDelete}/>
       
        <Dialog
          open={openConfirm}
          onClose={handleCloseDelete}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Subscribe
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Supprimer le produit {name} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={()=>deleteProduct(id)} color="primary">
              Oui, supprimer !
            </Button>
            <Button onClick={handleCloseDelete} color="primary">
              Non, annuler
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  let data = [] // pour tester le style de produits vide test a stylisé


  // rendu de la liste des produits 
  // La méthode map() crée un nouveau tableau avec les résultats de l'appel d'une fonction fournie sur chaque élément du tableau appelant.
  // a partir de la methode mal, je renvoie  la liste des produits sous forme de card, qui affiche les infos de chaque produits
  // a condition que le tableau de produits ne soit pas vide, 
  // si il est vide j'affiche un message indiquant qu'il ny a pas de produits trouvés
  const showProducts = () => {
    
    const ProdutcsList = currentItems.length > 0 ? currentItems.map((item, index) => {
      return(
      <Grid item key={index} xs={12} sm={6} md={4}>
         <Card className={classes.card} hover>
           <CardActionArea>
           {
              loadingPhoto && idProduct == item.id ?
                getLoading()
              :
              <CardMedia
              
              className={classes.cardMedia}
              image={item.image_url && item.image_url !== "" ? item.image_url : DefaultImage}
              onClick={()=>goDetail(item.id)}
            />
           }
            <CardContent className={classes.cardContent}>
              <Typography noWrap variant="h6" component="h2" className={classes.name}>
                {limitTextDesc(item.name,18)}
  
              </Typography>
              <Typography >
                {limitTextDesc(item.description,90)}
              </Typography>
              <Typography>
                <small>
                  Crée le : {item.createdAt.toDate().toLocaleString('fr-FR') }
                </small>
              </Typography>
              <Typography>
                {
                  item?.dateUpdate ? 
                  <small> Mise à jour le : {item.dateUpdate?.toDate().toLocaleString('fr-FR') }</small>
                  :
                  <div></div>
                }
              </Typography>
              <Typography variant="h6" component="h2" className={classes.price}>
                {item.price} €
              </Typography>
            </CardContent>
            </CardActionArea>
            <CardActions >
            {/* <Check id={item.id} /> */}

            <Fab size="small"  color="secondary"   >
              <Edition id={item.id} />
            </Fab>
            <Fab size="small"   >
                <ConfirmDelete id={item.id} name={item.name}/>
            </Fab>
            <Fab size="small"  >
                <EditPhoto id={item.id} />
            </Fab>
           
            </CardActions>
          </Card>
      </Grid>
      )
    })
    
      :
      <Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
          Aucuns produits trouvés
      </Typography>

      return(
        ProdutcsList
      )
  }
  
 


  const displayCategories = 
    readCategory.length > 0 ? readCategory.map((item, index) => {
      return(
        <Tab label={item.name} {...a11yProps(item.id)} onClick={()=>filterFirstPage()} />
      )  
    })
    :
    <div></div>
  


  
   const dataFilter = () => {
     /**
      * Pour chaque categorie du panel, je le relie au categorie du tableau
      * en faisant index +1
      * Je recupere son id
      * Je filtre les produits par lid de la categorie avec la methode filter
      * La méthode filter() crée et retourne un nouveau tableau contenant tous les éléments du tableau d'origine qui remplissent une condition déterminée par la fonction callback
      * Je genere le rendu visuel des produits lié à la categorie et je parametre la pagination du filtre
      * Je boucle sur le resultat de la pagination du filtre pour afficher les produits par categorie 
      * J'affiche une pagination dynamique et independante pour chaque categorie
      * data filter est la fonction devra afficher le panel des categorie avec leurs produits et sa pagination
      * render resulte les produits par categories et sa pagination sinon une message pour dire qu'il n'y a pas de produits
      * */

  
    const resultFilter = 
      
    readCategory.length > 0 ? readCategory.map((item, index) => {

   
     
      if(value == index+1){
        
       
        const result = []

            
              // a partir de la methode filter, je cherche les produits dont la categorie est la categorie que j'ai selectionné grace à son id
        readProducts.length > 0 && readProducts.filter((prod) => {
          if(prod.category_id === item.id){
            result.push(prod)
          }
        })

        // je parametre la pagination en fonction du nombre de produits trouvé par categorie
        const getPageFilter = (event, page) => {
          setCurrentPageFilter(page)
        }

          const indexOfLastItemFilter = currentPageFilter*itemsByPage
          const indexOfFirstItemFilter = indexOfLastItemFilter - itemsByPage

          // resultat de la pagination pour le filtre des produits 
          const currentItemsFilter = result.slice(indexOfFirstItemFilter, indexOfLastItemFilter)

          // je genere le rendu visuel des produits par categorie de la pagination (equivalent de ProdutcsList)
          
        const renderResult = currentItemsFilter.length > 0 ? currentItemsFilter.map((element, indexProduct) => {
          return(
            <Grid item key={indexProduct} xs={12} sm={6} md={4}>
              <Card className={classes.card} hover>
                <CardActionArea>
                  {
                    loadingPhoto  && idProduct == element.id ?
                      getLoading()
                    :
                    <CardMedia
                    className={classes.cardMedia}
                    image={element.image_url && element.image_url !== "" ? element.image_url : DefaultImage}
                    onClick={()=>goDetail(element.id)}
                  />
                  }
                  
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h6" component="h2" className={classes.name}>
                    {limitTextDesc(element.name,18)}

                    </Typography>
                    <Typography>
                      {limitTextDesc(element.description,90)}
                    </Typography>
                    <Typography>
                      <small>
                        Crée le : {element.createdAt.toDate().toLocaleString('fr-FR') }
                      </small>
                    </Typography>
                    <Typography>
                      {
                        element?.dateUpdate ? 
                        <small> Mise à jour le : {element.dateUpdate?.toDate().toLocaleString('fr-FR') }</small>
                        :
                        <div></div>
                      }
                    </Typography>
                    <Typography variant="h6" component="h2" className={classes.price}>
                      {element.price} €
                    </Typography>
                  </CardContent>
                  </CardActionArea>
                  <CardActions className={classes.btnActions}>
                  {/* <Check id={element.id} /> */}
                    <Fab size="small"  color="secondary" aria-label="add"  >
                       <Edition id={element.id} />
                    </Fab>
                    <Fab size="small"  color="" aria-label="add"  >
                        <ConfirmDelete id={element.id} name={element.name}/>
                    </Fab>
                    <Fab size="small"  color="" aria-label="add">
                        <EditPhoto id={element.id} />
                    </Fab>
                    
                  </CardActions>
                </Card>
              </Grid>
          )
        }):
        <div> Aucuns produits ne corresponds a cette catégories </div>
           
        // je calcul le nombre de page totale de la pagination afin de lenvoyer en props
        // au composant pagination, pour verifie si la pagination doit s'afficher ou pas en fonction du nombre de page totale.
        const nbPagesFilter = Math.ceil(result.length/itemsByPage) 
       

        // je retourne le panel des categorie,
        // chaque categorie correspondra a des produits si il y en a
        // et chaque categorie aura une pagination independante 
      return(
        <TabPanel value={item.id} index={item.id}>
          <Grid container spacing={4}>   
            {renderResult}
          </Grid>
            <Pagination getPage={getPageFilter} nbPages={nbPagesFilter}/>
        </TabPanel>
        
      )  
      }
      
    })
    :
    <div></div>

    
     return(resultFilter)
   }

   
    
   // lorsque je clique sur un filtre par category, je tombe directement sur la premiere page, 
   const filterFirstPage = ()=> {
    setCurrentPageFilter(1)
   }

   // lorsque je clique sur le bouton tout les produits, je tombe directement sur la premiere page
   const noFilter = () => {
    setCurrentPage(1)
   }

   const getLoading = () => {
     return(
      <div style={{display: 'flex', padding:80, justifyContent: 'center'}}>
        <CircularProgress color="secondary"  />
      </div>
     )
   }


  

  return (
    <main>
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
         Vos produits mise en ligne
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container  justifyContent="center">
            <Grid item>
              <AddProduct products={readProducts} />
            </Grid>
            {/* <Grid item style={{marginLeft:20}}>
              <MultiDelete tabDelete={multiDelCat} />
            </Grid> */}
          </Grid>
        </div>
      </Container>
    </div>

    <Container className={classes.cardGrid} maxWidth="md">
      <div className={classes.tabMain}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Tous les produits" {...a11yProps(0)} onClick={()=>noFilter()} />
            {displayCategories}
          </Tabs>
        </AppBar>
        {
          refreshDelete ? 
          getLoading()
          :
          <Fragment>
          <TabPanel value={value} index={0}>
              {
                loading ?
                getLoading()
              :
                <Grid container spacing={4}>
                { showProducts()}              
                </Grid>
              }
              <Pagination getPage={getPage} nbPages={nbPages}/>
          </TabPanel>
            {dataFilter()}
          </Fragment>
        }

      </div>
    </Container>
  </main>
    
  )
}

export default Products;