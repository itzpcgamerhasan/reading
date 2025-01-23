const subjects = [
  "Bangla First Paper",
  "Bangla Second Paper",
  "English First Paper",
  "English Second Paper",
  "Physics",
  "Islam",
  "Math",
  "Higher Math",
  "ICT",
  "BGS",
  "Biology",
  "Chemistry"
];

// Buttons and Modals
const mahAddChapterButton = document.getElementById('mah-addChapterButton');
const mahViewProgressButton = document.getElementById('mah-viewProgressButton');
const mahAddChapterModal = document.getElementById('mah-addChapterModal');
const mahViewProgressModal = document.getElementById('mah-viewProgressModal');
const mahCloseAddChapter = document.getElementById('mah-closeAddChapter');
const mahCloseViewProgress = document.getElementById('mah-closeViewProgress');
const mahSubjectList = document.getElementById('mah-subjectList');
const mahSaveButton = document.getElementById('mah-saveButton');
const mahProgressList = document.getElementById('mah-progressList');

// Initialize subject list
function initializeSubjectList() {
  mahSubjectList.innerHTML = '';
  subjects.forEach(subject => {
    const div = document.createElement('div');
    div.className = 'mah-subject-item';

    const label = document.createElement('label');
    label.textContent = subject;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Completed Topic';
    input.dataset.subject = subject;

    div.appendChild(label);
    div.appendChild(input);
    mahSubjectList.appendChild(div);
  });
}

// Save completed topics to localStorage
function saveCompletedTopics() {
  const inputs = document.querySelectorAll('#mah-subjectList input');
  const completedTopics = JSON.parse(localStorage.getItem('mah-studyProgress')) || {};

  inputs.forEach(input => {
    const subject = input.dataset.subject;
    const topic = input.value.trim();
    if (topic) {
      if (!completedTopics[subject]) {
        completedTopics[subject] = [];
      }
      completedTopics[subject].push(topic);
    }
  });

  localStorage.setItem('mah-studyProgress', JSON.stringify(completedTopics));
  alert('Progress saved successfully!');
  mahAddChapterModal.classList.add('mah-hidden');
}

// View progress from localStorage
function viewProgress() {
  const completedTopics = JSON.parse(localStorage.getItem('mah-studyProgress')) || {};
  mahProgressList.innerHTML = '';

  Object.keys(completedTopics).forEach(subject => {
    const li = document.createElement('li');
    li.textContent = `${subject}: ${completedTopics[subject].join(', ')}`;
    mahProgressList.appendChild(li);
  });

  mahViewProgressModal.classList.remove('mah-hidden');
}

// Event Listeners
mahAddChapterButton.addEventListener('click', () => {
  initializeSubjectList();
  mahAddChapterModal.classList.remove('mah-hidden');
});

mahViewProgressButton.addEventListener('click', () => {
  viewProgress();
});

mahCloseAddChapter.addEventListener('click', () => {
  mahAddChapterModal.classList.add('mah-hidden');
});

mahCloseViewProgress.addEventListener('click', () => {
  mahViewProgressModal.classList.add('mah-hidden');
});

mahSaveButton.addEventListener('click', saveCompletedTopics);



const progressData = JSON.parse(localStorage.getItem("progressData")) || {};
const historyData = JSON.parse(localStorage.getItem("historyData")) || [];

// Save current date in localStorage for daily reset
const todayDate = new Date().toLocaleDateString();
const lastSavedDate = localStorage.getItem("lastSavedDate");

if (todayDate !== lastSavedDate) {
    localStorage.setItem("progressData", JSON.stringify({})); // Reset progressData
    localStorage.setItem("lastSavedDate", todayDate); // Update saved date
}

