
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  initHomePage();
  initRegistrationPage();
  initContactPage();
});

function initHomePage() {
  const eventsRow = document.getElementById("home-events-row");
  if (!eventsRow || typeof getAllEvents !== "function") return;

  getAllEvents()
    .then((events) => {
      const label = document.getElementById("events-count-label");
      if (label) {
        label.textContent = events.length
          ? `${events.length} event(s) available`
          : "No events available";
      }

      eventsRow.innerHTML = "";
      if (!events.length) {
        eventsRow.innerHTML =
          '<div class="col-12 text-muted">No events found.</div>';
        return;
      }

      events.forEach((ev) => {
        const col = document.createElement("div");
        col.className = "col-md-4 col-sm-6";

        col.innerHTML = `
          <div class="card event-card shadow-sm h-100">
            <div class="card-body d-flex flex-column">
              <span class="badge bg-secondary mb-2">${ev.category}</span>
              <h5 class="card-title">${ev.name}</h5>
              <p class="card-text small text-muted mb-1">ID: ${ev.id}</p>
              <p class="card-text small mb-1">
                <strong>Date:</strong> ${ev.date} &nbsp; | &nbsp;
                <strong>Time:</strong> ${ev.time}
              </p>
              <p class="card-text small mb-2">
                <a href="${ev.url}" target="_blank" rel="noopener noreferrer">
                  Join Event Link
                </a>
              </p>
              <div class="mt-auto">
                <button
                  class="btn btn-primary btn-sm w-100"
                  data-event-id="${ev.id}"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        `;

        const btn = col.querySelector("button");
        if (btn) {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-event-id");
            if (id) {
              
              window.location.href = `register.html?id=${encodeURIComponent(
                id
              )}`;
            }
          });
        }

        eventsRow.appendChild(col);
      });
    })
    .catch(() => {
      console.error("Failed to load events for home page");
    });
}

function initRegistrationPage() {
  const regForm = document.getElementById("registration-form");
  const eventIdSpan = document.getElementById("regEventId");
  if (!regForm || !eventIdSpan || typeof getEventById !== "function") return;

  
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    
    alert("No event selected. Redirecting to Home page.");
    window.location.href = "index.html";
    return;
  }

  getEventById(eventId)
    .then((ev) => {
      if (!ev) {
        alert("Event not found. Redirecting to Home page.");
        window.location.href = "index.html";
        return;
      }

      document.getElementById("regEventId").textContent = ev.id;
      document.getElementById("regEventName").textContent = ev.name;
      document.getElementById("regEventCategory").textContent = ev.category;
      document.getElementById("regEventDate").textContent = ev.date;
      document.getElementById("regEventTime").textContent = ev.time;
      const urlAnchor = document.getElementById("regEventUrl");
      if (urlAnchor) {
        urlAnchor.href = ev.url;
        urlAnchor.textContent = ev.url;
      }
    })
    .catch(() => {
      alert("Unable to load event details. Redirecting to Home page.");
      window.location.href = "index.html";
    });

  regForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!regForm.checkValidity()) {
      regForm.classList.add("was-validated");
      alert("Please fill all required fields correctly.");
      return;
    }

    alert("You are successfully registered to this event!");
    regForm.reset();
    regForm.classList.remove("was-validated");
  });
}

function initContactPage() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      alert("Please fill all required fields correctly.");
      return;
    }

    alert("Thank you for contacting us. We will get back to you shortly.");
    form.reset();
    form.classList.remove("was-validated");
  });
}

