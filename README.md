Here's a README file for your script:
FCLM Employee Links Script
Overview

The FCLM Employee Links script enhances the employee view page on the FCLM portal. It provides additional functionality such as quick links, live activity status, and copy buttons for employee information. The script is designed to streamline navigation and access to critical data while improving the overall user experience.
Features

    Quick Links:
        Adapt Dashboard
        FANS Direct Message
        Engage Team Page
        Picking Console
        Amazon Time
        FC Learning Transcript
        Umbrella Permissions
        LDAP Permissions
    Dynamic Tab Title and Favicon:
        Matches the employee’s login and badge photo for easier tab management.
    Live Activity Status:
        Displays the last pick location and current activity status of pickers.
    Copy Buttons:
        Copy First Name, Last Name, and Full Name (in First Last format) with a single click.

Installation

This script is designed to be used with Tampermonkey, a browser extension for running userscripts.
Steps:

    Install Tampermonkey on your preferred browser.
    Download the script from the repository.
    Open the Tampermonkey dashboard.
    Click on the "Add a new script" button.
    Paste the script into the editor and save.

Usage

    Navigate to an employee's page on the FCLM portal.
    The script automatically enhances the page with:
        Links to related tools and dashboards.
        A dynamically updated tab title and favicon.
        Copy buttons for extracting names:
            First Name
            Last Name
            Full Name (in First Last format)
        Buttons are added under the employee’s subheader for easy access.
    Use the links and buttons as needed to streamline your workflow.

Script Structure

The script is divided into several functional sections:

    Metadata: Defines the script name, version, and permissions.
    Dynamic Enhancements:
        Tab title and favicon changes.
        Live activity status updates with API integration.
    Copy Buttons:
        Buttons for First Name, Last Name, and Full Name copying functionality.
    Helper Functions:
        Utilities for rate limiting and DOM manipulation.

Contribution

Contributions are welcome! Feel free to fork the repository and create pull requests for improvements or bug fixes.
Development Notes

    Ensure compatibility with both Chrome and Firefox.
    Maintain clean and readable code for easy updates.
    Test thoroughly before submitting changes.

License

This project is licensed under the MIT License.
