function currentDate() {
	return new Date(Date.now()).toLocaleDateString();
}

const preferenceModule = {
	init() {
		document
			.querySelector("#preferencesForm")
			.addEventListener("submit", (e) => {
				e.preventDefault();
				const formData = new FormData(e.target);
				const backgroundColor = formData.get("backgroundColor").trim();
				const fontColor = formData.get("fontColor").trim();
				const buttonColor = formData.get("buttonColor").trim();

				localStorage.setItem(
					"userPreferences",
					JSON.stringify({ backgroundColor, fontColor, buttonColor }),
				);

				preferenceModule.apply(backgroundColor, fontColor, buttonColor);
			});

		document
			.querySelector("#userPreferencesButton")
			.addEventListener("click", (e) => {
				document
					.querySelector("#preferencesWrapper")
					.classList.toggle("hidden");
			});

		if (localStorage.getItem("userPreferences")) {
			const userPreferences = JSON.parse(
				localStorage.getItem("userPreferences"),
			);

			preferenceModule.apply(...Object.values(userPreferences));
		} else {
			userPreferences = {
				backgroundColor: "#f0f0f0",
				fontColor: "#000000",
				buttonColor: "#007bff",
			};
			localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
			preferenceModule.apply(
				userPreferences.backgroundColor,
				userPreferences.fontColor,
				userPreferences.buttonColor,
			);
		}
	},

	apply(backgroundColor, fontColor, buttonColor) {
		const root = document.body;
		const h1 = document.querySelector("h1");
		const prevContainer = document.querySelector("#previewContainer");
		const appControlsWrapper = document.querySelector("#appControlsWrapper");

		const labels = document.querySelectorAll("label");
		const inputs = document.querySelectorAll("input");
		const textareas = document.querySelectorAll("textarea");
		const headers = document.querySelectorAll("h5");
		const buttons = document.querySelectorAll("button");
		const selects = document.querySelectorAll("select");
		const legends = document.querySelectorAll("legend");
		const fieldsets = document.querySelectorAll("fieldset");
		const footerEl = document.querySelectorAll("footer > *");
		const links = document.querySelectorAll("a");
		const li = document.querySelectorAll("li");
		const docForm = document.querySelectorAll(".docForm");

		root.style.backgroundColor = backgroundColor;

		h1.style.color = fontColor;
		prevContainer.style.color = fontColor;
		appControlsWrapper.style.borderColor = fontColor;

		labels.forEach((label) => {
			label.style.color = fontColor;
		});

		inputs.forEach((input) => {
			input.style.border = `1px solid ${fontColor}`;
			input.style.backgroundColor = backgroundColor;
			input.style.color = fontColor;
		});

		textareas.forEach((textarea) => {
			textarea.style.border = `1px solid ${fontColor}`;
			textarea.style.backgroundColor = backgroundColor;
			textarea.style.color = fontColor;
		});

		headers.forEach((header) => {
			header.style.color = fontColor;
		});

		buttons.forEach((button) => {
			button.style.border = `1px solid ${fontColor}`;
			button.style.color = fontColor;
			button.style.backgroundColor = buttonColor;
		});

		selects.forEach((select) => {
			select.style.backgroundColor = backgroundColor;
			select.style.color = fontColor;
			select.style.border = `1px solid ${fontColor}`;
		});

		legends.forEach((legend) => {
			legend.style.color = fontColor;
		});

		fieldsets.forEach((fieldset) => {
			fieldset.style.border = `1px solid ${fontColor}`;
		});

		footerEl.forEach((item) => {
			item.style.color = fontColor;
		});

		links.forEach((link) => {
			link.style.color = fontColor;
		});

		li.forEach((item) => {
			item.style.color = fontColor;
		});

		docForm.forEach((item) => (item.style.border = `1px solid ${fontColor}`));
	},

	reapply() {
		const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
		console.log(userPreferences);
		preferenceModule.apply(...Object.values(userPreferences));
	},
};

const appModule = {
	sessionObject: {},
	currentSession: "",

	updateSessionObject(newSessionObject) {
		this.sessionObject = newSessionObject;
		console.log(JSON.stringify(this.sessionObject));
		localStorage.setItem("sessionObject", JSON.stringify(this.sessionObject));
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
		if (localStorage.getItem("lastSession")) {
			this.sessionObject =
				JSON.parse(localStorage.getItem("sessionObject")) || {};
			this.setCurrentSession(localStorage.getItem("lastSession"));
		} else {
			this.sessionObject = { [currentDate()]: [] };
			localStorage.setItem("sessionObject", JSON.stringify(this.sessionObject));
			localStorage.setItem("lastSession", currentDate());
			this.setCurrentSession(currentDate());
		}
	},
};

