import { BACKEND_PORT } from './config.js';
import { fileToDataUrl } from './helpers.js';

// Initial variables
let focusedChannelNumber;
let startMessagesNumber = 0;

// Checking if user is logged in
function checkLoggedIn() {
  let isLoggedIn;
  if (localStorage.getItem("userId") == null || localStorage.getItem("userId") == "") {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }
  if (isLoggedIn) {
    try {
      document.body.removeChild(document.getElementsByClassName("main")[0]);
    } catch (error) {
      errorPopup(error);
    }
    // If user is logged in show the channel page
    createChannelPage();
  } else {
    // If not show the login/sign up form
    createLoginForm();
  }
}

checkLoggedIn();

// Adding channels in sidebar function
function addChannelinSidebar(channelDetails) {
  const li = document.createElement("li");
  li.id = channelDetails.id;
  const privateIconElement = document.createElement('i');
  privateIconElement.className = 'fa-solid fa-lock';
  privateIconElement.style.color = "red";

  const publicIconElement = document.createElement('i');
  publicIconElement.className = 'fa-solid fa-lock-open';
  publicIconElement.style.color = "green";

  const a = document.createElement("a");
  a.className = "channel-names"
  a.href = "channels/" + channelDetails.id;
  a.textContent = "# " + channelDetails.name;
  // Adding event listeners when clicked on channel name
  a.addEventListener("click", function (event) {
    event.preventDefault();
    let elementsToRemove = document.getElementsByClassName("message-box");
    elementsToRemove = Array.from(elementsToRemove);
    elementsToRemove.forEach(function (element) {
      document.getElementsByClassName("inside")[0].removeChild(element);
    });
    startMessagesNumber = 0;
    document.getElementById("main-heading-channel-name").innerText = "# " + channelDetails.name;
    let URL = event.target.href.split("/");
    let channelId = URL[URL.length - 1];
    // Fetching messages of clicked channel
    fetchMessages(channelId, startMessagesNumber);
  });
  //Identification for channel's public/private status
  if (channelDetails.private) {
    li.appendChild(privateIconElement);
  } else {
    li.appendChild(publicIconElement);
  }
  li.appendChild(a);
  let channelsUl = document.querySelector(".channels ul");
  channelsUl.appendChild(li);
}

