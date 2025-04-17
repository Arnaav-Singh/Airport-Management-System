import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Globe from 'react-globe.gl';
import axios from 'axios';
import {
    FaTicketAlt,
    FaPlaneDeparture,
    FaMapMarkerAlt,
    FaCogs,
    FaBell,
    FaSuitcaseRolling,
    FaWrench,
    FaTachometerAlt,
    FaChevronRight,
    FaPersonBooth
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

function Dashboard() {
    // Sample flight arcs data (Memoized)
    const arcsData = React.useMemo(() => {
        const numArcs = 20;
        const generatedArcs = [];
        for (let i = 0; i < numArcs; i++) {
            generatedArcs.push({
                startLat: (Math.random() - 0.5) * 180,
                startLng: (Math.random() - 0.5) * 360,
                endLat: (Math.random() - 0.5) * 180,
                endLng: (Math.random() - 0.5) * 360,
                color: [['#4169E1', '#87CEFA'][Math.round(Math.random() * 1)], '#ffffff']
            });
        }
        return generatedArcs;
    }, []);

    // State for fetched data
    const [data, setData] = useState({
        passengers: [],
        flights: [],
        gates: [],
        resources: [],
        maintenance: [],
        notifications: [],
        baggage: [],
        checkins: []
    });

    // Fetch data from all tables (using useCallback)
    const fetchData = useCallback(async () => {
        try {
            const endpoints = [
                'passengers',
                'flights',
                'gates',
                'resources',
                'maintenance',
                'notifications',
                'baggage',
                'checkins'
            ];
            const responses = await Promise.all(
                endpoints.map(endpoint => axios.get(`http://localhost:3001/api/${endpoint}`))
            );
            setData({
                passengers: responses[0].data,
                flights: responses[1].data,
                gates: responses[2].data,
                resources: responses[3].data,
                maintenance: responses[4].data,
                notifications: responses[5].data,
                baggage: responses[6].data,
                checkins: responses[7].data
            });
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Ref to ensure globe renders correctly
    const globeRef = useRef(null);

    return (
        <div className="dashboard-bg">
            <style>{`
                .dashboard-bg {
                    min-height: 100vh;
                    background: linear-gradient(to bottom, rgba(135, 206, 235, 0.7), rgba(135, 206, 235, 0.3)),
                                url('https://images.unsplash.com/photo-1502680196839-98c9598e6c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .dashboard-container {
                    width: 100%;
                    max-width: 1300px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }
                .globe-container {
                    height: 500px;
                    width: 100%;
                    background: linear-gradient(to bottom, #1a202c, #2d3748);
                    overflow: hidden;
                    margin: 0;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.4));
                    position: relative;
                }
                .globe-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 6rem;
                    background: linear-gradient(to top, rgba(26, 32, 44, 0.95), transparent);
                    z-index: 10;
                    animation: fadeIn 1.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .dashboard-header {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 2rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    border: 2px solid #c7d2fe;
                    padding: 3rem 2.5rem;
                    margin: 3rem 0;
                    text-align: center;
                    backdrop-filter: blur(10px);
                }
                .header-title {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #1e40af;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header-desc {
                    color: #4b5563;
                    font-size: 1.2rem;
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.6;
                }
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2.5rem;
                    padding: 0 1rem 2rem;
                    margin-bottom: 2rem;
                }
                .dashboard-card {
                    background: rgba(255, 255, 255, 0.98);
                    border-radius: 1.5rem;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15), 0 0 15px rgba(37, 99, 235, 0.3) inset,
                                0 5px 15px rgba(0, 0, 0, 0.1);
                    border: 2px solid #c7d2fe;
                    overflow: hidden;
                    transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
                    backdrop-filter: blur(8px);
                }
                .dashboard-card:hover {
                    transform: translateY(-12px) scale(1.03);
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25), 0 0 20px rgba(37, 99, 235, 0.4) inset,
                                0 10px 20px rgba(0, 0, 0, 0.2);
                }
                .card-header {
                    background: linear-gradient(90deg, #2563eb, #1e40af);
                    padding: 1.8rem;
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    border-top-left-radius: 1.5rem;
                    border-top-right-radius: 1.5rem;
                }
                .icon-container {
                    font-size: 2.2rem;
                    color: #fff;
                    filter: drop-shadow(0 4px 10px rgba(31, 38, 135, 0.3));
                }
                .card-title {
                    font-size: 1.7rem;
                    font-weight: 600;
                    color: #fff;
                    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
                }
                .card-body {
                    padding: 1.8rem;
                    text-align: center;
                }
                .card-description {
                    color: #4b5563;
                    font-size: 1rem;
                    margin-bottom: 1.2rem;
                    line-height: 1.6;
                }
                .view-details {
                    display: inline-flex;
                    align-items: center;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #2563eb;
                    transition: color 0.2s, text-shadow 0.2s;
                    text-decoration: none;
                }
                .view-details:hover {
                    color: #1e40af;
                    text-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
                }
                .chevron-icon {
                    margin-left: 0.3rem;
                    font-size: 0.8rem;
                    transition: transform 0.2s;
                }
                .dashboard-card:hover .chevron-icon {
                    transform: translateX(0.3rem);
                }
                @media (max-width: 1024px) {
                    .globe-container {
                        height: 400px;
                    }
                    .dashboard-header {
                        padding: 2.5rem 2rem;
                    }
                    .header-title {
                        font-size: 2.5rem;
                    }
                    .header-desc {
                        font-size: 1.1rem;
                    }
                    .cards-grid {
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    }
                }
                @media (max-width: 768px) {
                    .globe-container {
                        height: 350px;
                    }
                    .dashboard-header {
                        padding: 2rem 1.5rem;
                        border-radius: 1.5rem;
                    }
                    .header-title {
                        font-size: 2rem;
                    }
                    .header-desc {
                        font-size: 1rem;
                    }
                    .cards-grid {
                        grid-template-columns: 1fr;
                    }
                    .dashboard-card {
                        border-radius: 1.5rem;
                    }
                    .card-header {
                        padding: 1.2rem;
                    }
                    .card-title {
                        font-size: 1.4rem;
                    }
                    .card-body {
                        padding: 1.2rem;
                    }
                }
                @media (max-width: 480px) {
                    .header-title {
                        font-size: 1.8rem;
                    }
                    .header-desc {
                        font-size: 0.95rem;
                    }
                    .card-title {
                        font-size: 1.3rem;
                    }
                    .card-description {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
            <div className="dashboard-container">
                {/* Globe Section */}
                <div className="globe-container" ref={globeRef}>
                    <Globe
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        arcsData={arcsData}
                        arcColor={'color'}
                        arcDashLength={() => Math.random()}
                        arcDashGap={() => Math.random()}
                        arcDashAnimateTime={() => Math.random() * 4000 + 500}
                        backgroundColor="rgba(0,0,0,0)"
                        width={typeof window !== 'undefined' ? window.innerWidth : 1300}
                        height={500}
                        animateIn={true}
                        showAtmosphere={true}
                        onGlobeReady={() => console.log('Globe ready')}
                    />
                    <div className="globe-overlay"></div>
                </div>
                {/* Dashboard Header */}
                <div className="dashboard-header">
                    <h2 className="header-title">
                        <FaTachometerAlt /> Airline Operations Center
                    </h2>
                    <p className="header-desc">Welcome to a centralized hub designed to manage and monitor all critical airport operations with ease.</p>
                </div>
                {/* Dashboard Cards Grid */}
                <div className="cards-grid">
                    <AnimatePresence>
                        {[
                            {
                                to: "/checkin",
                                icon: <FaTicketAlt />,
                                title: "Check-in Services",
                                desc: "View passenger check-in statuses and boarding processes."
                            },
                            {
                                to: "/flights",
                                icon: <FaPlaneDeparture />,
                                title: "Flight Schedule",
                                desc: "View real-time flight schedules, arrivals, and departures."
                            },
                            {
                                to: "/gates",
                                icon: <FaMapMarkerAlt />,
                                title: "Gate Operations",
                                desc: "View gate assignments for efficient aircraft handling."
                            },
                            {
                                to: "/resources",
                                icon: <FaCogs />,
                                title: "Resource Allocation",
                                desc: "View staff and equipment assignments."
                            },
                            {
                                to: "/maintenance",
                                icon: <FaWrench />,
                                title: "Maintenance Status",
                                desc: "View maintenance status for aircraft and facilities."
                            },
                            {
                                to: "/notifications",
                                icon: <FaBell />,
                                title: "Real-time Alerts",
                                desc: "View critical notifications and updates."
                            },
                            {
                                to: "/baggage",
                                icon: <FaSuitcaseRolling />,
                                title: "Baggage Tracking",
                                desc: "View passenger baggage statuses."
                            },
                            {
                                to: "/admin/login",
                                icon: <FaPersonBooth />,
                                title: "Admin Login",
                                desc: "Manage flights and passenger data."
                            }
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Link
                                    to={card.to}
                                    className="dashboard-card"
                                >
                                    <div className="card-header">
                                        <div className="icon-container">
                                            {card.icon}
                                        </div>
                                        <h3 className="card-title">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-description">{card.desc}</p>
                                        <div className="flex justify-center">
                                            <span className="view-details">
                                                View Details <FaChevronRight className="chevron-icon" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;