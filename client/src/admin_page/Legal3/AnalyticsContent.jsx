import React from 'react'; // State ve Effect burada lazım değil artık, UserStatsChart içinde var.
import './AnalyticsContent.css';
import { IoLayersSharp } from "react-icons/io5";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";

import UserStatsChart from '../../components/UserStatsChart';
import MonthlySalesChart from '../../components/MonthlySalesChart';


const AnalyticsContent = () => {


    return (
        <div className="analytics-content">


            <div className="up-panel">

                <div className="left-panel">
                    <div className="boxs">
                        <div className="daily-orders box">
                            <div className="headers">
                                <div className="text"><h2>Günlük Siparişler</h2></div>
                                <div className="icon"><IoLayersSharp /></div>
                            </div>
                            <div className="contens">
                                <h1>45</h1>
                                <p>Son 24 Saat</p>
                            </div>
                        </div>
                        <div className="approved box">
                            <div className="headers">
                                <div className="text"><h2>Onaylı Siparişler</h2></div>
                                <div className="icon"><GiConfirmed /></div>
                            </div>
                            <div className="contens">
                                <h1>40</h1>
                                <p>Son 24 Saat</p>
                            </div>
                        </div>
                        <div className="month-total box">
                            <div className="headers">
                                <div className="text"><h2>Aylık Kazanç</h2></div>
                                <div className="icon"><MdOutlineAttachMoney /></div>
                            </div>
                            <div className="contens">
                                <h1>35,234</h1>
                            </div>
                        </div>
                        <div className="revenue box">
                            <div className="headers">
                                <div className="text"><h2>Hasılat</h2></div>
                                <div className="icon"><FaRegCreditCard /></div>
                            </div>
                            <div className="contens">
                                <h1>25,654</h1>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="right-panel">
                    <div className="graph-text">
                        <h3>Kullanıcılar</h3>
                        <p className="text-muted">Kullanıcı tiplerine göre dağılım.</p>
                    </div>

                    <div className="graph">
                        <UserStatsChart />
                    </div>
                </div>

            </div>

            <div className="bottom-panel">
                <div className="monthly-sales">
                    <MonthlySalesChart />
                </div>

            </div>




        </div>
    )
}

export default AnalyticsContent;