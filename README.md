Requirements
The system should support the following functionalities and components to manage app versions:

🔧 System Components
App and App Versions

Each app can have multiple versions.

Every version is associated with:

A file (byte stream)

Metadata (e.g., minimum supported OS version)

Rollout Manager

Supports two types of rollout operations:

Install: For fresh installations.

Update: Computes a diff from the installed version to the latest version and applies it.

Rollout Strategies

Beta Rollout: New version is released only to specific devices.

Percentage Rollout: New version is released to a specific percentage of devices.

🧪 Functional Requirements
The system should implement the following functions:

uploadNewVersion(...)
Stores a new app version and its corresponding file byte stream.

createUpdatePatch(app, fromVersion, toVersion)
Creates a diff (byte stream or byte array) between two versions. This patch is sent to the pre-installed app on the device, which handles installation.

releaseVersion(...)
Releases a version according to the rollout strategy (e.g., beta or percentage rollout).

isAppVersionSupported(...)
Checks if a given app version is compatible with a specific device (based on OS version, rollout status, etc.).

checkForInstall(...)
Validates whether an app can be freshly installed on a given device.

checkForUpdates(...)
Checks whether an update is available for the app on a given device.

executeTask(...)
Executes an install or update task based on input parameters. This function may internally use helper methods listed below.

🛠️ Available Capabilities (Assumed)
These are dummy utility methods available for use within the system:

installApp(fileContent) – Installs the app file on a device.

updateApp(diffContent) – Applies an update using a diff file.

createDiffPack(sourceFile, targetFile) – Generates a diff file from one version to another.

uploadFile(fileContent) – Uploads a file and returns a storage URL.

getFile(fileUrl) – Retrieves a file using its URL.

💡 Code Expectations
All logic should be implemented in-memory.

No need for REST APIs or frameworks – simple functional or object-oriented code is sufficient.

Any programming language can be used.

Focus on clean structure and completion of basic requirements.

📋 Evaluation Criteria
✅ Working and correct code

✨ Code readability and maintainability

🧱 Use of OOP/OOD principles and separation of concerns

🧪 Testability (preferably with a TDD mindset)

🧠 Demonstration of language proficiency

🧾 Basic test cases

🌟 Optional / Bonus Requirements
Implement percentage-based rollout strategy.

System should meet:

Execution Time Limit: 4 seconds (for JS)

Memory Limit: 2 GB

