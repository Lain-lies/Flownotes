const storageState = {
	record: null,
	currentSessionName: "",
	sessionList: [],
	indexBeingEdited: 0,

	setRecord: function (record) {
		this.record = record;
	},

	setCurrentSessionName: function (sessionName) {
		this.currentSessionName = sessionName;
	},

	setSessionList: function (sessionList) {
		this.sessionList = [...sessionList];
	},

	getRecord: function () {
		return this.record;
	},

	getCurrentSessionName: function () {
		return this.currentSessionName;
	},

	getSessionList: function () {
		return [...this.sessionList];
	},

	getSessionListFromLocalStorage: function () {
		const sessionList = Object.entries(localStorage)
			.map(([key]) => key)
			.filter((key) => key !== "lastSessionName");
		console.log(sessionList);

		return sessionList;
	},

	// HELPERS //
	resumeLastSession: function () {
		const lastSessionName = localStorage.getItem("lastSessionName");

		if (lastSessionName === null || lastSessionName === undefined) {
			console.log("No last session");
			return false;
		}

		const sessionList = this.getSessionListFromLocalStorage(lastSessionName);
		this.setSessionList(sessionList);
		this.loadSession(lastSessionName);
		return true;
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

		console.log(`
Current Session: ${this.getCurrentSessionName()}
Current Record: ${this.getRecord()}
Session List: ${this.getSessionList()}`);
	},

	syncWithLocalStorage: function (newRecord) {
		this.setRecord([...this.getRecord(), newRecord]);

		localStorage.setItem(
			this.getCurrentSessionName(),
			JSON.stringify(this.getRecord()),
		);

		alert("Local Storage Synced!");

		return true;
	},

	updateSessionList: function () {
		const newSessionList = this.getSessionListFromLocalStorage();
		this.setSessionList(newSessionList);
	},

	saveLastSession: function () {
		console.log(`savelastsession: ${this.getCurrentSessionName()} `);
		localStorage.setItem("lastSessionName", this.getCurrentSessionName());
	},

	getDataInRecord(index) {
		const data = this.getRecord()[index];
		return data;
	},

	updateDataInRecord(index, newData) {
		this.getRecord()[index] = newData;
	},

	// INIT //

	init: function () {
		const now = Date.now();
		const dateObject = new Date(now);
		const currentDate = dateObject.toLocaleDateString();
		localStorage.setItem(currentDate, JSON.stringify([]));
		this.setSessionList([currentDate]);
		this.loadSession(currentDate);
		this.saveLastSession();
	},
};

class managedStateObject {
	constructor(state, subscribers = []) {
		this.state = state;
		this.subscribers = subscribers;
	}
	setState(value) {
		this.state = value;
		console.log(this.state);
	}

	getState(value) {
		return this.state;
	}

	subscribe(subscriber) {
		this.subscribers = [...this.subscribers, subscriber];
	}
}

const fieldStateManager = {
	managedState: {
		isModified: new managedStateObject(false),
		isSaved: new managedStateObject(false),
		savedData: new managedStateObject({}),
		isEditMode: new managedStateObject(false),

		callerType: new managedStateObject("Affected User"),
		templateType: new managedStateObject("Standard"),

		possibleMajorIncident: new managedStateObject("No"),
		contactType: new managedStateObject("Phone"),

		resetType: new managedStateObject("Non-AD"),
		newHire: new managedStateObject("No"),
		mfaRegistered: new managedStateObject("Yes"),
		ssprOffered: new managedStateObject("No"),

		issueResolved: new managedStateObject("No"),
		userAgreedResolved: new managedStateObject("No"),
	},

	setState(name, value) {
		this.managedState[name].setState(value);
		this.updateSubscribers(name);
	},

	getState(name) {
		return this.managedState[name].getState();
	},

	subscribe(name, subscriber) {
		this.managedState[name].subscribe(subscriber);
	},

	updateSubscribers(name) {
		const state = this.managedState[name];
		state.subscribers.forEach((subscriber) => subscriber(state.getState()));
	},
};

