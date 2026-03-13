

const EMS_LOGIN_FLAG = "ems_isAdminLoggedIn";

document.addEventListener("DOMContentLoaded", () => {
  
  const loggedIn = sessionStorage.getItem(EMS_LOGIN_FLAG) === "true";
  if (!loggedIn) {
    alert("Unauthorized access. Please login as Admin first.");
    window.location.href = "login.html";
    return;
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  setupLogout();
  setupAddEventForm();
  setupSearch();
  refreshEvents();
});

function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (!logoutBtn) return;
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(EMS_LOGIN_FLAG);
    window.location.href = "login.html";
  });
}

function setupAddEventForm() {
  const form = document.getElementById("add-event-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      alert("Please fill all required fields correctly.");
      return;
    }

    const eventObj = {
      id: document.getElementById("eventId").value.trim(),
      name: document.getElementById("eventName").value.trim(),
      category: document.getElementById("eventCategory").value,
      date: document.getElementById("eventDate").value,
      time: document.getElementById("eventTime").value,
      url: document.getElementById("eventUrl").value.trim(),
    };

    addEvent(eventObj)
      .then(() => {
        alert("Event added successfully.");
        form.reset();
        form.classList.remove("was-validated");
        refreshEvents();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add event. Check if Event ID is unique.");
      });
  });
}

let currentEventsCache = [];

function refreshEvents() {
  const row = document.getElementById("admin-events-row");
  if (!row || typeof getAllEvents !== "function") return;

  getAllEvents()
    .then((events) => {
      currentEventsCache = events;
      renderAdminEvents(events);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load events.");
    });
}

function renderAdminEvents(events) {
  const row = document.getElementById("admin-events-row");
  const label = document.getElementById("admin-events-count-label");
  if (!row) return;

  if (label) {
    label.textContent = events.length
      ? `${events.length} event(s) found`
      : "No events available";
  }

  row.innerHTML = "";
  if (!events.length) {
    row.innerHTML =
      '<div class="col-12 text-muted">No events found. Please add a new event.</div>';
    return;
  }

  events.forEach((ev) => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    col.innerHTML = `
      <div class="card event-card shadow-sm h-100">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <span class="badge bg-secondary">${ev.category}</span>
            <span class="text-muted small">ID: ${ev.id}</span>
          </div>
          <h5 class="card-title">${ev.name}</h5>
          <p class="card-text small mb-1">
            <strong>Date:</strong> ${ev.date} &nbsp; | &nbsp;
            <strong>Time:</strong> ${ev.time}
          </p>
          <p class="card-text small mb-2">
            <a href="${ev.url}" target="_blank" rel="noopener noreferrer">
              Join Event Link
            </a>
          </p>
          <div class="mt-auto d-flex justify-content-between">
            <button
              class="btn btn-outline-danger btn-sm"
              data-delete-id="${ev.id}"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    `;

    const delBtn = col.querySelector("[data-delete-id]");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        const id = delBtn.getAttribute("data-delete-id");
        if (id && confirm("Are you sure you want to delete this event?")) {
          deleteEventById(id)
            .then(() => {
              alert("Event deleted.");
              refreshEvents();
            })
            .catch((err) => {
              console.error(err);
              alert("Failed to delete event.");
            });
        }
      });
    }

    row.appendChild(col);
  });
}

function setupSearch() {
  const form = document.getElementById("search-form");
  const resetBtn = document.getElementById("reset-search-btn");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchBy = document.getElementById("searchBy").value;
    const query = document
      .getElementById("searchQuery")
      .value.trim()
      .toLowerCase();

    if (!query) {
      alert("Please enter a search keyword.");
      return;
    }

    const filtered = currentEventsCache.filter((ev) => {
      if (searchBy === "id") {
        return String(ev.id).toLowerCase().includes(query);
      }
      if (searchBy === "name") {
        return String(ev.name).toLowerCase().includes(query);
      }
      if (searchBy === "category") {
        return String(ev.category).toLowerCase().includes(query);
      }
      return false;
    });

    renderAdminEvents(filtered);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.getElementById("searchQuery").value = "";
      renderAdminEvents(currentEventsCache);
    });
  }
}

