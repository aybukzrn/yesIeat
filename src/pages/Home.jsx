
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Home.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MdOutlineDeliveryDining, MdOutlineEco, MdOutlineCleaningServices, MdOutlineMobileFriendly } from 'react-icons/md';
import { PiChefHatFill } from 'react-icons/pi';


import { Fade, Zoom, Slide } from 'react-awesome-reveal';

const sliderData = [

    { id: 1, image: '/assets/slider1.jpg', title: 'Yeni Menü: Dünya Lezzetleri!', subtitle: 'En popüler mutfaklardan seçme tatlar şimdi siparişe açık.', buttonText: 'Menüyü İncele', link: '/menu' },
    { id: 2, image: '/assets/slider2.png', title: 'Haftanın Fırsatı: %20 İndirim!', subtitle: 'Tüm ana yemeklerde geçerli, hemen sipariş ver.', buttonText: 'Siparişe Başla', link: '/orders' },
    { id: 3, image: '/assets/slider3.jpg', title: 'Özel Rezervasyon Fırsatları', subtitle: 'Sevdiklerinizle unutulmaz bir akşam yemeği için yerinizi ayırtın.', buttonText: 'Rezervasyon Yap', link: '/reservation' },
];

const Home = () => {

    const categories = [
        { name: 'Burger', src: '/assets/category1.webp' },
        { name: 'Dürüm', src: '/assets/category2.webp' },
        { name: 'Sokak Lezzetleri', src: '/assets/category7.jpg' },
        { name: 'Pizza', src: '/assets/category4.jpg' },
        { name: 'Kebap', src: '/assets/category6.jpg' },
        { name: 'Salata', src: '/assets/category5.jpg' },
        { name: 'Makarna', src: '/assets/category3.jpg' },
        { name: 'Ev Yemekleri', src: '/assets/category8.jpg' },
        { name: 'İçecekler', src: '/assets/category9.jpg' },
        { name: 'Tatlılar', src: '/assets/category10.jpg' },
    ];

    return (
        <div className="home-page">
            <Navbar />

            <Slide direction="up" triggerOnce>



                <section className="main-slider">

                    <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={true}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                        className="mySwiper"
                    >
                        {sliderData.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <div
                                    className="slide-content"
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                >

                                    <div className="overlay">
                                        <h2>{slide.title}</h2>
                                        <p>{slide.subtitle}</p>
                                        <Link to={slide.link} className="slider-button">
                                            {slide.buttonText}
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

            </Slide>




            <section>
                <div className="category">


                    <img src="/assets/sun-tornado.svg" alt="desen" className="bg-pattern" />


                    <Fade direction="down" triggerOnce>
                        <h2 className="category-title">Mutfaklar</h2>
                    </Fade>

                    <div className="category-list">


                        {categories.map((category, index) => (
                            <Zoom
                                key={index}
                                delay={index * 100}
                                triggerOnce 
                            >
                                <div className="category-item">
                                    <img src={category.src} alt={category.name} />

                                    <h3>{category.name} </h3>

                                </div>
                            </Zoom>
                        ))}
                    </div>
                </div>
            </section>


            <section className="chef-special py-5">
                <div className="container d-flex align-items-center justify-content-between special-card">
                    <div className="special-details">
                        <Fade direction="left" triggerOnce>
                            <h3 className="special-badge">
                                <PiChefHatFill  className='chef-icon'/>
                                ŞEFİN TAVSİYESİ</h3>
                            <h2>Izgara Somon Filosu</h2>
                            <p>Hafif, doyurucu ve protein deposu. Limitli sayıda, hemen deneyin!</p>
                            <Link to="/menu/somon" className="order-now-button">Şimdi Sipariş Ver</Link>
                        </Fade>
                    </div>
                    <div className="special-image-container">
                    <Fade direction="right" triggerOnce>
                        <img src="/assets/special.jpg" alt="Izgara Somon" className="special-image" />
                    </Fade>
                    </div>
                </div>
            </section>





            <section>
                <div className="container text-center">

                    <Fade direction="down" triggerOnce>
                        <h2 className="mb-5">Neden <br /> HAZIR YEMEK?</h2>
                    </Fade>

                    <div className="row features-grid">

                        <div className="info-item">
                            <Slide direction="up" delay={200} triggerOnce className="col-md-3 feature-item">
                                <MdOutlineDeliveryDining size={48} className="feature-icon" />
                                <h3>Hızlı Teslimat</h3>
                                <p>30 dakikada kapınızda!</p>
                            </Slide>

                        </div>

                        <div className="info-item">
                            <Slide direction="up" delay={400} triggerOnce className="col-md-3 feature-item">
                                <MdOutlineEco size={48} className="feature-icon" />
                                <h3>Taze Malzemeler</h3>
                                <p>Günün en taze ürünleri.</p>
                            </Slide>
                        </div>

                        <div className="info-item">

                            <Slide direction="up" delay={400} triggerOnce className="col-md-3 feature-item">
                                <MdOutlineMobileFriendly size={40} className="feature-icon" />
                                <h3>Kolay Sipariş</h3>
                                <p>Sadece birkaç tıkla siparişinizi tamamlayın.</p>
                            </Slide>
                        </div>

                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
};

export default Home;