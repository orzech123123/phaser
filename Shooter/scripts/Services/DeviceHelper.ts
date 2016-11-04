class DeviceHelper {
    static IsWindows = (): boolean => {
        return device.platform === "windows";
    }
}