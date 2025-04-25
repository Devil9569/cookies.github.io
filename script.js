document.addEventListener('DOMContentLoaded', function() {
    const cookieInput = document.getElementById('cookie-input');
    const jsonOutput = document.getElementById('json-output');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const statusMessage = document.getElementById('status-message');
    
    // Convert cookies to JSON
    convertBtn.addEventListener('click', function() {
        const cookieString = cookieInput.value.trim();
        
        if (!cookieString) {
            showStatus('Please enter cookies to convert', 'error');
            return;
        }
        
        try {
            const jsonOutput = convertCookiesToJson(cookieString);
            document.getElementById('json-output').value = jsonOutput;
            copyBtn.disabled = false;
            showStatus('Cookies converted successfully!', 'success');
        } catch (error) {
            showStatus('Error converting cookies: ' + error.message, 'error');
            console.error(error);
        }
    });
    
    // Copy JSON to clipboard
    copyBtn.addEventListener('click', function() {
        const output = jsonOutput.value;
        
        if (!output) {
            showStatus('No JSON to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(output)
            .then(() => {
                showStatus('JSON copied to clipboard!', 'success');
            })
            .catch(err => {
                showStatus('Failed to copy: ' + err, 'error');
            });
    });
    
    // Clear all fields
    clearBtn.addEventListener('click', function() {
        cookieInput.value = '';
        jsonOutput.value = '';
        copyBtn.disabled = true;
        hideStatus();
    });
    
    // Cookie conversion function
    function convertCookiesToJson(cookieString) {
        const cookies = cookieString.split(';').map(c => c.trim()).filter(c => c);
        const cookieList = [];
        
        for (const cookie of cookies) {
            if (!cookie.includes('=')) continue;
            
            const [name, ...valueParts] = cookie.split('=');
            const value = valueParts.join('='); // In case value contains '='
            
            // Determine cookie attributes
            const secure = ['sb', 'datr', 'c_user', 'xs', 'fr', 'presence'].includes(name);
            const httpOnly = ['sb', 'datr', 'xs', 'fr'].includes(name);
            let sameSite = secure ? "None" : "Lax";
            
            const cookieData = {
                name: name,
                value: value,
                path: "/",
                domain: ".facebook.com",
                secure: secure,
                httpOnly: httpOnly,
                expiry: 32503680000, // Far future timestamp
                sameSite: sameSite
            };
            
            if (name === 'wd') {
                cookieData.secure = false;
                cookieData.sameSite = "Lax";
            }
            
            cookieList.push(cookieData);
        }
        
        if (cookieList.length === 0) {
            throw new Error('No valid cookies found in input');
        }
        
        return JSON.stringify(cookieList, null, 2);
    }
    
    // Show status message
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status ' + type;
        statusMessage.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(hideStatus, 5000);
    }
    
    // Hide status message
    function hideStatus() {
        statusMessage.style.display = 'none';
    }
});