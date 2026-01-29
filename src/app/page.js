// src/app/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Separator } from '@/components/ui/separator';
import EEWAlert from '@/components/EEWAlert';
import EarthquakeHistory from '@/components/EarthquakeHistory';
import TsunamiInfo from '@/components/TsunamiInfo';
import { WOLFX_WS_URL, parseWolfxMessage, fetchEarthquakeList } from '@/lib/wolfx';
import { fetchTsunamiInfo } from '@/lib/p2p';
import { Radio, Wifi, WifiOff } from 'lucide-react';

// Dynamically import map to avoid SSR issues with Leaflet
const EarthquakeMap = dynamic(() => import('@/components/EarthquakeMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-lg border">地图加载中...</div>
});

export default function Home() {
  const [eew, setEew] = useState(null);
  const [history, setHistory] = useState([]);
  const [tsunami, setTsunami] = useState(null);
  const [wsStatus, setWsStatus] = useState('connecting');
  const [mapCenter, setMapCenter] = useState([35.6895, 139.6917]);

  // Initial and periodic data fetching
  const refreshStaticData = useCallback(async () => {
    const [eqList, latestTsunami] = await Promise.all([
      fetchEarthquakeList(),
      fetchTsunamiInfo()
    ]);

    if (eqList && eqList.length > 0) {
      setHistory(eqList);
      if (!eew) {
        const latestEq = eqList[0];
        const lat = parseFloat(latestEq.latitude);
        const lng = parseFloat(latestEq.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter([lat, lng]);
        }
      }
    }

    if (latestTsunami) {
      setTsunami(latestTsunami);
    }
  }, [eew]);

  useEffect(() => {
    refreshStaticData();
    const interval = setInterval(refreshStaticData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [refreshStaticData]);

  // WebSocket for real-time EEW
  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connect = () => {
      try {
        ws = new WebSocket(WOLFX_WS_URL);

        ws.onopen = () => {
          console.log('Wolfx WebSocket Connected');
          setWsStatus('connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const parsed = parseWolfxMessage(data);
            if (parsed) {
              if (parsed.isCancel) {
                setEew(null);
              } else {
                setEew(parsed);
                const lat = parseFloat(parsed.latitude);
                const lng = parseFloat(parsed.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                  setMapCenter([lat, lng]);
                }

                if (parsed.isFinal) {
                  setTimeout(() => setEew(null), 300000);
                }
              }
            }
          } catch (e) {
            console.error('Error parsing WS message', e);
          }
        };

        ws.onclose = () => {
          setWsStatus('disconnected');
          reconnectTimeout = setTimeout(connect, 5000);
        };

        ws.onerror = (err) => {
          console.error('WS Error:', err);
          ws.close();
        };
      } catch (e) {
        console.error('Connection error:', e);
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              <Radio className="text-red-600 animate-pulse" />
              EEW 紧急地震速报
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              实时监测地震及海啸预警信息 (数据源: JMA / Wolfx / P2PQuake)
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border shadow-sm">
            <div className={`flex items-center gap-1.5 text-xs font-medium ${wsStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              {wsStatus === 'connected' ? <Wifi size={14} /> : <WifiOff size={14} />}
              {wsStatus === 'connected' ? '实时连接正常' : '连接断开'}
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="text-[10px] text-gray-400 font-mono">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Display Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* EEW Alert Section */}
            {eew && (
              <section>
                <EEWAlert eew={eew} />
              </section>
            )}

            {/* Map Section */}
            <section className="bg-white p-2 rounded-xl border shadow-sm">
              <EarthquakeMap earthquakes={history} center={mapCenter} />
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Tsunami Info */}
            <section>
              <TsunamiInfo tsunami={tsunami} />
            </section>

            {/* History List */}
            <section>
              <EarthquakeHistory history={history} />
            </section>
          </div>
        </div>

        <footer className="text-center text-xs text-slate-400 pt-8 pb-4">
          本站仅供学术交流使用，预警信息请以官方发布为准。
        </footer>
      </div>
    </main>
  );
}
