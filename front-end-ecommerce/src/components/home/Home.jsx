// Home.jsx
import MainBannerHome from '../mainBanner/MainBannerHome';
import NavBarHome from '../navBar/NavBarHome';
import SliderSectionHome from '../sliderSection/SliderSectionHome'; 
import ProductSectionHome from '../productSection/ProductSectionHome';
import './Home.css';

export default function Home() {
  return (
    <main className="home-container">
    
      {/* Nav bar Section */}
      <NavBarHome/>

      {/* Banner main Section */}
      <MainBannerHome/>

      {/* Slider Section */}
      <SliderSectionHome />

      {/*Product Section */}
      <ProductSectionHome/>

    </main>
  );
}