// Creating the main channel section
function createChannelPage() {
  const mainDiv = document.createElement("div");
  mainDiv.className = "main";

  const mainSidebarDiv = document.createElement("div");
  mainSidebarDiv.className = "main-sidebar";

  const profileSidebarDiv = document.createElement("div");
  profileSidebarDiv.className = "profile-sidebar";

  const logoDiv = document.createElement("div");
  logoDiv.className = "logo-div";

  const logoImg = document.createElement("img");
  logoImg.src = "./resources/logo.png";
  logoImg.alt = "App's Logo";

  const parentIconsDiv = document.createElement("div");
  parentIconsDiv.className = "parent-icons";

  const iconsDiv = document.createElement("div");
  iconsDiv.className = "icons";

  const ul = document.createElement("ul");
  const userIcon = document.createElement("li");
  const userIconLink = document.createElement("a");
  userIconLink.href = "";
  const userIconI = document.createElement("i");
  userIconI.className = "fa-regular fa-user";
  userIconLink.appendChild(userIconI);
  userIcon.appendChild(userIconLink);

  //Non-editable users profile section
  userIcon.addEventListener("click", function (e) {
    e.preventDefault();
    const actualProfilePopup = document.getElementById('actual-profile-popup');
    const close = document.getElementsByClassName('close')[9];
    actualProfilePopup.style.display = 'flex';
    updateActualProfile();
    close.addEventListener('click', () => {
      actualProfilePopup.style.display = 'none';
    });
  })

  // Notification pop-up
  const bellIcon = document.createElement("li");
  const bellIconLink = document.createElement("a");
  bellIconLink.href = "";
  const bellIconI = document.createElement("i");
  bellIconI.className = "fa-regular fa-bell";
  bellIconLink.appendChild(bellIconI);
  bellIcon.appendChild(bellIconLink);
  // On click event for notification pop up
  bellIcon.addEventListener("click", function (e) {
    const notificationPopup = document.getElementById('notification-popup');
    e.preventDefault()
    notificationPopup.style.display = 'flex';
    const closee = document.getElementById("removeClose");
    closee.addEventListener("click", function () {
      notificationPopup.style.display = 'none';
    });
  })
  // Joining public channel section
  const addChannel = document.createElement("li");
  const addChannelLink = document.createElement("a");
  addChannelLink.href = "";
  const addChannelI = document.createElement("i");
  addChannelI.className = "fa-solid fa-globe";
  addChannelLink.appendChild(addChannelI);
  addChannel.appendChild(addChannelLink);
  addChannel.addEventListener("click", function (e) {
    e.preventDefault();
    const allChannelPopup = document.getElementById('all-channel-popup');
    const close = document.getElementsByClassName('close')[3];
    addAllChannelsInAllChannelDiv();
    allChannelPopup.style.display = 'flex';
    close.addEventListener('click', () => {
      let elementsToRemove = document.querySelectorAll(".all-channel-list li");
      elementsToRemove = Array.from(elementsToRemove);
      elementsToRemove.forEach(function (element) {
        document.getElementsByClassName("all-channel-list")[0].removeChild(element);
      });
      allChannelPopup.style.display = 'none';
    });
  })
  //Creating channel section
  const createChannelIcon = document.createElement("li");
  const createChannelLink = document.createElement("a");
  createChannelLink.href = "";
  const createChannelI = document.createElement("i");
  createChannelI.className = "fa-solid fa-plus";
  createChannelLink.appendChild(createChannelI);
  createChannelIcon.appendChild(createChannelLink);
  // On click event listener for creating channel section
  createChannelIcon.addEventListener("click", function (e) {
    e.preventDefault()
    const newChannelPopup = document.getElementById('new-channel-popup');
    newChannelPopup.style.display = 'flex';
    const close = document.getElementsByClassName('close')[5];
    close.addEventListener('click', () => {
      document.getElementById("channelName").value = "";
      document.getElementById("description").value = "";
      document.getElementsByClassName("submit-btn-1")[0].value = "Create channel"
      document.getElementsByClassName("submit-btn-1")[0].style.backgroundColor = "#C04605";
      newChannelPopup.style.display = 'none';
    });
  })
  ul.appendChild(userIcon);
  ul.appendChild(bellIcon);
  ul.appendChild(addChannel);
  ul.appendChild(createChannelIcon);
  iconsDiv.appendChild(ul);

  const additionalIconsDiv = document.createElement("div");
  additionalIconsDiv.className = "additional-icons";
  // Log out section
  const logoutLink = document.createElement("a");
  logoutLink.href = "";
  const logoutI = document.createElement("i");
  logoutI.className = "fa-solid fa-right-from-bracket";
  logoutLink.appendChild(logoutI);

  // Event listener for logout section
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    const logoutPopup = document.getElementById('logout-popup');
    const close = document.getElementsByClassName('close')[6];
    e.preventDefault()
    logoutPopup.style.display = 'flex';
    document.getElementsByClassName('yes')[0].addEventListener('click', () => {
      localStorage.setItem("userId", "");
      localStorage.setItem("token", "");
    });
    close.addEventListener('click', () => {
      logoutPopup.style.display = 'none';
    });
    document.getElementsByClassName('no')[0].addEventListener('click', () => {
      logoutPopup.style.display = 'none';
    });
  })
  additionalIconsDiv.appendChild(logoutLink);

  // Settings for edit profile section
  const gearIconLink = document.createElement("a");
  gearIconLink.href = "";
  const gearIconI = document.createElement("i");
  gearIconI.className = "fa-solid fa-gear edit-settingss";
  gearIconLink.appendChild(gearIconI);
  gearIconLink.addEventListener("click", addEditProfileSection);
  additionalIconsDiv.appendChild(gearIconLink);

  parentIconsDiv.appendChild(iconsDiv);
  parentIconsDiv.appendChild(additionalIconsDiv);
  logoDiv.appendChild(logoImg);
  profileSidebarDiv.appendChild(logoDiv);
  profileSidebarDiv.appendChild(parentIconsDiv);

  const channelsSidebarDiv = document.createElement("div");
  channelsSidebarDiv.className = "channels-sidebar";

  const h1Overview = document.createElement("h1");
  h1Overview.textContent = "Overview";

  const channelsDiv = document.createElement("div");
  channelsDiv.className = "channels";

  const h3Channels = document.createElement("h3");
  h3Channels.textContent = "Channels ";
  const angleDownIcon = document.createElement("i");
  angleDownIcon.className = "fa-solid fa-angle-down";
  h3Channels.appendChild(angleDownIcon);

  let channelsUl = document.createElement("ul");
  let channelList = []
  // List of all the channels joined by the user
  fetch('http://localhost:5005/' + "channel", {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      // Handling error
      if (data.error) {
        errorPopup(data.error);
      } else {
        channelList = data.channels;
        for (let i = 0; i < channelList.length; i++) {
          if (channelList[i].members.includes(parseInt(localStorage.getItem("userId")))) {
            // Adding joined channels in sidebar
            addChannelinSidebar(channelList[i]);
          }
        }
      }
    });

  channelsDiv.appendChild(h3Channels);
  channelsDiv.appendChild(channelsUl);

  channelsSidebarDiv.appendChild(h1Overview);
  channelsSidebarDiv.appendChild(channelsDiv);


  mainSidebarDiv.appendChild(profileSidebarDiv);
  mainSidebarDiv.appendChild(channelsSidebarDiv);

  const contentDiv = document.createElement("div");
  contentDiv.className = "content-div";

  const channelHeaderDiv = document.createElement("div");
  channelHeaderDiv.className = "channel-header";

  const h3ChannelName = document.createElement("h3");
  h3ChannelName.id = "main-heading-channel-name"
  h3ChannelName.textContent = "";

  const additionalInfoDiv = document.createElement("div");
  additionalInfoDiv.className = "additional-info";

  // Invite user section
  const inviteUser = document.createElement("a");
  inviteUser.href = "";
  const inviteIcon = document.createElement("i");
  inviteIcon.className = "fa-solid fa-user-plus";
  inviteUser.appendChild(inviteIcon);
  inviteUser.addEventListener("click", function (event) {
    event.preventDefault()
    const invitePopup = document.getElementById('invite-popup');
    const close = document.getElementsByClassName('close')[8];
    close.addEventListener('click', () => {
      invitePopup.style.display = 'none';
    });
    invitePopup.style.display = 'flex';
    addAllInviteUsers();
  })

  // List of all the members in the channel section
  const memberPopupButton = document.createElement("a");
  memberPopupButton.href = "";
  const userGroupIcon = document.createElement("i");
  userGroupIcon.className = "fa-solid fa-user-group";
  memberPopupButton.appendChild(userGroupIcon);
  memberPopupButton.addEventListener("click", function (event) {
    event.preventDefault()
    addChannelMembersPopUp()
    const membersPopup = document.getElementById('members-popup');
    const close = document.getElementsByClassName('close')[0];
    membersPopup.style.display = 'flex';
    close.addEventListener('click', () => {
      let elementsToRemove = document.querySelectorAll(".members-list li");
      elementsToRemove = Array.from(elementsToRemove);
      elementsToRemove.forEach(function (element) {
        document.getElementsByClassName("members-list")[0].removeChild(element);
      });
      membersPopup.style.display = 'none';
    });
  })

  // Channel details section
  const popupButton = document.createElement("a");
  popupButton.href = "";
  const circleInfoIcon = document.createElement("i");
  circleInfoIcon.className = "fa-solid fa-circle-info";
  // onclick event for channel detail section
  circleInfoIcon.addEventListener("click", function (e) {
    e.preventDefault();
    updateChannelDetails();
    document.getElementById("leave").innerText = "Leave channel";
    document.getElementById("leave").style.backgroundColor = "#CA3535";
    document.getElementById("leave").addEventListener("click", function (e) {
      e.preventDefault();
      // Fetching all the channel details
      fetch('http://localhost:5005/' + "channel/" + focusedChannelNumber.toString() + "/leave", {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("token").toString(),
          'Content-type': 'application/json',
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            errorPopup(data.error);
          } else {
            document.getElementById(focusedChannelNumber).remove();
            let elementsToRemove = document.getElementsByClassName("message-box");
            elementsToRemove = Array.from(elementsToRemove);
            elementsToRemove.forEach(function (element) {
              document.getElementsByClassName("inside")[0].removeChild(element);
            });
            document.getElementById("main-heading-channel-name").innerText = "";
            document.getElementById("leave").innerText = "Channel Left";
            document.getElementById("leave").style.backgroundColor = "green";
            setTimeout(() => {
              document.getElementById("channel-popup").style.display = "none";
            }, 500);
          }
        });
    })
    let channelPopup = document.getElementById('channel-popup');
    const close = document.getElementsByClassName('close')[1];
    channelPopup.style.display = 'flex';

    close.addEventListener('click', () => {
      document.getElementById("leave").innerText = "Leave channel";
      document.getElementById("leave").style.backgroundColor = "#CA3535";
      channelPopup.style.display = 'none';
    });
  });

  popupButton.appendChild(circleInfoIcon);
  additionalInfoDiv.appendChild(inviteUser);

  additionalInfoDiv.appendChild(memberPopupButton);
  additionalInfoDiv.appendChild(popupButton);

  channelHeaderDiv.appendChild(h3ChannelName);
  channelHeaderDiv.appendChild(additionalInfoDiv);

  // All channel messages section
  const messageContentDiv = document.createElement("div");
  messageContentDiv.className = "message-content";

  const insideDiv = document.createElement("div");
  insideDiv.className = "inside";

  messageContentDiv.appendChild(insideDiv);

  const chatBoxDiv = document.createElement("div");
  chatBoxDiv.className = "chat-box";

  // message input bar
  const textarea = document.createElement("textarea");
  textarea.id = "message-input-box"
  textarea.name = "";
  textarea.cols = "30";
  textarea.rows = "1";
  textarea.placeholder = "Write Something!";

  // Send message button
  const submitButton = document.createElement("button");
  const submitIcon = document.createElement("i");
  submitIcon.className = "fa-solid fa-location-arrow";
  submitButton.style.cursor = "pointer";
  submitButton.addEventListener("click", function (e) {
    if (document.getElementById("message-input-box").value == "") {
      errorPopup("Message Cannot Be Empty!");
      return;
    }
    e.preventDefault();
    // Request for updating the database with current user's message
    fetch('http://localhost:5005/' + "message/" + focusedChannelNumber.toString(), {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("token").toString(),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "message": document.getElementById("message-input-box").value
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          errorPopup(data.error);
        } else {
          fetch('http://localhost:5005/' + "message/" + focusedChannelNumber + "?start=" + 0, {
            method: 'GET',
            headers: {
              'Authorization': localStorage.getItem("token").toString(),
              'Content-type': 'application/json',
            }
          })
            .then((response) => response.json())
            .then((data) => {
              data = {
                "id": data.messages[0].id,
                "sender": localStorage.getItem("userId"),
                "message": document.getElementById("message-input-box").value,
                "sentAt": new Date().toISOString()
              }
              // I have fragmented multiple functions 
              // One fetches all the messages, one creates message parent div 
              // and one adds all individual messages

              // Adding individual message to the front end
              // User message here means this message was typed by the current user passed as a parameter to the function
              addIndividualMessage(data, "user-message");
            });


        }
      });
  })

  submitButton.appendChild(submitIcon);

  chatBoxDiv.appendChild(textarea);
  chatBoxDiv.appendChild(submitButton);

  contentDiv.appendChild(channelHeaderDiv);
  contentDiv.appendChild(messageContentDiv);
  contentDiv.appendChild(chatBoxDiv);

  mainDiv.appendChild(mainSidebarDiv);
  mainDiv.appendChild(contentDiv);

  // Append the mainDiv to the document body
  document.body.appendChild(mainDiv);
  // Scroll to the bottom of the messages list
  document.getElementsByClassName("inside")[0].addEventListener("scroll", () => {
    let scrollableDiv = document.getElementsByClassName("inside")[0];
    if (scrollableDiv.scrollTop === 0) {
      fetchMessages(focusedChannelNumber, startMessagesNumber);
    }
  })
}

