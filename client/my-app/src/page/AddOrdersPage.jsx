import Header from "../components/Header";
import MainLogic from "../components/MainLogic";

const AddOrdersPage = () => {
  return (
    <>
      <Header showMiddleSection={true} />
      <MainLogic isHome={false} />
    </>
  );
};

export default AddOrdersPage;