const setState = fieldStateManager.setState.bind(fieldStateManager);
const getState = fieldStateManager.getState.bind(fieldStateManager);
const subscribe = fieldStateManager.subscribe.bind(fieldStateManager);

const fieldUI = {
	callerTypeSubscribe() {
		const switchButton = document.querySelector("[name=callerType] + button");

		subscribe("callerType", (value) => (switchButton.textContent = value));

		subscribe("callerType", (value) => {
			document.querySelector("[name=callerType]").value = value;
		});

		subscribe("callerType", (value) => {
			document.querySelector("#onBehalfOfWrapper").classList.toggle("hidden");
		});

		switchButton.addEventListener("click", () => {
			getState("callerType") === "Affected User"
				? setState("callerType", "On Behalf")
				: setState("callerType", "Affected User");
		});
	},

	templateTypeSubscribe() {
		const switchButton = document.querySelector("[name=templateType] + button");

		subscribe("templateType", (value) => (switchButton.textContent = value));

		subscribe("templateType", (value) => {
			document.querySelector("[name=templateType]").value = value;
		});

		subscribe("templateType", (value) => {
			document
				.querySelector(".standardTemplateWrapper")
				.classList.toggle("hidden");

			document.querySelector(".pwrTemplateWrapper").classList.toggle("hidden");
		});

		subscribe("templateType", (value) => {
			const textOne = document.querySelector("#templateDependentText-1");
			const textTwo = document.querySelector("#templateDependentText-2");

			if (value === "Standard") {
				textOne.textContent = "Issue Resolved?:";
				textTwo.textContent = "User agreed to set ticket to 'Resolved'?:";
			} else {
				textOne.textContent = "Ticket Fulfilled?:";
				textTwo.textContent = "User agreed to set ticket to 'Fulfilled'?:";
			}
		});

		switchButton.addEventListener("click", () => {
			getState("templateType") === "Standard"
				? setState("templateType", "Password Reset")
				: setState("templateType", "Standard");
		});
	},

	possibleMajorIncidentSubscribe() {
		const switchButton = document.querySelector(
			"[name=possibleMajorIncident] + button",
		);
		subscribe(
			"possibleMajorIncident",
			(value) => (switchButton.textContent = value),
		);
		subscribe("possibleMajorIncident", (value) => {
			document.querySelector("[name=possibleMajorIncident]").value = value;
		});
		switchButton.addEventListener("click", () => {
			getState("possibleMajorIncident") === "No"
				? setState("possibleMajorIncident", "Yes")
				: setState("possibleMajorIncident", "No");
		});
	},

	contactTypeSubscribe() {
		const switchButton = document.querySelector("[name=contactType] + button");
		subscribe("contactType", (value) => (switchButton.textContent = value));
		subscribe("contactType", (value) => {
			document.querySelector("[name=contactType]").value = value;
		});
		switchButton.addEventListener("click", () => {
			getState("contactType") === "Phone"
				? setState("contactType", "Chat")
				: setState("contactType", "Phone");
		});
	},

	resetTypeSubscribe() {
		const switchButton = document.querySelector("[name=resetType] + button");

		subscribe("resetType", (value) => (switchButton.textContent = value));

		subscribe("resetType", (value) => {
			document.querySelector("[name=resetType]").value = value;
		});

		subscribe("resetType", (value) => {
			document.querySelector("#ssprDetailsWrapper").classList.toggle("hidden");
		});

		switchButton.addEventListener("click", () => {
			getState("resetType") === "Non-AD"
				? setState("resetType", "Active Directory")
				: setState("resetType", "Non-AD");
		});
	},

	newHireSubscribe() {
		const switchButton = document.querySelector("[name=newHire] + button");
		subscribe("newHire", (value) => (switchButton.textContent = value));
		subscribe("newHire", (value) => {
			document.querySelector("[name=newHire]").value = value;
		});
		switchButton.addEventListener("click", () => {
			getState("newHire") === "No"
				? setState("newHire", "Yes")
				: setState("newHire", "No");
		});
	},

	mfaSubscribe() {
		const switchButton = document.querySelector(
			"[name=mfaRegistered] + button",
		);
		subscribe("mfaRegistered", (value) => (switchButton.textContent = value));
		subscribe("mfaRegistered", (value) => {
			document.querySelector("[name=mfaRegistered]").value = value;
		});
		switchButton.addEventListener("click", () => {
			getState("mfaRegistered") === "Yes"
				? setState("mfaRegistered", "No")
				: setState("mfaRegistered", "Yes");
		});
	},

	ssprSubscribe() {
		const switchButton = document.querySelector("[name=ssprOffered] + button");

		subscribe("ssprOffered", (value) => (switchButton.textContent = value));

		subscribe("ssprOffered", (value) => {
			document.querySelector("[name=ssprOffered]").value = value;
		});

		subscribe("ssprOffered", (value) => {
			document.querySelector("#noOptGroup").classList.toggle("hidden");
			document.querySelector("#yesOptGroup").classList.toggle("hidden");
		});

		switchButton.addEventListener("click", () => {
			getState("ssprOffered") === "No"
				? setState("ssprOffered", "Yes")
				: setState("ssprOffered", "No");
		});
	},

	issueResolvedSubscribe() {
		const switchButton = document.querySelector(
			"[name=issueResolved] + button",
		);

		subscribe("issueResolved", (value) => (switchButton.textContent = value));

		subscribe("issueResolved", (value) => {
			document.querySelector("[name=issueResolved]").value = value;
		});

		subscribe("issueResolved", (value) => {
			document
				.querySelector("#resolutionNotesWrapper")
				.classList.toggle("hidden");
		});

		switchButton.addEventListener("click", () => {
			getState("issueResolved") === "No"
				? setState("issueResolved", "Yes")
				: setState("issueResolved", "No");
		});
	},

	userAgreedSubscribe() {
		const switchButton = document.querySelector(
			"[name=userAgreedResolved] + button",
		);
		subscribe(
			"userAgreedResolved",
			(value) => (switchButton.textContent = value),
		);
		subscribe("userAgreedResolved", (value) => {
			document.querySelector("[name=userAgreedResolved]").value = value;
		});
		switchButton.addEventListener("click", () => {
			getState("userAgreedResolved") === "No"
				? setState("userAgreedResolved", "Yes")
				: setState("userAgreedResolved", "No");
		});
	},
	// INC
	stateSubscribe() {
		this.possibleMajorIncidentSubscribe();
		this.contactTypeSubscribe();
		this.templateTypeSubscribe();
		this.callerTypeSubscribe();
		this.resetTypeSubscribe();
		this.newHireSubscribe();
		this.mfaSubscribe();
		this.ssprSubscribe();
		this.issueResolvedSubscribe();
		this.userAgreedSubscribe();
	},

	init() {
		this.stateSubscribe();
	},
};

