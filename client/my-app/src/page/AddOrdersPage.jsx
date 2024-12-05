import { useState } from "react";
import Header from "../components/Header";
import MainLogic from "../components/MainLogic";

const AddOrdersPage = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // The search value from the header
  const search = (value) => {
    setIsSearch(true);
    setSearchValue(value);
  };

  return (
    <>
      <Header showMiddleSection={true} search={search} />
      <MainLogic isHome={false} isSearch={isSearch} searchValue={searchValue} />
    </>
  );
};

export default AddOrdersPage;
