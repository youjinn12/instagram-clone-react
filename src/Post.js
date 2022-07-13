import React, { useEffect, useState } from "react";
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from 'firebase/compat/app';


export default function Post({postId, username, caption, imageUrl, signedinUser}){
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [whoLiked, setWhoLiked] = useState([]);


    useEffect(() => {
        let unsubscribe;
        let commentreturn;
        let likereturn;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId);
            commentreturn = unsubscribe.collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    com: doc.data(),
                })));
            });
            likereturn = unsubscribe.collection("likes")
            .onSnapshot((snapshot) => {
                setWhoLiked(snapshot.docs.map((doc) => 
                    doc.data().userId
            ));
            });
        }
        return () => {
            commentreturn();
            likereturn();
        };
        
    }, [postId]);



    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            text: comment,
            username: signedinUser.displayName
        });
        setComment('');
    }

    const pressLike = (event) =>{
        event.preventDefault();

        db.collection("posts").doc(postId).collection("likes").add({
            userId: signedinUser.displayName
        });
    }

    const pressDelete = (event) =>{
        event.preventDefault();

        const del = db.collection("posts").doc(postId).collection("likes").where("userId","==", signedinUser.displayName);
        del.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              doc.ref.delete();
            });
          });
    }
    
    const commentDel = (id) =>{

        const del = db.collection("posts").doc(postId).collection("comments").where(firebase.firestore.FieldPath.documentId(),"==", id);
        del.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              doc.ref.delete();
            });
          });
    }


    const postDel = () => {
        const del = db.collection("posts").where(firebase.firestore.FieldPath.documentId(),"==", postId);
        del.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              doc.ref.delete();
            });
          });
    }

    return(
        <div className="post">
        <div className="post__header">
            <Avatar
                className='post__avatar'
                alt={username}
                src= "/static/images/avatar/1/jpg"
                />
            <h3>{username}</h3>
            {(signedinUser)&&(username === signedinUser.displayName) ? <button onClick={postDel} >delete</button> : ""}
            </div>

            <img className="post__image" src={imageUrl} alt="postOne"/>
            <h4 className="post__text"> <strong>{username}: </strong>{caption}</h4>
            
{/* the like button  */}
{signedinUser && (  
<button 
onClick={whoLiked.includes(signedinUser.displayName) ? pressDelete : pressLike}
type="submit"
className="post__likeButton"
>
    <span>{whoLiked.length} { whoLiked.includes(signedinUser.displayName) ? "unlike" : "like" } </span>
</button> )}

            <div className="post__comments">
                {comments.map((comment) => (
                    <p key={comment.id}>
                        <strong>{comment.com.username}</strong>{comment.com.text} 
                        {(signedinUser)&&(comment.com.username === signedinUser.displayName) ? <button onClick={() => commentDel(comment.id)} >delete</button> : ""}
                    </p>
                ))}
            </div>

            {signedinUser && (           
                 <form className="post__commentBox">
                <input 
                value={comment}
                type="text"
                placeholder="write a comment"
                onChange={(e) => setComment(e.target.value)}
                /> 
                <button
                className="post__button"
                disabled={!comment}
                type="submit"
                onClick={postComment}
                >
                    Post
                </button>
            </form>
            )}



        </div>
    )
}