class stateManager {
	constructor() {
		this.DEFAULT_MANAGED_STATE = {
			isModified: false,
			isSaved: false,
			savedData: {},
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

	setMultipleState(referenceObject) {
		Object.keys(this.DEFAULT_MANAGED_STATE).forEach((key) => {
			this.setState(key, referenceObject[key]);
		});
	}
}

const form = {
	generate(instance = 1) {
		const form = document.createElement("form");

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
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "✓",
								id: `OBemailProvidedButton${instance}`,
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
							}),
							this.generateElement("button", {
								type: "button",
								textContent: "✓",
								id: `OBemployeeIdProvidedButton${instance}`,
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
								id: `possibleMajorIncident${instance}`,
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
								textContent: "No",
								id: `contactType${instance}`,
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
							this.generateSelectElement("nextChecklist", null, [
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

		const ssprDetailsWrapperFieldset = document.createElement("fieldset");
		const ssprDetailsWrapperLegend = document.createElement("legend");
		ssprDetailsWrapperLegend.textContent = "Active Directory SSPR Details";
		ssprDetailsWrapperFieldset.append(ssprDetailsWrapperLegend);

		// ssprDetailsWrapperFieldset.classList.add("hidden");

		ssprDetailsWrapperFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "New Hire:" }),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `newHire${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		ssprDetailsWrapperFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "MFA Registered:" }),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `mfaRegistered${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		ssprDetailsWrapperFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "SSPR Offered" }),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `ssprOffered${instance}`,
					}),
				],
				["fieldWrapper"],
			),
		);

		ssprDetailsWrapperFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "SSPR Outcome:" }),
					this.generateSelectElement(
						"ssprOutcome",
						[{ id: "noOptGroup" }, { id: "yesOptGroup", class: "hidden" }],
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
								id: `resetType${instance}`,
							}),
						],
						["fieldWrapper"],
					),
				],
				[],
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
				["fieldWrapper"],
				`ticketFulfilledWrapper${instance}`,
			),
		);

		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", { textContent: "Next Action:" }),
					this.generateSelectElement(
						"nextAction",
						[
							{ id: `standardTemplateExclusiveOptGroup${instance}` },
							{ id: `pwrTemplateExclusiveOptGroup${instance}` },
						],
						[
							[
								"Complete the interaction",
								"Cancel the ticket",
								"Escalated the ticket",
								"Set Ticket to 'On Hold' Status",
								"Set Ticket to 'Resolved' Status",
								"Route the Ticket to the Next Resolver Team",
							],
							[
								"Complete the interaction",
								"Cancel the ticket",
								"Escalated the ticket",
								"Set Ticket to 'Fulfilled' Status",
								"Wait for Line Manager's Approval",
							],
						],
					),
				],
				["fieldWrapper"],
			),
		);

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

		closingDetailsFieldset.appendChild(
			this.generateWrapper(
				[
					this.generateElement("label", {
						textContent: "User Agreed to set ticket to 'Fulfilled'?:",
					}),
					this.generateElement("button", {
						type: "button",
						textContent: "No",
						id: `userAgreedFulfilled${instance}`,
					}),
				],
				["fieldWrapper"],
				`userAgreedFulfilled${instance}`,
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

		fieldControlsFieldSet.appendChild(
			this.generateWrapper(
				[
					this.generateElement("button", {
						type: "button",
						textContent: "Save Changes & Copy",
						id: `saveChanges${instance}`,
					}),
					this.generateElement("button", {
						type: "button",
						textContent: "Cancel Edit",
						id: `cancelEditButton${instance}`,
					}),
				],
				[],
				`editModeWrapper${instance}`,
			),
		);

		interactionDetailsFieldSet.appendChild(ssprDetailsWrapperFieldset);
		form.appendChild(callerFieldset);
		form.appendChild(userEntitlementFieldSet);
		form.appendChild(interactionDetailsFieldSet);
		form.appendChild(issueIdentificationFieldset);
		form.appendChild(closingDetailsFieldset);
		form.appendChild(fieldControlsFieldSet);

		document.querySelector("body").appendChild(form);
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

	generateSelectElement(name, optGroupProp, options) {
		const select = document.createElement("select");

		select.name = name;

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
	constructor(instance, stateManager) {
		this.instance = instance;
		this.setState = stateManager.setState.bind(stateManager);
		this.getState = stateManager.getState.bind(stateManager);
		this.subscribe = stateManager.subscribe.bind(stateManager);
		this.stateSubscribe();
	}
	// isEditModeSubscribe() {
	// 	subscribe("isEditMode", (value) => {
	// 		const normalModeWrapper = document.querySelector("#normalModeWrapper");
	// 		const editModeWrapper = document.querySelector("#editModeWrapper");

	// 		if (value) {
	// 			editModeWrapper.classList.remove("hidden");
	// 			normalModeWrapper.classList.add("hidden");
	// 		} else {
	// 			editModeWrapper.classList.add("hidden");
	// 			normalModeWrapper.classList.remove("hidden");
	// 		}
	// 	});
	// },

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

	emailProvidedSubscribe() {
		subscribe("emailProvided", (value) => {
			document.querySelector("[name='emailProvided']").value = value;
		});

		subscribe("emailProvided", (value) => {
			const button = document.querySelector("#emailProvidedButton");
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector("#emailProvidedButton")
			.addEventListener("click", () => {
				getState("emailProvided") === "Provided"
					? setState("emailProvided", "Not Provided")
					: setState("emailProvided", "Provided");
			});
	}

	OBemailProvidedSubscribe() {
		subscribe("OBemailProvided", (value) => {
			document.querySelector("[name='OBemailProvided']").value = value;
		});

		subscribe("OBemailProvided", (value) => {
			const button = document.querySelector("#OBemailProvidedButton");
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector("#OBemailProvidedButton")
			.addEventListener("click", () => {
				getState("OBemailProvided") === "Provided"
					? setState("OBemailProvided", "Not Provided")
					: setState("OBemailProvided", "Provided");
			});
	}

	employeeIdProvidedSubscribe() {
		subscribe("employeeIdProvided", (value) => {
			document.querySelector("[name='employeeIdProvided']").value = value;
		});

		subscribe("employeeIdProvided", (value) => {
			const button = document.querySelector("#employeeIdProvidedButton");
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector("#employeeIdProvidedButton")
			.addEventListener("click", () => {
				getState("employeeIdProvided") === "Provided"
					? setState("employeeIdProvided", "Not Provided")
					: setState("employeeIdProvided", "Provided");
			});
	}

	OBemployeeIdProvidedSubscribe() {
		subscribe("OBemployeeIdProvided", (value) => {
			document.querySelector("[name='OBemployeeIdProvided']").value = value;
		});

		subscribe("OBemployeeIdProvided", (value) => {
			const button = document.querySelector("#OBemployeeIdProvidedButton");
			button.textContent = value === "Provided" ? "✓" : "x";
		});

		document
			.querySelector("#OBemployeeIdProvidedButton")
			.addEventListener("click", () => {
				getState("OBemployeeIdProvided") === "Provided"
					? setState("OBemployeeIdProvided", "Not Provided")
					: setState("OBemployeeIdProvided", "Provided");
			});
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

	stateSubscribe() {
		// this.isEditModeSubscribe();
		this.callerTypeSubscribe();
		// this.templateTypeSubscribe();
		// this.emailProvidedSubscribe();
		// this.OBemailProvidedSubscribe();
		// this.employeeIdProvidedSubscribe();
		// this.OBemployeeIdProvidedSubscribe();
		// this.possibleMajorIncidentSubscribe();
		// this.contactTypeSubscribe();
		// this.resetTypeSubscribe();
		// this.newHireSubscribe();
		// this.mfaSubscribe();
		// this.ssprSubscribe();
		// this.issueResolvedSubscribe();
		// this.userAgreedSubscribe();
	}

	fieldInit() {
		const field = document.querySelector("#documentationField");

		field.addEventListener("input", () => {
			setState("isModified", true);
		});
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
		<form id="documentationField">
			<!--  Caller and Template Type -->
			<fieldset>
				<legend>Caller & Template Type</legend>

				<div class="fieldWrapper">
					<label for="callerType">Caller Type:</label>
					<input
						type="text"
						class="hidden"
						id="callerType"
						name="callerType"
						value="Affected User"
						required />
					<button type="button">Affected User</button>
				</div>

				<div class="fieldWrapper">
					<label for="templateType">Template Type:</label>
					<input
						type="text"
						class="hidden"
						id="templateType"
						name="templateType"
						value="Standard"
						required />
					<button type="button">Standard</button>
				</div>
			</fieldset>

			<!-- User Entitlement -->
			<fieldset>
				<legend>User Entitlement</legend>

				<div class="fieldWrapper">
					<label for="fullName">Full Name:</label>
					<input
						type="text"
						id="fullName"
						name="fullName"
						placeholder="Enter Full Name"
						required />
				</div>

				<div class="fieldWrapper">
					<label for="email">Email Address:</label>
					<div class="inputWithButtonWrapper">
						<input
							type="text"
							id="email"
							name="email"
							placeholder="Enter Email"
							required />
						<input
							type="text"
							id="emailProvided"
							name="emailProvided"
							value="Provided"
							required />
						<button id="emailProvidedButton" type="button">✓</button>
					</div>
				</div>

				<div class="fieldWrapper">
					<label for="employeeId">Employee ID:</label>
					<div class="inputWithButtonWrapper">
						<input
							type="text"
							id="employeeId"
							name="employeeId"
							placeholder="Enter Employee ID"
							required />
						<input
							type="text"
							id="employeeIdProvided"
							name="employeeIdProvided"
							value="Provided"
							required />
						<button id="employeeIdProvidedButton" type="button">✓</button>
					</div>
				</div>

				<div class="fieldWrapper">
					<label for="contactNumber">Contact Number:</label>
					<input
						type="text"
						id="contactNumber"
						name="contactNumber"
						placeholder="Enter Contact Number"
						required />
				</div>

				<div class="availabilityWrapper">
					<label for="availability">Availability Hours:</label>
					<div class="insideWrapper">
						<input
							type="text"
							id="availability"
							name="availability"
							placeholder="Enter Best Time to Reach"
							value="09:00-16:00"
							required />

						<select name="timezone">
							<option value="EST" selected>EST</option>
							<option value="BST">BST</option>
							<option value="DST">DST</option>
							<option value="GMT">GMT</option>
							<option value="IST">IST</option>
						</select>
					</div>
				</div>

				<div class="fieldWrapper">
					<label for="workSetup">Work Setup:</label>
					<select name="workSetup">
						<option value="WFH" selected>WFH</option>
						<option value="Office">Office</option>
						<option value="Field">Field</option>
					</select>
				</div>

				<div class="fieldWrapper">
					<label for="contactPreference">Contact Preference:</label>
					<select name="contactPreference">
						<option value="Phone" selected>Phone</option>
						<option value="Teams">Teams</option>
						<option value="Email">Email</option>
					</select>
				</div>

				<div id="onBehalfOfWrapper" class="hidden">
					<fieldset>
						<legend>On Behalf Of</legend>

						<div class="fieldWrapper">
							<label for="OBfullName">Full Name:</label>
							<input
								type="text"
								id="OBfullName"
								name="OBfullName"
								placeholder="Enter Full Name"
								value="N/A"
								required />
						</div>

						<div class="fieldWrapper">
							<label for="OBemail">Email Address:</label>

							<div class="inputWithButtonWrapper">
								<input
									type="text"
									id="OBemail"
									name="OBemail"
									value="N/A@email.com"
									placeholder="Enter Email Address" />
								<input
									type="text"
									id="OBemailProvided"
									name="OBemailProvided"
									value="Provided"
									required />
								<button id="OBemailProvidedButton" type="button">✓</button>
							</div>
						</div>

						<div class="fieldWrapper">
							<label for="OBemployeeId">Employee ID:</label>
							<div class="inputWithButtonWrapper">
								<input
									type="text"
									id="OBemployeeId"
									name="OBemployeeId"
									placeholder="Enter Employee ID"
									value="N/A"
									required />
								<input
									type="text"
									id="OBemployeeIdProvided"
									name="OBemployeeIdProvided"
									value="Provided"
									required />
								<button id="OBemployeeIdProvidedButton" type="button">✓</button>
							</div>
						</div>

						<div class="fieldWrapper">
							<label for="OBcontactNumber">Contact Number:</label>
							<input
								type="text"
								id="OBcontactNumber"
								name="OBcontactNumber"
								placeholder="Enter Contact Number"
								value="N/A"
								required />
						</div>

						<div class="availabilityWrapper">
							<label for="OBavailability">Availability Hours:</label>
							<div class="insideWrapper">
								<input
									type="text"
									id="OBavailability"
									name="OBavailability"
									placeholder="Enter Best Time to Reach"
									value="09:00-16:00"
									required />

								<select name="OBtimezone">
									<option value="EST" selected>EST</option>
									<option value="BST">BST</option>
									<option value="DST">DST</option>
									<option value="GMT">GMT</option>
									<option value="IST">IST</option>
								</select>
							</div>
						</div>

						<div class="fieldWrapper">
							<label for="OBworkSetup">Work Setup:</label>
							<select name="OBworkSetup">
								<option value="WFH" selected>WFH</option>
								<option value="Office">Office</option>
								<option value="Field">Field</option>
							</select>
						</div>

						<div class="fieldWrapper">
							<label for="OBcontactPreference">Contact Preference:</label>
							<select name="OBcontactPreference">
								<option value="Phone" selected>Phone</option>
								<option value="Teams">Teams</option>
								<option value="Email">Email</option>
							</select>
						</div>
					</fieldset>
				</div>

				<div class="fieldWrapper">
					<label for="existingTicket">Existing Ticket?:</label>
					<input
						type="text"
						id="existingTicket"
						name="existingTicket"
						placeholder="Existing Ticket Number"
						value="No"
						required />
				</div>
			</fieldset>

			<!-- Interaction Details -->
			<fieldset>
				<legend>Interaction Details</legend>

				<div class="standardTemplateWrapper">
					<div class="fieldWrapper">
						<label for="possibleMajorIncident">Possible Major Incident?:</label>
						<input
							type="text"
							id="possibleMajorIncident"
							class="hidden"
							name="possibleMajorIncident"
							value="No" />

						<button type="button">No</button>
					</div>

					<div class="fieldWrapper">
						<label for="contactType">Contact Type:</label>
						<input
							type="text"
							class="hidden"
							id="contactType"
							name="contactType"
							value="Phone" />

						<button type="button">Phone</button>
					</div>

					<div class="fieldWrapper">
						<label for="machineName">Device Name:</label>
						<input
							type="text"
							id="machineName"
							name="machineName"
							placeholder="Enter Machine Name"
							value="N/A" />
					</div>

					<div class="fieldWrapper">
						<label for="nexthinkChecklist">Nexthink Checklist:</label>
						<select name="nexthinkChecklist" id="nexthinkChecklist">
							<option value="Not Applicable">Not Applicable</option>
							<option value="Not Available(See Attachment)">
								Not Available(See Attachment)
							</option>
							<option value="Diagnostics Attached">Diagnostics Attached</option>
						</select>
					</div>
				</div>

				<div class="pwrTemplateWrapper hidden">
					<div class="fieldWrapper">
						<label for="resetType">Reset Type:</label>
						<input
							type="text"
							class="hidden"
							id="resetType"
							name="resetType"
							value="Non-AD"
							required />
						<button type="button">Non-AD</button>
					</div>

					<fieldset id="ssprDetailsWrapper" class="hidden">
						<legend>Active Directory SSPR Details</legend>

						<div class="fieldWrapper">
							<label for="newHire">New Hire:</label>
							<input
								type="text"
								class="hidden"
								id="newHire"
								name="newHire"
								value="No"
								required />
							<button type="button">No</button>
						</div>

						<div class="fieldWrapper">
							<label for="mfaRegistered">MFA Registered:</label>
							<input
								type="text"
								class="hidden"
								id="mfaRegistered"
								name="mfaRegistered"
								value="Yes"
								required />
							<button type="button">Yes</button>
						</div>

						<div class="fieldWrapper">
							<label for="ssprOffered">SSPR Offered:</label>
							<input
								type="text"
								class="hidden"
								id="ssprOffered"
								value="No"
								required
								name="ssprOffered" />
							<button type="button">No</button>
						</div>

						<div class="fieldWrapper">
							<label for="ssprOutcome">SSPR Outcome:</label>

							<select id="ssprOutcome" name="ssprOutcome">
								<optgroup label="SSPR Offered: No" id="noOptGroup">
									<option
										value="N/A: User is calling on behalf of someone else."
										selected>
										N/A: User is calling on behalf of someone else..
									</option>
									<option
										value="N/A: User already have an existing ticket for password reset.">
										N/A: User already have an existing ticket for password
										reset.
									</option>
									<option
										value="N/A: User is not yet registered to MFA."
										selected>
										N/A: User is not yet registered to MFA.
									</option>

									<option value="N/A: User's AD account is locked out.">
										N/A: User's AD account is locked out.
									</option>

									<option
										value="N/A: User's AD account is deactivated/disabled.">
										N/A: User's AD account is deactivated/disabled.
									</option>

									<option value="N/A: User is calling for an admin account.">
										N/A: User is calling for an admin account.
									</option>

									<option
										value="N/A: User just had a password reset within 24 hours. Option is still locked.">
										N/A: User just had a password reset within 24 hours. Option
										is still locked.
									</option>
								</optgroup>

								<optgroup
									label="SSPR Offered: Yes"
									id="yesOptGroup"
									class="hidden">
									<option
										value="Success: User was able to change the password via the self-service tool."
										selected>
										Success: User was able to change the password via the
										self-service tool.
									</option>

									<!-- ERROR -->

									<option value="Error: User is unable to access aka.ms/sspr.">
										Error: User is unable to access aka.ms/sspr.
									</option>
									<option
										value="Error: Account doesn't exist. Contact administrator.">
										Error: Account doesn't exist. Contact administrator.
									</option>
									<option
										value="Error: You haven't registered for a password reset.">
										Error: You haven't registered for a password reset.
									</option>

									<!-- FAILED  -->

									<option
										value="Failed: User cannot correctly input the CAPTCHA.">
										Failed: User cannot correctly input the CAPTCHA.
									</option>
									<option
										value="Failed: User unable to change their password due to complexity requirements.">
										Failed: User unable to change their password due to
										complexity requirements.
									</option>
									<option
										value="Failed: The user forgot the answers to the security questions.">
										Failed: The user forgot the answers to the security
										questions.
									</option>
									<option
										value="Failed: User was disconnected; Unable to reach back.">
										Failed: User was disconnected; Unable to reach back.
									</option>

									<!-- USER REFUSED  -->
									<option
										value="User refused: User prefers the agent to do the password change."
										selected>
										User refused: User prefers the agent to do the password
										change.
									</option>
									<option
										value="User refused: User don't want to use their mobile phone.">
										User refused: User don't want to use their mobile phone.
									</option>
									<option
										value="User refused: User prefers to keep their current password.">
										User refused: User prefers to keep their current password.
									</option>
								</optgroup>
							</select>
						</div>
					</fieldset>
				</div>
			</fieldset>

			<!-- Issue Identification and Troubleshooting -->
			<fieldset>
				<legend>Issue Identification and Troubleshooting</legend>
				<label for="issueDescription"> Issue Description: </label>
				<textarea
					name="issueDescription"
					id="issueDescription"
					rows="5"
					placeholder="Describe the issue"
					minlength="50"
					required></textarea>

				<label for="troubleshootingSteps"> Troubleshooting Steps: </label>
				<textarea
					name="troubleshootingSteps"
					id="troubleshootingSteps"
					rows="10"
					placeholder="List the steps taken to troubleshoot the issue"
					required></textarea>

				<div id="standardTemplateAutofillButtonsWrapper">
					<button type="button" id="incidentResolvedAFButton">
						Incident Resolved
					</button>
					<button type="button" id="incidentRoutedAFButton">
						Incident Routed
					</button>
				</div>
			</fieldset>

			<!-- Closing Details -->
			<fieldset>
				<legend>Closing Details</legend>

				<div class="centerWrapper">
					<div class="fieldWrapper">
						<label for="kbArticle">KB Article Used:</label>
						<input
							type="text"
							id="kbArticle"
							name="kbArticle"
							placeholder="Enter KB Article"
							required />
					</div>

					<div class="fieldWrapper">
						<label for="issueResolved">
							<span id="templateDependentText-1">Issue Resolved?:</span>
						</label>
						<input
							type="text"
							class="hidden"
							id="issueResolved"
							name="issueResolved"
							value="No"
							required />
						<button type="button">No</button>
					</div>

					<div id="resolutionNotesWrapper" class="fieldWrapper hidden">
						<label for="resolutionNotes">Resolution Notes:</label>
						<input
							type="text"
							id="resolutionNotes"
							name="resolutionNotes"
							placeholder="Detailed step that resolved the issue"
							value="N/A"
							required />
					</div>

					<div class="fieldWrapper">
						<label for="nextActions">Next Action(s):</label>
						<select id="nextActions" name="nextActions">
							<optgroup
								label="Select Option"
								id="standardTemplateExclusiveOptGroup">
								<option value="Complete the interaction">
									Complete the interaction
								</option>
								<option value="Cancelled the ticket">
									Cancelled the ticket
								</option>
								<option value="Escalated the ticket">
									Escalated the ticket
								</option>
								<option value="Set Ticket to 'On Hold' Status">
									Set Ticket to 'On Hold' Status
								</option>
								<option value="Set Ticket to 'Resolved' Status">
									Set Ticket to 'Resolved' Status
								</option>
								<option value="Route the Ticket to the Next Resolver Team">
									Route the Ticket to the Next Resolver Team
								</option>
							</optgroup>

							<optgroup
								label="Select Option"
								id="pwrTemplateExclusiveOptGroup"
								class="hidden">
								<option value="Complete the interaction">
									Complete the interaction
								</option>
								<option value="Cancelled the ticket">
									Cancelled the ticket
								</option>
								<option value="Escalated the ticket">
									Escalated the ticket
								</option>
								<option value="Set Ticket to 'Fulfilled' Status">
									Set Ticket to 'Fulfilled' Status
								</option>
								<option value="Line Manager's Approval Required">
									Line Manager's Approval Required
								</option>
							</optgroup>
						</select>
					</div>

					<div class="fieldWrapper">
						<label for="userAgreedResolved">
							<span id="templateDependentText-2">
								User agreed to set ticket to 'Resolved'?
							</span>
						</label>
						<input
							type="text"
							class="hidden"
							id="userAgreedResolved"
							name="userAgreedResolved"
							value="No"
							required />
						<button type="button">No</button>
					</div>

					<div class="fieldWrapper">
						<label for="ticketNumber">Ticket Number:</label>
						<input
							type="text"
							id="ticketNumber"
							name="ticketNumber"
							placeholder="Not visible when copied"
							required />
					</div>
				</div>
			</fieldset>

			<!-- Field Controls -->
			<fieldset id="normalModeWrapper">
				<legend>Field Controls</legend>
				<button type="submit" id="saveNoteButton">Save Note & Copy</button>
				<button type="button" id="newNoteButton">New Note</button>
				<button type="button" id="newNoteUserRetainedButton">
					New Note(Multiple Issue)
				</button>
				<button type="button" id="cancelButton">Cancel</button>
			</fieldset>

			<fieldset id="editModeWrapper" class="hidden">
				<legend>Edit Mode Controls</legend>
				<button type="button" id="saveChangesButton">
					Save Changes & Copy to Clipboard
				</button>
				<button type="button" id="cancelEditButton">Cancel Edit</button>
			</fieldset>
		</form>