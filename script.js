function currentDate() {
	return new Date(Date.now()).toLocaleDateString();
}

const preferenceModule = {
	init() {
		this.root = document.body;
		this.h1 = document.querySelector("h1");
		this.prevContainer = document.querySelector("#previewContainer");
		this.appControlsWrapper = document.querySelector("#appControlsWrapper");

		this.labels = document.querySelectorAll("label");
		this.inputs = document.querySelectorAll("input");
		this.textareas = document.querySelectorAll("textarea");
		this.headers = document.querySelectorAll("h5");
		this.buttons = document.querySelectorAll("button");
		this.selects = document.querySelectorAll("select");
		this.legends = document.querySelectorAll("legend");
		this.fieldsets = document.querySelectorAll("fieldset");
		this.footerEl = document.querySelectorAll("footer > *");
		this.links = document.querySelectorAll("a");
		this.li = document.querySelectorAll("li");

		document
			.querySelector("#preferencesForm")
			.addEventListener("submit", (e) => {
				e.preventDefault();
				const formData = new FormData(e.target);
				const backgroundColor = formData.get("backgroundColor").trim();
				const fontColor = formData.get("fontColor").trim();
				const buttonBgColor = formData.get("buttonColor").trim();

				preferenceModule.apply(backgroundColor, fontColor, buttonBgColor);
			});

		document
			.querySelector("#userPreferencesButton")
			.addEventListener("click", (e) => {
				document
					.querySelector("#preferencesWrapper")
					.classList.toggle("hidden");
			});
	},

	apply(backgroundColor, fontColor, buttonBgColor) {
		this.root.style.backgroundColor = backgroundColor;

		this.h1.style.color = fontColor;
		this.prevContainer.style.color = fontColor;
		this.appControlsWrapper.style.borderColor = fontColor;

		this.labels.forEach((label) => {
			label.style.color = fontColor;
		});

		this.inputs.forEach((input) => {
			input.style.borderColor = fontColor;
			input.style.backgroundColor = backgroundColor;
			input.style.color = fontColor;
		});

		this.textareas.forEach((textarea) => {
			textarea.style.borderColor = fontColor;
			textarea.style.backgroundColor = backgroundColor;
			textarea.style.color = fontColor;
		});

		this.headers.forEach((header) => {
			header.style.color = fontColor;
		});

		this.buttons.forEach((button) => {
			button.style.borderColor = fontColor;
			button.style.backgroundColor = buttonBgColor;
		});

		this.selects.forEach((select) => {
			select.style.backgroundColor = backgroundColor;
			select.style.color = fontColor;
			select.style.borderColor = fontColor;
		});

		this.legends.forEach((legend) => {
			legend.style.color = fontColor;
		});

		this.fieldsets.forEach((fieldset) => {
			fieldset.style.borderColor = fontColor;
		});

		this.footerEl.forEach((item) => {
			item.style.color = fontColor;
		});

		this.links.forEach((link) => {
			link.style.color = buttonBgColor;
		});

		this.li.forEach((item) => {
			item.style.color = fontColor;
		});
	},
};

const appModule = {
	sessionObject: {},
	currentSession: "",

	updateSessionObject() {
		this.sessionObject = { ...JSON.parse(localStorage.getItem("tempSO")) };
		localStorage.setItem("sessionObject", JSON.stringify(this.sessionObject));
		localStorage.removeItem("tempSO");
	},

	getSessionObject() {
		return { ...this.sessionObject };
	},

	setCurrentSession(session) {
		this.currentSession = session;
		document.querySelector("#currentSessionName").textContent = session;
		localStorage.setItem("lastSession", session);

		console.log(`Session Object: ${JSON.stringify(this.sessionObject)}`);
		console.log(`Current Session: ${this.currentSession}`);
	},

	getCurrentSessionName() {
		return this.currentSession;
	},

	init() {
		this.sessionObject =
			JSON.parse(localStorage.getItem("sessionObject")) || {};
		if (localStorage.getItem("lastSession")) {
			this.setCurrentSession(localStorage.getItem("lastSession"));
		} else {
			this.sessionObject = { ...this.sessionObject, [currentDate()]: [] };
			localStorage.setItem("sessionObject", JSON.stringify(this.sessionObject));
			localStorage.setItem("lastSession", currentDate());
			this.setCurrentSession(currentDate());
		}
	},
};

