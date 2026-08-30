const app = {
	getRecord: function () {
		return this.record;
	},

	getCurrentSessionName: function () {
		return this.currentSessionName;
	},

	// HELPERS //
	getIndexBeingEdited: function () {
		return this.indexBeingEdited;
	},

	loadSession: function (sessionName) {
		const sessionData = JSON.parse(localStorage.getItem(sessionName));

		if (!Array.isArray(sessionData)) {
			alert(
				"Error encountered: The session loaded is not Array and will cause saving errors",
			);
			return;
		}

		this.setRecord(sessionData);
		this.setCurrentSessionName(sessionName);
		localStorage.setItem("lastSessionName", sessionName);

		console.log(`
Current Session: ${this.getCurrentSessionName()}
Current Record: ${this.getRecord()}
Session List: ${this.getSessionList()}`);
	},

	updateDataAndSync: function (data) {
		[...this.getRecord(), data];

		alert("Storage Synced!");
	},

	updateSessionList: function (newSessionName) {
		localStorage.setItem(newSessionName, JSON.stringify([]));
		const newSessionList = this.getSessionListFromLocalStorage();
		this.setSessionList(newSessionList);
	},

	getDataInRecord(index) {
		const data = this.getRecord()[index];
		return data;
	},

	updateDataInRecord(index, newData) {
		this.getRecord()[index] = newData;
		localStorage.setItem(
			this.getCurrentSessionName(),
			JSON.stringify(this.getRecord()),
		);
	},

	// INIT //
	resumeLastSession: function () {
		const lastSessionName = localStorage.getItem("lastSessionName");

		if (lastSessionName === null || lastSessionName === undefined) {
			console.log("No last session");
			return false;
		}

		const sessionList = this.getSessionListFromLocalStorage();
		this.setSessionList(sessionList);
		this.loadSession(lastSessionName);
		return true;
	},

	init: function () {
		localStorage.setItem(currentDate, JSON.stringify([]));
		this.setSessionList([currentDate]);
		this.loadSession(currentDate);
		localStorage.setItem("lastSessionName", currentDate);
	},
};

const appControls = {
	closePreviewButtonInit() {
		const previewContainer = document.querySelector("#previewContainer");
		document
			.querySelector("#closePreviewButton")
			.addEventListener("click", () => (previewContainer.textContent = ""));
	},

	hideControlPanelButtonInit() {
		const appControlsWrapper = document.querySelector("#appControlsWrapper");
		const options = ["Show Control Panel", "Hide Control Panel"];
		let current = 0;
		document
			.querySelector("#hideControlPanelButton")
			.addEventListener("click", (e) => {
				appControlsWrapper.classList.toggle("hidden");
				current = 1 - current;
				e.target.textContent = options[current];
			});
	},

	createSessionAutoFillInit() {
		const createSessionAFButton = document.querySelector(
			"#createSessionAFButton",
		);

		createSessionAFButton.addEventListener("click", () => {
			const phTime = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Manila",
				dateStyle: "short",
			});

			// const now = Date.now();
			// const dateObject = new Date(now);
			// const currentDate = dateObject.toLocaleDateString();
			document.querySelector("[name=sessionName]").value = phTime;
		});
	},

	init() {
		document.querySelector("#currentSessionName").textContent =
			app.getCurrentSessionName();
		this.createSessionFormInit();
		this.renderSessionList();
		this.closePreviewButtonInit();
		this.hideControlPanelButtonInit();
		this.createSessionAutoFillInit();
	},
};
