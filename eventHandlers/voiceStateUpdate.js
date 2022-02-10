exports.handle = async function(oldState, newState) {
	if (newState.channel) {
		console.log('CONNECTING');
		await this.timer.voiceConnect(newState.id);
	} else {
		console.log('DISCONNECTING');
		await this.timer.voiceDisconnect(newState.id);
	}
};