const controlPanelDisplayState = {
	controlPanelElement: document.querySelector(".controlPanel"),
	controlPanelCurrentSessionNameElement: document.querySelector(
		"#currentSessionName",
	),
	controlPanelSessionListElement: document.querySelector("#sessionList"),
	controlPanelSessionHistoryElement: document.querySelector("#sessionHistory"),

	renderCurrentSessionName: function (value) {
		this.controlPanelCurrentSessionNameElement.textContent = value;
	},

	renderSessionList: function () {
		this.controlPanelSessionListElement.replaceChildren();

		const sessionList = storageState.getSessionList();
		sessionList.forEach((session) => {
			const li = document.createElement("li");
			const button = document.createElement("button");
			button.textContent = session;
			button.addEventListener("click", () => {
				if (fieldState.isAllowedtoSwitchSession()) {
					storageState.loadSession(session);
					storageState.saveLastSession();
					this.renderCurrentSessionName(storageState.getCurrentSessionName());
					this.renderSessionHistory(storageState.getCurrentSessionName());
					this.renderSessionList();
					return;
				}
				alert("Please SAVE current notes before switching or CANCEL");
			});
			li.appendChild(button);
			this.controlPanelSessionListElement.appendChild(li);
		});
	},

	renderSessionHistory: function (sessionName) {
		this.controlPanelSessionHistoryElement.replaceChildren();

		const exportAllButton = document.createElement("button");
		exportAllButton.textContent = "Export ALL";
		exportAllButton.addEventListener("click", () => exportSession(sessionName));

		this.controlPanelSessionHistoryElement.appendChild(exportAllButton);

		const sessionHistory = JSON.parse(localStorage.getItem(sessionName));

		sessionHistory.forEach((record, index) => {
			const wrapper = document.createElement("div");
			const previewButton = document.createElement("button");
			const editButton = document.createElement("button");
			const doctype = record.isIncident ? "Standard" : "Password Reset";

			previewButton.textContent = `${record.fullName} | ${doctype}`;
			previewButton.addEventListener("click", () => {
				exportIndividualRecord(record);
			});

			editButton.textContent = "EDIT";
			editButton.addEventListener("click", () => {
				fieldUI.util.injectValuesToField(storageState.getDataInRecord(index));
			});

			wrapper.appendChild(previewButton);
			wrapper.appendChild(editButton);

			this.controlPanelSessionHistoryElement.appendChild(wrapper);
		});
	},

	init: function () {
		const hideControlPanelButton = document.querySelector(
			"#hide-control-panel",
		);

		hideControlPanelButton.addEventListener("click", () => {
			if (this.controlPanelElement.style.display === "none") {
				this.controlPanelElement.style.display = "flex";
				hideControlPanelButton.textContent = "HIDE CONTROL PANEL";
			} else {
				this.controlPanelElement.style.display = "none";
				hideControlPanelButton.textContent = "SHOW CONTROL PANEL";
			}
		});

		this.renderCurrentSessionName(storageState.getCurrentSessionName());
		this.renderSessionList();
	},
};