// Login form
function createLoginForm() {
  const mainContainer = document.createElement('div');
  mainContainer.className = 'main';

  const formContainer = document.createElement('div');
  formContainer.className = 'form';

  const signInContainer = document.createElement('div');
  signInContainer.className = 'sign-in';

  const signInHeader = document.createElement('div');
  signInHeader.className = 'sign-in-header';
  signInHeader.textContent = 'Sign In';

  const signInForm = document.createElement('form');
  signInForm.className = 'sign-in-form';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Email';
  emailInput.className = 'input-bar';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.id = 'sign-in-password';
  passwordInput.placeholder = 'Password';
  passwordInput.className = 'input-bar';

  const signInButton = document.createElement('input');
  signInButton.type = 'submit';
  signInButton.id = 'sign-in-button';
  signInButton.value = 'SIGN IN';
  signInButton.className = 'submitButton';

  signInForm.appendChild(emailInput);
  signInForm.appendChild(passwordInput);
  signInForm.appendChild(signInButton);
  signInContainer.appendChild(signInHeader);
  signInContainer.appendChild(signInForm);

  const signUpContainer = document.createElement('div');
  signUpContainer.className = 'sign-up';

  const signUpHeader = document.createElement('div');
  signUpHeader.className = 'sign-up-header';
  signUpHeader.textContent = 'Sign Up';

  const signUpForm = document.createElement('form');
  signUpForm.className = 'sign-up-form';

  const fnameInput = document.createElement('input');
  fnameInput.type = 'text';
  fnameInput.name = 'fname';
  fnameInput.id = 'fname-sign-up';
  fnameInput.placeholder = 'First Name';
  fnameInput.className = 'input-bar';

  const lnameInput = document.createElement('input');
  lnameInput.type = 'text';
  lnameInput.name = 'lname';
  lnameInput.id = 'lname-sign-up';
  lnameInput.placeholder = 'Last Name';
  lnameInput.className = 'input-bar';

  const emailSignUpInput = document.createElement('input');
  emailSignUpInput.type = 'email';
  emailSignUpInput.name = 'email';
  emailSignUpInput.placeholder = 'Email';
  emailSignUpInput.className = 'input-bar';

  const passwordSignUpInput = document.createElement('input');
  passwordSignUpInput.type = 'password';
  passwordSignUpInput.name = 'password';
  passwordSignUpInput.id = 'sign-up-password';
  passwordSignUpInput.placeholder = 'Password';
  passwordSignUpInput.className = 'input-bar';

  const confirmPasswordInput = document.createElement('input');
  confirmPasswordInput.type = 'password';
  confirmPasswordInput.name = 'cnf-password';
  confirmPasswordInput.id = 'sign-up-cnf-password';
  confirmPasswordInput.placeholder = 'Confirm Password';
  confirmPasswordInput.className = 'input-bar';

  const signUpButton = document.createElement('input');
  signUpButton.type = 'submit';
  signUpButton.id = 'sign-up-button';
  signUpButton.value = 'Sign Up';
  signUpButton.className = 'submitButton';

  signUpForm.appendChild(fnameInput);
  signUpForm.appendChild(lnameInput);
  signUpForm.appendChild(emailSignUpInput);
  signUpForm.appendChild(passwordSignUpInput);
  signUpForm.appendChild(confirmPasswordInput);
  signUpForm.appendChild(signUpButton);
  signUpContainer.appendChild(signUpHeader);
  signUpContainer.appendChild(signUpForm);

  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.className = 'overlay-container';

  const overlayGreetings = document.createElement('div');
  overlayGreetings.className = 'sign-up-greetings';
  overlayGreetings.textContent = 'Hello Friend!';

  const overlayDescription = document.createElement('div');
  overlayDescription.className = 'sign-up-description';

  const overlayDescription1 = document.createElement('div');
  overlayDescription1.id = 'sign-up-description1';
  overlayDescription1.textContent = "Don't Have An Account?";

  const overlayDescription2 = document.createElement('div');
  overlayDescription2.id = 'sign-up-description2';
  overlayDescription2.textContent = 'Start Your Journey With Us!';

  const overlayButton = document.createElement('input');
  overlayButton.type = 'submit';
  overlayButton.value = 'SIGN UP';
  overlayButton.id = 'overlay-altering-button';
  overlayButton.className = 'overlay-change-button';

  overlayDescription.appendChild(overlayDescription1);
  overlayDescription.appendChild(overlayDescription2);

  overlay.appendChild(overlayGreetings);
  overlay.appendChild(overlayDescription);
  overlay.appendChild(overlayButton);

  formContainer.appendChild(signInContainer);
  formContainer.appendChild(signUpContainer);
  formContainer.appendChild(overlay);

  mainContainer.appendChild(formContainer);

  document.body.appendChild(mainContainer);

  // Overlay container 
  const overlayChange = document.getElementById("overlay-altering-button");
  overlayChange.addEventListener("click", function () {
    let overlayContainer = document.getElementById("overlay");
    let description1 = document.getElementById("sign-up-description1");
    let description2 = document.getElementById("sign-up-description2");
    if (overlayContainer.classList.contains("overlay-container-left")) {
      overlayContainer.classList.remove("overlay-container-left");
      description1.innerText = "Don't Have An Account?";
      description2.innerText = "Start Your Journey With Us!";
      overlayChange.value = "SIGN UP";
    } else {
      overlayContainer.classList.add("overlay-container-left");
      description1.innerText = "Already Have An Account?";
      description2.innerText = "Continue Your Journey With Us!";
      overlayChange.value = "SIGN IN";
    }
  })

  // Sign up form with submit event listener
  const signUpF = document.getElementsByClassName("sign-up-form")[0];
  signUpF.addEventListener('submit', (event) => {
    event.preventDefault();
    if (document.getElementById("sign-up-cnf-password").value !== document.getElementById("sign-up-password").value) {
      errorPopup("Password Doesn't Match!");
      return;
    }
    // Fetch request for registering the current user
    fetch('http://localhost:5005/' + "auth/register", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "email": event.target.email.value,
        "password": event.target.password.value,
        "name": event.target.fname.value + " " + event.target.lname.value
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          errorPopup(data.error);
        } else {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('token', data.token);
          checkLoggedIn();
        }
      });
    event.preventDefault();
  })

  // Sign in form with submit event listener
  const signInF = document.getElementsByClassName("sign-in-form")[0];
  signInF.addEventListener('submit', (event) => {
    event.preventDefault();
    // French request for checking if the user exists and logging in the user
    fetch('http://localhost:5005/' + "auth/login", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "email": event.target.email.value,
        "password": event.target.password.value
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          errorPopup(data.error);
        } else {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('token', data.token);
          checkLoggedIn();
        }
      });
    event.preventDefault();
  })
}

