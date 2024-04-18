import React, {useState, useEffect} from 'react';
import VideoPreview from './VideoPreview';
import DeviceSelector from './DeviceSelector';
import RecordControls from './RecordControls';
import './VideoStyles.css';


const VideoRecorder = () => {
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
    const [error, setError] = React.useState(false);
    const [mediaStream, setMediaStream] = useState(null);

    useEffect(() => {
        const fetchDevices = async () => { 
          const devices = await navigator.mediaDevices.enumerateDevices();
          setAvailableDevices(devices.filter(device => device.kind === 'videoinput'));
        };
        fetchDevices();
      }, []);

    const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDeviceId(event.target.value); 
    };
  
    useEffect(() => {
        const getMediaStream = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
            console.log('Media stream obtained:', stream);
            setMediaStream(stream);
          } catch (error) {
            setError(true)
          }
        };
    
        getMediaStream();
    
        return () => {
          // Clean up function to stop media stream
          if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        };
    }, []);
    
    useEffect(() => {
        if (mediaStream) {
            // Set the video element's source object to the obtained media stream
            const videoElement = document.getElementById('video-preview');
            if (videoElement) videoElement.srcObject = mediaStream;
        }
    }, [mediaStream]);
    

    return (
        <div className='container'>
            {mediaStream && <DeviceSelector selectedDeviceId={selectedDeviceId} handleDeviceChange={handleDeviceChange} availableDevices={availableDevices}/>}
            <VideoPreview/>
            {/* Control buttons */}
            {!error && mediaStream && <RecordControls mediaStream={mediaStream}/>}
            {error && <div>Fetching stream isnt possible on this network right now</div>}
            {!error && !mediaStream && <p>You need to provide necessary permissions to start the video preview</p>}
        </div>
    )
}

export default VideoRecorder;