

const EMS_DB_NAME = "upgradEMS";
const EMS_DB_VERSION = 1;
const EMS_EVENTS_STORE = "events";

function openEmsDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(EMS_DB_NAME, EMS_DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(EMS_EVENTS_STORE)) {
        const store = db.createObjectStore(EMS_EVENTS_STORE, {
          keyPath: "id",
        });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(EMS_EVENTS_STORE, "readonly");
      const store = tx.objectStore(EMS_EVENTS_STORE);
      const countReq = store.count();
      countReq.onsuccess = () => {
        if (countReq.result === 0) {
          seedDefaultEvents(db)
            .then(() => resolve(db))
            .catch(reject);
        } else {
          resolve(db);
        }
      };
      countReq.onerror = () => resolve(db);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function seedDefaultEvents(db) {
  const defaultEvents = [
    {
      id: "EVT1001",
      name: "AI & Machine Learning Summit",
      category: "Tech & Innovations",
      date: "2026-04-05",
      time: "11:00",
      url: "https://events.upgrad.com/ai-ml-summit",
    },
    {
      id: "EVT1002",
      name: "Industry 4.0: Smart Manufacturing",
      category: "Industrial Events",
      date: "2026-04-15",
      time: "16:00",
      url: "https://events.upgrad.com/industry-4",
    },
    {
      id: "EVT1003",
      name: "Full-Stack Web Development Workshop",
      category: "Workshops",
      date: "2026-03-25",
      time: "10:00",
      url: "https://events.upgrad.com/fswd-workshop",
    },
  ];

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EMS_EVENTS_STORE, "readwrite");
    const store = tx.objectStore(EMS_EVENTS_STORE);
    defaultEvents.forEach((ev) => store.put(ev));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function addEvent(event) {
  return openEmsDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(EMS_EVENTS_STORE, "readwrite");
        const store = tx.objectStore(EMS_EVENTS_STORE);
        const req = store.add(event);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}

function getAllEvents() {
  return openEmsDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(EMS_EVENTS_STORE, "readonly");
        const store = tx.objectStore(EMS_EVENTS_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      })
  );
}

function getEventById(id) {
  return openEmsDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(EMS_EVENTS_STORE, "readonly");
        const store = tx.objectStore(EMS_EVENTS_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      })
  );
}

function deleteEventById(id) {
  return openEmsDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(EMS_EVENTS_STORE, "readwrite");
        const store = tx.objectStore(EMS_EVENTS_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}

