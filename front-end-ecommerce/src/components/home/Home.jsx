// Home.jsx
import MainBannerHome from '../mainBanner/MainBannerHome';
import NavBar from '../NavBar/NavBar';
import ProductCardHome from '../productcard/ProductCardHome';
import SliderSectionHome from '../sliderSection/SliderSectionHome'; // Importa tu componente Slider
import './Home.css';

export default function Home() {
  return (
    <main className="home-container">
      
      {/* Nav bar Section */}
      <NavBar/>

      {/* Banner main Section */}
      <MainBannerHome/>

      {/* Slider Section */}
      <SliderSectionHome />
  
      {/*Product Section */}
      <ProductCardHome/>

    </main>
  );
}
