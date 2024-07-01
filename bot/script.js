var running = false;
var botData; // Variable to store bot data

// Load JSON file
function loadBotData(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'bot_data.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            botData = JSON.parse(xhr.responseText);
            callback();
        }
    };
    xhr.send(null);
}

// Function to send message
function send() {
    if (running == true) return;
    var msg = document.getElementById("message").value;
    if (msg == "") return;
    running = true;
    addMsg(msg);
    // Delay message response
    window.setTimeout(addResponseMsg, 1000, msg);
}

// Function to add sent message
function addMsg(msg) {
    var div = document.createElement("div");
    div.innerHTML =
        "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
        msg +
        "</div>";
    div.className = "chat-message-div";
    document.getElementById("message-box").appendChild(div);
    // Clear input field and scroll to bottom
    document.getElementById("message").value = "";
    document.getElementById("message-box").scrollTop = document.getElementById(
        "message-box"
    ).scrollHeight;
}

// Function to add response message
function addResponseMsg(msg) {
    var div = document.createElement("div");
    var response = getResponse(msg.toLowerCase()); // Get response from bot data
    div.innerHTML = "<div class='chat-message-received'>" + response + "</div>";
    div.className = "chat-message-div";
    document.getElementById("message-box").appendChild(div);
    // Scroll to bottom
    document.getElementById("message-box").scrollTop = document.getElementById(
        "message-box"
    ).scrollHeight;
    running = false;
}

// Get response from bot data based on message content
function getResponse(msg) {
    var responses = botData.responses;
    var triggers = botData.triggers;

    // Iterate through triggers to find matching category
    for (var category in triggers) {
        if (triggers.hasOwnProperty(category)) {
            var triggerPhrases = triggers[category];
            for (var i = 0; i < triggerPhrases.length; i++) {
                if (msg.includes(triggerPhrases[i])) {
                    // If trigger phrase found, return random response from category
                    return responses[category][Math.floor(Math.random() * responses[category].length)];
                }
            }
        }
    }
    // Default response if no match found
    return "Sorry, I'm not sure about that.";
}

// Event listener for Enter key press
document.getElementById("message").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        send();
    }
});

// Event listener for toggle button click
document.getElementById("chatbot_toggle").onclick = function () {
    if (document.getElementById("chatbot").classList.contains("collapsed")) {
        document.getElementById("chatbot").classList.remove("collapsed")
        document.getElementById("chatbot_toggle").children[0].style.display = "none"
        document.getElementById("chatbot_toggle").children[1].style.display = ""
        setTimeout(addResponseMsg, 1000, "Hi")
    } else {
        document.getElementById("chatbot").classList.add("collapsed")
        document.getElementById("chatbot_toggle").children[0].style.display = ""
        document.getElementById("chatbot_toggle").children[1].style.display = "none"
    }
}

// Load bot data and initialize
loadBotData(function() {
    console.log("Bot data loaded.");
});