const sessionModule = {
	fetchSessionListFromLocalStorage() {
		this.sessionList =
			Object.keys(JSON.parse(localStorage.getItem("sessionObject"))) || {};
	},

	createSessionListItem(parentNode, session) {
		const li = document.createElement("li");
		const sessionButton = document.createElement("button");

		sessionButton.textContent = session;
		sessionButton.addEventListener("click", () => {
			if (historyModule.getIsActivelyEditing()) {
				alert("Editor is opened please close or save before switching session");
				return;
			}
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

				appModule.updateSessionObject({
					...appModule.getSessionObject(),
					[`${newSessionName}`]: [],
				});

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
	isActivelyEditing: false,

	setIsActivelyEditing(value) {
		this.isActivelyEditing = value;
	},

	getIsActivelyEditing(value) {
		return this.isActivelyEditing;
	},

	reset() {
		this.editIndex = null;
		this.isActivelyEditing = false;
	},

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
			exportSession([
				...appModule.getSessionObject()[appModule.getCurrentSessionName()],
			]),
		);
		ul.replaceChildren();
		appModule
			.getSessionObject()
			[appModule.getCurrentSessionName()].forEach((data, index) => {
				previewHandler = () => previewRecord(data);

				editHandler = () => {
					if (this.getIsActivelyEditing()) {
						alert("Editor is active please close or save current work");
						return;
					}
					this.editIndex = index;
					this.isActivelyEditing = true;
					createEditorInstance(data);
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

// UTILITIES //

async function copyToClipboard(data) {
	const text =
		data.templateType === "Standard"
			? standardTemplateFormatter(data)
			: pwrTypeFormatter(data);

	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error("Failed to copy: ", err);
		return false;
	}
}

function exportSession(records) {
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
	a.download = `${appModule.getCurrentSessionName()}.txt`;

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
Email Address: ${data.OBemailProvided} | ${data.OBemail}
Employee ID: ${data.OBemployeeIdProvided} | ${data.OBemployeeId}
Contact Number: ${data.OBcontactNumber}
Availability Hours: ${data.OBavailability} ${data.OBtimezone}
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
Email Address: ${data.emailProvided} | ${data.email}
Employee ID: ${data.employeeIdProvided} | ${data.employeeId}
Contact Number: ${data.contactNumber}
Availability Hours: ${data.availability}${data.timezone}
Location: ${data.location}
${onBehalfDetails}
Existing Ticket? ${data.existingTicket}
Possible Major Incident? ${data.possibleMajorIncident}
Contact Type: ${data.contactType}

Device Name: ${data.deviceName}
Nexthink Checklist: ${data.nexthinkCheckList}

ISSUE DESCRIPTION:
${data.issueDescription}

TROUBLESHOOTING STEPS:
${data.troubleshootingSteps}
${resolutionNotes}
KB Article: ${data.kbArticle}
Issue Resolved? ${data.issueResolved}
Next Action(s): ${data.nextAction}
User agreed to set data to Resolved? ${data.userAgreedResolved}`;

	return documentation;
}

function pwrTypeFormatter(data) {
	let onBehalfDetails = "";
	if (data.callerType === "On Behalf") {
		onBehalfDetails = `
USER
Name: ${data.OBfullName}
Email Address: ${data.OBemailProvided} | ${data.OBemail}
Employee ID: ${data.OBemployeeIdProvided} | ${data.OBemployeeId}
Contact Number: ${data.OBcontactNumber}
Availability Hours: ${data.OBavailability} ${data.OBtimezone}
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
Email Address: ${data.emailProvided} | ${data.email}
Employee ID: ${data.employeeIdProvided} | ${data.employeeId}
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
Ticket Fulfilled: ${data.ticketFulfilled}
Next Action(s): ${data.nextActions}
User agreed to fulfill ticket? ${data.userAgreedFulfilled}`;

	return documentation;
}

class stateManager {
	constructor() {
		this.DEFAULT_MANAGED_STATE = {
			isModified: false,
			isSaved: false,
			isEditMode: false,

			callerType: "Affected User",
			templateType: "Standard",

			emailProvided: "Provided",
			OBemailProvided: "Provided",

			employeeIdProvided: "Provided",
			OBemployeeIdProvided: "Provided",

			possibleMajorIncident: "No",
			contactType: "Phone",

			resetType: "Non-AD",
			newHire: "No",
			mfaRegistered: "Yes",
			ssprOffered: "No",

			nextAction: "",
			issueResolved: "No",
			ticketFulfilled: "No",
			userAgreedResolved: "No",
			userAgreedFulfilled: "No",
		};

		this.managedState = Object.fromEntries(
			Object.entries(this.DEFAULT_MANAGED_STATE).map(([key, value]) => {
				return [key, new managedStateObject(value)];
			}),
		);
	}

	setState(name, value) {
		this.managedState[name].setState(value);
	}

	getState(name) {
		return this.managedState[name].getState();
	}

	subscribe(name, subscriber) {
		this.managedState[name].subscribe(subscriber);
	}

	resetState() {
		Object.entries(this.DEFAULT_MANAGED_STATE).forEach(([key, value]) =>
			this.setState(key, value),
		);
	}

	getStateObject() {
		return Object.fromEntries(
			Object.entries(this.DEFAULT_MANAGED_STATE).map(([key]) => {
				return [key, this.getState(`${key}`)];
			}),
		);
	}

	setMultipleState(referenceObject) {
		Object.keys(this.DEFAULT_MANAGED_STATE).forEach((key) => {
			this.setState(key, referenceObject[key]);
		});
	}

	setMultipleSelectedState(referenceObject) {
		Object.entries(referenceObject).forEach(([key, value]) => {
			this.setState(key, value);
		});
	}
}

const form = {
	generate(instance = 1, editMode = false) {
		const form = document.createElement("form");

		form.id = `form${instance}`;
		form.classList.add("docForm");

		// Instance ID
		const instanceID = document.createElement("p");
		instanceID.textContent = instance;
		form.appendChild(instanceID);

		//Form State

		const formState = document.createElement("p");
		editMode
			? (formState.textContent = "FS=EDIT")
			: (formState.textContent = "FS=NORMAL");
		form.appendChild(formState);

		//Caller and Template Type Fieldset
		const callerFieldset = document.createElement("fieldset");
		const callerLegend = document.createElement("legend");
		callerLegend.textContent = "Caller and Template Type";

		callerFieldset.appendChild(callerLegend);

		// Caller Type
		callerFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Caller Type:" }),
					this.generateElement("button", {
						type: "button",
						textContent: "Affected User",
						id: `callerTypeButton${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		// Template Type
		callerFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Template Type:" }),
					this.generateElement("button", {
						type: "button",
						textContent: "Standard",
						id: `templateTypeButton${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		//User Entitlement Fieldset
		const userEntitlementFieldSet = document.createElement("fieldset");
		const userEntitlementLegend = document.createElement("legend");
		userEntitlementLegend.textContent = "User Entitlement";

		userEntitlementFieldSet.appendChild(userEntitlementLegend);

		//Full Name Field
		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Full Name:" }),
					this.generateElement("input", {
						type: "text",
						name: `fullName`,
						required: true,
						placeholder: "Enter Full Name",
					}),
				],
				["fieldWrapper"],
			),
		);

		// Email Field
		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Email:" }),
					this.generateWrapper(
						[
							this.generateElement("input", {
								type: "email",
								name: `email`,
								required: true,
								placeholder: "Enter Email Address",
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "✓",
								id: `emailProvidedButton${instance}`,
								title:
									"If Email is provided by caller button should be a check",
							}),
						],
						["inputWithButtonWrapper"],
					),
				],
				["fieldWrapper"],
			),
		);

		// Employee ID Field
		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Employee ID:" }),
					this.generateWrapper(
						[
							this.generateElement("input", {
								type: "text",
								name: `employeeId`,
								required: true,
								placeholder: "Enter Employee ID",
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "✓",
								id: `employeeIdProvidedButton${instance}`,
								title:
									"If Employee ID is provided by caller button should be a check",
							}),
						],
						["inputWithButtonWrapper"],
					),
				],
				["fieldWrapper"],
			),
		);

		// Contact Number Field
		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Contact Number:" }),
					this.generateElement("input", {
						type: "text",
						name: `contactNumber`,
						required: true,
						placeholder: "Enter Contact Number",
					}),
				],
				["fieldWrapper"],
			),
		);

		// Availability Fields
		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Availability Hours:",
					}),
					this.generateWrapper(
						[
							this.generateElement("input", {
								type: "text",
								name: "availability",
								placeholder: "Enter Best Time to Reach",
								value: "09:00-16:00",
								required: true,
							}),
							(() => {
								const select = document.createElement("select");
								select.appendChild(
									this.generateElement("option", {
										textContent: "EST",
										value: "EST",
										selected: true,
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "BST",
										value: "BST",
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "DST",
										value: "DST",
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "GMT",
										value: "GMT",
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "IST",
										value: "IST",
									}),
								);
								select.name = "timezone";
								return select;
							})(),
						],
						["insideWrapper"],
					),
				],
				["availabilityWrapper"],
			),
		);

		// Work Setup Field
		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Work Setup",
					}),
					(() => {
						const select = document.createElement("select");
						select.appendChild(
							this.generateElement("option", {
								textContent: "WFH",
								value: "WFH",
								selected: true,
							}),
						);
						select.appendChild(
							this.generateElement("option", {
								textContent: "Office",
								value: "Office",
							}),
						);
						select.appendChild(
							this.generateElement("option", {
								textContent: "Field",
								value: "Field",
							}),
						);

						select.name = "workSetup";
						return select;
					})(),
				],
				["fieldWrapper"],
			),
		);

		// Contact Preference Field
		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Contact Preference",
					}),
					(() => {
						const select = document.createElement("select");
						select.appendChild(
							this.generateElement("option", {
								textContent: "Phone",
								value: "Phone",
								selected: true,
							}),
						);
						select.appendChild(
							this.generateElement("option", {
								textContent: "Teams",
								value: "Teams",
							}),
						);
						select.appendChild(
							this.generateElement("option", {
								textContent: "Email",
								value: "Email",
							}),
						);
						select.name = "contactPreference";
						return select;
					})(),
				],
				["fieldWrapper"],
			),
		);

		const onBehalfOfFieldSet = document.createElement("fieldset");
		const onBehalfOfFieldLegend = document.createElement("legend");
		onBehalfOfFieldSet.classList.add("hidden");
		onBehalfOfFieldSet.id = `onBehalfOfWrapper${instance}`;
		onBehalfOfFieldLegend.textContent = "On Behalf Of";

		onBehalfOfFieldSet.appendChild(onBehalfOfFieldLegend);

		// OB Full Name Field
		onBehalfOfFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Full Name:" }),
					this.generateElement("input", {
						type: "text",
						name: `OBfullName`,
						required: true,
						placeholder: "Enter Full Name",
						value: "N/A",
					}),
				],
				["fieldWrapper"],
			),
		);

		// OB Email Field
		onBehalfOfFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Email:" }),
					this.generateWrapper(
						[
							this.generateElement("input", {
								type: "email",
								name: `OBemail`,
								required: true,
								placeholder: "Enter Email Address",
								value: "N/A@email.com",
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "✓",
								id: `OBemailProvidedButton${instance}`,
								title:
									"If Email is provided by caller button should be a check",
							}),
						],
						["inputWithButtonWrapper"],
					),
				],
				["fieldWrapper"],
			),
		);

		// OB Employee ID Field
		onBehalfOfFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Employee ID:" }),
					this.generateWrapper(
						[
							this.generateElement("input", {
								type: "text",
								name: `OBemployeeId`,
								required: true,
								placeholder: "Enter Employee ID",
								value: "N/A",
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "✓",
								id: `OBemployeeIdProvidedButton${instance}`,
								title:
									"If Employee ID is provided by caller button should be a check",
							}),
						],
						["inputWithButtonWrapper"],
					),
				],
				["fieldWrapper"],
			),
		);

		// OB Contact Number Field
		onBehalfOfFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Contact Number:" }),
					this.generateElement("input", {
						type: "text",
						name: `OBcontactNumber`,
						required: true,
						placeholder: "Enter Contact Number",
						value: "N/A",
					}),
				],
				["fieldWrapper"],
			),
		);

		// OB Availability Fields
		onBehalfOfFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Availability Hours:",
					}),
					this.generateWrapper(
						[
							this.generateElement("input", {
								type: "text",
								name: "OBavailability",
								placeholder: "Enter Best Time to Reach",
								value: "09:00-16:00",
								required: true,
							}),
							(() => {
								const select = document.createElement("select");
								select.appendChild(
									this.generateElement("option", {
										textContent: "EST",
										value: "EST",
										selected: true,
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "BST",
										value: "BST",
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "DST",
										value: "DST",
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "GMT",
										value: "GMT",
									}),
								);
								select.appendChild(
									this.generateElement("option", {
										textContent: "IST",
										value: "IST",
									}),
								);
								select.name = "OBtimezone";
								return select;
							})(),
						],
						["insideWrapper"],
					),
				],
				["availabilityWrapper"],
			),
		);

		// OB Work Setup Field
		onBehalfOfFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Work Setup",
					}),
					(() => {
						const select = document.createElement("select");
						select.appendChild(
							this.generateElement("option", {
								textContent: "WFH",
								value: "WFH",
								selected: true,
							}),
						);
						select.appendChild(
							this.generateElement("option", {
								textContent: "Office",
								value: "Office",
							}),
						);
						select.appendChild(
							this.generateElement("option", {
								textContent: "Field",
								value: "Field",
							}),
						);

						select.name = "OBworkSetup";
						return select;
					})(),
				],
				["fieldWrapper"],
			),
		);

		// OB Contact Preference Field
		onBehalfOfFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Contact Preference",
					}),
					this.generateSelectElement("OBcontactPreference", null, [
						"Phone",
						"Teams",
						"Email",
					]),
				],
				["fieldWrapper"],
			),
		);

		userEntitlementFieldSet.appendChild(
			this.generateWrapper([onBehalfOfFieldSet], [], instance),
		);

		userEntitlementFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Existing Ticket?:" }),
					this.generateElement("input", {
						type: "text",
						name: "existingTicket",
						placeholder: "Existing Ticket Number",
						value: "No",
						required: true,
					}),
				],
				["fieldWrapper"],
			),
		);

		//Interaction Details Fieldset

		const interactionDetailsFieldSet = document.createElement("fieldset");
		const interactionDetailsLegend = document.createElement("legend");
		interactionDetailsLegend.textContent = "Interaction Details";

		interactionDetailsFieldSet.appendChild(interactionDetailsLegend);

		interactionDetailsFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateWrapper(
						[
							this.generateElement("label", {
								textContent: "Possible Major Incident?:",
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "No",
								id: `possibleMajorIncidentButton${instance}`,
							}),
						],
						["fieldWrapper"],
					),
					this.generateWrapper(
						[
							this.generateElement("label", {
								textContent: "Contact Type:",
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "Phone",
								id: `contactTypeButton${instance}`,
							}),
						],
						["fieldWrapper"],
					),
					this.generateWrapper(
						[
							this.generateElement("label", {
								textContent: "Device Name:",
							}),
							this.generateElement("input", {
								type: "input",
								name: "deviceName",
								value: "N/A",
								placeholder: "Device Name / Asset Tag",
							}),
						],
						["fieldWrapper"],
					),
					this.generateWrapper(
						[
							this.generateElement("label", {
								textContent: "Nexthink Checklist:",
							}),
							this.generateSelectElement("nexthinkCheckList", null, [
								"Not Applicable",
								"Not Available(See Attachment)",
								"Diagnostics Attached",
							]),
						],
						["fieldWrapper"],
					),
				],
				[],
				`standardTemplateWrapper${instance}`,
			),
		);

		const ssprDetailsFieldset = document.createElement("fieldset");
		const ssprDetailsWrapperLegend = document.createElement("legend");
		ssprDetailsWrapperLegend.textContent = "Active Directory SSPR Details";
		ssprDetailsFieldset.append(ssprDetailsWrapperLegend);

		ssprDetailsFieldset.id = `ssprDetailsFieldset${instance}`;
		ssprDetailsFieldset.classList.add("hidden");

		// New Hire
		ssprDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "New Hire:" }),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `newHireButton${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		// MFA Registered
		ssprDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "MFA Registered:" }),
					this.generateElement("button", {
						type: "button",
						textContent: "Yes",
						id: `mfaRegisteredButton${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		ssprDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "SSPR Offered" }),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `ssprOfferedButton${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		ssprDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "SSPR Outcome:" }),
					this.generateSelectElement(
						"ssprOutcome",
						[
							{ id: `noOptGroup${instance}` },
							{ id: `yesOptGroup${instance}`, class: "hidden" },
						],
						[
							[
								"N/A: User is calling on behalf of someone else..",
								"N/A: User already have an existing ticket for password reset.",
								"N/A: User is not yet registered to MFA.",
								"N/A: User's AD account is locked out.",
								"N/A: User's AD account is deactivated/disabled.",
								"N/A: User is calling for an admin account.",
								"N/A: User just had a password reset within 24 hours. Option is still locked.",
							],
							[
								"Error: User is unable to access aka.ms/sspr.",
								"Error: Account doesn't exist. Contact administrator.",
								"Error: You haven't registered for a password reset",
								"Failed: User cannot correctly input the CAPTCHA.",
								"Failed: User unable to change their password due to complexity requirements.",
								"Failed: The user forgot the answers to the security questions.",
								"Failed: User was disconnected; Unable to reach back.",
								"User refused: User prefers the agent to do the password change.",
								"User refused: User don't want to use their mobile phone.",
								"User refused: User prefers to keep their current password.",
							],
						],
					),
				],
				["fieldWrapper"],
			),
		);

		interactionDetailsFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateWrapper(
						[
							this.generateElement("label", { textContent: "Reset Type:" }),
							this.generateElement("button", {
								type: "button",
								textContent: "Non-AD",
								id: `resetTypeButton${instance}`,
							}),
						],
						["fieldWrapper"],
					),
					ssprDetailsFieldset,
				],
				["hidden"],
				`pwrTemplateWrapper${instance}`,
			),
		);

		// Issue Identification and Troubleshooting  Fieldset

		const issueIdentificationFieldset = document.createElement("fieldset");
		const issueIdentificationLegend = document.createElement("legend");
		issueIdentificationLegend.textContent =
			"Issue Identification and Troubleshooting";
		issueIdentificationFieldset.appendChild(issueIdentificationLegend);

		issueIdentificationFieldset.appendChild(
			this.generateElement("label", { textContent: "Issue Description" }),
		);

		issueIdentificationFieldset.appendChild(
			this.generateElement("textarea", {
				name: "issueDescription",
				placeholder: "Describe the Issue",
				minLength: 50,
				rows: 5,
				required: true,
			}),
		);

		issueIdentificationFieldset.appendChild(
			this.generateElement("label", { textContent: "Troubleshooting Steps" }),
		);

		issueIdentificationFieldset.appendChild(
			this.generateElement("textarea", {
				name: "troubleshootingSteps",
				placeholder: "List the steps take to troubleshoot the issue",
				rows: 10,
				required: true,
			}),
		);

		// Closing Details Fieldset

		const closingDetailsFieldset = document.createElement("fieldset");
		const closingDetailsLegend = document.createElement("legend");
		closingDetailsLegend.textContent = "Closing Details";
		closingDetailsFieldset.appendChild(closingDetailsLegend);

		// KB Article
		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "KB Article:" }),
					this.generateElement("input", {
						type: "text",
						name: "kbArticle",
						placeholder: "KB Article Used",
						required: true,
					}),
				],
				["fieldWrapper"],
			),
		);

		// Issue Resolved
		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Issue Resolved?:" }),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `issueResolvedButton${instance}`,
					}),
				],
				["fieldWrapper"],
				`issueResolvedWrapper${instance}`,
			),
		);

		// Ticket Fulfilled
		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Ticket Fulfilled?:",
					}),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `ticketFulfilledButton${instance}`,
					}),
				],
				["fieldWrapper", "hidden"],
				`ticketFulfilledWrapper${instance}`,
			),
		);

		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Resolution Notes:",
					}),
					this.generateElement("input", {
						type: "text",
						name: "standardResolutionNotes",
						placeholder: "Detailed step that resolved the issue",
					}),
				],
				["fieldWrapper", "hidden"],
				`standardResolutionNotesWrapper${instance}`,
			),
		);

		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "Resolution Notes:",
					}),
					this.generateElement("input", {
						type: "text",
						name: "pwrResolutionNotes",
						placeholder: "Detailed step that resolved the issue",
					}),
				],
				["fieldWrapper", "hidden"],
				`pwrResolutionNotesWrapper${instance}`,
			),
		);

		// Next Action
		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Next Action:" }),
					this.generateSelectElement(
						"nextAction",
						[
							{ id: `standardTemplateExclusiveOptGroup${instance}` },
							{
								id: `pwrTemplateExclusiveOptGroup${instance}`,
								class: "hidden",
							},
						],
						[
							[
								"Complete the interaction",
								"Cancel the ticket",
								"Escalate the ticket",
								"Set Ticket to 'On Hold' Status",
								"Set Ticket to 'Resolved' Status",
								"Route the Ticket to the Next Resolver Team",
							],
							[
								"Complete the interaction",
								"Cancel the ticket",
								"Escalate the ticket",
								"Set Ticket to 'Fulfilled' Status",
								"Wait for Line Manager's Approval",
							],
						],
						`nextActionSelect${instance}`,
					),
				],
				["fieldWrapper"],
			),
		);

		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Location:" }),
					this.generateElement("input", {
						type: "text",
						name: "location",
						placeholder: "Affected User Location",
						value: "N/A",
						required: true,
					}),
				],
				["fieldWrapper", "hidden"],
				`locationWrapper${instance}`,
			),
		);

		// User Agreed Resolved
		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "User Agreed to set ticket to 'Resolved'?:",
					}),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `userAgreedResolvedButton${instance}`,
					}),
				],
				["fieldWrapper"],
				`userAgreedResolvedWrapper${instance}`,
			),
		);

		// User Agreed Fulfilled
		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "User Agreed to set ticket to 'Fulfilled'?:",
					}),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `userAgreedFulfilledButton${instance}`,
					}),
				],
				["fieldWrapper", "hidden"],
				`userAgreedFulfilledWrapper${instance}`,
			),
		);

		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Ticket Number" }),
					this.generateElement("input", {
						type: "text",
						name: "ticketNumber",
						placeholder: "Not visible when copied",
						required: true,
					}),
				],
				["fieldWrapper"],
			),
		);

		const fieldControlsFieldSet = document.createElement("fieldset");
		const fieldControlsLegend = document.createElement("legend");
		fieldControlsLegend.textContent = "Field Controls";

		fieldControlsFieldSet.appendChild(fieldControlsLegend);
		fieldControlsFieldSet.classList.add("fieldControls");
		if (!editMode) {
			fieldControlsFieldSet.appendChild(
				this.generateElement("button", {
					type: "submit",
					textContent: "Save Note & Copy",
					id: `saveButton${instance}`,
				}),
			);

			fieldControlsFieldSet.appendChild(
				this.generateElement("button", {
					type: "button",
					textContent: "Close Instance",
					id: `closeInstanceButton${instance}`,
				}),
			);

			fieldControlsFieldSet.appendChild(
				this.generateElement("button", {
					type: "button",
					textContent: "Multiple Issue",
					id: `multipleIssueButton${instance}`,
				}),
			);

			fieldControlsFieldSet.appendChild(
				this.generateElement("button", {
					type: "button",
					textContent: "Cancel",
					id: `cancelButton${instance}`,
				}),
			);
		} else {
			fieldControlsFieldSet.appendChild(
				this.generateElement("button", {
					type: "submit",
					textContent: "Save Changes & Copy",
				}),
			);

			fieldControlsFieldSet.appendChild(
				this.generateElement("button", {
					type: "button",
					textContent: "Cancel Edit",
					id: `cancelEditButton${instance}`,
				}),
			);
		}

		form.appendChild(callerFieldset);
		form.appendChild(userEntitlementFieldSet);
		form.appendChild(interactionDetailsFieldSet);
		form.appendChild(issueIdentificationFieldset);
		form.appendChild(closingDetailsFieldset);
		form.appendChild(fieldControlsFieldSet);

		document.querySelector("#innerFormsWrapper").appendChild(form);
	},

	generateElement(type, properties = {}, classes = []) {
		const element = document.createElement(type);

		Object.assign(element, properties);

		classes.forEach((className) => element.classList.add(className));

		return element;
	},

	generateWrapper(children, classes = [], id = null) {
		const wrapper = document.createElement("div");

		classes.forEach((className) => wrapper.classList.add(className));
		children.forEach((child) => wrapper.appendChild(child));

		if (id) {
			wrapper.id = id;
		}
		return wrapper;
	},

	generateSelectElement(name, optGroupProp, options, id = null) {
		const select = document.createElement("select");

		select.name = name;

		if (id) select.id = id;

		if (optGroupProp) {
			options.forEach((option, index) => {
				const optgroup = document.createElement("optgroup");

				optgroup.id = optGroupProp[index].id;

				if (optGroupProp[index].class) {
					optgroup.classList.add(optGroupProp[index].class);
				}

				option.forEach((item) => {
					const option = document.createElement("option");
					option.value = item;
					option.textContent = item;
					optgroup.appendChild(option);
				});

				select.appendChild(optgroup);
			});

			return select;
		} else {
			options.forEach((item) => {
				const option = document.createElement("option");
				option.value = item;
				option.textContent = item;
				select.appendChild(option);
			});
			return select;
		}
	},
};