// Fetch messages function for fetching all the channel messages
function fetchMessages(channelId, start) {
  focusedChannelNumber = channelId;
  startMessagesNumber = start + 25;
  fetch('http://localhost:5005/' + "message/" + channelId + "?start=" + start, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        addMessagesToDOM(data.messages)
      }
    });

}

// Adding individual messages to the channel
function addIndividualMessage(messageInfo, type) {
  if (messageInfo.pinned) {
    let li = document.createElement("li");
    li.className = messageInfo.message;
    li.innerText = "# " + messageInfo.message;
    document.getElementById("pinned-messages").appendChild(li);
  }
  const messageBoxDiv = document.createElement("div");
  messageBoxDiv.className = "message-box";
  messageBoxDiv.id = messageInfo.id;

  const userProfileDiv = document.createElement("div");
  userProfileDiv.className = "user-profile";

  const msgInfoDiv = document.createElement("div");
  msgInfoDiv.className = "msg-info";

  const timePlusH4 = document.createElement("div");
  timePlusH4.className = "timePlusH4";

  const h4_username = document.createElement("h4");
  h4_username.className = "user-name";

  // Message timestamp
  const timeStamp = document.createElement("p");
  timeStamp.className = "time-stamp";
  const msgDate = new Date(messageInfo.sentAt);

  // Timestamp further calculations
  const TodaysDate = new Date();
  const dateDiff = Math.floor((TodaysDate - msgDate) / (1000 * 60 * 60 * 24));

  // Conditional Adding yesterday to the timestamp
  if (dateDiff === 1) {
    let hours = msgDate.getHours().toString().padStart(2, '0');
    let minutes = msgDate.getMinutes().toString().padStart(2, '0');
    timeStamp.innerText = "Yesterday, " + hours + ":" + minutes;
  } else if (dateDiff === 0) {
    // Conditional adding today to the timestamp
    let hours = msgDate.getHours().toString().padStart(2, '0');
    let minutes = msgDate.getMinutes().toString().padStart(2, '0');
    timeStamp.innerText = "Today, " + hours + ":" + minutes;
  } else {
    // Time stamp
    let date = new Date(messageInfo.sentAt);
    let yr = date.getFullYear();
    let mnth = (date.getMonth() + 1).toString();
    mnth = mnth.padStart(2, '0');
    let day = date.getDate().toString();
    day = day.padStart(2, '0');
    let hrs = date.getHours().toString();
    hrs = hrs.padStart(2, '0');
    let mins = date.getMinutes().toString();
    mins = mins.padStart(2, '0');
    let secs = date.getSeconds().toString();
    secs = secs.padStart(2, '0');
    let actualDate = yr + "-" + mnth + "-" + day + " " + hrs + ":" + mins + ":" + secs;
    timeStamp.innerText = actualDate;

  }
  timePlusH4.appendChild(h4_username);
  timePlusH4.appendChild(timeStamp);

  // Get current user's details
  fetch('http://localhost:5005/' + "user/" + messageInfo.sender, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        h4_username.innerText = data.name;
        h4_username.addEventListener("click", function () {
          const actualProfilePopup = document.getElementById('actual-profile-popup');
          const close = document.getElementsByClassName('close')[9];
          actualProfilePopup.style.display = 'flex';
          document.getElementsByClassName("name")[0].innerText = data.name;
          document.getElementsByClassName("contact")[0].innerText = data.email;
          document.getElementsByClassName("bio")[0].innerText = data.bio;
          document.getElementById("user-img-actual-profile").src = data.image;
          document.getElementsByClassName("edit")[0].style.display = "none";
          close.addEventListener('click', () => {
            actualProfilePopup.style.display = 'none';
            document.getElementsByClassName("edit")[0].style.display = "flex";
          });
        })
        const imgUser = document.createElement("img");
        imgUser.className = "message-user-image"
        if (data.image == null) {
          imgUser.src = "./resources/user.png";
          imgUser.alt = data.name + "'s" + " Image";
        } else {
          imgUser.src = data.image;
          imgUser.alt = data.name + "'s" + " Image";
        }
        userProfileDiv.appendChild(imgUser)
      }
    });

  const userMessageP = document.createElement("p");
  userMessageP.innerText = messageInfo.message;

  let messageMenuBar = document.createElement("div");
  messageMenuBar.className = "message-menu-bar";

  let MenuBar = document.createElement("div");
  MenuBar.className = "menu-bar";

  // Message react section
  let spanEmojis = document.createElement("div");
  spanEmojis.className = "emojis-span"

  let thumbsEmoji = document.createElement("span")
  thumbsEmoji.innerText = "👍";
  thumbsEmoji.className = "unreacted"


  let sadEmoji = document.createElement("span")
  sadEmoji.innerText = "🫤"
  sadEmoji.className = "unreacted"
  let laughingEmoji = document.createElement("span")
  laughingEmoji.innerText = "😂"
  laughingEmoji.className = "unreacted"

  // Event listeners for individual emojis
  thumbsEmoji.addEventListener("click", function () {
    if (thumbsEmoji.className == "unreacted") {
      sadEmoji.style.display = "none";
      laughingEmoji.style.display = "none";
      thumbsEmoji.className = "reacted";
      reactToMessage(messageInfo.id, "U+1F44D")
    } else {
      sadEmoji.style.display = "inline";
      laughingEmoji.style.display = "inline";
      thumbsEmoji.className = "unreacted";
      unreactToMessage(messageInfo.id, "U+1F44D")
    }
  })

  sadEmoji.addEventListener("click", function () {
    if (sadEmoji.className == "unreacted") {
      thumbsEmoji.style.display = "none";
      laughingEmoji.style.display = "none";
      sadEmoji.className = "reacted";
      reactToMessage(messageInfo.id, "U+1FAE4")

    } else {
      thumbsEmoji.style.display = "inline";
      laughingEmoji.style.display = "inline";
      sadEmoji.className = "unreacted";
      unreactToMessage(messageInfo.id, "U+1FAE4")

    }
  })

  laughingEmoji.addEventListener("click", function () {
    if (laughingEmoji.className == "unreacted") {
      sadEmoji.style.display = "none";
      thumbsEmoji.style.display = "none";
      laughingEmoji.className = "reacted";
      reactToMessage(messageInfo.id, "U+1F602")

    } else {
      sadEmoji.style.display = "inline";
      thumbsEmoji.style.display = "inline";
      laughingEmoji.className = "unreacted";
      unreactToMessage(messageInfo.id, "U+1F602")

    }
  })
  spanEmojis.appendChild(thumbsEmoji);
  spanEmojis.appendChild(laughingEmoji);
  spanEmojis.appendChild(sadEmoji);

  MenuBar.appendChild(spanEmojis);

  // Pending messages in channel
  let pinSpan = document.createElement("i");
  if (messageInfo.pinned) {
    pinSpan.className = "pin fa-solid fa-link-slash";
  } else {
    pinSpan.className = "unpin fa-solid fa-thumbtack";
  }
  pinSpan.id = "pin-message"
  pinSpan.addEventListener('click', function (e) {
    e.preventDefault();
    // Toggling pinning and unpinning messages
    if (pinSpan.className.split(" ")[0] == "unpin") {
      pinSpan.className = "pin fa-solid fa-link-slash";
      // Fetch a request for pending messages to the channel
      fetch('http://localhost:5005/' + "message/pin/" + focusedChannelNumber.toString() + "/" + messageInfo.id.toString(), {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("token").toString(),
          'Content-type': 'application/json',
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            errorPopup(data.error);
          } else {
            let li = document.createElement("li");
            li.className = messageInfo.message;
            li.innerText = "# " + messageInfo.message;
            document.getElementById("pinned-messages").appendChild(li);
          }
        });
    } else {
      pinSpan.className = "unpin fa-solid fa-thumbtack";
      fetch('http://localhost:5005/' + "message/unpin/" + focusedChannelNumber.toString() + "/" + messageInfo.id.toString(), {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("token").toString(),
          'Content-type': 'application/json',
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            errorPopup(data.error);
          } else {
            document.getElementsByClassName(messageInfo.message)[0].remove();
          }
        });
    }
  })

  // Deleting message section
  let deleteSpan = document.createElement("i");
  deleteSpan.className = "fa-solid fa-trash";
  deleteSpan.id = "delete-message";
  deleteSpan.addEventListener("click", function (e) {
    e.preventDefault();
    fetch('http://localhost:5005/' + "message/" + focusedChannelNumber.toString() + "/" + messageInfo.id, {
      method: 'DELETE',
      headers: {
        'Authorization': localStorage.getItem("token").toString(),
        'Content-type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          errorPopup(data.error);
        } else {
        }
      });
    document.getElementById(messageInfo.id).remove();
  })

  MenuBar.appendChild(spanEmojis);
  MenuBar.appendChild(pinSpan);
  if (messageInfo.sender == localStorage.getItem("userId").toString()) {
    MenuBar.appendChild(deleteSpan);
  }

  messageMenuBar.appendChild(userMessageP);
  messageMenuBar.appendChild(MenuBar);

  msgInfoDiv.appendChild(timePlusH4);
  msgInfoDiv.appendChild(messageMenuBar);
  messageBoxDiv.appendChild(userProfileDiv);
  messageBoxDiv.appendChild(msgInfoDiv);
  if (type == "user-message") {
    document.getElementsByClassName("inside")[0].append(messageBoxDiv);
    let scrollableDiv = document.getElementsByClassName("inside")[0];
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    document.getElementById("message-input-box").value = "";
  } else {
    document.getElementsByClassName("inside")[0].prepend(messageBoxDiv);
  }
}

