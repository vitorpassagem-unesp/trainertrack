import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} TrainerTrack. Todos os direitos reservados.</p>
                <p>Desenvolvido para personal trainers e seus clientes.</p>
            </div>
        </footer>
    );
};

export default Footer;