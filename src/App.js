import "./App.css";
import React, { useEffect, useState } from "react";
import instagramlogo from "./instagramLogo.png";
import Post from "./Post.js";
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase";

import Modal from "@material-ui/core/Modal";
// import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Input, Button } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 450,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
},
}));

function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    // (this is like backend listener backend state 같은거를 update 해줌)
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in ...
        setUser(authUser);

        if (authUser.displayName) {
          //dont update Username
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out ...
        setUser(null);
      }
    });
    // (this is like backend listener backend state 같은거를 update 해줌)

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const [posts, setPosts] = useState([
    // {
    //   username: "uu.012",
    //   caption: "this is React",
    //   imageUrl: postOne,
    //   id: 1
    // },
    // {
    //   username: "moonji_jung",
    //   caption: "Bauhaus",
    //   imageUrl: bauhaus,
    //   id: 2
    // }
  ]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(alert("Welcome"))
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) =>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .then(alert(`Welcome ${username}`))
    .catch(error => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="App">
      <div>






      <div className="app__header">
        <img className="app__headerImage" src={instagramlogo} alt="logo" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer" >
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={handleOpen}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
      {posts.map((post) => (
        <Post
          username={post.post.username}
          caption={post.post.caption}
          imageUrl={post.post.imageUrl}
          postId={post.id}
          key={post.id}
          signedinUser={user}
        />
      ))}
      </div>

        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <center><img className="app__headerImage" src={instagramlogo} alt="logo" /></center>
            <form className="app__signup">
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>



        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <center><img className="app__headerImage" src={instagramlogo} alt="logo" /></center>
            <form className="app__signup">
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </div>
        </Modal>
      </div>

      <div>

        {user?.displayName ? (
        <ImageUpload username={user.displayName} />
        ) : (
          <h3> Login First </h3>
        )
      }
</div>

    </div>
  );
}

export default App;