const sessionModule = {
	fetchSessionListFromLocalStorage() {
		this.sessionList =
			Object.keys(JSON.parse(localStorage.getItem("sessionObject"))) || [];
	},

	createSessionListItem(parentNode, session) {
		const li = document.createElement("li");
		const sessionButton = document.createElement("button");

		sessionButton.textContent = session;
		sessionButton.addEventListener("click", () => {
			appModule.setCurrentSession(session);
			historyModule.renderHistory();
		});

		li.appendChild(sessionButton);
		parentNode.appendChild(li);
	},

	renderSessionList() {
		const ul = document.querySelector("#sessionList");
		ul.replaceChildren();
		this.fetchSessionListFromLocalStorage();
		this.sessionList.forEach((session) => {
			this.createSessionListItem(ul, session);
		});
	},

	createSessionFormInit() {
		document
			.querySelector("#createSessionForm")
			.addEventListener("submit", (e) => {
				e.preventDefault();
				const formData = new FormData(e.target);
				const newSessionName = formData.get("sessionName").trim();

				if (newSessionName === "") {
					alert("Session name cannot be empty!");
					return;
				}

				this.fetchSessionListFromLocalStorage();

				if (this.sessionList.includes(newSessionName)) {
					alert("Session name already exists! Please choose a different name.");
					return;
				}

				const tempSO = { ...appModule.getSessionObject() };
				tempSO[newSessionName] = [];
				localStorage.setItem("tempSO", JSON.stringify(tempSO));
				appModule.updateSessionObject();

				this.renderSessionList();
				e.target.reset();
			});
	},

	init() {
		this.renderSessionList();
		this.createSessionFormInit();
	},
};

const historyModule = {
	editIndex: null,

	saveChangesHandler(data) {
		if (this.editIndex === null) {
			alert("No record selected for editing.");
			return;
		}
		const tempSO = { ...appModule.getSessionObject() };
		tempSO[appModule.getCurrentSessionName()][this.editIndex] = data;
		localStorage.setItem("tempSO", JSON.stringify(tempSO));
		appModule.updateSessionObject();
		this.editIndex = null;
		this.renderHistory();
	},

	cancelEditHandler() {
		this.editIndex = null;
	},

	createHistoryListItem(parentNode, data, previewHandler, editHandler) {
		const li = document.createElement("li");
		const div = document.createElement("div");
		div.classList.add("liWrapper");

		const previewButton = document.createElement("button");
		const editButton = document.createElement("button");

		previewButton.textContent = `${data.ticketNumber} | ${data.fullName}`;
		previewButton.addEventListener("click", previewHandler);

		editButton.textContent = "Edit";
		editButton.addEventListener("click", editHandler);

		div.appendChild(previewButton);
		div.appendChild(editButton);

		li.appendChild(div);

		parentNode.appendChild(li);
	},

	renderHistory() {
		const ul = document.querySelector("#sessionHistory");
		const exportAllButton = document.querySelector("#exportAll");
		exportAllButton.addEventListener("click", () =>
			exportSession(app.getCurrentSessionName()),
		);
		ul.replaceChildren();
		appModule
			.getSessionObject()
			[appModule.getCurrentSessionName()].forEach((data, index) => {
				previewHandler = () => previewRecord(data);

				editHandler = () => {
					if (getState("isModified")) {
						alert("Unable to edit record: Please save or cancel notes");
						return;
					}

					if (getState("isEditMode")) {
						alert("Already in edit mode. Please save or cancel current edits.");
						return;
					}

					this.editIndex = index;

					Object.entries(data).forEach(([key, value]) => {
						const el = document.querySelector(`[name="${key}"]`);
						el.value = value;
					});

					setMultipleState(data);
					setState("isEditMode", true);
				};

				this.createHistoryListItem(ul, data, previewHandler, editHandler);
			});
	},
};

class managedStateObject {
	constructor(state, subscribers = []) {
		this.state = state;
		this.subscribers = subscribers;
	}

	setState(value) {
		this.state = value;
		this.updateSubscribers();
	}

	getState() {
		return this.state;
	}

	subscribe(subscriber) {
		this.subscribers = [...this.subscribers, subscriber];
	}

	updateSubscribers() {
		this.subscribers.forEach((subscriber) => subscriber(this.getState()));
	}
}

