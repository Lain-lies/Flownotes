const fieldUI = {
	util: {
		backToTop: function () {
			window.location.href = "#documentationField";
		},

		switchTemplateDependentTexts: function (option) {
			const issueResolvedTextOptions = [
				"Issue Resolved?:",
				"Ticket Fulfilled?:",
			];

			const userAgreedResolvedTextOptions = [
				"User agreed to set ticket to 'Resolved'?:",
				"User agreed to set ticket to 'Fulfilled'?:",
			];

			this.templateDependentTexts[0].textContent =
				issueResolvedTextOptions[option];
			this.templateDependentTexts[1].textContent =
				userAgreedResolvedTextOptions[option];
		},

		isAllowedToNewNote() {
			if (
				fieldState.getFieldSaved() === false &&
				fieldState.getFieldModified() === false
			) {
				alert("No changes detected");
				return false;
			}
			if (
				fieldState.getFieldSaved() === false &&
				fieldState.getFieldModified() === true
			) {
				alert("Please save current note");
				return false;
			}

			return true;
		},

		injectValuesToField(data) {
			Object.entries(data).forEach(([name, value]) => {
				const field = document.querySelector(`[name="${name}"]`);
				if (field) {
					field.value = value;

					if (
						field.nextElementSibling &&
						field.nextElementSibling.classList.contains("switchClickButton") &&
						field.nextElementSibling.textContent !== value
					) {
						field.nextElementSibling.click();
					}
				}
			});
		},
	},

	resetSwitch: function () {
		const switchClickButtons = document.querySelectorAll(".switchClickButton");

		switchClickButtons.forEach((button) => {
			button.remove();
		});

		this.initSwitch();
	},

	resetCallType: function () {
		if (fieldState.getIsCaller() === false) {
			this.util.callTypeButton.click();
		}
	},

	resetTemplateType: function () {
		fieldState.debug();
		if (fieldState.getIsIncident() === false) {
			this.util.templateTypeButton.click();
			console.log(1);
		}
	},

	reset: function () {
		this.resetSwitch();
		this.resetCallType();
		this.resetTemplateType();
		this.util.resolutionNotesWrapperSwitchVisibility();
		this.util.backToTop();
	},

	initAutoFillMinimumDataSet: function () {
		const element = document.querySelector("[name=troubleshootingSteps]");
		const parent = element.parentElement;

		const buttonOne = document.createElement("button");
		buttonOne.textContent = "PW Reset VERIFIED";
		const buttonTwo = document.createElement("button");
		buttonTwo.textContent = "PW Reset NOT VERIFIED";

		const buttonThree = document.createElement("button");
		buttonThree.textContent = "Incident Routed";
		const buttonFour = document.createElement("button");
		buttonFour.textContent = "Incident Resolved";

		buttonOne.type = "button";
		buttonTwo.type = "button";
		buttonThree.type = "button";
		buttonFour.type = "button";

		buttonOne.addEventListener("click", () => {
			const resetType = element.value;
			element.value = `
- Checked Users account via ${resetType}
- User account is active
- Verified the user via verification tool
- User is verified
- Successfully reset user's password 
- Provided the password to the user
- User tried the password on his/her end
- User successfully signed in
- Provided ticket number to user
- User acknowledged
- End call`;
		});

		buttonTwo.addEventListener("click", () => {
			const resetType = element.value;
			element.value += `
- Checked Users account via  ${resetType}
- Verified the user via verification tool
- User is not verified
- Filed a password reset request for user 
- Advised user that the request is subject to line-manager's approval
- Provided Ticket Number
- User Acknowledged
- End call`;
		});

		buttonThree.addEventListener("click", () => {
			element.value += `
- Advised user ticket will be routed to [NAME] team
- Provided ticket number to the user
- User Acknowledged
- End call`;
		});

		buttonFour.addEventListener("click", () => {
			element.value += `
- Issue Resolved
- Provided ticket number to the user
- Confirmed with user ticket can now be set to resolved
- End call`;
		});
		parent.appendChild(buttonOne);
		parent.appendChild(buttonTwo);
		parent.appendChild(buttonThree);
		parent.appendChild(buttonFour);
	},

	initTextAreaAutoFormat: function () {
		const resolutionNotesElement = document.querySelector(
			"[name=troubleshootingSteps]",
		);

		resolutionNotesElement.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				e.target.value += `
- `;
			}
		});

		const issueDescriptionElement = document.querySelector(
			"[name=issueDescription]",
		);

		issueDescriptionElement.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				e.target.value += `
- `;
			}
		});
	},

	initKBShortcut: function () {
		const kbaElement = document.querySelector("[name=kbArticle]");

		const shortcuts = {
			ad: "KB0034635",
			css: "KB0036245",
			ds: "KB0036249",
			ldap: "KB0034367",
			cwq: "KB0034367",
			arcos: "KB0011194",
			max: "KB0050099",
			power: "KB0010724",
			sap: "KB0028648",
			win11: "KB0042494",
			laptop: "KB0041117",
			mobile: "KB0041555",
			avd: "KB0042642",
			o365: "KB0034763",
			outlook: "KB0035272",
			intune: "KB0035752",
			mfa: "KB0040875",
			myhub: "KB0040883",
			teams: "KB0041367",
			adsup: "KB0035746",
		};

		kbaElement.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				const value = shortcuts[e.target.value];
				if (value === null || value === undefined) return;
				e.target.value = value;
			}
		});
	},

	initSaveChangesButton: function () {
		const saveChangesButton = document.querySelector("#saveChangesButton");

		saveChangesButton.addEventListener("click");
	},

	initField: function () {
		const documentationField = document.querySelector("#documentationField");
		documentationField.addEventListener("input", () => {
			fieldState.setFieldModified(true);
		});

		documentationField.addEventListener("submit", (event) => {
			event.preventDefault();
			const formData = new FormData(event.target);
			const data = Object.fromEntries(formData.entries());
			const cleanedData = fieldState.fieldDataFilter(data);
			fieldState.onSaveHelper(cleanedData);
		});

		const resetButton = document.querySelector("#cancelButton");
		resetButton.addEventListener("click", () => {
			if (
				confirm(
					"Are you sure you want to cancel? All unsaved changes will be lost.",
				)
			) {
				documentationField.reset();
				this.reset();
				fieldState.resetState();
			}
		});

		const newNoteButton = document.querySelector("#newNoteButton");
		newNoteButton.addEventListener("click", () => {
			if (this.util.isAllowedToNewNote()) {
				documentationField.reset();
				this.reset();
				fieldState.onNewNoteHelper();
			}
			return;
		});

		const newNoteUserInfoRetainedButton = document.querySelector(
			"#newNoteUserInfoRetainedButton",
		);
		newNoteUserInfoRetainedButton.addEventListener("click", () => {
			if (!this.util.isAllowedToNewNote()) return;
			const {
				employeeId,
				fullName,
				email,
				contactNumber,
				availability,
				timezone,
				location,
				OBemployeeId,
				OBfullName,
				OBemail,
				OBcontactNumber,
				OBavailability,
				OBtimezone,
				OBlocation,
			} = fieldState.getFieldData();

			const userEntitlementData = {
				employeeId,
				fullName,
				email,
				contactNumber,
				availability,
				timezone,
				location,
				OBemployeeId,
				OBfullName,
				OBemail,
				OBcontactNumber,
				OBavailability,
				OBtimezone,
				OBlocation,
			};

			documentationField.reset();
			this.reset();
			fieldState.onNewNoteHelper();
			console.log(userEntitlementData);

			Object.entries(userEntitlementData).forEach(([name, value]) => {
				const field = document.querySelector(`[name="${name}"]`);

				if (field) {
					field.value = value;

					const switchButton =
						field.parentElement?.querySelector(".switch-click");

					if (switchButton) {
						switchButton.textContent = value;
					}
				}
			});
		});
	},

	init() {
		this.initSwitch();
		this.initCallTypeSwitch();
		this.initTemplateTypeSwitch();
		this.initSSPRTemplateSwitch();
		this.initAutoFillMinimumDataSet();
		this.initTextAreaAutoFormat();
		this.initKBShortcut();
		this.initField();
	},
};
