
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faComment as fasComment } from '@fortawesome/free-solid-svg-icons';
import "./Post.css";

function Post({ post, currentUser, isMyPost = false }) {
  const isOwner = currentUser && currentUser.id === post.ownerId;

  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(post.isLiked || false);

  // Fetch likes count and comments on component mount
  useEffect(() => {
    async function fetchPostData() {

      // Fetch comments
      const fetchedComments = await PetApi.getComments(post.id);
      setComments(fetchedComments);
      
      if (currentUser) {
        try {
          // Fetch likes count
          const count = await PetApi.getLikesCount(post.id);
          setLikeCount(count);
          
        } catch (err) {
          console.error("Error fetching post data:", err);
        }
      }
    }
    fetchPostData();
  }, [post.id, currentUser]);

  // Fetch like status on component mount
  useEffect(() => {
    async function fetchLikeStatus() {
      if (currentUser) {
        try {
          const isLiked = await PetApi.isPostLiked(post.id);
          setLiked(isLiked);
        } catch (err) {
          console.error("Error checking like status:", err);
        }
      }
    }
    fetchLikeStatus();
  }, [post.id, currentUser]);

  // Handle like/dislike action
  async function handleLike(postId) {
    if (!currentUser || !currentUser.id) {
      console.error("Error: User not authenticated or missing ID");
      return;
    }
    try {
      if (liked) {
        await PetApi.removeLike(postId); // Call the API to remove the like
        setLikeCount((prev) => prev - 1);
      } else {
        await PetApi.addLike(postId, { ownerId: currentUser.id }); // Call the API to add the like
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked); // Toggle the liked state
    } catch (err) {
      console.error("Error liking/disliking post:", err);
    }
  }

  const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your post? This action cannot be undone.");

        if (!confirmDelete) return;
        try {
            await PetApi.deletePost(post.id); // Use the API method with post id
            alert("Post deleted successfully.");
            navigate("/"); 
        } catch (err) {
            console.error("Error deleting post:", err);
            setError("Failed to delete post. Please try again.");
        }
    };

  return (
    <div className="Post">
      <h2>
        <Link to={`/posts/${post.id}`}>{post.content}</Link>
      </h2>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      {/* <p class = "tweet info">{post.ownerId} - {post.createdAt}</p> */}

      <div className="Post-actions">
        {currentUser && (
          <>
            <button onClick={() => handleLike(post.id)} className={liked ? "like-button-pulse" : "like-button-outline"}>
              {liked ? '❤️' : '♡'} Like
              ({likeCount})
            </button>

            <button className="comment-button">
              <FontAwesomeIcon icon={fasComment} />
              <Link to={`/posts/${post.id}`}>Comment</Link>
            </button>

          </>
        )}

        {isMyPost && (
          <div className="Post-actions">
              <Link className="postbtneditDelete postbtnEdit" to={`/posts/edit/${post.id}`}><FontAwesomeIcon icon={faEdit} /></Link>
              
            <button className="postbtneditDelete postbtnDelete" onClick={handleDelete}><FontAwesomeIcon icon={faTrashAlt} /></button>
          </div>
        )}
      </div>

     
        <div className="Post-comments">
          <h5>Comments:</h5>
          {comments.slice(-2).map(comment => (
            <div key={comment.id} className="Post-comment">
              <strong>{comment.username}</strong>: {comment.content}
            </div>
          ))}
          <Link to={`/posts/${post.id}`}>View all comments</Link>
        </div>

    </div>
  );

}
export default Post;