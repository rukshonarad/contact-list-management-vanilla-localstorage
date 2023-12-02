class Storage {
    get() {
        const contacts = localStorage.getItem("contacts");
        if (!contacts) return [];
        return JSON.parse(contacts);
    }

    add(contact) {
        const existingContacts = this.get();
        existingContacts.push(contact);
        this.setContacts(existingContacts);
    }

    delete(id) {
        const existingContacts = this.get();
        const keptContacts = existingContacts.filter(
            (contact) => contact.id !== id
        );
        this.setContacts(keptContacts);
    }

    openUpdatePopup(id) {
        const existingContacts = this.get();
        const contact = existingContacts.find((contact) => contact.id === id);

        document.getElementById("updateFirstName").value = contact.firstName;
        document.getElementById("updateLastName").value = contact.lastName;
        document.getElementById("updateEmail").value = contact.email;
        document.getElementById("updateLinkedInProfile").value =
            contact.linkedInProfile;
        document.getElementById("updatePhoneNumber").value =
            contact.phoneNumber;
        document.getElementById("updatePopup").style.display = "block";
    }

    saveUpdatedContact() {
        const existingContacts = this.get();
        const index = existingContacts.findIndex(
            (c) => c.email === document.getElementById("updateEmail").value
        );

        if (index !== -1) {
            existingContacts[index] = {
                firstName: document.getElementById("updateFirstName").value,
                lastName: document.getElementById("updateLastName").value,
                email: document.getElementById("updateEmail").value,
                linkedInProfile: document.getElementById(
                    "updateLinkedInProfile"
                ).value,
                phoneNumber: document.getElementById("updatePhoneNumber").value
            };

            this.setContacts(existingContacts);
            app.loadContacts();
            this.closeUpdatePopup();
        }
    }

    closeUpdatePopup() {
        document.getElementById("updatePopup").style.display = "none";
    }

    setContacts(updatedContacts) {
        localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    }
}

const storage = new Storage();

class ContactListApp {
    static tableBody = document.querySelector(".contacts");

    deleteContact = (id) => {
        storage.delete(id);
    };

    addContact = (contact) => {
        storage.add(contact);
    };

    getAll() {
        return storage.get();
    }

    createContact = ({
        id,
        firstName,
        lastName,
        email,
        linkedInProfile,
        phoneNumber
    }) => {
        const tr = document.createElement("tr");

        const idTd = document.createElement("td");
        idTd.innerText = id;

        const firstNameTd = document.createElement("td");
        firstNameTd.innerText = firstName;
        tr.appendChild(firstNameTd);

        const lastNameTd = document.createElement("td");
        lastNameTd.innerText = lastName;
        tr.appendChild(lastNameTd);

        const emailTd = document.createElement("td");
        emailTd.innerText = email;
        tr.appendChild(emailTd);

        const linkedInProfileTd = document.createElement("td");
        linkedInProfileTd.innerText = linkedInProfile;
        tr.appendChild(linkedInProfileTd);

        const phoneNumberTd = document.createElement("td");
        phoneNumberTd.innerText = phoneNumber;
        tr.appendChild(phoneNumberTd);

        const buttonsTd = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.style.cursor = "pointer";
        editButton.style.backgroundColor = "#45a930";
        editButton.style.color = "#fff";
        editButton.style.border = "none";
        editButton.style.borderRadius = "4px";
        editButton.style.padding = "8px 12px";
        editButton.style.width = "60px";
        editButton.style.marginRight = "10px";

        editButton.addEventListener("click", () => {
            storage.openUpdatePopup(id);
            this.loadContacts();
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.backgroundColor = "#ff5559";
        deleteButton.style.color = "#fff";
        deleteButton.style.border = "none";
        deleteButton.style.borderRadius = "4px";
        deleteButton.style.padding = "8px 12px";
        deleteButton.style.width = "60px";

        deleteButton.addEventListener("click", (e) => {
            this.deleteContact(id);
            this.loadContacts();
        });

        const saveButton = document.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            storage.saveUpdatedContact();
        });

        const cancelButton = document.getElementById("cancelButton");
        cancelButton.addEventListener("click", () => {
            document.getElementById("updatePopup").style.display = "none";
        });

        buttonsTd.appendChild(editButton);
        buttonsTd.appendChild(deleteButton);
        tr.appendChild(buttonsTd);

        ContactListApp.tableBody.appendChild(tr);
    };

    loadContacts = () => {
        ContactListApp.tableBody.innerHTML = "";
        const contacts = storage.get();
        for (const contact of contacts) {
            this.createContact(contact);
        }
    };

    initForm = () => {
        const form = document.querySelector("#contactForm");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const id = crypto.randomUUID();
            const firstName = document.querySelector("#firstName").value;
            const lastName = document.querySelector("#lastName").value;
            const email = document.querySelector("#email").value;
            const linkedInProfile =
                document.querySelector("#linkedInProfile").value;
            const phoneNumber = document.querySelector("#phoneNumber").value;

            const contact = {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                linkedInProfile: linkedInProfile,
                phoneNumber: phoneNumber
            };

            this.addContact(contact);
            form.reset();
            this.loadContacts();
        });
    };

    init = () => {
        this.loadContacts();
        this.initForm();
    };
}

const app = new ContactListApp();
app.init();
