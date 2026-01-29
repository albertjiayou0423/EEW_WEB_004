// src/lib/verify_logic.js
import { parseWolfxMessage } from './wolfx.js';
import { parseNToolData } from './ntool.js';
import { parseP2PTsunamiData } from './p2p.js';

const mockWolfxData = {
  type: 'jma_eew',
  EventID: '20231001120000',
  Serial: 1,
  Title: '紧急地震速报',
  AnnouncedTime: '2023/10/01 12:00:05',
  OriginTime: '2023/10/01 12:00:00',
  Hypocenter: '千叶县近海',
  Latitude: 35.5,
  Longitude: 140.2,
  Magunitude: 5.5,
  Depth: 10,
  MaxIntensity: '4',
  isCancel: false,
  isFinal: false,
  isWarn: true,
  OriginalText: 'TEST MESSAGE'
};

const mockNToolData = {
  Head: {
    EventID: '20231001110000',
    Title: '震源・震度信息',
    ReportDateTime: '2023/10/01 11:05',
    InfoKind: '震源・震度',
    Headline: '各地测得震度如下'
  },
  Body: {
    Earthquake: {
      OriginTime: '2023/10/01 11:00',
      Hypocenter: {
        Name: '石川县能登地方',
        Latitude: '37.5',
        Longitude: '137.2',
        Depth: '10'
      },
      Magnitude: '4.5'
    },
    Intensity: {
      Observation: {
        MaxInt: '3'
      }
    }
  }
};

const mockP2PTsunamiData = [
  {
    id: 'tsunami_test_id',
    time: '2023/10/01 10:00:00',
    cancelled: false,
    issue: {
      source: '气象厅',
      time: '2023/10/01 10:01',
      type: 'Focus'
    },
    areas: [
      { name: '岩手县', grade: 'Watch', immediate: false }
    ]
  }
];

function runTests() {
  console.log('--- Running Logic Verification ---');

  const wolfxResult = parseWolfxMessage(mockWolfxData);
  if (wolfxResult && wolfxResult.id === '20231001120000') {
    console.log('✅ Wolfx Parsing: Success');
  } else {
    console.log('❌ Wolfx Parsing: Failed', wolfxResult);
  }

  const ntoolResult = parseNToolData(mockNToolData);
  if (ntoolResult && ntoolResult.id === '20231001110000' && ntoolResult.hypocenter === '石川县能登地方') {
    console.log('✅ nTool Parsing: Success');
  } else {
    console.log('❌ nTool Parsing: Failed', ntoolResult);
  }

  const p2pResult = parseP2PTsunamiData(mockP2PTsunamiData);
  if (p2pResult && p2pResult.id === 'tsunami_test_id' && p2pResult.areas.length === 1) {
    console.log('✅ p2p Tsunami Parsing: Success');
  } else {
    console.log('❌ p2p Tsunami Parsing: Failed', p2pResult);
  }

  console.log('--- Verification Finished ---');
}

runTests();
