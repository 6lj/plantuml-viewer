# PlantUML Viewer

A web application that introduces a **new algorithm for displaying UML diagrams** using PlantUML. This application allows users to input PlantUML code via a web interface, render it as a PNG image using a Node.js backend, and display the resulting diagram.

## Prerequisites

- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
  - Verify: `node -v` and `npm -v`
- **[Java 17 JRE or JDK](https://adoptium.net/)** for running PlantUML
  - Verify: `java -version` (should show version 17 or higher, e.g., `java version "17.0.9"`)
- **PlantUML JAR file** (`plantuml-gplv2-1.2025.3.jar`)
  - Download from [PlantUML](https://plantuml.com/en/download) and place in the project directory.

## Installation

1. **Move Project to a Path Without Spaces**
   - Ensure the project is in a directory without spaces in the path to avoid issues with PlantUML. For example:
     - **Correct**: `C:\Users\Zord\plantuml-viewer`
     - **Incorrect**: `C:\Users\Zord\Downloads\New folder (103)\plantuml-viewer-main`
   - Move the project if needed:
     ```bash
     cd C:\Users\Zord\plantuml-viewer
     ```

2. **Install Dependencies**
   
     ```bash
     npm install
     ```
 


3. **Start the Server**
   - Run the server:
     ```bash
     node server.js
     ```
    
   - The server will run at `http://localhost:3000`.

4. **Access the Application**
   - Open a browser and navigate to `http://localhost:3000`.
   - Enter PlantUML code (e.g., the sample below) in the text area and click "Render Diagram":
     ```plantuml
     @startuml
     Alice -> Bob: Hello
     Bob --> Alice: Hi back!
     @enduml
     ```

## Troubleshooting

- **Error: `ENOENT: no such file or directory, open 'temp.png'`**
  - **Cause**: PlantUML failed to generate `temp.png`, likely due to:
    - Missing or incorrect `plantuml-gplv2-1.2025.3.jar`.
    - Java not installed or not in PATH.
    - Spaces in the project path (e.g., `New folder (103)`).
  - **Fix**:
    1. Move the project to a path without spaces (e.g., `C:\Users\Zord\plantuml-viewer`).
    2. Verify Java: `java -version`. Install Java 17 if missing.
    3. Verify JAR: Ensure `plantuml-gplv2-1.2025.3.jar` is in the project directory.
    4. Test PlantUML manually:
       ```bash
       echo "@startuml\nAlice -> Bob: Hello\nBob --> Alice: Hi back!\n@enduml" > test.puml
       java -jar plantuml-gplv2-1.2025.3.jar -tpng test.puml -o .
       ```
       Check if `test.png` is created.
    5. Check server logs for errors (e.g., `PlantUML execution error`).
    6. Ensure the project directory has write permissions:
       - Right-click the folder > Properties > Security > Confirm your user has "Full control".



- **Other Issues**
  - **Java not recognized**: Add Java to PATH (e.g., `C:\Program Files\Java\jdk-17\bin`).
  - **Antivirus interference**: Temporarily disable antivirus to test file creation.
  - **Logs**: Check server logs in the terminal for detailed errors (e.g., `PlantUML execution error`).
  - 


## Notes

- The application requires `plantuml-gplv2-1.2025.3.jar` to match `server.js`. If using a different version, update the JAR name in `server.js`.
- Avoid spaces and special characters in the project path to ensure PlantUML compatibility.
