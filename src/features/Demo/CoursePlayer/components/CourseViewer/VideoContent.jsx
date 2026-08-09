import React, { useState } from "react";
import { IoPlay, IoPause, IoVolumeHighOutline, IoSettingsOutline, IoExpandOutline } from "react-icons/io5";

const VideoContent = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#111', display: 'flex', flexDirection: 'column' }}>
      
      {/* منطقة الفيديو الوهمية */}
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <button 
          onClick={() => setPlaying(!playing)}
          style={{
            background: 'rgba(37, 99, 235, 0.9)', color: 'white', border: 'none',
            width: '72px', height: '72px', borderRadius: '50%', fontSize: '32px',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)'
          }}
        >
          {playing ? <IoPause /> : <IoPlay style={{marginLeft: '4px'}} />}
        </button>
      </div>

      {/* شريط التحكم السفلي */}
      <div style={{ padding: '16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
        <div style={{ height: '4px', background: '#333', borderRadius: '2px', marginBottom: '16px', cursor: 'pointer' }}>
           <div style={{ height: '100%', width: '35%', background: '#3B82F6', borderRadius: '2px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', alignItems: 'center' }}>
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             <IoPlay style={{ fontSize: '20px', cursor: 'pointer' }} />
             <IoVolumeHighOutline style={{ fontSize: '20px', cursor: 'pointer' }} />
             <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>04:18 / 12:40</span>
           </div>
           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             <IoSettingsOutline style={{ fontSize: '20px', cursor: 'pointer' }} />
             <IoExpandOutline style={{ fontSize: '20px', cursor: 'pointer' }} />
           </div>
        </div>
      </div>
      
    </div>
  );
};

export default VideoContent;