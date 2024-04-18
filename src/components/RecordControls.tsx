import {useState} from 'react';

const RecordControls = ({mediaStream}) => {
    const [recorder, setRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const startRecording = () => {
        // Check if media stream is available before starting recording
        if (mediaStream) {
            if (!isRecording) {
                const newRecorder = new MediaRecorder(mediaStream);
                const chunks = [];

                newRecorder.ondataavailable = (event) => {
                    chunks.push(event.data);
                };

                newRecorder.onstop = () => {
                    setRecordedChunks(chunks);
                };

                newRecorder.start();
                setRecorder(newRecorder);
                setIsRecording(true);
            }
        }
    };

    const stopRecording = () => {
        if (recorder) {
            recorder.stop();
            setIsRecording(false);
        }
    };

    const downloadVideo = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recorded-video.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    };
    
    return(
        <div>
            <button onClick={startRecording} disabled={isRecording}>
                {isRecording ? 'Recording' : 'Start'}
            </button>
            <button onClick={stopRecording}>Stop</button>
            <button onClick={downloadVideo}>Download</button>
        </div>
    )
}

export default RecordControls