// Adding all the messages to the Dom
function addMessagesToDOM(messages) {
  for (let i = 0; i < messages.length; i++) {
    addIndividualMessage(messages[i]);
  }
  let scrollableDiv = document.getElementsByClassName("inside")[0];
  scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}

// Adding all the channel members in the pop up
function addChannelMembersPopUp() {
  // Fetch a request for getting all the channel members
  fetch('http://localhost:5005/' + "channel/" + focusedChannelNumber, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        createMembersInfoDOM(data.members);
      }
    });
}


// 
function addIndividualChannelMembers(data) {
  const listItem = document.createElement("li");

  const leftProfile = document.createElement("div");
  leftProfile.className = "members-left-profile";

  const membersProfile = document.createElement("div");
  membersProfile.className = "members-profile";

  let userIcon;
  if (data.image == null) {

    userIcon = document.createElement("i");
    userIcon.className = "fa-solid fa-user";
  } else {
    userIcon = document.createElement("img");
    userIcon.src = data.image;
    userIcon.alt = "User's Image";
    userIcon.className = "members-picture"
  }
  membersProfile.appendChild(userIcon);

  const membersProfileInfo = document.createElement("div");
  membersProfileInfo.className = "members-profile-info";

  const memberNameLink = document.createElement("a");
  memberNameLink.href = "";
  memberNameLink.textContent = data.name;

  const memberProfession = document.createElement("p");
  memberProfession.textContent = data.email;

  membersProfileInfo.appendChild(memberNameLink);
  membersProfileInfo.appendChild(memberProfession);

  leftProfile.appendChild(membersProfile);
  leftProfile.appendChild(membersProfileInfo);

  listItem.appendChild(leftProfile);
  document.querySelector(".members-list").appendChild(listItem);
}

