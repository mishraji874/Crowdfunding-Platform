'use client'

import { useState } from 'react';

const cryptoPairs = [
    // Major Cryptocurrencies
    { value: "BINANCE:BTCUSDT", label: "Bitcoin/USDT" },
    { value: "BINANCE:ETHUSDT", label: "Ethereum/USDT" },
    { value: "BINANCE:SOLUSDT", label: "Solana/USDT" },
    { value: "BINANCE:BNBUSDT", label: "BNB/USDT" },
    { value: "BINANCE:ADAUSDT", label: "Cardano/USDT" },
    // DeFi Tokens
    { value: "BINANCE:UNIUSDT", label: "Uniswap/USDT" },
    { value: "BINANCE:AAVEUSDT", label: "Aave/USDT" },
    { value: "BINANCE:MKRUSDT", label: "Maker/USDT" },
    { value: "BINANCE:COMPUSDT", label: "Compound/USDT" },
    // Layer 2 Solutions
    { value: "BINANCE:MATICUSDT", label: "Polygon/USDT" },
    { value: "BINANCE:ARBUSDT", label: "Arbitrum/USDT" },
    { value: "BINANCE:OPUSDT", label: "Optimism/USDT" },
    // Meme Coins
    { value: "BINANCE:DOGEUSDT", label: "Dogecoin/USDT" },
    { value: "BINANCE:SHIBUSDT", label: "Shiba Inu/USDT" },
    // Gaming & Metaverse
    { value: "BINANCE:SANDUSDT", label: "Sandbox/USDT" },
    { value: "BINANCE:MANAUSDT", label: "Decentraland/USDT" },
    { value: "BINANCE:AXSUSDT", label: "Axie/USDT" },
];

const timeframes = [
    { value: "1", label: "1 Minute" },
    { value: "5", label: "5 Minutes" },
    { value: "15", label: "15 Minutes" },
    { value: "30", label: "30 Minutes" },
    { value: "60", label: "1 Hour" },
    { value: "240", label: "4 Hours" },
    { value: "D", label: "1 Day" },
    { value: "W", label: "1 Week" },
];

const CryptoChart = () => {
    const [selectedPair, setSelectedPair] = useState("BINANCE:BTCUSDT");
    const [selectedTimeframe, setSelectedTimeframe] = useState("D");

    const getWidgetUrl = (pair: string, timeframe: string) => {
        return `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${pair}&interval=${timeframe}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[%22Volume%22,%22MACD%22,%22RSI%22]&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=1&details=true&hotlist=1&calendar=1`;
    };

    return (
        <div className="space-y-2 sm:space-y-4">
            <div className="p-1.5 sm:p-4 rounded-lg bg-card">
                <div className="grid grid-cols-1 gap-2 sm:gap-3 w-full">
                    {/* Pair Selection */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs sm:text-sm font-medium text-foreground/70">
                            Select Pair
                        </label>
                        <select
                            value={selectedPair}
                            onChange={(e) => setSelectedPair(e.target.value)}
                            className="w-full h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm rounded-md border bg-background text-foreground hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                            style={{
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.3rem center',
                                backgroundSize: '1em',
                                paddingRight: '1.5rem'
                            }}
                        >
                            {cryptoPairs.map((pair) => (
                                <option
                                    key={pair.value}
                                    value={pair.value}
                                    className="text-xs sm:text-sm"
                                >
                                    {pair.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Timeframe Selection */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs sm:text-sm font-medium text-foreground/70">
                            Timeframe
                        </label>
                        <select
                            value={selectedTimeframe}
                            onChange={(e) => setSelectedTimeframe(e.target.value)}
                            className="w-full h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm rounded-md border bg-background text-foreground hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                            style={{
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.3rem center',
                                backgroundSize: '1em',
                                paddingRight: '1.5rem'
                            }}
                        >
                            {timeframes.map((tf) => (
                                <option
                                    key={tf.value}
                                    value={tf.value}
                                    className="text-xs sm:text-sm"
                                >
                                    {tf.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Chart Container */}
            <div className="w-full h-[350px] sm:h-[500px] md:h-[600px] relative border rounded-lg overflow-hidden">
                <iframe
                    key={`${selectedPair}-${selectedTimeframe}`}
                    src={getWidgetUrl(selectedPair, selectedTimeframe)}
                    className="w-full h-full border-none"
                    allowTransparency
                    allowFullScreen
                    scrolling="no"
                />
            </div>
        </div>
    );
};

export default CryptoChart;
