import React from "react";
import SearchBox from "./SearchBox";
import SearchResult from "./SearchResult";
export default () => {
  const [searchResult, setSearchResult] = React.useState([]);
  const getSearch = (value: any) => setSearchResult(value);

  return (
    <div>
      <SearchBox getSearch={getSearch} />
      {searchResult.map((user) => {
        return <SearchResult user={user} />;
      })}
    </div>
  );
};