function createMembersInfoDOM(memberArray) {
  for (let i = 0; i < memberArray.length; i++) {
    fetch('http://localhost:5005/' + "user/" + memberArray[i], {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem("token").toString(),
        'Content-type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          errorPopup(data.error);
        } else {
          addIndividualChannelMembers(data);
        }
      });
  }
}

function updateChannelDetails() {
  fetch('http://localhost:5005/' + "channel/" + focusedChannelNumber, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        document.getElementById("channel-heading").innerText = data.name;
        document.getElementById("channel-description").innerText = (data.description == "" ? "No Description" : data.description);
        let date = new Date(data.createdAt);
        let yr = date.getFullYear();
        let mnth = (date.getMonth() + 1).toString();
        mnth = mnth.padStart(2, '0');
        let day = date.getDate().toString();
        day = day.padStart(2, '0');
        let hrs = date.getHours().toString();
        hrs = hrs.padStart(2, '0');
        let mins = date.getMinutes().toString();
        mins = mins.padStart(2, '0');
        let secs = date.getSeconds().toString();
        secs = secs.padStart(2, '0');
        let actualDate = yr + "-" + mnth + "-" + day + " " + hrs + ":" + mins + ":" + secs;

        document.getElementById("channel-created-time").innerText = actualDate;
        document.getElementById("channel-status").innerText = (data.private ? "Public" : "Private");
        fetch('http://localhost:5005/' + "user/" + data.creator, {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem("token").toString(),
            'Content-type': 'application/json',
          }
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              errorPopup(data.error);
            } else {
              document.getElementById("channel-creator-name").innerText = data.name;
            }
          });
      }
    });
}

function addEditProfileSection(e) {
  e.preventDefault();
  const profilePopup = document.getElementById('profile-edit-popup');
  const close = document.getElementsByClassName('close')[2];

  profilePopup.style.display = 'flex';

  const editProfileOption = document.getElementById("edit-profile-option");
  const passwordChangeOption = document.getElementById("password-change-option");
  close.addEventListener('click', () => {
    profilePopup.style.display = 'none';
    document.getElementById("save-profile-changes").innerText = "Save Changes";
    document.getElementById("save-profile-changes").style.backgroundColor = "#C04605";

    document.getElementById("confirm-password").value = "";
    document.getElementById("new-password").value = "";

    document.getElementById("password-submit").innerText = "Save Changes";
    document.getElementById("password-submit").style.backgroundColor = "#C04605";
  });

  editProfileOption.style.backgroundColor = "antiquewhite"
  passwordChangeOption.addEventListener("click", function () {
    passwordChangeOption.style.backgroundColor = "antiquewhite"
    editProfileOption.style.backgroundColor = "white"
    document.getElementById("change-password-containerr").style.display = "block";
    document.getElementById("edit-profile-containerr").style.display = "none";

    const passwordToggles = document.querySelectorAll(".password-toggle");
    passwordToggles.forEach(toggle => {
      toggle.addEventListener("click", function () {
        const passwordInput = toggle.previousElementSibling;
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
        } else {
          passwordInput.type = "password";
        }
      });
    });
    const passwordForm = document.getElementById("password-form");
    passwordForm.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  });

  editProfileOption.addEventListener("click", function () {
    editProfileOption.style.backgroundColor = "antiquewhite"
    passwordChangeOption.style.backgroundColor = "white"
    document.getElementById("change-password-containerr").style.display = "none";
    document.getElementById("edit-profile-containerr").style.display = "block";
    const editProfileForm = document.getElementById("edit-profile-form");
    editProfileForm.addEventListener("submit", function (event) {
      event.preventDefault();

    });
  });
  updateInitialProfileDetails();
}

function updateInitialProfileDetails() {
  fetch('http://localhost:5005/' + "user/" + localStorage.getItem("userId").toString(), {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {

        document.getElementById("name").value = data.name;
        document.getElementById("email").value = data.email;
        document.getElementById("user-description-edit-profile").value = data.bio;
        document.getElementById("edit-profile-picture").src = data.image;
      }
    });
}

function addAllChannelsInAllChannelDiv() {
  fetch('http://localhost:5005/' + "channel", {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {

        for (let i = 0; i < data.channels.length; i++) {
          fetch('http://localhost:5005/' + "user/" + data.channels[i].creator, {
            method: 'GET',
            headers: {
              'Authorization': localStorage.getItem("token").toString(),
              'Content-type': 'application/json',
            }
          })
            .then((response) => response.json())
            .then((data2) => {
              if (data.error) {
                errorPopup(data.error);
              } else {
                if (!(data.channels[i].members.includes(parseInt(localStorage.getItem("userId"))))) {
                  if (!(data.channels[i].private)) {
                    addChannelinFullChannel(data.channels[i], data2.name);
                  }
                }
              }
            });
        }
      }
    });
}

