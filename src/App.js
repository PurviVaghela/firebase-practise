import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
// want to display list of movies in db
import { db , auth , storage  } from "./config/firebase";
// using getDocs fun to get all movie list
import { getDocs, collection, addDoc , deleteDoc, doc, updateDoc} from "firebase/firestore";
import { upload } from "@testing-library/user-event/dist/upload";
import {ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  // new movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isOscar, setIsOscar] = useState(true);

  // update title state
  const [updatedTitle, setupdatedTitle] = useState("");

  // file upload
  const [fileUpload, setFileUpload] = useState("");

 
  const moviesCollection = collection(db, "movies");

  const getMovieList = async () => {
    // read the data and set the list
    try {
      const data = await getDocs(moviesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(filteredData);  ==> to check in console
      // to display on screen

      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  //creating fun to get movie list  ; read our db
  //creating fun as async as most of firebase op are async
  useEffect(() => {
      getMovieList();

  }, []); // empty dependency

  const onSubmitMovie = async () => {
    try{
    await addDoc(moviesCollection, { 

        title: newMovieTitle, 
        releaseDate: newReleaseDate,
        receivedOscar: isOscar ,
        userId: auth?.currentUser?.uid,
        });
        getMovieList();

    }
    catch(err) {console.error(err);}
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await deleteDoc(movieDoc);
  }

    const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await updateDoc(movieDoc , {title: updatedTitle});
  }

const uploadFile = async ()=>{
  if(!fileUpload) return;
  const filesFolderRef =  ref(storage, `projectFiles/ ${fileUpload.name}`);

  try{
     await uploadBytes(filesFolderRef, fileUpload);
  }catch(err){
    console.error(err);
  }
 


}


  return (
    <div className="App">
      <Auth />
      {/* to display on screen  */}
      <div>
        <br />
        <input
          placeholder="Enter title.."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />{" "}
        <br /> <br />
        <input
          placeholder="Release date.."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />{" "}
        <br />
        <input
          type="checkbox"
          checked={isOscar}
          onChange={(e) => setIsOscar(e.target.checked)}
        />
        <label>Received Oscar</label> <br /> <br />
        <button onClick={onSubmitMovie}>Submit</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h2 style={{ color: movie.receivedOscar ? "green" : "purple" }}>
              {" "}
              {movie.title}
            </h2>
            <p> Date: {movie.releaseDate}</p>

            <button onClick= {() =>deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder="new title.." onChange={(e) => setupdatedTitle(e.target.value)}/>  < br/>
            <button onClick={() => updatedTitle(movie.id)}>Update title</button>
          </div>
        ))}
      </div>

        <div>
          <input type="file"
           onChange={(e) => setFileUpload(e.target.files[0])}/>
          <button onClick={uploadFile}> Upload File </button>
        </div>


    </div>
  );
}

export default App;
