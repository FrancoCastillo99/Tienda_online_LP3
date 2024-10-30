// Home.jsx
import MainBanner from '../../modules/mainBanner/MainBanner';
import NavBar from '../../modules/navBar/NavBar';
import SliderSection from '../../modules/sliderSection/SliderSection'; 
import ProductSection from '../../modules/productSection/ProductSection';
import './Home.css';

export default function Home() {
  return (
    <main className="home-container">
    
      {/* Nav bar Section */}
      <MainBanner/>

      {/* Banner main Section */}
      <NavBar/>

      {/* Slider Section */}
      <SliderSection />

      {/*Product Section */}
      <ProductSection/>

    </main>
  );
}