class uiStateLinker {
	constructor(instance, stateManager, editMode) {
		this.instance = instance;
		this.setState = stateManager.setState.bind(stateManager);
		this.getState = stateManager.getState.bind(stateManager);
		this.subscribe = stateManager.subscribe.bind(stateManager);
		this.getStateObject = stateManager.getStateObject.bind(stateManager);
		this.stateSubscribe();
		this.fieldInit();

		if (!editMode) {
			this.saveButtonInit();
			this.closeInstanceButtonInit();
			this.multipleIssueButtonInit();
			this.cancelButtonInit();
		} else {
			this.saveChangesButtonInit();
			this.cancelEditButtonInit();
		}
	}

	callerTypeSubscribe() {
		const switchButton = document.querySelector(
			`#callerTypeButton${this.instance}`,
		);

		this.subscribe("callerType", (value) => (switchButton.textContent = value));

		this.subscribe("callerType", (value) => {
			const onBehalfOfWrapper = document.querySelector(
				`#onBehalfOfWrapper${this.instance}`,
			);

			value === "Affected User"
				? onBehalfOfWrapper.classList.add("hidden")
				: onBehalfOfWrapper.classList.remove("hidden");
		});

		switchButton.addEventListener("click", () => {
			this.getState("callerType") === "Affected User"
				? this.setState("callerType", "On Behalf")
				: this.setState("callerType", "Affected User");
		});
	}

