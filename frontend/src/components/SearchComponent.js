import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from './Product';

function SearchComponent() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noMatches, setNoMatches] = useState(false);

  // Load search results from localStorage on component mount
  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('searchResults'));
    if (savedResults) {
      setSearchResults(savedResults);
    }
  }, []);

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (keyword.trim() === '') {
      setSearchResults([]);
      setNoMatches(false);
    } else {
      try {
        const response = await fetch(`/api/search_products?search=${keyword}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.length === 0) {
          setNoMatches(true);
        } else {
          setSearchResults(data);
          setNoMatches(false);
          // Save search results to localStorage
          localStorage.setItem('searchResults', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Products..."
          value={keyword}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {/* Display search results or "No Matches" message */}
        {noMatches ? (
          <div style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px', color: '#dc3545' }}>
            No Matches
          </div>
        ) : (
          <Row>
            {searchResults.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default SearchComponent;
