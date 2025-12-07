import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import { RiTwitterXFill } from 'react-icons/ri'
import { FaFacebookSquare } from 'react-icons/fa'

const Footer = () => {

    const mapIframe = `<iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2246.0119355104907!2d32.802685972702115!3d39.7872984322932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d341813f339057%3A0x1b7a31a2228ed33!2zR2F6aW9zbWFucGHFn2EsIFNhaGlsIENkLiwgMDY4MzAgR8O2bGJhxZ_EsS9BbmthcmE!5e0!3m2!1str!2str!4v1760191854707!5m2!1str!2str" 
    
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy"
     referrerpolicy="no-referrer-when-downgrade">
     </iframe>`;

    return (
        <footer className="main-footer">
            <div className="footer-content container">

                <div className="f-left-section">



                    <div className="row">

                        <div className="footer-section links">
                            <h4>Hızlı Linkler</h4>
                            <a href="" target="_blank" rel="noopener noreferrer">Anasayfa</a>
                            <a href="" target="_blank" rel="noopener noreferrer">Hakkımızda</a>
                            <a href="" target="_blank" rel="noopener noreferrer">İletişim</a>
                            <a href="" target="_blank" rel="noopener noreferrer">İK Politikası</a>
                        </div>

                        <div className="footer-section social-media">
                            <h4>Bizi Takip Edin</h4>
                            <div className="social-icons">
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className='insta'><FaInstagram />   Instagram</a>
                                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className='tiktok'><FaTiktok />    TikTok</a>
                                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className='x'><RiTwitterXFill />    X</a>
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className='face'><FaFacebookSquare />   Facebook</a>
                            </div>
                        </div>

                    </div>



                </div>

                <div className="f-right-section">

                    <div className="footer-section about">
                        <div className="f-navbar-logo">
                            <img src="assets/LoginPages/logo.png" />
                        </div>

                        <div className="text">
                            <p>Adres: Gaziosmanpaşa, Sahil Cd., No 13 Gölbaşı/Ankara</p>
                            <p>(0312) 318 05 83</p>
                        </div>
                    </div>



                    <div className="footer-section map-location">


                        <div dangerouslySetInnerHTML={{ __html: mapIframe }} className="map-embed-container" />

                    </div>

                </div>



            </div>

            <div className="footer-bottom">
                &copy; 2025 YES I EAT. Tüm Hakları Saklıdır.
            </div>
        </footer>
    );
};

export default Footer
