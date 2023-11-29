class ContactManager {
    constructor() {
        this.contacts = this.get();
        this.tableBody = document.getElementById("contactTableBody");
        this.form = document.getElementById("contactForm");

        this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
        this.renderContacts();
    }

    get() {
        return JSON.parse(localStorage.getItem("contacts")) || [];
    }

    save() {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }

    renderContacts() {
        this.tableBody.innerHTML = "";
        this.contacts.forEach((contact) => {
            const row = this.createContactRow(contact);
            this.tableBody.appendChild(row);
        });
    }

    createContactRow(contact) {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.email}</td>
        <td>${contact.linkedIn}</td>
        <td>${contact.phoneNumber}</td>
        <td>
          <button class="btn btn-delete" onclick="contactManager.deleteContact(${contact.id})">Delete</button>
          <button class="btn btn-update" onclick="contactManager.openUpdatePopup(${contact.id})">Update</button>
        </td>
      `;
        return row;
    }

    addContact(formData) {
        const newContact = {
            id: Date.now(),
            ...formData
        };
        this.contacts.push(newContact);
        this.save();
        this.renderContacts();
        this.form.reset();
    }

    deleteContact(id) {
        this.contacts = this.contacts.filter((contact) => contact.id !== id);
        this.save();
        this.renderContacts();
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const formData = {
            firstName: this.form.firstName.value,
            lastName: this.form.lastName.value,
            email: this.form.email.value,
            linkedIn: this.form.linkedIn.value,
            phoneNumber: this.form.phoneNumber.value
        };
        this.addContact(formData);
    }
}

const contactManager = new ContactManager();
