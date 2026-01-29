// src/components/EarthquakeHistory.jsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, MapPin } from 'lucide-react';

export default function EarthquakeHistory({ history = [] }) {
  const getIntensityColor = (intensity) => {
    if (!intensity) return 'bg-gray-400';
    if (intensity.includes('7')) return 'bg-red-700';
    if (intensity.includes('6')) return 'bg-red-600';
    if (intensity.includes('5')) return 'bg-orange-500';
    if (intensity.includes('4')) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History size={20} /> 地震历史
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col">
            {history.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">暂无数据</div>
            ) : (
              history.map((eq, index) => (
                <div
                  key={eq.id || index}
                  className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{eq.hypocenter}</span>
                      <span className="text-xs text-gray-500">M{eq.magnitude}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <MapPin size={10} /> {eq.reportTime || eq.originTime}
                    </div>
                  </div>
                  <Badge className={`${getIntensityColor(eq.maxIntensity)} text-white font-bold`}>
                    震度 {eq.maxIntensity}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