const fieldStateManager = {
	DEFAULT_MANAGED_STATE: {
		isModified: false,
		isSaved: false,
		savedData: {},
		isEditMode: false,

		callerType: "Affected User",
		templateType: "Standard",

		possibleMajorIncident: "No",
		contactType: "Phone",

		resetType: "Non-AD",
		newHire: "No",
		mfaRegistered: "Yes",
		ssprOffered: "No",

		issueResolved: "No",
		userAgreedResolved: "No",
	},

	setState(name, value) {
		this.managedState[name].setState(value);
	},

	getState(name) {
		return this.managedState[name].getState();
	},

	subscribe(name, subscriber) {
		this.managedState[name].subscribe(subscriber);
	},

	resetState() {
		Object.entries(this.DEFAULT_MANAGED_STATE).forEach(([key, value]) =>
			this.setState(key, value),
		);
	},

	setMultipleState(referenceObject) {
		Object.keys(this.DEFAULT_MANAGED_STATE).forEach((key) => {
			this.setState(key, referenceObject[key]);
		});
	},

	init() {
		this.managedState = Object.fromEntries(
			Object.entries(this.DEFAULT_MANAGED_STATE).map(([key, value]) => {
				return [key, new managedStateObject(value)];
			}),
		);
	},
};

const setState = fieldStateManager.setState.bind(fieldStateManager);
const getState = fieldStateManager.getState.bind(fieldStateManager);
const subscribe = fieldStateManager.subscribe.bind(fieldStateManager);
const resetAllState = fieldStateManager.resetState.bind(fieldStateManager);
const setMultipleState =
	fieldStateManager.setMultipleState.bind(fieldStateManager);

