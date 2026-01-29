// src/components/EEWAlert.jsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Activity, Zap } from 'lucide-react';

export default function EEWAlert({ eew }) {
  if (!eew) return null;

  const getIntensityColor = (intensity) => {
    if (!intensity) return 'bg-gray-500';
    if (intensity.includes('7')) return 'bg-red-700';
    if (intensity.includes('6')) return 'bg-red-600';
    if (intensity.includes('5')) return 'bg-orange-500';
    if (intensity.includes('4')) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className={`border-2 ${eew.isWarn ? 'border-red-500 shadow-lg' : 'border-orange-400'} animate-pulse`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xl font-bold">
          <div className="flex items-center gap-2">
            <AlertTriangle className={eew.isWarn ? 'text-red-500' : 'text-orange-500'} />
            紧急地震速报 (EEW)
          </div>
          <Badge variant={eew.isFinal ? "outline" : "destructive"}>
            {eew.isFinal ? "最终报" : `第 ${eew.serial} 报`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} /> 震中
            </div>
            <div className="text-xl font-bold">{eew.hypocenter}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap size={16} /> 最大震度
            </div>
            <div className={`text-2xl font-black text-white px-3 py-1 rounded inline-block ${getIntensityColor(eew.maxIntensity)}`}>
              {eew.maxIntensity}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Activity size={16} /> 规模 / 深度
            </div>
            <div className="text-lg font-semibold">
              M{eew.magnitude} / {eew.depth}km
            </div>
          </div>
          <div className="space-y-2 text-right self-end">
            <div className="text-xs text-gray-400">
              发布时间: {eew.announcedTime}
            </div>
          </div>
        </div>
        {eew.originalText && (
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500 font-mono whitespace-pre-wrap">
            {eew.originalText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
