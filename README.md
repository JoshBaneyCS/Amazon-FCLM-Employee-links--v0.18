# FCLM Employee Links Script

## 📋 Overview
The **FCLM Employee Links** script enhances the employee view page on the FCLM portal. It adds quick links, live activity status, and easy-to-use copy buttons for employee information. This script streamlines navigation and improves the overall user experience.

---

## ✨ Features
- **Quick Links**:
  - [Adapt Dashboard](https://adapt-iad.amazon.com)
  - [FANS Direct Message](https://fans-iad.amazon.com)
  - [Engage Team Page](https://na.engage.amazon.dev)
  - [Picking Console](https://picking-console.na.picking.aft.a2z.com)
  - [Amazon Time](https://weui.workevents.a2z.com)
  - [FC Learning Transcript](https://fclearning.amazon.com)
  - [Umbrella Permissions](https://iad.umbrella.amazon.dev)
  - [LDAP Permissions](https://permissions.amazon.com)
- **Dynamic Tab Title and Favicon**:
  - Matches the employee’s login and badge photo for easier tab management.
- **Live Activity Status**:
  - Displays the last pick location and current activity status of pickers.
- **Copy Buttons**:
  - Copy **First Name**, **Last Name**, and **Full Name** (in `First Last` format) with a single click.

---

## 🚀 Installation
This script is designed for use with [Tampermonkey](https://www.tampermonkey.net/).

### Steps:
1. Install Tampermonkey in your browser.
2. Clone or download this repository.
3. Open the Tampermonkey dashboard.
4. Click **"Add a new script"**.
5. Paste the script into the editor and save.

---

## 🛠️ Usage
1. Open an employee's page on the FCLM portal.
2. The script will automatically:
   - Add links to related tools and dashboards.
   - Update the tab title and favicon dynamically.
   - Include copy buttons under the employee’s subheader:
     - **First Name**
     - **Last Name**
     - **Full Name** (`First Last` format)
3. Use the links and buttons to streamline your workflow.

---

## 🧩 Script Structure
The script is organized as follows:
1. **Metadata**:
   - Script name, version, permissions, and match URL.
2. **Dynamic Enhancements**:
   - Updates tab title and favicon.
   - Fetches and displays live activity data.
3. **Copy Buttons**:
   - Adds buttons for copying employee names.
4. **Helper Functions**:
   - Utility functions for DOM manipulation and rate-limiting API calls.

---

## 🤝 Contribution
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch with your feature or bug fix.
3. Submit a pull request for review.

### Development Guidelines:
- Ensure compatibility with major browsers (e.g., Chrome, Firefox).
- Write clean, maintainable code.
- Test thoroughly before creating a pull request.

---

## 📜 License

FOR USE INTERNALLY WITH AMAZON FULFILLMENT ONLY! 
--
