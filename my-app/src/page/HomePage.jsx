import Header from "../components/Header";
import MainLogic from "../components/MainLogic";
import Testimonial from "../components/Testimonial";

const HomePage = () => {
  return (
    <>
      <Header setElipsis={false} />
      <MainLogic />
      <Testimonial />
    </>
  );
};

export default HomePage;
