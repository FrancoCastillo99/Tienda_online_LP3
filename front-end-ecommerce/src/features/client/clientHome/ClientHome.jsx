// Home.jsx
import BannerSection from '../bannerSection/BannerSection';
import NavBar from '../navBar/NavBar';
import SliderSection from '../sliderSection/SliderSection'; 
import ProductSection from '../productSection/ProductSection';
import Footer from '../footer/Footer';
import './ClientHome.css';

export default function Home() {
  return (
    <main className="home-container">
    
      {/* Nav bar Section */}
      <BannerSection/>

      {/* Banner main Section */}
      <NavBar/>

      {/* Slider Section */}
      <SliderSection />

      {/*Product Section */}
      <ProductSection/>

      {/*Footer Section */}
      <Footer/>

    </main>
  );
}