function addChannelinFullChannel(channel, creator) {
  const listItem = document.createElement('li');

  const leftProfileDiv = document.createElement('div');
  leftProfileDiv.className = 'all-channel-left-profile';

  const profileDiv = document.createElement('div');
  profileDiv.className = 'all-channel-profile';

  const iconElement = document.createElement('i');
  iconElement.className = 'fa-solid fa-hashtag';

  profileDiv.appendChild(iconElement);

  const profileInfoDiv = document.createElement('div');
  profileInfoDiv.className = 'all-channel-profile-info';

  const anchorElement = document.createElement('a');
  anchorElement.href = '';
  anchorElement.textContent = channel.name;

  const pEle = document.createElement('p');
  pEle.textContent = 'Created by ';

  const spanElement = document.createElement('span');
  spanElement.className = 'creator';
  spanElement.textContent = creator;

  pEle.appendChild(spanElement);
  profileInfoDiv.appendChild(anchorElement);
  profileInfoDiv.appendChild(pEle);

  leftProfileDiv.appendChild(profileDiv);
  leftProfileDiv.appendChild(profileInfoDiv);

  const rightProfileDiv = document.createElement('div');
  rightProfileDiv.className = 'all-channel-right-profile';

  const joinButton = document.createElement('button');
  joinButton.className = 'join-btn';
  joinButton.textContent = 'Join';

  // Joining public channels event listener
  joinButton.addEventListener("click", function (e) {
    e.preventDefault();
    fetch('http://localhost:5005/' + "channel/" + channel.id.toString() + "/join", {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem("token").toString(),
        'Content-type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          errorPopup(data.error);
        } else {
          data = {
            "id": channel.id.toString(),
            "name": channel.name
          }
          addChannelinSidebar(data);
          e.target.innerText = "Joined!";
          e.target.style.backgroundColor = "green";
          setTimeout(() => {
            const allChannelPopup = document.getElementById('all-channel-popup');
            let elementsToRemove = document.querySelectorAll(".all-channel-list li");
            elementsToRemove = Array.from(elementsToRemove);
            elementsToRemove.forEach(function (element) {
              document.getElementsByClassName("all-channel-list")[0].removeChild(element);
            });
            allChannelPopup.style.display = 'none';
          }, 500);
        }
      });
  });

  rightProfileDiv.appendChild(joinButton);

  listItem.appendChild(leftProfileDiv);
  listItem.appendChild(rightProfileDiv);
  const container = document.getElementsByClassName('all-channel-list')[0];
  container.appendChild(listItem);
}

// Updating profile details
document.getElementById("save-profile-changes").addEventListener("click", function (e) {
  e.preventDefault();
  let fileInput = document.getElementById("file-image");
  let selectedFile = fileInput.files[0];
  fileToDataUrl(selectedFile)
    .then((data) => {
      // Request for updating user details
      fetch('http://localhost:5005/' + "user/", {
        method: 'PUT',
        headers: {
          'Authorization': localStorage.getItem("token").toString(),
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          "email": document.getElementById("email").value,
          "name": document.getElementById("name").value,
          "image": data.toString(),
          "bio": document.getElementById("user-description-edit-profile").value
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            fetch('http://localhost:5005/' + "user/", {
              method: 'PUT',
              headers: {
                'Authorization': localStorage.getItem("token").toString()
              },
              body: JSON.stringify({
                "name": document.getElementById("name").value,
                "bio": document.getElementById("user-description-edit-profile").value,
                "image": data.toString()
              })
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  errorPopup(data.error);
                } else {
                  document.getElementById("save-profile-changes").innerText = "Changes Saved Successfully!";
                  document.getElementById("save-profile-changes").style.backgroundColor = "Green";
                }
              });
          } else {
            document.getElementById("save-profile-changes").innerText = "Changes Saved Successfully!";
            document.getElementById("save-profile-changes").style.backgroundColor = "Green";
          }
        });
    })
    .catch((error) => {
      errorPopup(error);
    });
});


document.getElementById("password-submit").addEventListener("click", function (e) {
  if (document.getElementById("confirm-password").value !== document.getElementById("new-password").value) {
    errorPopup("Password Doesn't Match!");
    return;
  }
  fetch('http://localhost:5005/' + "user/", {
    method: 'PUT',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      "password": document.getElementById("new-password").value
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        document.getElementById("password-submit").innerText = "Password Changed Successfully!";
        document.getElementById("password-submit").style.backgroundColor = "Green";
      }
    });
})

document.getElementById("create-new-channel").addEventListener("submit", function (e) {
  e.preventDefault();
  fetch('http://localhost:5005/' + "channel", {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      "name": document.getElementById("channelName").value,
      "private": document.getElementById("private").checked,
      "description": document.getElementById("description").value
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        document.getElementsByClassName("submit-btn-1")[0].value = "Created!"
        document.getElementsByClassName("submit-btn-1")[0].style.backgroundColor = "green";
        data.name = document.getElementById("channelName").value;
        data.id = data.channelId;
        data.private = document.getElementById("private").checked;
        addChannelinSidebar(data);
        setTimeout(() => {
          document.getElementById("channelName").value = "";
          document.getElementById("description").value = "";

          document.getElementById("new-channel-popup").style.display = "none";

          document.getElementsByClassName("submit-btn-1")[0].value = "Create channel"
          document.getElementsByClassName("submit-btn-1")[0].style.backgroundColor = "#C04605";
        }, 500);

      }
    });
})