// Generate subjects list
function generateSubjects() {
    const subjectsDiv = document.getElementById("subjects");
    subjectsDiv.innerHTML = "";

    subjects.forEach(subject => {
        const subjectDiv = document.createElement("div");
        subjectDiv.className = "subject";

        const subjectTitle = document.createElement("h3");
        subjectTitle.textContent = subject;

        const topicInput = document.createElement("input");
        topicInput.type = "text";
        topicInput.placeholder = `Enter topic for ${subject}`;
        topicInput.value = progressData[subject] && progressData[subject].topic || "";
        topicInput.addEventListener("input", () => {
            saveData(subject, "topic", topicInput.value);
            updateHistory(subject);
        });

        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "checkbox-label";
        checkboxLabel.textContent = "Mark as Completed";

        const completeCheckbox = document.createElement("input");
        completeCheckbox.type = "checkbox";
        completeCheckbox.checked = progressData[subject] && progressData[subject].completed || false;
        completeCheckbox.addEventListener("change", () => {
            const topic = progressData[subject] && progressData[subject].topic || "No topic entered";
            saveData(subject, "completed", completeCheckbox.checked);

            if (completeCheckbox.checked) {
                // Add to history
                addToHistory(todayDate, subject, topic);
            }
        });

        checkboxLabel.prepend(completeCheckbox);

        subjectDiv.appendChild(subjectTitle);
        subjectDiv.appendChild(topicInput);
        subjectDiv.appendChild(checkboxLabel);

        subjectsDiv.appendChild(subjectDiv);
    });
}

// Save data to local storage
function saveData(subject, key, value) {
    if (!progressData[subject]) progressData[subject] = {};
    progressData[subject][key] = value;
    localStorage.setItem("progressData", JSON.stringify(progressData));
}

// Add an entry to the history
function addToHistory(date, subject, topic) {
    const existingEntry = historyData.find(entry => entry.date === date && entry.subject === subject);
    if (existingEntry) {
        existingEntry.topic = topic; // Update topic if already in history
    } else {
        historyData.push({ date, subject, topic });
    }
    localStorage.setItem("historyData", JSON.stringify(historyData));
}

// Update history when topic changes
function updateHistory(subject) {
    const topic = progressData[subject] && progressData[subject].topic || "No topic entered";
    const today = new Date().toLocaleDateString();

    addToHistory(today, subject, topic);
}

// Open the history modal
function openHistoryModal() {
    const historyModal = document.getElementById("history-modal");
    const historyList = document.getElementById("history-list");
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "history-date-filter";
    dateInput.addEventListener("change", () => filterHistoryByDate(dateInput.value));

    historyList.innerHTML = ""; // Reset list
    historyList.appendChild(dateInput); // Add the date filter input

    displayHistoryDates(); // Show dates with history

    historyModal.style.display = "flex";
}

// Display unique dates with history
function displayHistoryDates() {
    const historyList = document.getElementById("history-list");
    const datesWithHistory = [...new Set(historyData.map(entry => entry.date))]; // Get unique dates

    if (datesWithHistory.length === 0) {
        const noHistoryMessage = document.createElement("li");
        noHistoryMessage.textContent = "No history available.";
        historyList.appendChild(noHistoryMessage);
    } else {
        datesWithHistory.forEach(date => {
            const dateItem = document.createElement("li");
            dateItem.textContent = date;
            dateItem.addEventListener("click", () => filterHistoryByDate(date)); // Show history for the clicked date
            historyList.appendChild(dateItem);
        });
    }
}

// Filter history by date
function filterHistoryByDate(selectedDate) {
    const historyList = document.getElementById("history-list");

    // Show a "Back" button to return to the date list
    const backButton = document.createElement("button");
    backButton.textContent = "Back to Date List";
    backButton.addEventListener("click", () => showDateList());

    // Style the back button to appear at the bottom
    backButton.style.position = "absolute";
    backButton.style.bottom = "10px";
    backButton.style.left = "50%";
    backButton.style.transform = "translateX(-50%)";

    historyList.innerHTML = ""; // Clear current list
    historyList.appendChild(backButton); // Add back button at the bottom

    const entries = selectedDate
        ? historyData.filter(entry => entry.date === selectedDate)
        : historyData;

    // Display history entries for the selected date
    displayHistoryEntries(entries);
}

// Show the date list again
function showDateList() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; // Clear the current list

    // Re-add the date input for filtering
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "history-date-filter";
    dateInput.addEventListener("change", () => filterHistoryByDate(dateInput.value));

    historyList.appendChild(dateInput); // Add the date filter input again

    displayHistoryDates(); // Display dates again
}

