import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface CryptoData {
  usd: number;
  usd_24h_change: number;
}

export const MarketTicker: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [btcData, setBtcData] = useState<CryptoData | null>(null);
  const [trxData, setTrxData] = useState<CryptoData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Digital clock effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Crypto prices effect
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tron&vs_currencies=usd&include_24hr_change=true');
        if (!res.ok) throw new Error('API limit or error');
        const data = await res.json();
        if (data.bitcoin && data.tron) {
          setBtcData(data.bitcoin);
          setTrxData(data.tron);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setError(false);
        }
      } catch (err) {
        console.error('Error fetching crypto prices:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#050914] dark:bg-[#050914] light:bg-gray-100 border-b border-[#1C2541] light:border-gray-200 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Digital Clock */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{time || '00:00:00'}</span>
        </div>

        {/* Crypto Widget: BTC & TRX ONLY */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {loading ? (
            <span className="text-gray-400 animate-pulse flex items-center space-x-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Loading market data...</span>
            </span>
          ) : (
            <>
              {/* BTC */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-white dark:text-white light:text-gray-900">BTC:</span>
                <span className="font-mono text-cyan-300">
                  {btcData ? `$${btcData.usd.toLocaleString()}` : '$--'}
                </span>
                {btcData && (
                  <span className={`flex items-center font-mono ${btcData.usd_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {btcData.usd_24h_change >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {btcData.usd_24h_change.toFixed(2)}%
                  </span>
                )}
              </div>

              {/* TRX */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-white dark:text-white light:text-gray-900">TRX:</span>
                <span className="font-mono text-cyan-300">
                  {trxData ? `$${trxData.usd.toFixed(4)}` : '$--'}
                </span>
                {trxData && (
                  <span className={`flex items-center font-mono ${trxData.usd_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trxData.usd_24h_change >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {trxData.usd_24h_change.toFixed(2)}%
                  </span>
                )}
              </div>

              {lastUpdated && (
                <span className="text-[10px] text-gray-400 hidden md:inline">
                  (CoinGecko • {lastUpdated})
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
