// src/components/TsunamiInfo.jsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, ShieldCheck, AlertCircle } from 'lucide-react';

export default function TsunamiInfo({ tsunami }) {
  if (!tsunami) return null;

  const isWarningActive = !tsunami.cancelled && tsunami.areas && tsunami.areas.length > 0;

  return (
    <Card className={`border-t-4 ${isWarningActive ? 'border-t-blue-500' : 'border-t-green-500'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves size={20} className={isWarningActive ? 'text-blue-500' : 'text-green-500'} />
          海啸预警状态
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isWarningActive ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <AlertCircle size={18} />
              当前发布海啸预警/注意报
            </div>
            <div className="grid grid-cols-1 gap-2">
              {tsunami.areas.slice(0, 5).map((area, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-2 bg-blue-50 rounded">
                  <span>{area.name}</span>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    {area.grade}
                  </Badge>
                </div>
              ))}
              {tsunami.areas.length > 5 && (
                <div className="text-xs text-center text-gray-500">
                  等共 {tsunami.areas.length} 个区域
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 py-4">
            <ShieldCheck size={24} />
            <span className="font-medium">当前无活跃的海啸预警</span>
          </div>
        )}
        <div className="mt-2 text-[10px] text-gray-400">
          发布时间: {tsunami.issue?.time || tsunami.time}
        </div>
      </CardContent>
    </Card>
  );
}
