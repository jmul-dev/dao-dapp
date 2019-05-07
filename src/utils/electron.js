export const metamaskPopup = () => {
	if (isElectron()) {
		window.chrome.ipcRenderer.send("open-metamask-notification");
	}
};

export const isElectron = () => {
	return !!(window.chrome && window.chrome.ipcRenderer);
};
