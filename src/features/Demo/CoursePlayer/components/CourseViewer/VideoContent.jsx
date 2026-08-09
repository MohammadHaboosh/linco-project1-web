import React, { useState } from "react";
import { IoPlay, IoPause, IoPlaySkipBack, IoPlaySkipForward, IoVolumeHigh, IoSettingsSharp, IoExpand } from "react-icons/io5";

const VideoContent = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#07101E' }}>
      
      {/* Video Title Overlay */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', color: 'white', zIndex: 10 }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Understanding the DOM
        </h2>
      </div>

      {/* Center Controls */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
        <button style={skipBtnStyle}><IoPlaySkipBack /></button>
        <button 
          onClick={() => setPlaying(!playing)}
          style={{
            background: 'white', color: '#07101E', border: 'none',
            width: '80px', height: '80px', borderRadius: '50%', fontSize: '32px',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.2s'
          }}
        >
          {playing ? <IoPause /> : <IoPlay style={{ marginLeft: '4px' }} />}
        </button>
        <button style={skipBtnStyle}><IoPlaySkipForward /></button>
      </div>

      {/* Bottom Control Bar */}
      <div style={{ padding: '20px 24px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginBottom: '16px', position: 'relative', cursor: 'pointer' }}>
           <div style={{ height: '100%', width: '45%', background: '#2563EB', borderRadius: '2px' }}></div>
           <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', position: 'absolute', top: '-4px', left: '45%', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', alignItems: 'center' }}>
           <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
             <IoVolumeHigh style={{ fontSize: '22px', cursor: 'pointer' }} />
             <span style={{ fontSize: '13px', fontWeight: '500', fontFamily: 'monospace' }}>06:45 / 15:20</span>
           </div>
           <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
             <IoSettingsSharp style={{ fontSize: '20px', cursor: 'pointer' }} />
             <IoExpand style={{ fontSize: '20px', cursor: 'pointer' }} />
           </div>
        </div>
      </div>
    </div>
  );
};

const skipBtnStyle = {
  background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)',
  fontSize: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center'
};

export default VideoContent;