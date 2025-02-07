import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../CurrentUserContext";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PetApi from "../PetApi";
import "./PostDetail.css";

function PostDetail() {
  const { currentUser } = useContext(CurrentUserContext);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await PetApi.getPost(id);

        setPost(fetchedPost);
        if (fetchedPost) {
          const fetchedComments = await PetApi.getComments(id);
          setComments(fetchedComments);
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setComments([]);
      }
    }
    fetchPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const newCommentObj = await PetApi.addComment(post.id, { content: newComment });
      setComments(prev => [...prev, newCommentObj]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
  
  if (!confirmDelete) return;
  
    try {
      await PetApi.removeComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Handle editing a comment
  const handleEditComment = async (e) => {
    e.preventDefault();
    try {
      const updatedComment = await PetApi.updateComment(editingCommentId, { content: editingContent });
      setComments((prev) =>
        prev.map((comment) => (comment.id === editingCommentId ? updatedComment : comment))
      );
      setEditingCommentId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-details-container">
      <h1>{post.content}</h1>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      <p><strong>Posted by : </strong>{post.ownerUsername}</p>
      <p><strong>Created at: </strong>{new Date(post.createdAt).toLocaleString()}</p>

      <h3>Comments:</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="Post-comment">
           <div className="comment-content-actions">
          <strong>{comment.username}</strong>: {comment.content}

          {/* Only show edit/delete options if the logged-in user is the comment owner */}
          {currentUser && currentUser.username === comment.username && (
            < div className="PostDetail-actions">
              <button className="postdetailbtneditDelete postdetailbtnEdit"
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditingContent(comment.content);
                }}
              > <FontAwesomeIcon icon={faEdit} />
                
              </button>
              <button className="postdetailbtneditDelete postdetailbtnDelete" onClick={() => handleDeleteComment(comment.id)}> <FontAwesomeIcon icon={faTrashAlt} /></button>
            </div>
          )}
</div>

          {/* Only show the edit form when editing this comment */}
          {currentUser && editingCommentId === comment.id && (
            <form onSubmit={handleEditComment}>
              <input
                type="text"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <button type="submit">Save</button>
              <button onClick={() => setEditingCommentId(null)}>Cancel</button>
            </form>
          )}
        </div>
      ))}

      {/* Show the comment form only if the user is logged in */}
      {currentUser && (
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Post Comment</button>
        </form>
      )}
    </div>
  );
  
}

export default PostDetail;




