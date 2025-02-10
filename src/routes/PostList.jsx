import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUserContext";
import PetApi from "../PetApi";
import Post from "../components/Post";
import SearchBar from "../components/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import "./PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const [filters, setFilters] = useState({
    ownerId: "",
    content: "",
    startDate: "",
    endDate: "",
    limit: 10,
    offset: 0,
  });
  const [searchTerms, setSearchTerms] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => {
            if (value == null) return false;
            return value.toString().trim() !== "";
          })
        );
        // Include the search term in the filters
        const finalFilters = {
          ...cleanedFilters,
          content: searchTerms.title?.trim() || "",
        };

        const fetchedPosts = await PetApi.getPosts(finalFilters);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchPosts();
  }, [filters, searchTerms]);


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
    <div className="PostList">

      {currentUser && (
        <div className="newPost">
          <Link to="/posts/new">Share Something <FontAwesomeIcon icon={faPaw} /></Link>
        </div>
      )}

      <SearchBar setSearchTerms={setSearchTerms} />

      <form className="filter-form">
        <div className="filter-date">
          <div className="form-group">
            <label htmlFor="startDate">From:</label>
            <input className="input-date-number"
              type="date"
              name="startDate"
              placeholder="Start date"
              value={filters.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">To:</label>
            <input className="input-date-number"
              type="date"
              name="endDate"
              placeholder="End date"
              value={filters.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group limit">
            <label htmlFor="limit">Posts:</label>
            <input className="input-date-number"
              type="number"
              name="limit"
              placeholder="Limit"
              value={filters.limit}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>


      <div>
        {posts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              currentUser={currentUser}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <div className="PostList-btns">
        <button className="btnPrev" onClick={handlePrevPage} disabled={filters.offset === 0}>
          Previous
        </button>
        <button className="btnNext" onClick={handleNextPage} disabled={posts.length < filters.limit}>Next</button>
      </div>
    </div>
  );
}

export default PostList;