// Display history entries for the selected date
function displayHistoryEntries(entries = historyData) {
    const historyList = document.getElementById("history-list");
    if (entries.length === 0) {
        const noHistoryMessage = document.createElement("li");
        noHistoryMessage.textContent = "No history available.";
        historyList.appendChild(noHistoryMessage);
    } else {
        entries.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = `${entry.date} - ${entry.subject}: ${entry.topic}`;
            historyList.appendChild(listItem);
        });
    }
}

// Close the history modal
function closeHistoryModal() {
    const historyModal = document.getElementById("history-modal");
    historyModal.style.display = "none";
}

// Initialize
generateSubjects();

// Display today's date at the top of the website
function displayTodayDate() {
    const dateContainer = document.getElementById("current-date");
    const today = new Date();

    // Format date as Day, Month Date, Year (e.g., "Monday, January 22, 2025")
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    dateContainer.textContent = `Of ${formattedDate}`;
}

// Call the function to display the date when the page loads
displayTodayDate();



// 
// DOM Elements
const scheduleForm = document.getElementById('scheduleForm');
const scheduleList = document.getElementById('scheduleList');
const resetAllButton = document.getElementById('resetAll');
const scheduleManager = document.getElementById('scheduleManager');
const notificationSound = document.getElementById('notificationSound');

// Load or initialize schedule
const schedule = JSON.parse(localStorage.getItem('schedule')) || {}; // Ensure it's an empty object if null
displaySchedule();

// Add or update schedule item
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const time = document.getElementById('time').value;

    // Convert 24-hour time to 12-hour format with AM/PM
    const formattedTime = convertTo12HourFormat(time);

    // Set schedule for the subject
    schedule[subject] = formattedTime;
    localStorage.setItem('schedule', JSON.stringify(schedule));
    displaySchedule();
    alert(`Schedule set for ${subject} at ${formattedTime}`);
});

// Convert 24-hour time to 12-hour format
function convertTo12HourFormat(time) {
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minute} ${period}`;
}

// Display schedule
function displaySchedule() {
    scheduleList.innerHTML = '';

    const hasSchedule = Object.keys(schedule).length > 0;

    // Show or hide Schedule Manager and Reset All button
    scheduleManager.classList.toggle('hidden', !hasSchedule);

    if (hasSchedule) {
        for (const subject in schedule) {
            const listItem = document.createElement('li');
            listItem.className = 'schedule-item';

            listItem.innerHTML = `
                ${subject}: ${schedule[subject]} 
                <i class="fas fa-trash reset-icon" onclick="resetSubject('${subject}')"></i>
            `;
            scheduleList.appendChild(listItem);
        }
    }
}

// Reset specific subject
window.resetSubject = (subject) => {
    delete schedule[subject];
    localStorage.setItem('schedule', JSON.stringify(schedule));
    displaySchedule();
    alert(`${subject} schedule has been reset.`);
};

// Reset all schedules
resetAllButton.addEventListener('click', () => {
    localStorage.removeItem('schedule');
    Object.keys(schedule).forEach(key => delete schedule[key]);
    displaySchedule();
    alert('All schedules have been reset.');
});

// Notification Logic
if ('serviceWorker' in navigator && 'Notification' in window) {
    // Register the service worker
    navigator.serviceWorker.register('sw.js').then((registration) => {
        console.log('Service Worker Registered:', registration);
    });

    // Request notification permission
    Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
            alert('Please enable notifications to receive schedule reminders!');
        }
    });

    // Check every minute for matching schedule
    setInterval(() => {
        const hasSchedule = Object.keys(schedule).length > 0;
        if (!hasSchedule) return; // Stop notifications if no schedule

        const currentTime = formatCurrentTime();

        for (const subject in schedule) {
            if (schedule[subject] === currentTime) {
                // Trigger notification
                showNotification(subject);
                playNotificationSound();
            }
        }
    }, 60000); // Check every minute
}

// Format current time to 12-hour format with AM/PM
function formatCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
}

// Show notification
function showNotification(subject) {
    navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Study Reminder', {
            body: `It's time to study: ${subject}`,
            icon: '/icon512_rounded.png', // Add an appropriate icon
            vibrate: [200, 100, 200], // Vibration pattern
            tag: 'study-reminder', // Unique identifier for this notification
        });
    });
}

// Play notification sound
function playNotificationSound() {
    const notificationSound = document.getElementById('notificationSound');
    notificationSound.play();
}
