import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props} 
            src="/assets/images/LogoUnsoed.webp" 
            alt="Logo UNSOED"
        />
    );
}