const fieldUI = {
	isEditModeSubscribe() {
		subscribe("isEditMode", (value) => {
			const normalModeWrapper = document.querySelector("#normalModeWrapper");
			const editModeWrapper = document.querySelector("#editModeWrapper");

			if (value) {
				editModeWrapper.classList.remove("hidden");
				normalModeWrapper.classList.add("hidden");
			} else {
				editModeWrapper.classList.add("hidden");
				normalModeWrapper.classList.remove("hidden");
			}
		});
	},

	callerTypeSubscribe() {
		const switchButton = document.querySelector("[name=callerType] + button");

		subscribe("callerType", (value) => (switchButton.textContent = value));

		subscribe("callerType", (value) => {
			document.querySelector("[name=callerType]").value = value;
		});

		subscribe("callerType", (value) => {
			const onBehalfOfWrapper = document.querySelector("#onBehalfOfWrapper");

			value === "Affected User"
				? onBehalfOfWrapper.classList.add("hidden")
				: onBehalfOfWrapper.classList.remove("hidden");
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
			const standardTemplateWrapper = document.querySelector(
				".standardTemplateWrapper",
			);

			const pwrTemplateWrapper = document.querySelector(".pwrTemplateWrapper");

			if (value === "Standard") {
				standardTemplateWrapper.classList.remove("hidden");
				pwrTemplateWrapper.classList.add("hidden");
			} else {
				standardTemplateWrapper.classList.add("hidden");
				pwrTemplateWrapper.classList.remove("hidden");
			}
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

		subscribe("templateType", (value) => {
			const standardTemplateAutofillButtonsWrapper = document.querySelector(
				"#standardTemplateAutofillButtonsWrapper",
			);

			value === "Standard"
				? standardTemplateAutofillButtonsWrapper.classList.remove("hidden")
				: standardTemplateAutofillButtonsWrapper.classList.add("hidden");
		});

		subscribe("templateType", (value) => {
			const standardTemplateExclusiveOptGroup = document.querySelector(
				"#standardTemplateExclusiveOptGroup",
			);
			const pwrTemplateExclusiveOptGroup = document.querySelector(
				"#pwrTemplateExclusiveOptGroup",
			);

			if (value === "Standard") {
				standardTemplateExclusiveOptGroup.classList.remove("hidden");
				pwrTemplateExclusiveOptGroup.classList.add("hidden");
			} else {
				standardTemplateExclusiveOptGroup.classList.add("hidden");
				pwrTemplateExclusiveOptGroup.classList.remove("hidden");
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
			const ssprDetailsWrapper = document.querySelector("#ssprDetailsWrapper");

			value === "Non-AD"
				? ssprDetailsWrapper.classList.add("hidden")
				: ssprDetailsWrapper.classList.remove("hidden");
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
			const resolutionNotesWrapper = document.querySelector(
				"#resolutionNotesWrapper",
			);

			value === "No"
				? resolutionNotesWrapper.classList.add("hidden")
				: resolutionNotesWrapper.classList.remove("hidden");
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

	stateSubscribe() {
		this.isEditModeSubscribe();
		this.callerTypeSubscribe();
		this.templateTypeSubscribe();
		this.possibleMajorIncidentSubscribe();
		this.contactTypeSubscribe();
		this.resetTypeSubscribe();
		this.newHireSubscribe();
		this.mfaSubscribe();
		this.ssprSubscribe();
		this.issueResolvedSubscribe();
		this.userAgreedSubscribe();
	},

	fieldInit() {
		const field = document.querySelector("#documentationField");

		field.addEventListener("input", () => {
			setState("isModified", true);
		});
	},

	saveButtonInit() {
		const field = document.querySelector("#documentationField");

		field.addEventListener("submit", (e) => {
			e.preventDefault();

			if (getState("isModified") === false) {
				alert("No Changes Detected");
				return;
			}

			if (getState("isSaved") === false) {
				setState("isSaved", true);
			}

			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData.entries());
			console.log(data);
			setState("savedData", data);
			copyToClipboard(data);
			const tempSO = { ...appModule.getSessionObject() };
			tempSO[appModule.getCurrentSessionName()] = [
				...tempSO[appModule.getCurrentSessionName()],
				data,
			];
			localStorage.setItem("tempSO", JSON.stringify(tempSO));
			console.log(JSON.parse(localStorage.getItem("tempSO")));
			alert("Saved and Copied to Clipboard");
		});
	},

	newNoteButtonInit() {
		document.querySelector("#newNoteButton").addEventListener("click", () => {
			if (getState("isSaved") === false) {
				alert("Please save current notes");
				return;
			}
			appModule.updateSessionObject();
			historyModule.renderHistory();
			document.querySelector("#documentationField").reset();
			resetAllState();
			window.location.href = "#documentationField";
		});
	},

	newNoteUserRetainedButtonInit() {
		document
			.querySelector("#newNoteUserRetainedButton")
			.addEventListener("click", () => {
				if (getState("isSaved") === false) {
					alert("Please save current notes");
					return;
				}
				const data = { ...getState("savedData") };

				app.updateRecordAndSync(data);
				document.querySelector("#documentationField").reset();

				const fields = [
					"employeeId",
					"fullName",
					"email",
					"contactNumber",
					"timezone",
					"location",
					"OBemployeeId",
					"OBfullName",
					"OBemail",
					"OBcontactNumber",
					"OBtimezone",
					"OBlocation",
				];

				fields.forEach((key) => {
					console.log(key);
					document.querySelector(`[name="${key}"]`).value = data[key];
				});
				resetAllState();
				window.location.href = "#documentationField";
				appControls.renderHistoryList();
			});
	},

	cancelButtonInit() {
		document.querySelector("#cancelButton").addEventListener("click", () => {
			if (
				confirm(
					"Are you sure you want to cancel? All unsaved changes will be lost.",
				)
			) {
				document.querySelector("#documentationField").reset();
				resetAllState();
				window.location.href = "#documentationField";
			}
		});
	},

	saveChangesButtonInit() {
		const saveChangesButton = document.querySelector("#saveChangesButton");

		saveChangesButton.addEventListener("click", (e) => {
			if (confirm("Are you sure you want to save changes?")) {
				const form = document.querySelector("#documentationField");
				const formData = new FormData(form);
				const data = Object.fromEntries(formData.entries());
				historyModule.saveChangesHandler(data);
				copyToClipboard(data);
				alert("Changes saved and copied to clipboard");
				document.querySelector("#documentationField").reset();
				resetAllState();
				window.location.href = "#documentationField";
			}
		});
	},

	cancelEditButtonInit() {
		const cancelEditButton = document.querySelector("#cancelEditButton");

		cancelEditButton.addEventListener("click", (e) => {
			if (confirm("Are you sure you want to cancel editing?")) {
				document.querySelector("#documentationField").reset();
				resetAllState();
				window.location.href = "#documentationField";
				historyModule.cancelEditHandler();
			}
		});
	},

	standardTroubleshootingStepsAutofillInit() {
		const troubleShootingStepsField = document.querySelector(
			"[name=troubleshootingSteps]",
		);

		const incidentResolvedAFButton = document.querySelector(
			"#incidentResolvedAFButton",
		);
		const incidentRoutedAFButton = document.querySelector(
			"#incidentRoutedAFButton",
		);

		incidentResolvedAFButton.addEventListener("click", () => {
			troubleShootingStepsField.value += `
- Issue Resolved
- Provided ticket number to the user
- Confirmed with user ticket can now be set to resolved
- End Interaction`;
		});

		incidentRoutedAFButton.addEventListener("click", () => {
			troubleShootingStepsField.value += `
- Advised user ticket will be routed to the next resolver team
- Provided ticket number to the user
- User Acknowledged
- End Interaction`;
		});
	},

	init() {
		this.stateSubscribe();
		this.fieldInit();
		this.saveButtonInit();
		this.newNoteButtonInit();
		this.cancelButtonInit();
		this.newNoteUserRetainedButtonInit();
		this.saveChangesButtonInit();
		this.cancelEditButtonInit();
		this.standardTroubleshootingStepsAutofillInit();
	},
};

// UTILITIES //

async function copyToClipboard(data) {
	const text =
		data.templateType === "Standard"
			? standardTemplateFormatter(data)
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
		textContent +=
			record.templateType === "Standard"
				? standardTemplateFormatter(record)
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

function previewRecord(data) {
	const text =
		data.templateType === "Standard"
			? standardTemplateFormatter(data)
			: pwrTypeFormatter(data);
	console.log(text);
	document.querySelector("#previewContainer").textContent = text;
}

function standardTemplateFormatter(data) {
	let onBehalfDetails = "";
	if (data.callerType === "On Behalf") {
		onBehalfDetails = `
USER
Name: ${data.OBfullName}
Email Address: ${data.OBemail}
Employee ID: ${data.OBemployeeId}
Contact Number: ${data.OBcontactNumber}
Availability Hours: ${data.OBavailability} ${data.OBtimezone}
Location: ${data.OBlocation}
`;
	}

	let resolutionNotes = "";
	if (data.issueResolved === "Yes") {
		resolutionNotes = `
RESOLUTION NOTES: ${data.resolutionNotes}`;
	}

	const documentation = `
CALLER
Full Name: ${data.fullName}
Email Address: ${data.email}
Employee ID: ${data.employeeId}
Contact Number: ${data.contactNumber}
Availability Hours: ${data.availability}${data.timezone}
Location: ${data.location}
${onBehalfDetails}
Existing Ticket? ${data.existingTicket}
Possible Major Incident? ${data.possibleMajorIncident}
Contact Type: ${data.contactType}

Device Name: ${data.machineName}
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
	let onBehalfDetails = "";
	if (data.callerType === "On Behalf") {
		onBehalfDetails = `
USER
Name: ${data.OBfullName}
Email Address: ${data.OBemail}
Employee ID: ${data.OBemployeeId}
Contact Number: ${data.OBcontactNumber}
Availability Hours: ${data.OBavailability} ${data.OBtimezone}
Location: ${data.OBlocation}
`;
	}

	let ssprDetails = "";
	if (data.resetType === "Active Directory") {
		ssprDetails = `
New Hire: ${data.newHire}
MFA Registered? ${data.mfaRegistered}
SSPR Offered? ${data.ssprOffered}
SSPR Outcome: ${data.ssprOutcome}`;
	}

	let resolutionNotes = "";
	if (data.issueResolved === "Yes") {
		resolutionNotes = `
RESOLUTION NOTES:
${data.resolutionNotes}`;
	}

	const documentation = `
CALLER
Name: ${data.fullName}
Email Address: ${data.email}
Employee ID: ${data.employeeId}
Contact Number: ${data.contactNumber}
Availability Hours: ${data.availability} ${data.timezone}
Location: ${data.location}
Existing Ticket? ${data.existingTicket}
${onBehalfDetails}${ssprDetails}

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

function appInit() {
	// window.addEventListener("beforeunload", (e) => {
	// 	e.preventDefault();
	// });
	appModule.init();
	sessionModule.init();
	historyModule.renderHistory();
	fieldStateManager.init();
	preferenceModule.init();
	resetAllState(); // prevent browser cache from desyncing from state

	fieldUI.init();
}

function fillTestData() {
	const testData = {
		employeeId: "70123456",
		fullName: "John Doe",
		email: "john.doe@nationalgrid.com",
		contactNumber: "555-123-4567",
		availability: "9am-4pm",
		location: "Waltham Data Drive",

		OBemployeeId: "70654321",
		OBfullName: "Jane Smith",
		OBemail: "jane.smith@nationalgrid.com",
		OBcontactNumber: "555-987-6543",
		OBavailability: "9am-4pm",
		OBlocation: "Syracue Erie Blvd",

		existingTicket: "No",
		machineName: "US-L-A1234",

		issueDescription: `- User is trying to access myhub
- Error message "Invalid Login"
- User was able to access myhub before
`,

		troubleshootingSteps: `- Remote user via LMI.
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

	setState("isModified", true);
}

document.querySelector("#fillTestData").addEventListener("click", fillTestData);

appInit();
