const DeviceSelector = ({selectedDeviceId, handleDeviceChange, availableDevices}) => {
    return (
        <select value={selectedDeviceId} onChange={handleDeviceChange}>
            {availableDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                {device.label}
                </option>
            ))}
        </select>
    )
}

export default DeviceSelector;