	templateTypeSubscribe() {
		const switchButton = document.querySelector(
			`#templateTypeButton${this.instance}`,
		);

		this.subscribe(
			"templateType",
			(value) => (switchButton.textContent = value),
		);

		this.subscribe("templateType", (value) => {
			const standardTemplateWrapper = document.querySelector(
				`#standardTemplateWrapper${this.instance}`,
			);

			const pwrTemplateWrapper = document.querySelector(
				`#pwrTemplateWrapper${this.instance}`,
			);

			if (value === "Standard") {
				standardTemplateWrapper.classList.remove("hidden");
				pwrTemplateWrapper.classList.add("hidden");
			} else {
				standardTemplateWrapper.classList.add("hidden");
				pwrTemplateWrapper.classList.remove("hidden");
			}
		});

		this.subscribe("templateType", (value) => {
			const issueResolvedWrapper = document.querySelector(
				`#issueResolvedWrapper${this.instance}`,
			);
			const userAgreedResolvedWrapper = document.querySelector(
				`#userAgreedResolvedWrapper${this.instance}`,
			);

			const ticketFulfilledWrapper = document.querySelector(
				`#ticketFulfilledWrapper${this.instance}`,
			);

			const userAgreedFulfilledWrapper = document.querySelector(
				`#userAgreedFulfilledWrapper${this.instance}`,
			);

			if (value === "Standard") {
				issueResolvedWrapper.classList.remove("hidden");
				userAgreedResolvedWrapper.classList.remove("hidden");
				ticketFulfilledWrapper.classList.add("hidden");
				userAgreedFulfilledWrapper.classList.add("hidden");
			} else {
				issueResolvedWrapper.classList.add("hidden");
				userAgreedResolvedWrapper.classList.add("hidden");
				ticketFulfilledWrapper.classList.remove("hidden");
				userAgreedFulfilledWrapper.classList.remove("hidden");
			}
		});

		// this.subscribe("templateType", (value) => {
		// 	const standardTemplateAutofillButtonsWrapper = document.querySelector(
		// 		"#standardTemplateAutofillButtonsWrapper",
		// 	);

		// 	value === "Standard"
		// 		? standardTemplateAutofillButtonsWrapper.classList.remove("hidden")
		// 		: standardTemplateAutofillButtonsWrapper.classList.add("hidden");
		// });

		this.subscribe("templateType", (value) => {
			const standardTemplateExclusiveOptGroup = document.querySelector(
				`#standardTemplateExclusiveOptGroup${this.instance}`,
			);
			const pwrTemplateExclusiveOptGroup = document.querySelector(
				`#pwrTemplateExclusiveOptGroup${this.instance}`,
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
			this.getState("templateType") === "Standard"
				? this.setState("templateType", "Password Reset")
				: this.setState("templateType", "Standard");
		});
	}

	emailProvidedSubscribe() {
		this.subscribe("emailProvided", (value) => {
			const button = document.querySelector(
				`#emailProvidedButton${this.instance}`,
			);
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector(`#emailProvidedButton${this.instance}`)
			.addEventListener("click", () => {
				this.getState("emailProvided") === "Provided"
					? this.setState("emailProvided", "Not Provided")
					: this.setState("emailProvided", "Provided");
			});
	}

	OBemailProvidedSubscribe() {
		this.subscribe("OBemailProvided", (value) => {
			const button = document.querySelector(
				`#OBemailProvidedButton${this.instance}`,
			);
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector(`#OBemailProvidedButton${this.instance}`)
			.addEventListener("click", () => {
				this.getState("OBemailProvided") === "Provided"
					? this.setState("OBemailProvided", "Not Provided")
					: this.setState("OBemailProvided", "Provided");
			});
	}

	employeeIdProvidedSubscribe() {
		this.subscribe("employeeIdProvided", (value) => {
			const button = document.querySelector(
				`#employeeIdProvidedButton${this.instance}`,
			);
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector(`#employeeIdProvidedButton${this.instance}`)
			.addEventListener("click", () => {
				this.getState("employeeIdProvided") === "Provided"
					? this.setState("employeeIdProvided", "Not Provided")
					: this.setState("employeeIdProvided", "Provided");
			});
	}

	OBemployeeIdProvidedSubscribe() {
		this.subscribe("OBemployeeIdProvided", (value) => {
			const button = document.querySelector(
				`#OBemployeeIdProvidedButton${this.instance}`,
			);
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector(`#OBemployeeIdProvidedButton${this.instance}`)
			.addEventListener("click", () => {
				this.getState("OBemployeeIdProvided") === "Provided"
					? this.setState("OBemployeeIdProvided", "Not Provided")
					: this.setState("OBemployeeIdProvided", "Provided");
			});
	}

	possibleMajorIncidentSubscribe() {
		const switchButton = document.querySelector(
			`#possibleMajorIncidentButton${this.instance}`,
		);
		this.subscribe(
			"possibleMajorIncident",
			(value) => (switchButton.textContent = value),
		);

		switchButton.addEventListener("click", () => {
			this.getState("possibleMajorIncident") === "No"
				? this.setState("possibleMajorIncident", "Yes")
				: this.setState("possibleMajorIncident", "No");
		});
	}

	contactTypeSubscribe() {
		const switchButton = document.querySelector(
			`#contactTypeButton${this.instance}`,
		);
		this.subscribe(
			"contactType",
			(value) => (switchButton.textContent = value),
		);

		switchButton.addEventListener("click", () => {
			this.getState("contactType") === "Phone"
				? this.setState("contactType", "Chat")
				: this.setState("contactType", "Phone");
		});
	}

	resetTypeSubscribe() {
		const switchButton = document.querySelector(
			`#resetTypeButton${this.instance}`,
		);

		this.subscribe("resetType", (value) => (switchButton.textContent = value));

		this.subscribe("resetType", (value) => {
			const ssprDetailsWrapper = document.querySelector(
				`#ssprDetailsFieldset${this.instance}`,
			);

			value === "Non-AD"
				? ssprDetailsWrapper.classList.add("hidden")
				: ssprDetailsWrapper.classList.remove("hidden");
		});

		switchButton.addEventListener("click", () => {
			this.getState("resetType") === "Non-AD"
				? this.setState("resetType", "Active Directory")
				: this.setState("resetType", "Non-AD");
		});
	}

	newHireSubscribe() {
		const switchButton = document.querySelector(
			`#newHireButton${this.instance}`,
		);
		this.subscribe("newHire", (value) => (switchButton.textContent = value));

		switchButton.addEventListener("click", () => {
			this.getState("newHire") === "No"
				? this.setState("newHire", "Yes")
				: this.setState("newHire", "No");
		});
	}

	mfaSubscribe() {
		const switchButton = document.querySelector(
			`#mfaRegisteredButton${this.instance}`,
		);
		this.subscribe(
			"mfaRegistered",
			(value) => (switchButton.textContent = value),
		);

		switchButton.addEventListener("click", () => {
			this.getState("mfaRegistered") === "Yes"
				? this.setState("mfaRegistered", "No")
				: this.setState("mfaRegistered", "Yes");
		});
	}

	ssprSubscribe() {
		const switchButton = document.querySelector(
			`#ssprOfferedButton${this.instance}`,
		);

		this.subscribe(
			"ssprOffered",
			(value) => (switchButton.textContent = value),
		);

		this.subscribe("ssprOffered", (value) => {
			const noOptGroup = document.querySelector(`#noOptGroup${this.instance}`);
			const yesOptGroup = document.querySelector(
				`#yesOptGroup${this.instance}`,
			);

			if (value === "No") {
				noOptGroup.classList.remove("hidden");
				yesOptGroup.classList.add("hidden");
			} else {
				noOptGroup.classList.add("hidden");
				yesOptGroup.classList.remove("hidden");
			}
		});

		switchButton.addEventListener("click", () => {
			this.getState("ssprOffered") === "No"
				? this.setState("ssprOffered", "Yes")
				: this.setState("ssprOffered", "No");
		});
	}

	issueResolvedSubscribe() {
		const switchButton = document.querySelector(
			`#issueResolvedButton${this.instance}`,
		);

		this.subscribe(
			"issueResolved",
			(value) => (switchButton.textContent = value),
		);

		this.subscribe("issueResolved", (value) => {
			const resolutionNotesWrapper = document.querySelector(
				`#standardResolutionNotesWrapper${this.instance}`,
			);

			value === "No"
				? resolutionNotesWrapper.classList.add("hidden")
				: resolutionNotesWrapper.classList.remove("hidden");
		});

		switchButton.addEventListener("click", () => {
			this.getState("issueResolved") === "No"
				? this.setState("issueResolved", "Yes")
				: this.setState("issueResolved", "No");
		});
	}

	ticketFulfilledSubscribe() {
		const switchButton = document.querySelector(
			`#ticketFulfilledButton${this.instance}`,
		);

		this.subscribe(
			"userAgreedFulfilled",
			(value) => (switchButton.textContent = value),
		);

		this.subscribe("userAgreedFulfilled", (value) => {
			const resolutionNotesWrapper = document.querySelector(
				`#pwrResolutionNotesWrapper${this.instance}`,
			);

			value === "No"
				? resolutionNotesWrapper.classList.add("hidden")
				: resolutionNotesWrapper.classList.remove("hidden");
		});

		switchButton.addEventListener("click", () => {
			this.getState("userAgreedFulfilled") === "No"
				? this.setState("userAgreedFulfilled", "Yes")
				: this.setState("userAgreedFulfilled", "No");
		});
	}

	nextActionSubscribe() {
		const nextActionSelect = document.querySelector(
			`#nextActionSelect${this.instance}`,
		);

		this.subscribe("nextAction", (value) => {
			const locationWrapper = document.querySelector(
				`#locationWrapper${this.instance}`,
			);
			if (value === "Route the Ticket to the Next Resolver Team") {
				locationWrapper.classList.remove("hidden");
			} else {
				locationWrapper.classList.add("hidden");
			}
		});

		nextActionSelect.addEventListener("change", (e) => {
			this.setState("nextAction", e.target.value);
		});
	}

	userAgreedResolvedSubscribe() {
		const switchButton = document.querySelector(
			`#userAgreedResolvedButton${this.instance}`,
		);
		this.subscribe(
			"userAgreedResolved",
			(value) => (switchButton.textContent = value),
		);

		switchButton.addEventListener("click", () => {
			this.getState("userAgreedResolved") === "No"
				? this.setState("userAgreedResolved", "Yes")
				: this.setState("userAgreedResolved", "No");
		});
	}

	userAgreedFulfilledSubscribe() {
		const switchButton = document.querySelector(
			`#userAgreedFulfilledButton${this.instance}`,
		);
		this.subscribe(
			"userAgreedResolved",
			(value) => (switchButton.textContent = value),
		);

		switchButton.addEventListener("click", () => {
			this.getState("userAgreedResolved") === "No"
				? this.setState("userAgreedResolved", "Yes")
				: this.setState("userAgreedResolved", "No");
		});
	}

	stateSubscribe() {
		// this.isEditModeSubscribe();
		this.callerTypeSubscribe();
		this.templateTypeSubscribe();
		this.emailProvidedSubscribe();
		this.OBemailProvidedSubscribe();
		this.employeeIdProvidedSubscribe();
		this.OBemployeeIdProvidedSubscribe();
		this.possibleMajorIncidentSubscribe();
		this.contactTypeSubscribe();
		this.resetTypeSubscribe();
		this.newHireSubscribe();
		this.mfaSubscribe();
		this.ssprSubscribe();
		this.issueResolvedSubscribe();
		this.ticketFulfilledSubscribe();
		this.nextActionSubscribe();
		this.userAgreedResolvedSubscribe();
		this.userAgreedFulfilledSubscribe();
	}

	fieldInit() {
		const form = document.querySelector(`#form${this.instance}`);

		form.addEventListener("input", () => {
			this.setState("isModified", true);
		});
	}

	saveButtonInit() {
		const form = document.querySelector(`#form${this.instance}`);

		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			if (this.getState("isModified") === false) {
				alert("No Changes Detected");
				return;
			}

			if (this.getState("isSaved") === false) {
				this.setState("isSaved", true);
			}

			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData.entries());

			this.combined = { ...this.getStateObject(), ...data };

			const copySuccess = await copyToClipboard(this.combined);

			if (copySuccess) {
				alert("Saved and Copied to Clipboard");
			} else {
				alert(
					"Changes saved, but copying to clipboard failed. Click save again",
				);
			}
		});
	}

	closeInstanceButtonInit() {
		document
			.querySelector(`#closeInstanceButton${this.instance}`)
			.addEventListener("click", () => {
				if (this.getState("isSaved") === false) {
					alert("Please save current notes");
					return;
				}

				const tempSO = appModule.getSessionObject();
				tempSO[appModule.getCurrentSessionName()] = [
					...tempSO[appModule.getCurrentSessionName()],
					this.combined,
				];
				appModule.updateSessionObject({ ...tempSO });
				historyModule.renderHistory();
				document.querySelector(`#form${this.instance}`).remove();
			});
	}

	multipleIssueButtonInit() {
		document
			.querySelector(`#multipleIssueButton${this.instance}`)
			.addEventListener("click", () => {
				if (this.getState("isSaved") === false) {
					alert("Please save current notes");
					return;
				}
				const tempSO = appModule.getSessionObject();
				tempSO[appModule.getCurrentSessionName()] = [
					...tempSO[appModule.getCurrentSessionName()],
					this.combined,
				];
				appModule.updateSessionObject({ ...tempSO });
				historyModule.renderHistory();
				document.querySelector(`#form${this.instance}`).remove();
				temp({ ...this.combined });
			});
	}

	cancelButtonInit() {
		document
			.querySelector(`#cancelButton${this.instance}`)
			.addEventListener("click", () => {
				if (
					confirm(
						"Are you sure you want to cancel? All unsaved changes will be lost.",
					)
				) {
					document.querySelector(`#form${this.instance}`).remove();
				}
			});
	}

	saveChangesButtonInit() {
		const form = document.querySelector(`#form${this.instance}`);

		form.addEventListener("submit", async (e) => {
			if (confirm("Would you like to save changes?")) {
				e.preventDefault();

				const formData = new FormData(e.target);
				const data = Object.fromEntries(formData.entries());

				this.combined = { ...this.getStateObject(), ...data };

				const tempSO = appModule.getSessionObject();
				tempSO[appModule.getCurrentSessionName()][historyModule.editIndex] =
					this.combined;

				appModule.updateSessionObject({ ...tempSO });
				historyModule.reset();
				historyModule.renderHistory();
				document.querySelector(`#form${this.instance}`).remove();
				const copySuccess = await copyToClipboard(this.combined);

				if (copySuccess) {
					alert("Changes saved and Copied to Clipboard");
				} else {
					alert(
						"Changes saved, but copying to clipboard failed. Click save again",
					);
				}
			} else {
				return;
			}
		});
	}

	cancelEditButtonInit() {
		document
			.querySelector(`#cancelEditButton${this.instance}`)
			.addEventListener("click", () => {
				if (
					confirm(
						"Are you sure you want to cancel? All unsaved changes will be lost.",
					)
				) {
					historyModule.reset();
					historyModule.renderHistory();
					document.querySelector(`#form${this.instance}`).remove();
				}
			});
	}

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
	}
}

function createFormInstance(data = null) {
	const instance = crypto.randomUUID();

	form.generate(instance);
	const stateManager1 = new stateManager();
	new uiStateLinker(instance, stateManager1, false);

	if (data) {
		const {
			emailProvided,
			OBemailProvided,
			employeeIdProvided,
			OBemployeeIdProvided,
			templateType,
		} = data;

		const retainedState = {
			emailProvided,
			OBemailProvided,
			employeeIdProvided,
			OBemployeeIdProvided,
		};

		stateManager1.setMultipleSelectedState(retainedState);
		retainUserInfo(instance, data);
	}
}

function createEditorInstance(data = null) {
	const instance = crypto.randomUUID();

	form.generate(instance, true);
	const stateManager1 = new stateManager();
	new uiStateLinker(instance, stateManager1, true);

	stateManager1.setMultipleState(data);
	loadValuesToForm(instance, data);
}

function appMiscButtonsInit() {
	document
		.querySelector("#closePreviewButton")
		.addEventListener("click", () => {
			document.querySelector("#previewContainer").replaceChildren();
		});

	document.querySelector("#addInstanceButton").addEventListener("click", () => {
		createFormInstance();
		preferenceModule.reapply();
	});

	document
		.querySelector("#hideControlPanelButton")
		.addEventListener("click", () => {
			document.querySelector("#appControlsWrapper").classList.toggle("hidden");
		});

	document.querySelector("#resetAppButton").addEventListener("click", () => {
		if (
			confirm(
				"Only do a reset if the app is malfunctioning or advised by the developer for an update. Resetting the application will remove all the sessions and history. Would you like to proceed?",
			)
		) {
			localStorage.clear();
			window.location.reload();
			return;
		}

		return;
	});
}

function appInit() {
	window.addEventListener("beforeunload", (e) => {
		e.preventDefault();
	});
	appModule.init();
	sessionModule.init();
	historyModule.renderHistory();
	preferenceModule.init();
	appMiscButtonsInit();
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

function retainUserInfo(instance, data) {
	console.log(data);
	document.querySelector(`#form${instance} input[name="fullName"]`).value =
		data["fullName"];
	document.querySelector(`#form${instance} input[name="email"]`).value =
		data["email"];
	document.querySelector(`#form${instance} input[name="employeeId"]`).value =
		data["employeeId"];
	document.querySelector(`#form${instance} input[name="contactNumber"]`).value =
		data["contactNumber"];
	document.querySelector(`#form${instance} input[name="availability"]`).value =
		data["availability"];
	document.querySelector(`#form${instance} select[name="timezone"]`).value =
		data["timezone"];
	document.querySelector(`#form${instance} select[name="workSetup"]`).value =
		data["workSetup"];
	document.querySelector(
		`#form${instance} select[name="contactPreference"]`,
	).value = data["contactPreference"];

	document.querySelector(`#form${instance} input[name="OBfullName"]`).value =
		data["OBfullName"];
	document.querySelector(`#form${instance} input[name="OBemail"]`).value =
		data["OBemail"];
	document.querySelector(`#form${instance} input[name="OBemployeeId"]`).value =
		data["OBemployeeId"];
	document.querySelector(
		`#form${instance} input[name="OBcontactNumber"]`,
	).value = data["OBcontactNumber"];
	document.querySelector(
		`#form${instance} input[name="OBavailability"]`,
	).value = data["OBavailability"];
	document.querySelector(`#form${instance} select[name="OBtimezone"]`).value =
		data["OBtimezone"];
	document.querySelector(`#form${instance} select[name="OBworkSetup"]`).value =
		data["OBworkSetup"];
	document.querySelector(
		`#form${instance} select[name="OBcontactPreference"]`,
	).value = data["OBcontactPreference"];
}

function loadValuesToForm(instance, data) {
	Object.entries(data).forEach(([key, value]) => {
		const el = document.querySelector(`#form${instance} [name="${key}"]`);
		if (el) el.value = value;
	});
}

appInit();
