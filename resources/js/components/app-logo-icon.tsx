import React, { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/Logo.png"
            alt="IqraPath Logo"
            {...props}
        />
    );
}
