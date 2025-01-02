import "./home.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Card from "../../components/card/Card"
import bmwM2Image from "../../resource/img/bmwm2comp.png";
import bmwM5Image from "../../resource/img/bmwm5cs.png";
import porscheCayImage from "../../resource/img/porschecayenne.png";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();
  
  const cardData = [
    {
      id: "snow",
      number: 1,
      customer: "Asep",
      service: "Servis Berkala KM.60.000",
      carImage: bmwM2Image,
      brand: "BMW",
      model: "M2 Competition",
      progress: "100",
      description: "Klik Detail untuk Informasi Lebih Lanjut"
    },
    {
      id: "andre345",
      number: 2,
      customer: "Bruce",
      service: "Pergantian Sparepart",
      carImage: bmwM5Image,
      brand: "BMW",
      model: "M5 CS",
      progress: "40",
      description: "Pergantian Sparepart Berkala: Kopling"
    },
    {
      id: "zion_willi",
      number: 3,
      customer: "Zeineddin",
      service: "Check-up",
      carImage: porscheCayImage,
      brand: "Porsche",
      model: "Cayenne Turbo GT",
      progress: "50",
      description: "Pengecekan kaki-kaki mobil"
    }
  ]

  return (
    <div className="home">
      <Sidebar/>
      <div className="homeContainer">
        <Navbar/>
        <span className="halo">Halo, Admin.</span>
        <div className="listContainer">
          {cardData.map((card, index) => (
            <Card 
              key={index}
              {...card}
              onDetail={() => navigate(`/masterdata/detail_${card.id}`)}
              onSelesai={() => console.log(`Selesai clicked for ${card.model}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home