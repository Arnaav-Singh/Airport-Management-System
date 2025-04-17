import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSuitcaseRolling } from 'react-icons/fa'; // Example icon for cart/baggage

const Nav = styled.nav`
  background: linear-gradient(90deg, #1a202c 60%, #2d3748 100%);
  padding: 20px 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.09);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 10px;
    padding: 0;
  }
`;

const Logo = styled(Link)`
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: -0.03em;
  font-family: 'Segoe UI', 'Arial', sans-serif;

  &:hover {
    color: #ff7e67;
    text-shadow: 0 2px 8px rgba(255,126,103,0.18);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 600px) {
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavItem = styled(Link)`
  color: #edf2f7;
  font-size: 1.08rem;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.3s cubic-bezier(.4,0,.2,1);

  &:hover {
    color: #ff7e67;
  }

  &:after {
    content: '';
    display: block;
    margin: 0 auto;
    width: 0;
    height: 2px;
    background: #ff7e67;
    transition: width 0.3s;
    border-radius: 1px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
  }

  &:hover:after {
    width: 100%;
  }
`;

const CartIconContainer = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  color: #edf2f7;
  margin-left: 18px;
  font-size: 1.3rem;
  transition: color 0.3s;

  &:hover {
    color: #ff7e67;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: #ff7e67;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.13);
`;

const Navbar = ({ cartItemCount = 0 }) => {
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">AirPort Buddy</Logo>
        <NavLinks>
        <NavItem to="/passengers/add">Passenger</NavItem>
          <NavItem to="/checkin">Check-in</NavItem>
          <NavItem to="/flights">Flights</NavItem>
          <NavItem to="/gates">Gates</NavItem>
          <NavItem to="/resources">Resources</NavItem>
          <NavItem to="/maintenance">Maintenance</NavItem>
          <NavItem to="/notifications">Notifications</NavItem>
        
          <NavItem to="/admin/login">Login</NavItem>
        
          {/* Example: Cart/Baggage icon with count */}
         
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
