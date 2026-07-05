const storageState = {
  record: null,
  currentSessionName: "",
  sessionList: [],

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

    // alert(`Session Loaded: ${this.getCurrentSessionName()}`);
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

const fieldState = {
  fieldModified: false,
  fieldSaved: false,
  fieldData: {},
  IsCaller: true,
  IsIncident: true,
  IsAD: false,
  IsResolved: false,

  // SETTERS //

  setFieldModified: function (value) {
    this.fieldModified = value;
  },

  setFieldSaved: function (value) {
    this.fieldSaved = value;
  },

  setFieldData: function (value) {
    this.fieldData = value;
  },

  setIsCaller: function (value) {
    this.IsCaller = value;
  },

  setIsIncident: function (value) {
    this.IsIncident = value;
  },

  setIsAD: function (value) {
    this.IsAD = value;
  },

  // GETTERS //

  getFieldModified: function () {
    return this.fieldModified;
  },

  getFieldSaved: function () {
    return this.fieldSaved;
  },

  getFieldData: function () {
    return this.fieldData;
  },

  getIsCaller: function () {
    return this.IsCaller;
  },

  getIsIncident: function () {
    return this.IsIncident;
  },

  getIsAD: function () {
    return this.IsAD;
  },
  // HELPERS //

  onSaveHelper: function (data) {
    console.log(this);
    if (this.getFieldModified() === false) {
      alert("No changes detected! Please modify the form before saving.");
      return;
    }

    if (this.getFieldSaved() === false) {
      this.setFieldSaved(true);
    }

    // console.log(data);
    this.setFieldData(data);
    copyToClipboard(data);

    alert("Record Saved and Copied to Clipboard");
  },

  onNewNoteHelper: function () {
    if (this.getFieldSaved() === false && this.getFieldModified() === false) {
      alert("No changes detected! Please modify the form before saving.");
      return;
    }

    if (this.getFieldSaved() === false && this.getFieldModified() === true) {
      alert("Please save current record Or cancel it first.");
      return;
    }

    storageState.syncWithLocalStorage(this.getFieldData());
    this.resetState();
    controlPanelDisplayState.renderAllControlPanelList();
  },

  resetState: function () {
    this.setFieldModified(false);
    this.setFieldSaved(false);
    this.setFieldData({});
    this.setIsCaller(true);
    this.setIsIncident(true);
    this.setIsAD(false);

    window.location.href = "#ticketForm";
  },

  isAllowedtoSwitchSession: function () {
    return this.getFieldSaved() === false && this.getFieldModified() === false
      ? true
      : false;
  },

  fieldCleaner: function (data) {
    let filteredDataOne = { ...data };
    filteredDataOne.isCaller = false;

    if (this.getIsCaller() === true) {
      const {
        OBemployeeId,
        OBemployeeLocation,
        OBfullName,
        OBemail,
        OBcontactNumber,
        OBavailability,
        OBtimezone,
        ...OBremoved
      } = data;

      filteredDataOne = OBremoved;
      filteredDataOne.isCaller = true;
    }

    let filteredDataTwo = null;

    if (this.getIsIncident() === true) {
      const {
        newHire,
        mfaRegistered,
        ssprOffered,
        ssprOutcome,
        ticketFulfilled,
        userAgreedFulfill,
        ...purified
      } = filteredDataOne;

      filteredDataTwo = purified;
      filteredDataTwo.isIncident = true;
    } else {
      if (this.getIsAD() === true) {
        const {
          possibleMajorIncident,
          contactType,
          machineName,
          nexthinkChecklist,
          issueResolved,
          userAgreedResolved,
          ...purified
        } = filteredDataOne;
        filteredDataTwo = purified;
        filteredDataTwo.isAD = true;
      } else {
        const {
          newHire,
          mfaRegistered,
          ssprOffered,
          ssprOutcome,
          possibleMajorIncident,
          contactType,
          machineName,
          nexthinkChecklist,
          issueResolved,
          userAgreedResolved,
          ...purified
        } = filteredDataOne;
        filteredDataTwo = purified;
        filteredDataTwo.isAD = false;
      }

      filteredDataTwo.isIncident = false;
    }

    console.log(filteredDataTwo);
    return filteredDataTwo;
  },
};

const fieldUI = {
  util: {
    onBehalfOfWrapper: document.querySelector("#onBehalfOfWrapper"),
    incTemplateWrapper: document.querySelector(".incTemplateWrapper"),
    pwrTemplateWrapper: document.querySelector(".pwrTemplateWrapper"),
    ssprTemplateWrapper: document.querySelector(".ssprTemplateWrapper"),
    callTypeButton: document.querySelector("#callTypeButton"),
    templateTypeButton: document.querySelector("#templateTypeButton"),
    templateDependentTexts: document.querySelectorAll(".templateDependentText"),

    onBehalfOfWrapperSwitchVisibility: function () {
      this.onBehalfOfWrapper.classList.toggle("hidden");
    },

    incTemplateWrapperSwitchVisibility: function () {
      this.incTemplateWrapper.classList.toggle("hidden");
    },

    pwrTemplateWrapperSwitchVisibility: function () {
      this.pwrTemplateWrapper.classList.toggle("hidden");
    },

    ssprTemplateWrapperSwitchVisibility: function () {
      this.ssprTemplateWrapper.classList.toggle("hidden");
    },

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
  },

  resetSwitch: function () {
    const switchClickButtons = document.querySelectorAll(".switch-click");

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
    if (fieldState.getIsIncident() === false) {
      this.util.templateTypeButton.click();
    }
  },

  reset: function () {
    this.resetSwitch();
    this.resetCallType();
    this.resetTemplateType();
    this.util.backToTop();
  },

  setupSwitch(element, options = ["No", "Yes"], handler = null) {
    let current = 0;

    element.value = options[current];
    element.style.display = "none";

    const parent = element.parentElement;
    const button = document.createElement("button");

    button.textContent = options[current];
    button.type = "button";
    button.classList.add("switch-btn");

    button.addEventListener("click", () => {
      current = 1 - current;
      button.textContent = options[current];
      element.value = options[current];
      if (handler !== null) {
        handler();
      }
    });

    parent.appendChild(button);
  },

  initSwitch: function () {
    // INC
    this.setupSwitch(document.querySelector("[name=possibleMajorIncident]"));
    this.setupSwitch(document.querySelector("[name=contactType]"), [
      "Phone",
      "Chat",
    ]);

    // PWR
    this.setupSwitch(document.querySelector("[name=newHire]"));
    this.setupSwitch(document.querySelector("[name=mfaRegistered]"));

    this.setupSwitch(
      document.querySelector("[name=issueResolved]"),
      ["No", "Yes"],
      () => fieldState.setIsResolved(!fieldState.getIsResolved()),
    );

    this.setupSwitch(document.querySelector("[name=userAgreedResolved]"));

    this.setupSwitch(
      document.querySelector("[name=ssprOffered]"),
      ["No", "Yes"],
      () => {
        const noOptGroup = document.querySelector("#noOptGroup");
        const yesOptGroup = document.querySelector("#yesOptGroup");

        noOptGroup.hidden = !noOptGroup.hidden;
        yesOptGroup.hidden = !yesOptGroup.hidden;
      },
    );
  },

  initCallTypeSwitch: function () {
    const callTypeButton = document.querySelector("#callTypeButton");
    const options = ["Caller", "On Behalf Of"];
    let current = 0;

    callTypeButton.addEventListener("click", (e) => {
      fieldState.setIsCaller(!fieldState.getIsCaller());
      this.util.onBehalfOfWrapperSwitchVisibility();
      current = 1 - current;
      callTypeButton.textContent = options[current];
    });
  },

  initTemplateTypeSwitch: function () {
    const templateTypeButton = document.querySelector("#templateTypeButton");
    const options = ["Standard", "Password Reset"];
    let current = 0;

    templateTypeButton.addEventListener("click", (e) => {
      e.preventDefault();
      fieldState.setIsIncident(!fieldState.getIsIncident());
      this.util.incTemplateWrapperSwitchVisibility();
      this.util.pwrTemplateWrapperSwitchVisibility();
      current = 1 - current;
      templateTypeButton.textContent = options[current];
      this.util.switchTemplateDependentTexts(current);
    });
  },

  initSSPRTemplateSwitch: function () {
    const ssprSwitchButton = document.querySelector("#ssprSwitchButton");

    ssprSwitchButton.addEventListener("click", (e) => {
      e.preventDefault();
      fieldState.setIsAD(!fieldState.getIsAD());
      console.log(`isAD: ${fieldState.getIsAD()}`);
      this.util.ssprTemplateWrapperSwitchVisibility();
    });
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

  initField: function () {
    const documentationField = document.querySelector("#documentationField");
    documentationField.addEventListener("input", () => {
      fieldState.setFieldModified(true);
    });

    documentationField.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      const cleanedData = fieldState.fieldCleaner(data);
      fieldState.onSaveHelper(cleanedData);
    });

    const resetButton = document.querySelector("#cancelButton");
    resetButton.addEventListener("click", () => {
      if (
        confirm(
          "Are you sure you want to cancel? All unsaved changes will be lost.",
        )
      ) {
        fieldState.resetState();
        documentationField.reset();
        this.reset();
      }
    });

    const newNoteButton = document.querySelector("#newNoteButton");
    newNoteButton.addEventListener("click", () => {
      fieldState.onNewNoteHelper();
      documenttionField.reset();
      this.reset();
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

const controlPanelDisplayState = {
  controlPanelElement: document.querySelector(".control-panel"),
  controlPanelCurrentSessionNameElement: document.querySelector(
    "#currentSessionName",
  ),
  controlPanelSessionListElement: document.querySelector("#session-list"),
  controlPanelExportSessionListElement:
    document.querySelector("#exportable-list"),
  controlPanelSessionHistoryElement: document.querySelector("#session-history"),

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
          this.renderAllControlPanelList();

          return;
        }
        alert(
          "Please SAVE current work before switching or CANCEL if you want to abandon work",
        );
      });
      li.appendChild(button);
      this.controlPanelSessionListElement.appendChild(li);
    });
  },

  renderExportSessionList: function () {
    this.controlPanelExportSessionListElement.replaceChildren();
    const sessionList = storageState.getSessionList();
    sessionList.forEach((session) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = session;
      button.addEventListener("click", () => {
        this.renderSessionHistory(session);
      });
      li.appendChild(button);
      this.controlPanelExportSessionListElement.appendChild(li);
    });
  },

  renderSessionHistory: function (sessionName) {
    this.controlPanelSessionHistoryElement.replaceChildren();

    const exportAllButton = document.createElement("button");
    exportAllButton.textContent = "Export ALL";
    exportAllButton.addEventListener("click", () => exportSession(sessionName));

    this.controlPanelSessionHistoryElement.appendChild(exportAllButton);

    const sessionHistory = JSON.parse(localStorage.getItem(sessionName));

    sessionHistory.forEach((record) => {
      const button = document.createElement("button");
      const doctype = record.isIncident ? "Incident" : "Password Reset";
      button.textContent = `${record.fullName} | ${doctype}`;
      button.addEventListener("click", () => {
        exportIndividualRecord(record);
      });
      this.controlPanelSessionHistoryElement.appendChild(button);
    });
  },

  renderAllControlPanelList: function () {
    console.log("render all called");
    this.renderSessionList();
    this.renderExportSessionList();
  },

  init: function () {
    const hideControlPanelButton = document.querySelector(
      "#hide-control-panel",
    );

    hideControlPanelButton.addEventListener("click", () => {
      if (this.controlPanelElement.style.display === "none") {
        this.controlPanelElement.style.display = "block";
        hideControlPanelButton.textContent = "HIDE CONTROL PANEL";
      } else {
        this.controlPanelElement.style.display = "none";
        hideControlPanelButton.textContent = "SHOW CONTROL PANEL";
      }
    });

    this.renderCurrentSessionName(storageState.getCurrentSessionName());

    this.renderAllControlPanelList();
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
  let onBehalfDetails = "";
  if (!data.isCaller) {
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
  if (data.isResolved === "Yes") {
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

RESOLUTION NOTES:
${data.resolutionNotes}

KB Article: ${data.kbArticle}
Ticket Fulfilled: ${data.ticketFulfilled}
Next Action(s): ${data.nextActions}
User agreed to fulfill ticket? ${data.userAgreedResolved}`;

  return documentation;
}

function init() {
  // window.addEventListener("beforeunload", (e) => {
  // 	e.preventDefault();
  // });

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