// UTILITIES //

async function copyToClipboard(data) {
	const text = data.isIncident
		? incidentTypeFormatter(data)
		: pwrTypeFormatter(data);
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error("Failed to copy: ", err);
	}
}

function exportSession(sessionName) {
	const records = JSON.parse(localStorage.getItem(sessionName)) || [];

	let textContent = "";

	records.forEach((record, index) => {
		textContent += record.isIncident
			? incidentTypeFormatter(record, record.isCaller)
			: pwrTypeFormatter(record);
		textContent += `
=============================================================
`;
	});

	const blob = new Blob([textContent], {
		type: "text/plain",
	});

	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `${sessionName}.txt`;

	a.click();

	URL.revokeObjectURL(url);
}

function exportIndividualRecord(data) {
	const textContent = data.isIncident
		? incidentTypeFormatter(data, data.isCaller)
		: pwrTypeFormatter(data);

	const blob = new Blob([textContent], {
		type: "text/plain",
	});

	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `${data.fullName}.txt`;

	a.click();

	URL.revokeObjectURL(url);
}

function initCreateNewSessionForm() {
	const createSessionForm = document.querySelector("#createSessionForm");
	createSessionForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const newSessionName = formData.get("sessionName").trim();
		console.log(newSessionName);
		if (newSessionName === "") {
			alert("Session name cannot be empty!");
			return;
		}

		if (localStorage.getItem(newSessionName)) {
			alert("Session name already exists! Please choose a different name.");
			return;
		}

		localStorage.setItem(newSessionName, JSON.stringify([]));
		storageState.updateSessionList();
		controlPanelDisplayState.renderAllControlPanelList();
	});
}

