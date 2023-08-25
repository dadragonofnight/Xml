<!DOCTYPE html>
<html>
<head>
    <title>XML Parser</title>
    <style>
        body {
            background-color: #f3f6f4;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }

        .courier-header {
            font-family: Courier, monospace;
            font-size: 32px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1 class="courier-header">XML Parser</h1>
    <input type="file" id="xmlFileInput" accept=".xml">
    <button id="processButton">Process XML</button>
    <pre id="output"></pre>

    <script>
        document.getElementById('processButton').addEventListener('click', async () => {
            const fileInput = document.getElementById('xmlFileInput');
            const outputElement = document.getElementById('output');
            
            if (fileInput.files.length === 0) {
                outputElement.textContent = "No XML file selected.";
                return;
            }

            const xmlFile = fileInput.files[0];
            const xmlData = await xmlFile.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
            const propertyElements = xmlDoc.querySelectorAll('Property');

            const combinedProperties = {};

            propertyElements.forEach(prop => {
                const refNameElement = prop.querySelector('RefName');
                const valueElement = prop.querySelector('Value');

                if (refNameElement && valueElement) {
                    const propertyName = refNameElement.textContent;
                    const propertyValue = valueElement.textContent;

                    if (propertyName === 'iopcount' || propertyName === 'PSvoltage') {
                        if (!combinedProperties[propertyName]) {
                            combinedProperties[propertyName] = [];
                        }
                        combinedProperties[propertyName].push(propertyValue);
                    }
                }
            });

            let formattedOutput = "Property                 Value\n";
            formattedOutput += "------------------------------------\n";

            for (const combinedName in combinedProperties) {
                const values = combinedProperties[combinedName];
                formattedOutput += `${combinedName.padEnd(25)}: ${values.join(', ')}\n`;
            }

            outputElement.textContent = formattedOutput;
        });
    </script>
</body>
</html>