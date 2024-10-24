// Home.jsx
import MainBanner from '../mainBanner/MainBanner';
import NavBar from '../navBar/NavBar';
import SliderSection from '../sliderSection/SliderSection'; 
import ProductSection from '../productSection/ProductSection';
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