function incidentTypeFormatter(data) {
	console.log(data);
	let onBehalfDetails = "";
	if (data.isCaller === false) {
		onBehalfDetails = `
USER
Employee ID: ${data.OBemployeeId}
Name: ${data.OBfullName}
Email Address: ${data.OBemail}
Contact Number: ${data.OBcontactNumber}
Availability Hours: ${data.OBbestTimeToReach} ${data.OBtimezone}
Location: ${data.OBlocation}
`;
	}

	let resolutionNotes = "";
	if (data.isResolved) {
		resolutionNotes = `
RESOLUTION NOTES:
${data.resolutionNotes}`;
	}

	const documentation = `
CALLER
Employee ID: ${data.employeeId}
Name: ${data.fullName}
Email Address: ${data.email}
Contact Number: ${data.contactNumber}
Availability Hours: ${data.bestTimeToReach}${data.timezone}
Location: ${data.location}
${onBehalfDetails}
Existing Ticket? ${data.existingTicket}
Possible Major Incident? ${data.possibleMajorIncident}
Contact Type: ${data.contactType}

Machine Name: ${data.machineName}
Nexthink Checklist: ${data.nexthinkChecklist}

ISSUE DESCRIPTION:
${data.issueDescription}

TROUBLESHOOTING STEPS:
${data.troubleshootingSteps}
${resolutionNotes}

KB Article: ${data.kbArticle}
Issue Resolved? ${data.issueResolved}
Next Action(s): ${data.nextActions}
User agreed to set data to Resolved? ${data.userAgreedResolved}`;

	return documentation;
}

function pwrTypeFormatter(data) {
	let adDetails = "";
	if (data.isAD === true) {
		adDetails = `
New Hire: ${data.newHire}
MFA Registered? ${data.mfaRegistered}
SSPR Offered? ${data.ssprOffered}
SSPR Outcome: ${data.ssprOutcome}`;
	}

	let resolutionNotes = "";
	if (data.isResolved) {
		resolutionNotes = `
RESOLUTION NOTES:
${data.resolutionNotes}`;
	}

	const documentation = `
Employee ID: ${data.employeeId}
Name: ${data.fullName}
Email Address: ${data.email}
Contact Number: ${data.contactNumber}
Availability Hours: ${data.bestTimeToReach} ${data.timezone}
Location: ${data.location}
Existing Ticket? ${data.existingTicket}
${adDetails}

ISSUE DESCRIPTION:
${data.issueDescription}

TROUBLESHOOTING STEPS:
${data.troubleshootingSteps}
${resolutionNotes}

KB Article: ${data.kbArticle}
Ticket Fulfilled: ${data.issueResolved}
Next Action(s): ${data.nextActions}
User agreed to fulfill ticket? ${data.userAgreedResolved}`;

	return documentation;
}

function init() {
	window.addEventListener("beforeunload", (e) => {
		e.preventDefault();
	});

	const isFreshStart = !storageState.resumeLastSession();
	console.log(`isFreshStart: ${isFreshStart}`);
	if (isFreshStart) storageState.init();

	fieldUI.init();
	controlPanelDisplayState.init();
	initCreateNewSessionForm();
}

function fillTestData() {
	const testData = {
		employeeId: "7012345",
		fullName: "John Doe",
		email: "john.doe@nationalgrid.com",
		contactNumber: "555-123-4567",
		availability: "9am-4pm",
		location: "Waltham Data Drive",

		OBemployeeId: "7054321",
		OBfullName: "Jane Smith",
		OBemail: "jane.smith@nationalgrid.com",
		OBcontactNumber: "555-987-6543",
		OBavailability: "9am-4pm",
		OBlocation: "Syracue Erie Blvd",

		existingTicket: "No",
		machineName: "US-L-A1234",
		nexthinkChecklist: "N/A",
		issueDescription: `
- User is trying to access myhub
- Error message "Invalid Login"
- User was able to access myhub before
`,

		troubleshootingSteps: `
- Remote user via LMI.
- Cleared Cache and Cookies
- Removed Favorites folder/bookmark
- Restart Browser
- Accessed MyHub via Gridhome
- Access Successful
- Issue Resolved
- Provided user ticket number
- Confirmed with user ticket can now be set to resolved
- End call`,

		kbArticle: "KB0000111",
	};

	Object.entries(testData).forEach(([name, value]) => {
		const field = document.querySelector(`[name="${name}"]`);

		if (field) {
			field.value = value;

			const switchButton = field.parentElement?.querySelector(".switch-click");

			if (switchButton) {
				switchButton.textContent = value;
			}
		}
	});

	if (typeof fieldState !== "undefined") {
		fieldState.setFieldModified(true);
	}
}

document.querySelector("#fillTestData").addEventListener("click", fillTestData);

init();
