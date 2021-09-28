import React from 'react';

const Logo = (): JSX.Element => {
    return (
        <svg
            viewBox={'0 0 500 500'}
            xmlns={'http://www.w3.org/2000/svg'}
            fillRule={'evenodd'}
            clipRule={'evenodd'}
            strokeLinejoin={'round'}
            strokeMiterlimit={2}
            style={{ height: '35px' }}
        >
            <path d={'M250 0l166.667 166.666L250 333.333 83.334 166.666 250 0z'} fill={'#053fff'} />
            <path
                d={'M250 78.84l166.667 166.667L250 412.174 83.334 245.507 250 78.841z'}
                fill={'#055eff'}
            />
            <path
                d={'M250 166.667l166.667 166.666L250 500 83.334 333.333 250 166.667z'}
                fill={'#057eff'}
            />
        </svg>
    );
};

export default Logo;

// <svg
//     viewBox="0 0 59 88"
//     fillRule="evenodd"
//     clipRule="evenodd"
//     strokeLinejoin="round"
//     strokeMiterlimit={2}
//     className={"logo"}
// >
//     <g transform="scale(.04578 .12194)">
//         <path fill="none" d="M0 0h1280v720H0z" />
//         <clipPath id="prefix__a">
//             <path d="M0 0h1280v720H0z" />
//         </clipPath>
//         <g clipPath="url(#prefix__a)">
//             <path
//                 d="M639.623 0l639.619 240.13-639.619 240.13L.005 240.13 639.623 0z"
//                 fill="#fff"
//             />
//             <use
//                 xlinkHref="#prefix___Image2"
//                 y={8.9}
//                 width={58.6}
//                 height={68.577}
//                 transform="matrix(21.6949 0 0 8.15022 -.009 .004)"
//             />
//             <path
//                 d="M639.623 113.592l639.619 240.13-639.619 240.13L.005 353.722l639.618-240.13z"
//                 fill="#fff"
//             />
//             <use
//                 xlinkHref="#prefix___Image3"
//                 y={24.457}
//                 width={58.6}
//                 height={63.525}
//                 transform="matrix(21.6949 0 0 8.13958 -.009 .004)"
//             />
//             <path
//                 d="M639.623 240.127l639.619 240.13-639.619 240.13L.005 480.258l639.618-240.13z"
//                 fill="#fff"
//             />
//         </g>
//     </g>
//     <defs>
//         <image
//             id="prefix___Image2"
//             width={59}
//             height={69}
//             xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAABFCAYAAAD0DZ4CAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADJElEQVRogeXbbXLaMBCA4dfEECAhF+hMj9TD9kid6QUamhYIuD+kxYvjgLG98na0Mxrx4Qg/sQWy1ipIHF+//Szk8Y/vX6qUn13c3mR4KGDR+MwqliRwU6xCzqihUqpGOVmDzbARKuUhlhk1vAJOwFHVFVBZoU2wCjojIEtgHusyvifAd+AQa4GbgEfHtkDnwGMsi/h8RkAdgD2wi+WAIXhUbAt0QUCugDWwjK8Jdg/8UWUXXzMBj4b9BLokQJ+BJwL4MW5zJMDegC3wOz42A4+CvQJdE6DPwIYA1tgdAfgayxZD8GBsB+gGeIn1Or7/QDv2F4bgQdg7oC+Eo7qivc9uqbFm4N7YO6HP1P11Tv07e6D96JqAe2F7QpcE6AM19kgA/yUB+G7sAKj01eYISgYV5uDZRFDdjoyupJ3NJ+08NtvRV1BdovPGI0MlzhcBJDjCnbBG0OTgm1hjaFLwVWwiaBfwVmF7gz/diQ5QQW5GgCYBt+7IRFBz8IedmRhqCr7YISdQM/B5p5xBTcCFY+jo4MI5dFSwzPR5hqLal7H0PbGP9anEP1RiMLjk/4BKDAKX1NOd3qESfcGVYFeEOaKNKh6hErfAlarPpaQ+qk/Ug3vPUIlrYP3tLWmWo2Clv8pE9op6cswjVKINrBNm74Qvpz2xz+p+K2WOf6iEBksSrelZAHP56ZENm2lFXTxHoeqm53zAZLL6fF6r581ksee4SGpz6bkYQcl5vVNFz+/Kfwt8HmGN1P1Ue/bAoYxPZJwpCWMN1X0CfIHbxsw7QkrlLRZJh+4F++H8bjS6iLUn8K2LA8kfbYm535JwiOVUvfaF5Al8Cyqzka+EvO8FFrrtvAdw38u9Q0mdAe8aU4IHXdeW8Q/BP3jwBXypGgC/4FFmKvKag5IWnYLHn110CrabN3YGts8IOAGny/XcAR4zXWkOvYqdADxdfjYxePrMeyKwn3sqjMH+7pYxAieF3o0dGZz8DrdeP/zZ3Lsokc1dqRLZ3G8skc2d5BLZrBGQyGb1h0Q263okslmxJZHNWjyJbFZZSmSzflZHFiuj22LKNe//AFvwHMevku4/AAAAAElFTkSuQmCC"
//         />
//         <image
//             id="prefix___Image3"
//             width={59}
//             height={64}
//             xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAABACAYAAACkwA+xAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD2UlEQVRogdXb/1KjMBDA8W8Rtf58AWd8JB/WR3LGF9CzXlsL90eyZIuUAslCbmcyaXs95DOBhGTTFTPH88v7Sl6/vT7Vc/7t1fmvxIcCrlp/s/ZlFrgpViELAlRKrUoF1NZgM6yHSrnwpSDABXlQdY0h2gSroAUOWQKXvr4gYA/AD7D3tcBNwMmxHdBL4NqXK/9esHtgB/z19R5DcFJsB/QKh7xR5cr/+wGH+1Zli0ObgJNhT0DXOOA9cAfc+s8vcKAtsAG+fNlgCE6C7YHe4qD3wIN/f80x9gv4A3z62gwcjR0AfQAeCa0rl3FFaNlPXz4wBEdhR0AfcVB9z1Y4zDehZT8wBE/GjoTeEy7hkoD94felbAaehJ0IXeOGnfY4u8cNPebg0dhIqLSqfoKShwpzcLEQVB9Hnq7WuPu67xaQYasAVnoGNSQGfzkxVEJPBMxbeFDL9jwZxUBh5hY+izWEzg7u/cIZ6EMCqA7zS/rkScwMnQXceSILQc3BZWZQ1P+Te3hM7Hxd4de2ug4MZAHVEd3Cb69PVSc2M6gJuBgATTG8TI3oYen55b0ZXosB0MeOA84BjQXLpKMBl5lDJWI6LQCeX96bE+6DPrAsVCIaLOu4fVBZO1oSKhEFlnvgf4BKDAE3OSQdJWFd944AzBUqMaaFm+FLY6Vny+UePRenwLWqJYd0AH409laVG0L3nSNUogssLanzSHtgV/ovSQe1JgzK0nnlCpXQYEmiiecoxyStpks7tZgzVGKl6ral8RQcP3/qUrdKztE+17alAqqCkDbc4R6it4R8aRueY2igrEO3PTt8ByUpCMmd6oQx/nMI61U5XdJd0C1uZiTZwY1/vy39i/Y2gHanlCO4DZWk9objrGCTCpWWFZzUXZETeAhUyhc+0V3iml7iHCAH8BBo14R+X+I6ojGxJHgKVPZrHErCkseYWAI8FdpsSinVAXIGx0BlCK1X8GsNanIKwgicBPr2+lSfWl3MBZwMCiqx5T+IXokn3ZNWF1Q2nIyGHmETg7ODwrBcz9RLelRWfyBUbyEaBT2JXRBsBu3FLgA2hXLuRCLuYb27tPp14AWgMHCYmNjCet9TXwvPAh2MNQTPBh2FTQiWY5wbXj5ICB2NTQyeFToJGwHWvbSEdHrmUIh4jo0AS5q09if/F7eSoO9ReZ0MCpEP7SPBer+xYLv2G5tAIcEMZQRYEmVdO8nl8jWDQqLp2ECwbJu/JmBluibIpPdoO5LNPXvAkveVX39orG5ZvcabHAqJVxZ6wJIlXNP9GwEpZlAwWEY5AW7/YkuwXb/YMoEC/AMF9s1PKOo8uAAAAABJRU5ErkJggg=="
//         />
//     </defs>
// </svg>
