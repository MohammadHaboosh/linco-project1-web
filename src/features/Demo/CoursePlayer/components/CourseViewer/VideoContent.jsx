import React, { useState } from "react";
import { IoPlay, IoPause, IoVolumeHighOutline, IoSettingsOutline, IoExpandOutline } from "react-icons/io5";

const VideoContent = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#111' }}>
      <button 
        onClick={() => setPlaying(!playing)}
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(37, 99, 235, 0.9)', color: 'white', border: 'none',
          width: '64px', height: '64px', borderRadius: '50%', fontSize: '32px',
          display: 'grid', placeItems: 'center', cursor: 'pointer', zIndex: 10
        }}
      >
        {playing ? <IoPause /> : <IoPlay style={{marginLeft: '4px'}} />}
      </button>
    </div>
  );
};

export default VideoContent;