function addAllInviteUsers() {
  fetch('http://localhost:5005/' + "user", {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        for (let i = 0; i < data.users.length; i++) {
          fetch('http://localhost:5005/' + "channel/" + focusedChannelNumber, {
            method: 'GET',
            headers: {
              'Authorization': localStorage.getItem("token").toString(),
              'Content-type': 'application/json',
            }
          })
            .then((response) => response.json())
            .then((data1) => {
              if (data1.error) {
                const errorPopup = document.getElementById('error-popup');
                errorPopup.style.display = 'flex';
                document.getElementById("error-name").innerText = data1.error;
                const close = document.getElementsByClassName('close')[7];
                const close_btn = document.getElementsByClassName("close-btn")[0];
                close_btn.addEventListener('click', () => {
                  errorPopup.style.display = 'none';
                });
                close.addEventListener('click', () => {
                  errorPopup.style.display = 'none';
                });
              } else {
                if (!data1.members.includes(data.users[i].id)) {
                  fetch('http://localhost:5005/' + "user/" + data.users[i].id, {
                    method: 'GET',
                    headers: {
                      'Authorization': localStorage.getItem("token").toString(),
                      'Content-type': 'application/json',
                    }
                  })
                    .then((response) => response.json())
                    .then((data2) => {
                      if (data2.error) {
                        const errorPopup = document.getElementById('error-popup');
                        errorPopup.style.display = 'flex';
                        document.getElementById("error-name").innerText = data2.error;
                        const close = document.getElementsByClassName('close')[7];
                        const close_btn = document.getElementsByClassName("close-btn")[0];
                        close_btn.addEventListener('click', () => {
                          errorPopup.style.display = 'none';
                        });
                        close.addEventListener('click', () => {
                          errorPopup.style.display = 'none';
                        });
                      } else {
                        const listItem = document.createElement("li");

                        const leftProfile = document.createElement("div");
                        leftProfile.classList.add("invite-left-profile");

                        const profileImage = document.createElement("div");
                        profileImage.classList.add("invite-profile");
                        if (data2.image == null || data2.image == "") {
                          const userIconInv = document.createElement("i");
                          userIconInv.className = "fa-solid fa-user";
                          userIconInv.style.color = "#C04605";
                          profileImage.appendChild(userIconInv);
                        } else {
                          const img = document.createElement("img");
                          img.src = data2.image;
                          img.alt = "User's Image";
                          profileImage.appendChild(img);
                        }

                        const profileInfo = document.createElement("div");
                        profileInfo.classList.add("invite-profile-info");
                        const nameLink = document.createElement("a");
                        nameLink.href = "";
                        nameLink.textContent = data2.name;
                        const jobDescription = document.createElement("p");
                        jobDescription.textContent = data2.email;
                        profileInfo.appendChild(nameLink);
                        profileInfo.appendChild(jobDescription);

                        const rightProfile = document.createElement("div");
                        rightProfile.classList.add("invite-right-profile");
                        const plusIcon = document.createElement("i");
                        plusIcon.classList.add("fa-solid", "fa-user-plus");
                        plusIcon.style.color = "#C04605"

                        plusIcon.addEventListener("click", function (e) {
                          e.preventDefault();
                          fetch('http://localhost:5005/' + "channel/" + focusedChannelNumber.toString() + "/invite", {
                            method: 'POST',
                            headers: {
                              'Authorization': localStorage.getItem("token").toString(),
                              'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                              "userId": data.users[i].id
                            })
                          })
                            .then((response) => response.json())
                            .then((data4) => {
                              if (data4.error) {
                                const errorPopup = document.getElementById('error-popup');
                                errorPopup.style.display = 'flex';
                                document.getElementById("error-name").innerText = data4.error;
                                const close = document.getElementsByClassName('close')[7];
                                const close_btn = document.getElementsByClassName("close-btn")[0];
                                close_btn.addEventListener('click', () => {
                                  errorPopup.style.display = 'none';
                                });
                                close.addEventListener('click', () => {
                                  errorPopup.style.display = 'none';
                                });
                              } else {
                                plusIcon.classList.remove("fa-solid", "fa-user-plus");

                                plusIcon.classList.add("fa-solid", "fa-user-check");
                                plusIcon.style.color = "green";
                                setTimeout(() => {
                                  document.getElementById("invite-popup").style.display = "none";
                                  plusIcon.classList.add("fa-solid", "fa-user-plus");
                                  plusIcon.style.color = "#C04605"
                                }, 500);
                              }
                            });
                        })

                        rightProfile.appendChild(plusIcon);

                        leftProfile.appendChild(profileImage);
                        leftProfile.appendChild(profileInfo);

                        listItem.appendChild(leftProfile);
                        listItem.appendChild(rightProfile);

                        const parentElement = document.getElementsByClassName("invite-list")[0];
                        parentElement.appendChild(listItem);
                      }
                    });
                }
              }
            });
        }
      }
    });
}

document.getElementsByClassName("edit")[0].addEventListener("click", function (e) {
  e.preventDefault();
  const profilePopup = document.getElementById('profile-edit-popup');
  updateInitialProfileDetails();
  profilePopup.style.display = 'flex';

  const closee = document.getElementsByClassName('close')[2];
  const editProfileOption = document.getElementById("edit-profile-option");
  const passwordChangeOption = document.getElementById("password-change-option");
  console.log(closee);
  closee.addEventListener('click', function () {
    console.log("wor");
    profilePopup.style.display = 'none';
    document.getElementById("save-profile-changes").innerText = "Save Changes";
    document.getElementById("save-profile-changes").style.backgroundColor = "#C04605";
    document.getElementById("confirm-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("password-submit").innerText = "Save Changes";
    document.getElementById("password-submit").style.backgroundColor = "#C04605";
  });
})


function updateActualProfile() {
  fetch('http://localhost:5005/' + "user/" + localStorage.getItem("userId").toString(), {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        document.getElementsByClassName("name")[0].innerText = data.name;
        document.getElementsByClassName("contact")[0].innerText = data.email;
        document.getElementsByClassName("bio")[0].innerText = data.bio;
        document.getElementById("user-img-actual-profile").src = data.image;
      }
    });
}


function errorPopup(error) {
  const errorPopup = document.getElementById('error-popup');
  errorPopup.style.display = 'flex';
  document.getElementById("error-name").innerText = error;
  const close = document.getElementsByClassName('close')[7];
  const close_btn = document.getElementsByClassName("close-btn")[0];
  close_btn.addEventListener('click', () => {
    errorPopup.style.display = 'none';
  });
  close.addEventListener('click', () => {
    errorPopup.style.display = 'none';
  });
}

document.getElementById("edit-channel-name-btn").addEventListener("click", function () {
  fetch('http://localhost:5005/' + "channel/" + focusedChannelNumber.toString(), {
    method: 'PUT',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      "name": document.getElementById("edit-channel-nam").value
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        document.getElementById("edit-channel-name-btn").innerText = "Saved!"
        document.getElementById("edit-channel-name-btn").style.backgroundColor = "green"
        document.getElementById("channel-heading").innerText = document.getElementById("edit-channel-nam").value;
        document.getElementById(focusedChannelNumber).getElementsByClassName("channel-names")[0].innerText = "# " + document.getElementById("edit-channel-nam").value;
        setTimeout(() => {
          document.getElementById("edit-channel-name-btn").innerText = "Save Changes!"
          document.getElementById("edit-channel-name-btn").style.backgroundColor = "#007BFF"
        }, 3000);
      }
    });
})

document.getElementById("edit-channel-description-btn").addEventListener("click", function () {
  fetch('http://localhost:5005/' + "channel/" + focusedChannelNumber.toString(), {
    method: 'PUT',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      "description": document.getElementById("edit-channel-desc").value
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      } else {
        document.getElementById("edit-channel-description-btn").innerText = "Saved!"
        document.getElementById("edit-channel-description-btn").style.backgroundColor = "green"
        document.getElementById("channel-description").innerText = document.getElementById("edit-channel-desc").value;
        setTimeout(() => {
          document.getElementById("edit-channel-description-btn").innerText = "Save Changes!"
          document.getElementById("edit-channel-description-btn").style.backgroundColor = "#007BFF"
        }, 3000);
      }
    });
})

// Reacting to message function
function reactToMessage(messageId, emoji) {
  fetch('http://localhost:5005/' + "message/react/" + focusedChannelNumber.toString() + "/" + messageId, {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      "react": emoji
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      }
    });
}
// Unreacting to message function
function unreactToMessage(messageId, emoji) {
  fetch('http://localhost:5005/' + "message/unreact/" + focusedChannelNumber.toString() + "/" + messageId, {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem("token").toString(),
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      "react": emoji
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        errorPopup(data.error);
      }
    });
}



