import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUserContext";
import PetApi from "../PetApi";
import Post from "../components/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
// import SearchBar from "../components/SearchBar";
import "./MyPostList.css";

function MyPostList() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const [filters, setFilters] = useState({
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    async function fetchUserPosts() {
      if (!currentUser) return;
      try {
        const fetchedPosts = await PetApi.getUserPosts(currentUser.username);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    }
    fetchUserPosts();
  }, [currentUser]);


  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleNextPage = () => {
    setFilters((f) => ({ ...f, offset: f.offset + f.limit }));
  };

  const handlePrevPage = () => {
    setFilters((f) => ({ ...f, offset: Math.max(0, f.offset - (f.limit || 10)) }));
  };

 
  const handleDelete = async (postId) => {
    try {
      await PetApi.deletePost(postId);
      setPosts((posts) => posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="MyPostList">
      <h1>My Posts</h1>

      {currentUser && (
        <div className="MyCreatePost-btn">
            <Link to="/posts/new">Share Something <FontAwesomeIcon icon={faPaw} /></Link>
        </div>
      )}

      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              currentUser={currentUser}
              onDelete={() => handleDelete(post.id)}
              isMyPost={true}
            />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>

      <div className="MyPostList-btns">
        <button onClick={handlePrevPage} disabled={filters.offset === 0}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={posts.length < filters.limit}>Next</button>
      </div>
    </div>
  );
}

export default MyPostList;
